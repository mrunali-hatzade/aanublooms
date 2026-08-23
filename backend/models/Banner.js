import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  image: { type: String },
  ctaText: { type: String, default: '' },
  ctaLink: { type: String, default: '' },
  startDate: { type: Date },
  endDate: { type: Date },
  isActive: { type: Boolean, default: true },
  status: { type: String, enum: ['active', 'inactive', 'archived'], default: 'active' },
  displayOrder: { type: Number, default: 0 }
}, { timestamps: true });

export const Banner = mongoose.models.Banner || mongoose.model('Banner', bannerSchema);
