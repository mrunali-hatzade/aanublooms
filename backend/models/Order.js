import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  isGuestOrder: { type: Boolean, default: true },
  customer: {
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    zip: String,
    country: { type: String, default: 'India' }
  },
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number,
      image: String,
      selectedColor: String,
      selectedSize: String,
      giftWrap: Boolean,
      giftMessage: String
    }
  ],
  subtotal: { type: Number, default: 0 },
  shippingFee: { type: Number, default: 0 },
  shippingMethod: { type: String, default: 'Standard Craft Delivery' },
  discountAmount: { type: Number, default: 0 },
  couponCode: { type: String, default: '' },
  giftWrap: { type: Boolean, default: false },
  giftWrapFee: { type: Number, default: 0 },
  giftMessage: { type: String, default: '' },
  total: { type: Number, default: 0 },
  paymentMethod: { type: String, default: 'COD' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  status: {
    type: String,
    enum: ['placed', 'confirmed', 'handcrafting', 'packaging', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'placed'
  },
  trackingNumber: { type: String },
  statusHistory: [
    {
      status: String,
      note: String,
      time: String
    }
  ],
  notes: { type: String, default: '' }
}, { timestamps: true });

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
