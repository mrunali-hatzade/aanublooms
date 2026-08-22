import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendOrderConfirmationToCustomer, sendNewOrderAlertToFounder } from '../services/emailService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ordersFilePath = path.join(__dirname, '../data/orders.json');
const productsFilePath = path.join(__dirname, '../data/products.json');

const router = express.Router();

const getOrders = () => {
  try {
    const data = fs.readFileSync(ordersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading orders:', err);
    return [];
  }
};

const saveOrders = (orders) => {
  fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2), 'utf8');
};

// GET /api/orders
router.get('/', (req, res) => {
  const orders = getOrders();
  const { email, status } = req.query;
  let filtered = orders;

  if (email) {
    filtered = filtered.filter(o => o.customer && o.customer.email.toLowerCase() === email.toLowerCase());
  }

  if (status && status !== 'all') {
    filtered = filtered.filter(o => o.status.toLowerCase() === status.toLowerCase());
  }

  res.json({
    success: true,
    count: filtered.length,
    data: filtered
  });
});

// POST /api/orders/track (Secure Guest Order Tracking)
router.post('/track', (req, res) => {
  const { orderId, phone } = req.body;

  if (!orderId || !phone) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both your Order ID and phone number used during checkout.'
    });
  }

  const cleanId = orderId.trim().toUpperCase().replace('#', '');
  const cleanPhone = phone.trim().replace(/[^0-9]/g, '');

  const orders = getOrders();
  const order = orders.find(o => {
    const idMatch = o.id.toUpperCase().replace('#', '') === cleanId;
    const orderPhone = (o.customer?.phone || '').replace(/[^0-9]/g, '');
    const phoneMatch = orderPhone && (orderPhone.endsWith(cleanPhone) || cleanPhone.endsWith(orderPhone) || orderPhone.includes(cleanPhone) || cleanPhone.includes(orderPhone));
    return idMatch && phoneMatch;
  });

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'No order found matching this Order ID and phone number. Please verify your receipt details.'
    });
  }

  // Mask sensitive info for privacy
  const maskedPhone = order.customer?.phone ? order.customer.phone.replace(/(\d{2})\d+(\d{2})/, '$1******$2') : '******';
  const safeOrder = {
    ...order,
    customer: {
      name: order.customer?.name || 'Valued Customer',
      city: order.customer?.city || 'Pune',
      state: order.customer?.state || 'Maharashtra',
      zip: order.customer?.zip || '411038',
      phone: maskedPhone
    }
  };

  res.json({ success: true, data: safeOrder });
});

// GET /api/orders/:id
router.get('/:id', (req, res) => {
  const orders = getOrders();
  const order = orders.find(o => o.id.toUpperCase() === req.params.id.toUpperCase());

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  res.json({ success: true, data: order });
});

// POST /api/orders (Create new order)
router.post('/', (req, res) => {
  const orders = getOrders();
  const {
    customer,
    items,
    subtotal,
    discount = 0,
    appliedCoupon = null,
    giftWrap = false,
    giftWrapFee = 0,
    giftMessage = '',
    shipping = 0,
    shippingMethod = 'Standard Craft Delivery',
    total,
    paymentMethod = 'Credit Card'
  } = req.body;

  if (!customer || !items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Order items and customer details are required' });
  }

  // Generate sequential Order ID (AB-0001)
  let nextNumber = 1;
  const abOrders = orders.filter(o => o.id && o.id.startsWith('AB-'));
  if (abOrders.length > 0) {
    const maxOrder = abOrders.reduce((max, order) => {
      const num = parseInt(order.id.replace('AB-', ''), 10);
      return num > max ? num : max;
    }, 0);
    nextNumber = maxOrder + 1;
  }
  const orderId = `AB-${String(nextNumber).padStart(4, '0')}`;

  const newOrder = {
    id: orderId,
    createdAt: new Date().toISOString(),
    customer,
    items,
    subtotal: Number(subtotal),
    discount: Number(discount),
    appliedCoupon,
    giftWrap: Boolean(giftWrap),
    giftWrapFee: Number(giftWrapFee),
    giftMessage: giftMessage || '',
    shipping: Number(shipping),
    shippingMethod,
    total: Number(total),
    status: 'placed',
    trackingNumber: `TRACK-${orderId}`,
    statusHistory: [
      {
        status: 'placed',
        time: new Date().toISOString(),
        note: 'Order confirmed! Artisan Aanu has received your order.'
      }
    ],
    paymentMethod,
    paymentStatus: 'Paid'
  };

  orders.unshift(newOrder);
  saveOrders(orders);

  // Optional: decrement stock in products.json
  try {
    const productsData = fs.readFileSync(productsFilePath, 'utf8');
    const products = JSON.parse(productsData);
    items.forEach(item => {
      const prod = products.find(p => p.id === item.id);
      if (prod && prod.stock > 0) {
        prod.stock = Math.max(0, prod.stock - (item.quantity || 1));
      }
    });
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), 'utf8');
  } catch (err) {
    console.error('Error updating stock:', err);
  }

  // ✉️ Send Automated Email Notifications (Customer Confirmation + Founder Alert)
  try {
    sendOrderConfirmationToCustomer(newOrder);
    sendNewOrderAlertToFounder(newOrder);
  } catch (emailErr) {
    console.error('Email dispatch error (non-fatal):', emailErr.message);
  }

  res.status(201).json({
    success: true,
    message: 'Order placed successfully!',
    data: newOrder
  });
});

// PATCH /api/orders/:id/status (Admin status update)
router.patch('/:id/status', (req, res) => {
  const orders = getOrders();
  const { status, note } = req.body;
  const index = orders.findIndex(o => o.id.toUpperCase() === req.params.id.toUpperCase());

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  const validStatuses = ['placed', 'handcrafting', 'packaging', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  orders[index].status = status;
  orders[index].statusHistory = orders[index].statusHistory || [];
  orders[index].statusHistory.push({
    status,
    time: new Date().toISOString(),
    note: note || `Status updated to ${status}`
  });

  saveOrders(orders);

  res.json({
    success: true,
    message: `Order status updated to ${status}`,
    data: orders[index]
  });
});

// DELETE /api/orders/customer/:email
// Deletes all orders associated with a customer email
router.delete('/customer/:email', (req, res) => {
  const email = req.params.email.toLowerCase();
  let orders = getOrders();
  
  const initialCount = orders.length;
  orders = orders.filter(o => {
    const custEmail = (o.customer?.email || '').toLowerCase();
    return custEmail !== email;
  });

  if (orders.length === initialCount) {
    return res.status(404).json({ success: false, message: 'No orders found for this customer.' });
  }

  saveOrders(orders);
  res.json({ success: true, message: `Deleted all orders for ${email}`, deletedCount: initialCount - orders.length });
});


// DELETE /:id
router.delete('/:id', (req, res) => {
  let items = getOrders();
  const initialCount = items.length;
  items = items.filter(i => (i.id || i.code || i._id || '').toString() !== req.params.id.toString());
  if (items.length === initialCount) return res.status(404).json({ success: false, message: 'Not found' });
  saveOrders(items);
  res.json({ success: true, message: 'Deleted successfully' });
});

export default router;
