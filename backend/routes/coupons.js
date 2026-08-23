import express from 'express';
import { Coupon } from '../models/Coupon.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/coupons — public (active coupons only for storefront)
router.get('/', async (req, res) => {
  try {
    const now = new Date();
    const coupons = await Coupon.find({
      isActive: true,
      $or: [
        { endDate: { $exists: false } },
        { endDate: null },
        { endDate: { $gte: now } }
      ]
    });
    res.json({ success: true, data: coupons });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/coupons/admin — admin, all coupons
router.get('/admin', requireAdmin, async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, data: coupons });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/coupons/validate — public
router.post('/validate', async (req, res) => {
  try {
    const { code, cartSubtotal } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Please enter a coupon code.' });
    }

    const now = new Date();
    const coupon = await Coupon.findOne({ code: code.trim().toUpperCase(), isActive: true });

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or expired coupon code.' });
    }

    if (coupon.startDate && now < coupon.startDate) {
      return res.status(400).json({ success: false, message: 'This coupon is not yet active.' });
    }

    if (coupon.endDate && now > coupon.endDate) {
      return res.status(400).json({ success: false, message: 'This coupon has expired.' });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: 'This coupon has reached its usage limit.' });
    }

    const subtotal = Number(cartSubtotal) || 0;
    if (subtotal < coupon.minOrder) {
      return res.status(400).json({
        success: false,
        message: `Coupon "${coupon.code}" requires a minimum order of ₹${coupon.minOrder}.`
      });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (subtotal * coupon.value) / 100;
      if (coupon.maxDiscount) discountAmount = Math.min(discountAmount, coupon.maxDiscount);
    } else if (coupon.discountType === 'fixed') {
      discountAmount = Math.min(subtotal, coupon.value);
    }

    res.json({
      success: true,
      message: `Coupon applied: ${coupon.description || coupon.code}!`,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        value: coupon.value,
        discountAmount: Number(discountAmount.toFixed(2)),
        description: coupon.description
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/coupons — admin create
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { code, discountType, value, minOrder, maxDiscount, description, isActive, startDate, endDate, usageLimit } = req.body;
    if (!code || !discountType || value === undefined) {
      return res.status(400).json({ success: false, message: 'Code, discount type, and value are required.' });
    }

    const existing = await Coupon.findOne({ code: code.trim().toUpperCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'A coupon with this code already exists.' });
    }

    const coupon = new Coupon({
      code: code.trim().toUpperCase(),
      discountType,
      value: Number(value),
      minOrder: Number(minOrder) || 0,
      maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
      description: description || '',
      isActive: isActive !== false,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      usageLimit: usageLimit ? Number(usageLimit) : undefined
    });

    await coupon.save();
    res.status(201).json({ success: true, message: 'Coupon created!', data: coupon });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/coupons/:id — admin update
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found.' });
    res.json({ success: true, message: 'Coupon updated!', data: coupon });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/coupons/:id/status — admin toggle active
router.patch('/:id/status', requireAdmin, async (req, res) => {
  try {
    const { isActive } = req.body;
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, { isActive }, { new: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found.' });
    res.json({ success: true, message: `Coupon ${isActive ? 'activated' : 'deactivated'}.`, data: coupon });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/coupons/:id — admin
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const deleted = await Coupon.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Coupon not found.' });
    res.json({ success: true, message: 'Coupon deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
