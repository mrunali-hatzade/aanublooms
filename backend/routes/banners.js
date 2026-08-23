import express from 'express';
import { Banner } from '../models/Banner.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/banners — public (active banners within date range)
router.get('/', async (req, res) => {
  try {
    const now = new Date();
    const banners = await Banner.find({
      isActive: true,
      status: 'active',
      $or: [
        { startDate: { $exists: false } },
        { startDate: null },
        { startDate: { $lte: now } }
      ],
      $and: [
        { $or: [{ endDate: { $exists: false } }, { endDate: null }, { endDate: { $gte: now } }] }
      ]
    }).sort({ displayOrder: 1 });
    res.json({ success: true, data: banners });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/banners/admin — all banners
router.get('/admin', requireAdmin, async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.json({ success: true, data: banners });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/banners — admin
router.post('/', requireAdmin, async (req, res) => {
  try {
    const banner = new Banner(req.body);
    await banner.save();
    res.status(201).json({ success: true, data: banner });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/banners/:id — admin
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const updated = await Banner.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Banner not found.' });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/banners/:id/status — admin
router.patch('/:id/status', requireAdmin, async (req, res) => {
  try {
    const { isActive, status } = req.body;
    const update = {};
    if (isActive !== undefined) update.isActive = isActive;
    if (status) update.status = status;
    const updated = await Banner.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Banner not found.' });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/banners/:id — admin
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const deleted = await Banner.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Banner not found.' });
    res.json({ success: true, message: 'Banner deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
