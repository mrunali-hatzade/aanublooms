import express from 'express';
import { CustomRequest } from '../models/CustomRequest.js';
import { Notification } from '../models/Notification.js';
import { requireAdmin } from '../middleware/auth.js';
import { sendWhatsAppNotification } from '../services/whatsappService.js';

const router = express.Router();

// GET /api/custom-requests — admin only
router.get('/', requireAdmin, async (req, res) => {
  try {
    const requests = await CustomRequest.find().sort({ createdAt: -1 });
    res.json({ success: true, count: requests.length, data: requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/custom-requests — public (customer submits)
router.post('/', async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, itemType, colorPalette, yarnPreference, specialNotes, estimatedBudget, referenceImage } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !itemType) {
      return res.status(400).json({ success: false, message: 'Please provide your name, email, phone number, and item type.' });
    }

    const id = `COMM-${Date.now()}`;
    const newRequest = new CustomRequest({
      id,
      customerName,
      customerEmail,
      customerPhone: customerPhone || '',
      itemType,
      colorPalette: colorPalette || [],
      yarnPreference: yarnPreference || 'Artisan Choice',
      specialNotes: specialNotes || '',
      estimatedBudget: estimatedBudget || '',
      referenceImage: referenceImage || null,
      status: 'new',
      statusHistory: [{ status: 'new', time: new Date().toISOString(), note: 'Custom request submitted.' }]
    });

    await newRequest.save();

    await Notification.create({
      type: 'new_custom_order',
      title: 'New Custom Order Request! 🎨',
      message: `${customerName} wants a custom ${itemType}.`,
      relatedEntity: 'custom_request',
      relatedEntityId: id
    });

    sendWhatsAppNotification(`🎨 *New Custom Request!*\n\n*Name:* ${customerName}\n*Phone:* ${customerPhone || 'N/A'}\n*Item:* ${itemType}\n*Budget:* ${estimatedBudget || 'N/A'}\n*Notes:* ${specialNotes || 'N/A'}`);

    res.status(201).json({
      success: true,
      message: 'Custom order request received! Aanu will review and respond within 24 hours.',
      data: newRequest
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/custom-requests/:id/status — admin only
router.patch('/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status, note, adminNotes, quotedPrice } = req.body;
    const validStatuses = ['new', 'discussion', 'quote_sent', 'approved', 'in_production', 'ready', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    const request = await CustomRequest.findOne({ id: req.params.id });
    if (!request) {
      return res.status(404).json({ success: false, message: 'Custom request not found.' });
    }

    request.status = status;
    if (adminNotes) request.adminNotes = adminNotes;
    if (quotedPrice) request.quotedPrice = Number(quotedPrice);
    request.statusHistory = request.statusHistory || [];
    request.statusHistory.push({ status, time: new Date().toISOString(), note: note || `Status updated to ${status}` });
    await request.save();

    res.json({ success: true, message: `Custom order status updated to ${status}`, data: request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/custom-requests/:id — admin
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const deleted = await CustomRequest.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ success: false, message: 'Not found.' });
    res.json({ success: true, message: 'Custom request deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
