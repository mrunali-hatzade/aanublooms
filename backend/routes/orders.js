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

  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  const orderId = `AANU-${randomDigits}`;

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
    trackingNumber: `USPS-AANU${randomDigits}`,
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

export default router;
