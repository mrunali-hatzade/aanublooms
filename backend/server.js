import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import productsRoutes from './routes/products.js';
import ordersRoutes from './routes/orders.js';
import customRequestsRoutes from './routes/customRequests.js';
import couponsRoutes from './routes/coupons.js';
import analyticsRoutes from './routes/analytics.js';
import contactRoutes from './routes/contact.js';
import feedbackRoutes from './routes/feedback.js';
import authRoutes from './routes/auth.js';
import settingsRoutes from './routes/settings.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    brand: 'AanuBlooms - Handcrafted Crochet & Floral Creations (India)',
    timestamp: new Date().toISOString()
  });
});

// Fallback error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`🌸 AanuBlooms API Server running at http://localhost:${PORT}`);
});
