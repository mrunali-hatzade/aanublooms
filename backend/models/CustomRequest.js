import mongoose from 'mongoose';

const customRequestSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, default: '' },
  itemType: { type: String, required: true },
  colorPalette: [{ type: String }],
  yarnPreference: { type: String, default: 'Artisan Choice' },
  specialNotes: { type: String, default: '' },
  estimatedBudget: { type: String, default: '' },
  referenceImage: { type: String },
  status: {
    type: String,
    enum: ['new', 'discussion', 'quote_sent', 'approved', 'in_production', 'ready', 'completed', 'cancelled'],
    default: 'new'
  },
  statusHistory: [
    {
      status: String,
      note: String,
      time: String
    }
  ],
  adminNotes: { type: String, default: '' },
  quotedPrice: { type: Number }
}, { timestamps: true });

export const CustomRequest = mongoose.models.CustomRequest || mongoose.model('CustomRequest', customRequestSchema);
