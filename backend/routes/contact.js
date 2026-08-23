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

    // Basic regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address format.' });
    }

    // Advanced validation: Check if domain has MX records
    const domain = email.split('@')[1];
    try {
      const records = await dns.resolveMx(domain);
      if (!records || records.length === 0) {
        return res.status(400).json({ success: false, message: 'The email domain does not appear to exist. Please enter a valid email address.' });
      }
    } catch (err) {
      return res.status(400).json({ success: false, message: 'Invalid email domain. Please enter a correct email address.' });
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

    // Send email alert to founder
    const emailResult = await sendContactFormAlert(newMessage);
    if (emailResult && emailResult.success === false) {
       return res.status(500).json({ success: false, message: 'Message saved, but failed to send email alert. Please check your email credentials.' });
    }

    // Send thank you email to customer
    const customerEmailResult = await sendContactThankYouToCustomer(newMessage);
    if (customerEmailResult && customerEmailResult.success === false) {
       // If sending to the customer fails, it usually means their email address doesn't exist
       // We can rollback or just inform them
       return res.status(400).json({ success: false, message: 'The email address you provided seems to be invalid or unable to receive emails. Please provide a working email address.' });
    }

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
