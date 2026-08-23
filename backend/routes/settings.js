import express from 'express';
import { Setting } from '../models/Setting.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/settings — public (storefront reads settings)
router.get('/', async (req, res) => {
  try {
    let settings = await Setting.findOne({ key: 'global_store_settings' });
    if (!settings) {
      return res.json({ success: true, data: null });
    }
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/settings — admin only
router.put('/', requireAdmin, async (req, res) => {
  try {
    const updates = req.body;
    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid settings payload.' });
    }

    const settings = await Setting.findOneAndUpdate(
      { key: 'global_store_settings' },
      { $set: { ...updates, key: 'global_store_settings' } },
      { new: true, upsert: true, runValidators: false }
    );

    res.json({ success: true, message: 'Store settings saved successfully.', data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/settings/test-payment — admin
router.post('/test-payment', requireAdmin, (req, res) => {
  const { keyId } = req.body;
  if (!keyId) {
    return res.status(400).json({ success: false, message: 'Key ID is required.' });
  }
  const isValidFormat = keyId.startsWith('rzp_test_') || keyId.startsWith('rzp_live_');
  if (isValidFormat) {
    res.json({ success: true, status: 'connected', message: 'Razorpay API Key format verified.' });
  } else {
    res.status(400).json({ success: false, status: 'error', message: 'Invalid Razorpay Key ID format.' });
  }
});

export default router;
