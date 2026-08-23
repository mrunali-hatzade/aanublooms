import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  productCollection: { type: String, default: '' },
  status: { type: String, enum: ['active', 'inactive', 'archived'], default: 'active' },
  sku: { type: String, default: '' },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  salePrice: { type: Number },
  yarnMaterial: { type: String, default: '100% Combed Milk Cotton' },
  craftTimeHours: { type: Number, default: 4 },
  difficulty: { type: String, default: 'Intermediate' },
  stock: { type: Number, default: 10 },
  lowStockThreshold: { type: Number, default: 3 },
  shortDescription: { type: String },
  description: { type: String },
  images: [{ type: String }],
  videoUrl: { type: String },
  rating: { type: Number, default: 5.0 },
  reviewsCount: { type: Number, default: 0 },
  isBestseller: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  customizable: { type: Boolean, default: true },
  tags: [{ type: String }],
  careInstructions: [{ type: String }],
  colors: [{
    name: String,
    hex: String,
    inStock: Boolean
  }],
  reviews: [
    {
      id: String,
      userName: String,
      avatar: String,
      rating: Number,
      title: String,
      comment: String,
      verifiedPurchase: Boolean,
      date: String
    }
  ]
}, { timestamps: true });

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
