import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String },
  phone: { type: String, default: '' },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  avatar: { type: String },
  googleId: { type: String },
  authProvider: { type: String, default: 'local' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  zip: { type: String, default: '' },
  address: { type: String, default: '' },
  savedAddresses: [
    {
      id: String,
      title: String,
      name: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      zip: String,
      country: String,
      isDefault: Boolean
    }
  ]
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', userSchema);
