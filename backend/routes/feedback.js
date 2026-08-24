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

    // Send emails asynchronously in background for instant UI response
    const emailPromises = [sendFeedbackAlert(newFeedback)];
    if (email) emailPromises.push(sendFeedbackThankYouToCustomer(newFeedback));
    Promise.allSettled(emailPromises).catch(emailErr => console.error('Background feedback email error:', emailErr));

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
    const mongoose = (await import('mongoose')).default;
    let deleted;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      deleted = await Feedback.findByIdAndDelete(req.params.id);
    }
    if (!deleted) {
      deleted = await Feedback.findOneAndDelete({ id: req.params.id });
    }
    if (!deleted) return res.status(404).json({ success: false, message: 'Feedback not found.' });
    res.json({ success: true, message: 'Feedback deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/feedback/:id/reply — admin
router.put('/:id/reply', requireAdmin, async (req, res) => {
  try {
    const { reply } = req.body;
    const mongoose = (await import('mongoose')).default;
    let updated;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      updated = await Feedback.findByIdAndUpdate(
        req.params.id,
        { $set: { adminReply: reply } },
        { new: true }
      );
    }
    if (!updated) {
      updated = await Feedback.findOneAndUpdate(
        { id: req.params.id },
        { $set: { adminReply: reply } },
        { new: true }
      );
    }
    if (!updated) return res.status(404).json({ success: false, message: 'Feedback not found.' });
    res.json({ success: true, message: 'Reply added successfully.', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
