import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  key: { type: String, default: 'global_store_settings', unique: true },
  general: mongoose.Schema.Types.Mixed,
  business: mongoose.Schema.Types.Mixed,
  branding: mongoose.Schema.Types.Mixed,
  contact: mongoose.Schema.Types.Mixed,
  orders: mongoose.Schema.Types.Mixed,
  customOrders: mongoose.Schema.Types.Mixed,
  shipping: mongoose.Schema.Types.Mixed,
  payments: mongoose.Schema.Types.Mixed,
  taxes: mongoose.Schema.Types.Mixed,
  notifications: mongoose.Schema.Types.Mixed,
  customers: mongoose.Schema.Types.Mixed,
  seo: mongoose.Schema.Types.Mixed,
  legal: mongoose.Schema.Types.Mixed,
  maintenance: mongoose.Schema.Types.Mixed,
  crafting: mongoose.Schema.Types.Mixed
}, { timestamps: true });

export const Setting = mongoose.models.Setting || mongoose.model('Setting', settingSchema);
