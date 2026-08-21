import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const usersFilePath = path.join(__dirname, '../data/users.json');

const getUsers = () => {
  try {
    const data = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading users.json:', err);
    return [];
  }
};

const saveUsers = (users) => {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing users.json:', err);
    return false;
  }
};

const sanitizeUser = (user) => {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
};

// ==========================================
// 1. REGISTER NEW CUSTOMER
// POST /api/auth/register
// ==========================================
router.post('/register', (req, res) => {
  const { name, email, password, phone, address, city, state, zip } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and password are required fields.'
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long.'
    });
  }

  const cleanEmail = email.trim().toLowerCase();
  const users = getUsers();

  const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    return res.status(400).json({
      success: false,
      message: 'An account with this email address is already registered. Please sign in.'
    });
  }

  const isMakerAdmin = cleanEmail === 'admin@aanublooms.com' || cleanEmail === 'maker@aanublooms.com';

  const newUser = {
    id: `usr-${Date.now()}`,
    name: name.trim(),
    email: cleanEmail,
    password: password.trim(),
    phone: phone ? phone.trim() : '',
    role: isMakerAdmin ? 'admin' : 'customer',
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
    city: city ? city.trim() : '',
    state: state ? state.trim() : 'Maharashtra',
    zip: zip ? zip.trim() : '',
    address: address ? address.trim() : '',
    savedAddresses: address ? [
      {
        id: `addr-${Date.now()}`,
        title: 'Primary Delivery Address',
        name: name.trim(),
        phone: phone ? phone.trim() : '',
        address: address.trim(),
        city: city ? city.trim() : '',
        state: state ? state.trim() : 'Maharashtra',
        zip: zip ? zip.trim() : '',
        country: 'India',
        isDefault: true
      }
    ] : [],
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);

  const token = `tok_${newUser.id}_${Date.now()}`;

  res.status(201).json({
    success: true,
    message: `Account created successfully! Welcome to AanuBlooms, ${newUser.name}.`,
    user: sanitizeUser(newUser),
    token
  });
});

// ==========================================
// 2. REAL LOGIN
// POST /api/auth/login
// ==========================================
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both email and password.'
    });
  }

  const cleanEmail = email.trim().toLowerCase();
  const users = getUsers();

  const user = users.find(u => u.email.toLowerCase() === cleanEmail);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'No account found with this email address. Please create an account.'
    });
  }

  if (user.password !== password.trim()) {
    return res.status(401).json({
      success: false,
      message: 'Incorrect password. Please verify and try again.'
    });
  }

  const token = `tok_${user.id}_${Date.now()}`;

  res.json({
    success: true,
    message: `Welcome back, ${user.name}! 🌸`,
    user: sanitizeUser(user),
    token
  });
});

// ==========================================
// 3. GET CURRENT USER PROFILE
// GET /api/auth/me
// ==========================================
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const userId = token.split('_')[1];
  const users = getUsers();
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User session expired or not found' });
  }

  res.json({
    success: true,
    user: sanitizeUser(user)
  });
});

// ==========================================
// 4. UPDATE USER PROFILE
// PUT /api/auth/profile
// ==========================================
router.put('/profile', (req, res) => {
  const { userId, name, phone, city, state, zip, address } = req.body;

  if (!userId) {
    return res.status(400).json({ success: false, message: 'User ID is required' });
  }

  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  users[userIndex] = {
    ...users[userIndex],
    name: name ? name.trim() : users[userIndex].name,
    phone: phone !== undefined ? phone.trim() : users[userIndex].phone,
    city: city !== undefined ? city.trim() : users[userIndex].city,
    state: state !== undefined ? state.trim() : users[userIndex].state,
    zip: zip !== undefined ? zip.trim() : users[userIndex].zip,
    address: address !== undefined ? address.trim() : users[userIndex].address,
    updatedAt: new Date().toISOString()
  };

  saveUsers(users);

  res.json({
    success: true,
    message: 'Profile updated successfully!',
    user: sanitizeUser(users[userIndex])
  });
});

// ==========================================
// 5. GOOGLE DIRECT SIGN-IN / SIGN-UP
// POST /api/auth/google
// ==========================================
router.post('/google', (req, res) => {
  const { email, name, avatar, googleId } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Google account email is required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const users = getUsers();

  let user = users.find(u => u.email.toLowerCase() === cleanEmail);

  if (user) {
    // Existing user logging in with Google
    if (avatar && (!user.avatar || user.avatar.includes('dicebear'))) {
      user.avatar = avatar;
      user.googleId = googleId;
      saveUsers(users);
    }
  } else {
    // New user registering with Google
    const isMakerAdmin = cleanEmail === 'admin@aanublooms.com' || cleanEmail === 'maker@aanublooms.com';
    user = {
      id: `usr-${Date.now()}`,
      name: name ? name.trim() : cleanEmail.split('@')[0],
      email: cleanEmail,
      googleId: googleId || `g_${Date.now()}`,
      authProvider: 'google',
      phone: '',
      role: isMakerAdmin ? 'admin' : 'customer',
      avatar: avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || cleanEmail)}`,
      city: '',
      state: 'Maharashtra',
      zip: '',
      address: '',
      savedAddresses: [],
      createdAt: new Date().toISOString()
    };
    users.push(user);
    saveUsers(users);
  }

  const token = `tok_${user.id}_${Date.now()}`;

  res.json({
    success: true,
    message: `Welcome to AanuBlooms, ${user.name}! 🌸`,
    user: sanitizeUser(user),
    token
  });
});

export default router;
