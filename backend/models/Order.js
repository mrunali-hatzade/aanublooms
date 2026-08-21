import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  customer: {
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    zip: String,
    country: String
  },
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number,
      image: String,
      selectedColor: String,
      giftWrap: Boolean,
      giftMessage: String
    }
  ],
  subtotal: Number,
  shippingFee: Number,
  discountAmount: Number,
  total: Number,
  paymentMethod: String,
  paymentStatus: { type: String, default: 'Pending' },
  status: { type: String, default: 'Order Placed' },
  trackingNumber: String,
  timeline: [
    {
      status: String,
      note: String,
      timestamp: String
    }
  ]
}, { timestamps: true });

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
