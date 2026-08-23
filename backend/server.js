import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';

import authRoutes from './routes/auth.js';
import settingsRoutes from './routes/settings.js';
import productsRoutes from './routes/products.js';
import ordersRoutes from './routes/orders.js';
import customRequestsRoutes from './routes/customRequests.js';
import couponsRoutes from './routes/coupons.js';
import analyticsRoutes from './routes/analytics.js';
import contactRoutes from './routes/contact.js';
import feedbackRoutes from './routes/feedback.js';
import paymentRoutes from './routes/payment.js';
import notificationsRoutes from './routes/notifications.js';
import bannersRoutes from './routes/banners.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/custom-requests', customRequestsRoutes);
app.use('/api/coupons', couponsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/banners', bannersRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    brand: 'AanuBlooms - Handcrafted Crochet & Floral Creations (India)',
    timestamp: new Date().toISOString()
  });
});

// Serve Frontend
const frontendDistPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use('/assets', express.static(path.join(frontendDistPath, 'assets'), { maxAge: '1y', immutable: true }));
  app.use(express.static(frontendDistPath, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('index.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
    }
  }));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/assets') || req.path.match(/\.[a-zA-Z0-9]+$/)) {
      return next();
    }
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`🌸 AanuBlooms API Server running at http://localhost:${PORT}`);
});
