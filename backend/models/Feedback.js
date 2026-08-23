import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  author: { type: String, required: true },
  name: { type: String },
  email: { type: String, default: '' },
  city: { type: String, default: 'India' },
  rating: { type: Number, default: 5, min: 1, max: 5 },
  productCategory: { type: String, default: 'Handcrafted Creations' },
  highlight: { type: String, default: 'Quality Handcraft' },
  comment: { type: String, required: true },
  message: { type: String },
  avatar: { type: String },
  verified: { type: Boolean, default: true },
  isApproved: { type: Boolean, default: true },
  date: { type: String }
}, { timestamps: true });

export const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);
