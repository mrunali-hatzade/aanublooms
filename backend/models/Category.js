import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  itemCount: { type: Number, default: 0 }
}, { timestamps: true });

export const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
