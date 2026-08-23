import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['new_order', 'payment_received', 'payment_failed', 'new_custom_order', 'low_stock', 'order_shipped', 'order_delivered', 'new_enquiry', 'order_cancelled'],
    required: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  relatedEntity: { type: String },
  relatedEntityId: { type: String },
  isRead: { type: Boolean, default: false },
  readAt: { type: Date }
}, { timestamps: true });

export const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
