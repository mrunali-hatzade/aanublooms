import express from 'express';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { Notification } from '../models/Notification.js';
import { requireAdmin } from '../middleware/auth.js';
import { sendOrderConfirmationToCustomer, sendNewOrderAlertToFounder, sendOrderStatusUpdateAlert } from '../services/emailService.js';
import { sendWhatsAppTemplate } from '../services/whatsappService.js';

const router = express.Router();

// Helper: generate next order ID
const generateOrderId = async () => {
  const lastOrder = await Order.findOne().sort({ createdAt: -1 }).select('id');
  let nextNum = 1;
  if (lastOrder?.id) {
    const match = lastOrder.id.match(/(\d+)$/);
    if (match) nextNum = parseInt(match[1]) + 1;
  }
  return `AB-${String(nextNum).padStart(4, '0')}`;
};

// GET /api/orders — admin only
router.get('/', requireAdmin, async (req, res) => {
  try {
    const { email, status, limit = 100 } = req.query;
    let query = {};
    if (email) query['customer.email'] = { $regex: email, $options: 'i' };
    if (status && status !== 'all') query.status = status;

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/orders/track — guest order tracking (public)
router.post('/track', async (req, res) => {
  try {
    const { orderId, phone } = req.body;
    if (!orderId || !phone) {
      return res.status(400).json({ success: false, message: 'Please provide both Order ID and phone number.' });
    }

    const cleanId = orderId.trim().toUpperCase().replace('#', '');
    const cleanPhone = phone.trim().replace(/[^0-9]/g, '');

    const orders = await Order.find({});
    const order = orders.find(o => {
      const idMatch = (o.id || '').toUpperCase().replace('#', '') === cleanId;
      const orderPhone = (o.customer?.phone || '').replace(/[^0-9]/g, '');
      const phoneMatch = orderPhone && (orderPhone.endsWith(cleanPhone) || cleanPhone.endsWith(orderPhone));
      return idMatch && phoneMatch;
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'No order found matching this Order ID and phone number.' });
    }

    const maskedPhone = order.customer?.phone ? order.customer.phone.replace(/(\d{2})\d+(\d{2})/, '$1******$2') : '******';
    const safeOrder = {
      ...order.toObject(),
      customer: {
        name: order.customer?.name || 'Valued Customer',
        city: order.customer?.city || '',
        state: order.customer?.state || '',
        zip: order.customer?.zip || '',
        phone: maskedPhone
      }
    };

    res.json({ success: true, data: safeOrder });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/orders/:id — admin only
router.get('/:id', requireAdmin, async (req, res) => {
  try {
    const order = await Order.findOne({ id: req.params.id.toUpperCase() });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/orders — create new order (public — guest checkout)
router.post('/', async (req, res) => {
  try {
    const {
      customer, items, subtotal, discount = 0, couponCode = '',
      giftWrap = false, giftWrapFee = 0, giftMessage = '',
      shipping = 0, shippingMethod = 'Standard Craft Delivery',
      total, paymentMethod = 'COD'
    } = req.body;

    if (!customer || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order items and customer details are required.' });
    }

    // Validate and decrement stock
    for (const item of items) {
      const product = await Product.findOne({ id: item.id || item.productId });
      if (product) {
        if (product.stock < (item.quantity || 1)) {
          return res.status(400).json({
            success: false,
            message: `"${product.name}" has insufficient stock. Only ${product.stock} available.`
          });
        }
        product.stock = Math.max(0, product.stock - (item.quantity || 1));
        await product.save();

        // Low stock notification
        if (product.stock <= (product.lowStockThreshold || 3)) {
          await Notification.create({
            type: 'low_stock',
            title: 'Low Stock Alert',
            message: `"${product.name}" is running low — only ${product.stock} left.`,
            relatedEntity: 'product',
            relatedEntityId: product.id
          });
        }
      }
    }

    const orderId = await generateOrderId();
    const newOrder = new Order({
      id: orderId,
      isGuestOrder: true,
      customer,
      items,
      subtotal: Number(subtotal),
      discountAmount: Number(discount),
      couponCode,
      giftWrap: Boolean(giftWrap),
      giftWrapFee: Number(giftWrapFee),
      giftMessage: giftMessage || '',
      shippingFee: Number(shipping),
      shippingMethod,
      total: Number(total),
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'pending' : 'paid',
      status: 'placed',
      trackingNumber: `TRACK-${orderId}`,
      statusHistory: [{ status: 'placed', time: new Date().toISOString(), note: 'Order placed successfully.' }]
    });

    await newOrder.save();

    // Create notification
    await Notification.create({
      type: 'new_order',
      title: 'New Order Received! 🛍️',
      message: `Order ${orderId} from ${customer.name} — ₹${total}`,
      relatedEntity: 'order',
      relatedEntityId: orderId
    });

    // Send emails & WhatsApp notification (awaited for serverless cloud compatibility)
    try {
      await Promise.allSettled([
        sendOrderConfirmationToCustomer(newOrder.toObject()),
        sendNewOrderAlertToFounder(newOrder.toObject()),
        sendWhatsAppTemplate('new_order_placed', 'en', [
          newOrder.id,
          customer.name,
          total,
          newOrder.paymentStatus
        ])
      ]);
    } catch (emailErr) {
      console.error('Notification error (non-fatal):', emailErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      data: newOrder
    });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to place order.' });
  }
});

// PATCH /api/orders/:id/status — admin only
router.patch('/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status, note } = req.body;
    const validStatuses = ['placed', 'confirmed', 'handcrafting', 'packaging', 'shipped', 'delivered', 'cancelled', 'refunded'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const order = await Order.findOne({ id: req.params.id.toUpperCase() });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    order.status = status;
    order.statusHistory = order.statusHistory || [];
    order.statusHistory.push({ status, time: new Date().toISOString(), note: note || `Status updated to ${status}` });
    await order.save();

    // Notification for shipped
    if (status === 'shipped') {
      await Notification.create({
        type: 'order_shipped',
        title: 'Order Shipped',
        message: `Order ${order.id} has been shipped to ${order.customer?.name}.`,
        relatedEntity: 'order',
        relatedEntityId: order.id
      });
    }

    // Send email alert to founder for status update
    await sendOrderStatusUpdateAlert(order, status, note);

    res.json({ success: true, message: `Order status updated to ${status}`, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/orders/:id — admin only
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const deleted = await Order.findOneAndDelete({ id: req.params.id.toUpperCase() });
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    res.json({ success: true, message: 'Order deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
