import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productsFilePath = path.join(__dirname, '../data/products.json');
const categoriesFilePath = path.join(__dirname, '../data/categories.json');

const router = express.Router();

// Helper to read products
const getProducts = () => {
  try {
    const data = fs.readFileSync(productsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading products file:', err);
    return [];
  }
};

// Helper to write products
const saveProducts = (products) => {
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), 'utf8');
};

// Helper to read categories
const getCategories = () => {
  try {
    const data = fs.readFileSync(categoriesFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading categories file:', err);
    return [];
  }
};

// GET /api/products/categories
router.get('/categories', (req, res) => {
  const categories = getCategories();
  res.json({ success: true, data: categories });
});

// GET /api/products
router.get('/', (req, res) => {
  let products = getProducts();
  const { category, search, minPrice, maxPrice, yarnMaterial, difficulty, inStock, sort, featured, isBestseller, limit } = req.query;

  if (category && category !== 'all') {
    products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase().trim();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(q))) ||
      p.yarnMaterial.toLowerCase().includes(q)
    );
  }

  if (minPrice) {
    products = products.filter(p => p.price >= parseFloat(minPrice));
  }

  if (maxPrice) {
    products = products.filter(p => p.price <= parseFloat(maxPrice));
  }

  if (yarnMaterial && yarnMaterial !== 'all') {
    products = products.filter(p => p.yarnMaterial.toLowerCase().includes(yarnMaterial.toLowerCase()));
  }

  if (difficulty && difficulty !== 'all') {
    products = products.filter(p => p.difficulty.toLowerCase() === difficulty.toLowerCase());
  }

  if (inStock === 'true') {
    products = products.filter(p => p.stock > 0);
  }

  if (featured === 'true') {
    products = products.filter(p => p.featured);
  }

  if (isBestseller === 'true') {
    products = products.filter(p => p.isBestseller);
  }

  // Sorting
  if (sort === 'price-low') {
    products.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    products.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    products.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'newest') {
    products.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  }

  const total = products.length;

  if (limit) {
    products = products.slice(0, parseInt(limit));
  }

  res.json({
    success: true,
    count: products.length,
    total,
    data: products
  });
});

// GET /api/products/:id (by id or slug)
router.get('/:id', (req, res) => {
  const products = getProducts();
  const product = products.find(p => p.id === req.params.id || p.slug === req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Crochet product not found' });
  }

  // Find related products in same category
  const related = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  res.json({
    success: true,
    data: product,
    related
  });
});

// POST /api/products (Admin create product)
router.post('/', (req, res) => {
  const products = getProducts();
  const newProduct = {
    id: `prod-${Date.now()}`,
    slug: req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    rating: 5.0,
    reviewCount: 0,
    reviews: [],
    colors: req.body.colors || [{ name: 'Default Palette', hex: '#D96B43', inStock: true }],
    sizes: req.body.sizes || ['Standard Size'],
    stock: parseInt(req.body.stock) || 10,
    featured: req.body.featured || false,
    isBestseller: req.body.isBestseller || false,
    isNew: true,
    ...req.body
  };

  products.unshift(newProduct);
  saveProducts(products);

  res.status(201).json({ success: true, message: 'Crochet piece added successfully', data: newProduct });
});

// PUT /api/products/:id (Admin edit product)
router.put('/:id', (req, res) => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  products[index] = { ...products[index], ...req.body };
  saveProducts(products);

  res.json({ success: true, message: 'Crochet piece updated successfully', data: products[index] });
});

// DELETE /api/products/:id (Admin delete product)
router.delete('/:id', (req, res) => {
  let products = getProducts();
  const initialLength = products.length;
  products = products.filter(p => p.id !== req.params.id);

  if (products.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  saveProducts(products);
  res.json({ success: true, message: 'Crochet piece removed' });
});

// POST /api/products/:id/reviews (Customer review)
router.post('/:id/reviews', (req, res) => {
  const { author, rating, title, comment, avatar } = req.body;
  const products = getProducts();
  const product = products.find(p => p.id === req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const newReview = {
    id: `rev-${Date.now()}`,
    author: author || 'Kind Maker Fan',
    avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(author || 'Fan')}`,
    rating: Number(rating) || 5,
    date: new Date().toISOString().split('T')[0],
    title: title || 'Beautiful handcrafted piece!',
    comment: comment || 'Exceeded my expectations!',
    verifiedPurchase: true,
    helpfulCount: 1
  };

  product.reviews = product.reviews || [];
  product.reviews.unshift(newReview);
  product.reviewCount = product.reviews.length;
  product.rating = Number((product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length).toFixed(2));

  saveProducts(products);

  res.status(201).json({ success: true, message: 'Thank you for your review!', data: product });
});

export default router;
