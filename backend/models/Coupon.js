import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountType: { type: String, enum: ['percentage', 'fixed', 'shipping'], required: true },
  value: { type: Number, required: true },
  minOrder: { type: Number, default: 0 },
  maxDiscount: { type: Number },
  description: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  startDate: { type: Date },
  endDate: { type: Date },
  usageLimit: { type: Number },
  usedCount: { type: Number, default: 0 }
}, { timestamps: true });

export const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);
