import express from 'express';
import { Product } from '../models/Product.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const categoriesFilePath = path.join(__dirname, '../data/categories.json');

const router = express.Router();

import { Category } from '../models/Category.js';

// GET /api/products/categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/products/categories (Admin add category)
router.post('/categories', async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    await newCategory.save();
    res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /api/products/categories/:id
router.delete('/categories/:id', async (req, res) => {
  try {
    await Category.findOneAndDelete({ id: req.params.id });
    res.json({ success: true, message: 'Category removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, yarnMaterial, difficulty, inStock, sort, featured, isBestseller, limit } = req.query;
    
    let query = {};

    if (category && category !== 'all') {
      query.category = new RegExp(`^${category}$`, 'i');
    }

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

    if (yarnMaterial && yarnMaterial !== 'all') {
      query.yarnMaterial = { $regex: yarnMaterial, $options: 'i' };
    }

    if (difficulty && difficulty !== 'all') {
      query.difficulty = new RegExp(`^${difficulty}$`, 'i');
    }

    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (isBestseller === 'true') {
      query.isBestseller = true;
    }

    let mongooseQuery = Product.find(query);

    // Sorting
    if (sort === 'price-low') {
      mongooseQuery = mongooseQuery.sort({ price: 1 });
    } else if (sort === 'price-high') {
      mongooseQuery = mongooseQuery.sort({ price: -1 });
    } else if (sort === 'rating') {
      mongooseQuery = mongooseQuery.sort({ rating: -1 });
    } else if (sort === 'newest') {
      mongooseQuery = mongooseQuery.sort({ isNewArrival: -1, createdAt: -1 });
    } else {
      mongooseQuery = mongooseQuery.sort({ createdAt: -1 });
    }

    if (limit) {
      mongooseQuery = mongooseQuery.limit(parseInt(limit));
    }

    const products = await mongooseQuery.exec();
    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      count: products.length,
      total,
      data: products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/products/:id (by id or slug)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({
      $or: [{ id: req.params.id }, { slug: req.params.id }]
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Crochet product not found' });
    }

    // Find related products in same category
    const related = await Product.find({
      category: product.category,
      id: { $ne: product.id }
    }).limit(4);

    res.json({
      success: true,
      data: product,
      related
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/products (Admin create product)
router.post('/', async (req, res) => {
  try {
    const newProduct = new Product({
      id: `prod-${Date.now()}`,
      slug: req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      ...req.body
    });

    await newProduct.save();
    res.status(201).json({ success: true, message: 'Crochet piece added successfully', data: newProduct });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT /api/products/:id (Admin edit product)
router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Crochet piece updated successfully', data: updatedProduct });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /api/products/:id (Admin delete product)
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({ id: req.params.id });

    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Crochet piece removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/products/:id/reviews (Customer review)
router.post('/:id/reviews', async (req, res) => {
  try {
    const { author, rating, title, comment, avatar } = req.body;
    const product = await Product.findOne({ id: req.params.id });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const newReview = {
      id: `rev-${Date.now()}`,
      userName: author || 'Kind Maker Fan',
      avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(author || 'Fan')}`,
      rating: Number(rating) || 5,
      date: new Date().toISOString().split('T')[0],
      title: title || 'Beautiful handcrafted piece!',
      comment: comment || 'Exceeded my expectations!',
      verifiedPurchase: true
    };

    product.reviews = product.reviews || [];
    product.reviews.unshift(newReview);
    product.reviewsCount = product.reviews.length;
    product.rating = Number((product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length).toFixed(2));

    await product.save();

    res.status(201).json({ success: true, message: 'Thank you for your review!', data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
