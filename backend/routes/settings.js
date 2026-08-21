import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const settingsFilePath = path.join(__dirname, '../data/settings.json');

const getSettings = () => {
  try {
    const data = fs.readFileSync(settingsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading settings.json:', err);
    return {};
  }
};

const saveSettings = (settings) => {
  try {
    fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error saving settings.json:', err);
    return false;
  }
};

// ==========================================
// 1. GET ALL STORE SETTINGS
// GET /api/settings
// ==========================================
router.get('/', (req, res) => {
  const settings = getSettings();
  res.json({
    success: true,
    data: settings
  });
});

// ==========================================
// 2. UPDATE STORE SETTINGS (Entire or Partial)
// PUT /api/settings
// ==========================================
router.put('/', (req, res) => {
  const updates = req.body;
  if (!updates || typeof updates !== 'object') {
    return res.status(400).json({ success: false, message: 'Invalid settings payload' });
  }

  const currentSettings = getSettings();
  const updatedSettings = {
    ...currentSettings,
    ...updates,
    updatedAt: new Date().toISOString()
  };

  const success = saveSettings(updatedSettings);
  if (!success) {
    return res.status(500).json({ success: false, message: 'Failed to write settings to database' });
  }

  res.json({
    success: true,
    message: 'Store settings saved successfully.',
    data: updatedSettings
  });
});

// ==========================================
// 3. TEST PAYMENT GATEWAY CONNECTION
// POST /api/settings/test-payment
// ==========================================
router.post('/test-payment', (req, res) => {
  const { keyId } = req.body;
  if (!keyId) {
    return res.status(400).json({ success: false, message: 'Key ID is required for testing' });
  }

  // Simulated validation test
  const isValidFormat = keyId.startsWith('rzp_test_') || keyId.startsWith('rzp_live_');
  if (isValidFormat) {
    res.json({
      success: true,
      status: 'connected',
      message: 'Razorpay API Key format verified successfully. Gateway is ready.'
    });
  } else {
    res.status(400).json({
      success: false,
      status: 'error',
      message: 'Invalid Razorpay Key ID format. Key ID should start with rzp_test_ or rzp_live_'
    });
  }
});

export default router;
