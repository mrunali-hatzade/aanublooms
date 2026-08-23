import express from 'express';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/products/categories — public
router.get('/categories', async (req, res) => {
  try {
    const { includeAll } = req.query;
    const query = includeAll === 'true' ? {} : { status: { $ne: 'archived' } };
    const categories = await Category.find(query).sort({ displayOrder: 1, name: 1 });
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/products/categories — admin
router.post('/categories', requireAdmin, async (req, res) => {
  try {
    const { name, slug, description, image, displayOrder } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Category name is required.' });
    const id = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newCat = new Category({
      id,
      slug: id,
      name,
      description: description || '',
      image: image || '',
      displayOrder: displayOrder || 0,
      status: 'active'
    });
    await newCat.save();
    res.status(201).json({ success: true, data: newCat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/products/categories/:id — admin
router.put('/categories/:id', requireAdmin, async (req, res) => {
  try {
    const updated = await Category.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Category not found.' });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/products/categories/:id/status — admin (archive/restore)
router.patch('/categories/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Category.findOneAndUpdate({ id: req.params.id }, { status }, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Category not found.' });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/products/categories/:id — admin
router.delete('/categories/:id', requireAdmin, async (req, res) => {
  try {
    await Category.findOneAndDelete({ id: req.params.id });
    res.json({ success: true, message: 'Category removed.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/products/admin — admin, all products including inactive/archived
router.get('/admin', requireAdmin, async (req, res) => {
  try {
    const { search, category, status } = req.query;
    let query = {};
    if (status && status !== 'all') query.status = status;
    if (category && category !== 'all') query.category = new RegExp(`^${category}$`, 'i');
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }
    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/products — public, only active
router.get('/', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, yarnMaterial, difficulty, inStock, sort, featured, isBestseller, isNewArrival, limit } = req.query;

    let query = { status: 'active' };

    if (category && category !== 'all') query.category = new RegExp(`^${category}$`, 'i');
    if (search) {
      const q = search.trim();
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } },
        { yarnMaterial: { $regex: q, $options: 'i' } }
      ];
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    if (yarnMaterial && yarnMaterial !== 'all') query.yarnMaterial = { $regex: yarnMaterial, $options: 'i' };
    if (difficulty && difficulty !== 'all') query.difficulty = new RegExp(`^${difficulty}$`, 'i');
    if (inStock === 'true') query.stock = { $gt: 0 };
    if (featured === 'true') query.featured = true;
    if (isBestseller === 'true') query.isBestseller = true;
    if (isNewArrival === 'true') query.isNewArrival = true;

    let mongooseQuery = Product.find(query);
    if (sort === 'price-low') mongooseQuery = mongooseQuery.sort({ price: 1 });
    else if (sort === 'price-high') mongooseQuery = mongooseQuery.sort({ price: -1 });
    else if (sort === 'rating') mongooseQuery = mongooseQuery.sort({ rating: -1 });
    else if (sort === 'newest') mongooseQuery = mongooseQuery.sort({ isNewArrival: -1, createdAt: -1 });
    else mongooseQuery = mongooseQuery.sort({ createdAt: -1 });

    if (limit) mongooseQuery = mongooseQuery.limit(parseInt(limit));

    const products = await mongooseQuery.exec();
    const total = await Product.countDocuments(query);

    res.json({ success: true, count: products.length, total, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/products/:id — public (by id or slug)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({
      $or: [{ id: req.params.id }, { slug: req.params.id }],
      status: { $ne: 'archived' }
    });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    const related = await Product.find({
      category: product.category,
      id: { $ne: product.id },
      status: 'active'
    }).limit(4);

    res.json({ success: true, data: product, related });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/products — admin
router.post('/', requireAdmin, async (req, res) => {
  try {
    const id = req.body.id || `prod-${Date.now()}`;
    const slug = req.body.slug || (req.body.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newProduct = new Product({ ...req.body, id, slug, status: req.body.status || 'active' });
    await newProduct.save();
    res.status(201).json({ success: true, message: 'Product added successfully!', data: newProduct });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/products/:id — admin
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const updated = await Product.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, message: 'Product updated successfully!', data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PATCH /api/products/:id/status — admin (archive/restore/activate)
router.patch('/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['active', 'inactive', 'archived'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }
    const updated = await Product.findOneAndUpdate({ id: req.params.id }, { status }, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, message: `Product status set to ${status}.`, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/products/:id/stock — admin
router.patch('/:id/stock', requireAdmin, async (req, res) => {
  try {
    const { stock, delta } = req.body;
    const product = await Product.findOne({ id: req.params.id });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    if (stock !== undefined) {
      product.stock = Math.max(0, Number(stock));
    } else if (delta !== undefined) {
      product.stock = Math.max(0, (product.stock || 0) + Number(delta));
    }
    await product.save();
    res.json({ success: true, message: `Stock updated to ${product.stock}.`, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/products/:id — admin (hard delete, use with caution)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, message: 'Product permanently deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/products/:id/reviews — public
router.post('/:id/reviews', async (req, res) => {
  try {
    const { author, rating, title, comment, avatar } = req.body;
    const product = await Product.findOne({ id: req.params.id });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    const newReview = {
      id: `rev-${Date.now()}`,
      userName: author || 'Valued Customer',
      avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(author || 'fan')}`,
      rating: Number(rating) || 5,
      date: new Date().toISOString().split('T')[0],
      title: title || 'Great product!',
      comment: comment || 'Exceeded expectations!',
      verifiedPurchase: true
    };

    product.reviews = product.reviews || [];
    product.reviews.unshift(newReview);
    product.reviewsCount = product.reviews.length;
    product.rating = Number((product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length).toFixed(2));
    await product.save();

    res.status(201).json({ success: true, message: 'Review submitted!', data: product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

export default router;
