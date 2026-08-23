import express from 'express';
import { Feedback } from '../models/Feedback.js';
import { requireAdmin } from '../middleware/auth.js';

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
