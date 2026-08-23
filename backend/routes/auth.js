import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'aanublooms_jwt_secret_change_in_production';
const JWT_EXPIRES = '7d';

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id.toString(), userId: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
};

const sanitizeUser = (user) => {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  return obj;
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, address, city, state, zip } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists. Please sign in.' });
    }

    const isMakerAdmin = cleanEmail === 'admin@aanublooms.com' || cleanEmail === 'maker@aanublooms.com';
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      phone: phone?.trim() || '',
      role: isMakerAdmin ? 'admin' : 'customer',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      city: city?.trim() || '',
      state: state?.trim() || 'Maharashtra',
      zip: zip?.trim() || '',
      address: address?.trim() || '',
      savedAddresses: address ? [{
        id: `addr-${Date.now()}`,
        title: 'Primary Address',
        name: name.trim(),
        phone: phone?.trim() || '',
        address: address.trim(),
        city: city?.trim() || '',
        state: state?.trim() || 'Maharashtra',
        zip: zip?.trim() || '',
        country: 'India',
        isDefault: true
      }] : []
    });

    await newUser.save();
    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: `Welcome to AanuBlooms, ${newUser.name}! 🌸`,
      user: sanitizeUser(newUser),
      token
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: err.message || 'Registration failed.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(401).json({ success: false, message: 'No account found with this email.' });
    }

    let passwordMatch = false;
    if (user.password) {
      // Try bcrypt first (new hashed passwords)
      // Try bcrypt first, if it fails or returns false, check plain text
      try {
        passwordMatch = await bcrypt.compare(password.trim(), user.password);
      } catch {}
      
      // Fallback: plain text comparison for legacy passwords if bcrypt didn't match
      if (!passwordMatch) {
        passwordMatch = user.password === password.trim();
      }
    }

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect password.' });
    }

    const token = generateToken(user);
    res.json({
      success: true,
      message: `Welcome back, ${user.name}! 🌸`,
      user: sanitizeUser(user),
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Login failed.' });
  }
});

// GET /api/auth/me
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findOne({ id: req.user.userId }).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch user.' });
  }
});

// PUT /api/auth/profile
router.put('/profile', requireAuth, async (req, res) => {
  try {
    const { name, phone, city, state, zip, address } = req.body;
    const user = await User.findOne({ id: req.user.userId });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (city !== undefined) user.city = city.trim();
    if (state !== undefined) user.state = state.trim();
    if (zip !== undefined) user.zip = zip.trim();
    if (address !== undefined) user.address = address.trim();

    await user.save();
    res.json({ success: true, message: 'Profile updated!', user: sanitizeUser(user) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
});

// POST /api/auth/google
router.post('/google', async (req, res) => {
  try {
    const { email, name, avatar, googleId } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Google account email required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    let user = await User.findOne({ email: cleanEmail });

    if (user) {
      if (avatar && (!user.avatar || user.avatar.includes('dicebear'))) {
        user.avatar = avatar;
        user.googleId = googleId;
        await user.save();
      }
    } else {
      const isMakerAdmin = cleanEmail === 'admin@aanublooms.com' || cleanEmail === 'maker@aanublooms.com';
      user = new User({
        id: `usr-${Date.now()}`,
        name: name?.trim() || cleanEmail.split('@')[0],
        email: cleanEmail,
        googleId: googleId || `g_${Date.now()}`,
        authProvider: 'google',
        role: isMakerAdmin ? 'admin' : 'customer',
        avatar: avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || cleanEmail)}`,
        city: '',
        state: 'Maharashtra',
        savedAddresses: []
      });
      await user.save();
    }

    const token = generateToken(user);
    res.json({
      success: true,
      message: `Welcome to AanuBlooms, ${user.name}! 🌸`,
      user: sanitizeUser(user),
      token
    });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(500).json({ success: false, message: 'Google sign-in failed.' });
  }
});

export default router;
