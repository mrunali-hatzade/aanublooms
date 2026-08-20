import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const feedbacksFilePath = path.join(__dirname, '../data/feedbacks.json');

const router = express.Router();

const getFeedbacks = () => {
  try {
    if (!fs.existsSync(feedbacksFilePath)) {
      fs.writeFileSync(feedbacksFilePath, JSON.stringify([], null, 2), 'utf8');
      return [];
    }
    const data = fs.readFileSync(feedbacksFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading feedbacks:', err);
    return [];
  }
};

const saveFeedbacks = (feedbacks) => {
  fs.writeFileSync(feedbacksFilePath, JSON.stringify(feedbacks, null, 2), 'utf8');
};

// GET /api/feedback
router.get('/', (req, res) => {
  const feedbacks = getFeedbacks();
  res.json({ success: true, count: feedbacks.length, data: feedbacks });
});

// POST /api/feedback
router.post('/', (req, res) => {
  const { author, city, rating, productCategory, highlight, comment, avatar } = req.body;

  if (!author || !comment) {
    return res.status(400).json({ success: false, message: 'Please provide your name and feedback' });
  }

  const feedbacks = getFeedbacks();
  const newFeedback = {
    id: `FB-${Date.now()}`,
    author,
    city: city || 'India',
    rating: Number(rating) || 5,
    productCategory: productCategory || 'Handcrafted Creations',
    highlight: highlight || 'Quality Handcraft',
    comment,
    date: new Date().toISOString().split('T')[0],
    avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(author)}`,
    verified: true
  };

  feedbacks.unshift(newFeedback);
  saveFeedbacks(feedbacks);

  res.status(201).json({
    success: true,
    message: 'Thank you for sharing your lovely feedback with AanuBlooms! 🌸',
    data: newFeedback
  });
});

export default router;
