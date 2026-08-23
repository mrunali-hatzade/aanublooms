import express from 'express';
import dns from 'dns/promises';
import { Feedback } from '../models/Feedback.js';
import { requireAdmin } from '../middleware/auth.js';
import { sendFeedbackAlert, sendFeedbackThankYouToCustomer } from '../services/emailService.js';

const router = express.Router();

// GET /api/feedback — public
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ isApproved: true }).sort({ createdAt: -1 });
    res.json({ success: true, count: feedbacks.length, data: feedbacks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/feedback — public (customer submits)
router.post('/', async (req, res) => {
  try {
    const { author, name, email, city, rating, productCategory, highlight, comment, message, avatar } = req.body;
    const authorName = author || name;
    const commentText = comment || message;

    if (!authorName || !commentText) {
      return res.status(400).json({ success: false, message: 'Please provide your name and feedback.' });
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: 'Please enter a valid email address format.' });
      }

      const domain = email.split('@')[1];
      try {
        const records = await dns.resolveMx(domain);
        if (!records || records.length === 0) {
          return res.status(400).json({ success: false, message: 'The email domain does not appear to exist. Please enter a valid email address.' });
        }
      } catch (err) {
        return res.status(400).json({ success: false, message: 'Invalid email domain. Please enter a correct email address.' });
      }
    }

    const newFeedback = new Feedback({
      author: authorName,
      name: authorName,
      email: email || '',
      city: city || 'India',
      rating: Number(rating) || 5,
      productCategory: productCategory || 'Handcrafted Creations',
      highlight: highlight || 'Quality Handcraft',
      comment: commentText,
      message: commentText,
      date: new Date().toISOString().split('T')[0],
      avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(authorName)}`,
      verified: true,
      isApproved: true
    });

    await newFeedback.save();

    // Send email alert to founder
    const founderResult = await sendFeedbackAlert(newFeedback);
    if (founderResult && founderResult.success === false) {
       return res.status(500).json({ success: false, message: 'Feedback saved, but failed to send internal alert. Please check your email credentials.' });
    }
    
    if (email) {
      const customerResult = await sendFeedbackThankYouToCustomer(newFeedback);
      if (customerResult && customerResult.success === false) {
         return res.status(400).json({ success: false, message: 'The email address you provided seems to be invalid or unable to receive emails. Please provide a working email address.' });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for your feedback! 🌸',
      data: newFeedback
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/feedback/:id — admin
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const deleted = await Feedback.findByIdAndDelete(req.params.id)
      || await Feedback.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ success: false, message: 'Feedback not found.' });
    res.json({ success: true, message: 'Feedback deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
