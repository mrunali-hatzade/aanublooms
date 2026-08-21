import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const couponsPath = path.join(__dirname, '../data/coupons.json');

const router = express.Router();

const getCoupons = () => {
  try {
    const data = fs.readFileSync(couponsPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading coupons:', err);
    return [];
  }
};

// GET /api/coupons
router.get('/', (req, res) => {
  const coupons = getCoupons();
  res.json({ success: true, data: coupons.filter(c => c.isActive) });
});

// POST /api/coupons/validate
router.post('/validate', (req, res) => {
  const { code, cartSubtotal } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, message: 'Please enter a coupon code' });
  }

  const coupons = getCoupons();
  const coupon = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive);

  if (!coupon) {
    return res.status(404).json({ success: false, message: 'Invalid or expired coupon code' });
  }

  const subtotal = Number(cartSubtotal) || 0;
  if (subtotal < coupon.minOrder) {
    return res.status(400).json({
      success: false,
      message: `Coupon '${coupon.code}' requires a minimum subtotal of ₹${coupon.minOrder}`
    });
  }

  let discountAmount = 0;
  if (coupon.discountType === 'percentage') {
    discountAmount = (subtotal * coupon.value) / 100;
  } else if (coupon.discountType === 'fixed') {
    discountAmount = Math.min(subtotal, coupon.value);
  } else if (coupon.discountType === 'shipping') {
    discountAmount = 0; // Handled as 0 shipping
  }

  res.json({
    success: true,
    message: `Coupon applied: ${coupon.description}!`,
    coupon: {
      code: coupon.code,
      discountType: coupon.discountType,
      value: coupon.value,
      discountAmount: Number(discountAmount.toFixed(2)),
      description: coupon.description
    }
  });
});

export default router;
