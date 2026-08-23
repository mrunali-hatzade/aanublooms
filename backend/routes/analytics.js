import express from 'express';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { CustomRequest } from '../models/CustomRequest.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/analytics — admin only
router.get('/', requireAdmin, async (req, res) => {
  try {
    const { timeframe = '30d' } = req.query;

    let startDate = new Date();
    if (timeframe === '7d') startDate.setDate(startDate.getDate() - 7);
    else if (timeframe === '30d') startDate.setDate(startDate.getDate() - 30);
    else if (timeframe === '3m') startDate.setMonth(startDate.getMonth() - 3);
    else if (timeframe === '1y') startDate.setFullYear(startDate.getFullYear() - 1);
    else startDate = new Date(0); // all time

    const [allOrders, timeframeOrders, allProducts, customRequests] = await Promise.all([
      Order.find({ paymentStatus: { $in: ['paid', 'pending'] }, status: { $nin: ['cancelled', 'refunded'] } }),
      Order.find({
        createdAt: { $gte: startDate },
        status: { $nin: ['cancelled', 'refunded'] }
      }),
      Product.find({ status: { $ne: 'archived' } }),
      CustomRequest.find({ status: { $nin: ['cancelled', 'completed'] } })
    ]);

    const totalRevenue = allOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalOrders = allOrders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const totalProducts = allProducts.filter(p => p.status === 'active').length;
    const lowStockCount = allProducts.filter(p => (p.stock ?? 0) <= (p.lowStockThreshold ?? 3)).length;
    const pendingCommissions = customRequests.length;

    // Status breakdown
    const statusCounts = allOrders.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {});

    // Recent 5 orders
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

    // Sales by day for chart
    const salesByDay = {};
    timeframeOrders.forEach(o => {
      const day = new Date(o.createdAt).toISOString().split('T')[0];
      salesByDay[day] = (salesByDay[day] || 0) + (o.total || 0);
    });

    // Top products by revenue from order items
    const productRevenue = {};
    allOrders.forEach(order => {
      (order.items || []).forEach(item => {
        const key = item.productId || item.name;
        if (!productRevenue[key]) {
          productRevenue[key] = { name: item.name, image: item.image, revenue: 0, sold: 0 };
        }
        productRevenue[key].revenue += (item.price || 0) * (item.quantity || 1);
        productRevenue[key].sold += (item.quantity || 1);
      });
    });
    const topProducts = Object.values(productRevenue)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Low stock items detail
    const lowStockItems = allProducts
      .filter(p => (p.stock ?? 0) <= (p.lowStockThreshold ?? 3))
      .map(p => ({ id: p.id, name: p.name, stock: p.stock, threshold: p.lowStockThreshold || 3, image: p.images?.[0] }))
      .slice(0, 10);

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
        topProducts,
        lowStockItems,
        salesByDay
      }
    });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ success: false, message: 'Could not compute analytics.' });
  }
});

export default router;
