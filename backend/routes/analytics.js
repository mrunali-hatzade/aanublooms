import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ordersFilePath = path.join(__dirname, '../data/orders.json');
const productsFilePath = path.join(__dirname, '../data/products.json');
const customRequestsPath = path.join(__dirname, '../data/customRequests.json');

const router = express.Router();

// GET /api/analytics
router.get('/', (req, res) => {
  try {
    const ordersData = fs.readFileSync(ordersFilePath, 'utf8');
    const productsData = fs.readFileSync(productsFilePath, 'utf8');
    const customData = fs.readFileSync(customRequestsPath, 'utf8');

    const orders = JSON.parse(ordersData);
    const products = JSON.parse(productsData);
    const customRequests = JSON.parse(customData);

    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;
    const totalProducts = products.length;
    const lowStockCount = products.filter(p => p.stock <= 10).length;
    const pendingCommissions = customRequests.filter(c => c.status === 'pending_review').length;

    // Sales by status
    const statusCounts = orders.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {});

    // Recent 5 orders
    const recentOrders = orders.slice(0, 5);

    // Bestseller ranking
    const bestsellers = products.filter(p => p.isBestseller).slice(0, 5);

    res.json({
      success: true,
      data: {
        totalRevenue: Number(totalRevenue.toFixed(2)),
        totalOrders,
        avgOrderValue: Number(avgOrderValue.toFixed(2)),
        totalProducts,
        lowStockCount,
        pendingCommissions,
        statusCounts,
        recentOrders,
        bestsellers
      }
    });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ success: false, message: 'Could not compute analytics' });
  }
});

export default router;
