import express from 'express';
import dns from 'dns/promises';
import { ContactMessage } from '../models/ContactMessage.js';
import { Notification } from '../models/Notification.js';
import { requireAdmin } from '../middleware/auth.js';
import { sendContactFormAlert, sendContactThankYouToCustomer } from '../services/emailService.js';

const router = express.Router();

// GET /api/contact — admin only
router.get('/', requireAdmin, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({ success: true, count: messages.length, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/contact — public
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }

    // Fast regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address format.' });
    }

    const newMessage = new ContactMessage({
      id: `MSG-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || '',
      subject: subject?.trim() || '',
      message: message.trim()
    });

    await newMessage.save();

    await Notification.create({
      type: 'new_enquiry',
      title: 'New Enquiry',
      message: `${name} sent a message: "${message.substring(0, 60)}..."`,
      relatedEntity: 'contact_message',
      relatedEntityId: newMessage.id
    });

    // Send emails asynchronously in background for instant UI response
    Promise.allSettled([
      sendContactFormAlert(newMessage),
      sendContactThankYouToCustomer(newMessage)
    ]).catch(emailErr => console.error('Background contact email error:', emailErr));

    res.status(201).json({
      success: true,
      message: 'Your message has been sent! We will respond within 24 hours.',
      data: newMessage
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/contact/:id — admin
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const deleted = await ContactMessage.findOneAndDelete({ id: req.params.id })
      || await ContactMessage.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Message not found.' });
    res.json({ success: true, message: 'Message deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
