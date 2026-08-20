import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contactMessagesPath = path.join(__dirname, '../data/contactMessages.json');

const router = express.Router();

const getMessages = () => {
  try {
    if (!fs.existsSync(contactMessagesPath)) {
      fs.writeFileSync(contactMessagesPath, JSON.stringify([], null, 2), 'utf8');
      return [];
    }
    const data = fs.readFileSync(contactMessagesPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading contact messages:', err);
    return [];
  }
};

const saveMessages = (messages) => {
  fs.writeFileSync(contactMessagesPath, JSON.stringify(messages, null, 2), 'utf8');
};

// GET /api/contact (for maker admin view)
router.get('/', (req, res) => {
  const messages = getMessages();
  res.json({ success: true, count: messages.length, data: messages });
});

// POST /api/contact (submit contact message)
router.post('/', (req, res) => {
  const { name, email, subject, orderId, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Please provide your name, email, and message' });
  }

  const messages = getMessages();
  const newMessage = {
    id: `MSG-${Date.now()}`,
    createdAt: new Date().toISOString(),
    name,
    email,
    subject: subject || 'General Inquiry',
    orderId: orderId || null,
    message,
    status: 'unread'
  };

  messages.unshift(newMessage);
  saveMessages(messages);

  res.status(201).json({
    success: true,
    message: 'Thank you! Your message has been sent to Artisan Aanu. She will reply to your email within 24 hours 🌸',
    data: newMessage
  });
});

export default router;
