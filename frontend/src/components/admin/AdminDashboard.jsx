import React, { useState, useEffect, useRef } from 'react';
import {
  Package,
  ShoppingBag,
  Plus,
  Edit2,
  Trash2,
  Search,
  Eye,
  X,
  Palette,
  Shield,
  MessageSquareHeart,
  Star,
  IndianRupee,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Image as ImageIcon,
  Layers,
  ArrowUpRight,
  Upload,
  Camera,
  Check
} from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AdminDashboard = ({ onNavigate }) => {
  const { addToast } = useToast();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders' | 'commissions' | 'feedbacks' | 'messages'
  const [analytics, setAnalytics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [customRequests, setCustomRequests] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter for products
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');

  // Search & Filter for orders
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Product Add / Edit Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'forever-blooms',
    price: 699,
    originalPrice: 899,
    yarnMaterial: '100% Combed Milk Cotton',
    craftTimeHours: 4,
    difficulty: 'Intermediate',
    stock: 15,
    shortDescription: '',
    description: '',
    images: ['/images/aanu-blooms-signature-set.jpeg'],
    featured: true,
    isBestseller: false
  });

  // Preset quick-pick image options from our studio assets
  const studioPresetImages = [
    { label: '5-Piece Blossom Pots Set', url: '/images/aanu-blooms-signature-set.jpeg' },
    { label: '5-Piece Pots Top View', url: '/images/blossom-pots-collection.jpeg' },
    { label: 'Sunflower Cupcake Pot', url: '/images/sunflower-cupcake-pot.jpeg' },
    { label: 'Crimson Rose Cupcake Pot', url: '/images/crimson-rose-cupcake-pot.jpeg' },
    { label: 'Lavender Daisy Pot', url: '/images/lavender-daisy-cupcake-pot.jpeg' },
    { label: 'Golden Star Lily Pot', url: '/images/golden-lily-cupcake-pot.jpeg' },
    { label: 'Pink Tulip Handheld Stem', url: '/images/pink-tulip-stem.jpeg' },
    { label: 'Lavender & Lily Stems Duo', url: '/images/lavender-lily-stems.jpeg' },
    { label: 'Sunflower Handheld Stem', url: '/images/sunflower-stem-handheld.jpeg' }
  ];

  // Device file upload from PC / Laptop / Mobile Phone
  const handleDeviceFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Please select a valid image file (PNG, JPG, JPEG, WEBP)', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      addToast('Image size should be under 10MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setProductForm(prev => ({
        ...prev,
        images: [dataUrl, ...(prev.images?.filter(img => !img.startsWith('data:')) || [])]
      }));
      addToast('📸 Photo uploaded from your device successfully!', 'success');
    };
    reader.readAsDataURL(file);
  };

  // Fast direct photo launch from header
  const handleDirectPhotoLaunch = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setEditingProduct(null);
      setProductForm({
        name: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        category: 'forever-blooms',
        price: 599,
        originalPrice: 799,
        yarnMaterial: '100% Combed Milk Cotton',
        craftTimeHours: 4,
        difficulty: 'Intermediate',
        stock: 10,
        shortDescription: 'Slow-stitched handcrafted crochet piece made with love.',
        description: 'Handmade with ultra-soft milk cotton and velvet chenille. Perfect for thoughtful gifting and forever home decor.',
        images: [dataUrl],
        featured: true,
        isBestseller: false
      });
      setShowProductModal(true);
      addToast('📸 Photo loaded! Add product details and publish.', 'success');
    };
    reader.readAsDataURL(file);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [analyticsRes, ordersRes, productsRes, catsRes, customRes, contactRes, feedbackRes] = await Promise.all([
        api.getAnalytics(),
        api.getOrders(),
        api.getProducts(),
        api.getCategories(),
        api.getCustomRequests(),
        api.getContactMessages(),
        api.getFeedbacks()
      ]);
      setAnalytics(analyticsRes.data || {});
      setOrders(ordersRes.data || []);
      setProducts(productsRes.data || []);
      setCategories(catsRes.data || []);
      setCustomRequests(customRes.data || []);
      setContactMessages(contactRes.data || []);
      setFeedbacks(feedbackRes.data || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update order stage
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await api.updateOrderStatus(orderId, newStatus, `Stage updated to ${newStatus}`);
      if (res.success) {
        addToast(`Order #${orderId} stage updated to ${newStatus}! 📦`, 'success');
        setOrders(prev => prev.map(o => (o.id === orderId ? res.data : o)));
      }
    } catch (err) {
      addToast('Could not update order stage', 'error');
    }
  };

  // Quick Stock Adjuster (+1 / -1) directly on the product card
  const handleAdjustStock = async (prod, delta) => {
    const newStock = Math.max(0, (prod.stock || 0) + delta);
    try {
      const res = await api.updateProduct(prod.id, { ...prod, stock: newStock });
      if (res.success) {
        setProducts(prev => prev.map(p => (p.id === prod.id ? { ...p, stock: newStock } : p)));
        addToast(`Stock for "${prod.name}" updated to ${newStock}`, 'info');
      }
    } catch (err) {
      addToast('Could not update stock', 'error');
    }
  };

  // Open Add Product Modal
  const openAddModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'forever-blooms',
      price: 599,
      originalPrice: 799,
      yarnMaterial: '100% Combed Milk Cotton',
      craftTimeHours: 4,
      difficulty: 'Intermediate',
      stock: 12,
      shortDescription: 'Slow-stitched handcrafted crochet piece made with love.',
      description: 'Handmade with ultra-soft milk cotton and velvet chenille. Perfect for thoughtful gifting and forever home decor.',
      images: ['/images/aanu-blooms-signature-set.jpeg'],
      featured: true,
      isBestseller: false
    });
    setShowProductModal(true);
  };

  // Open Edit Product Modal
  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      ...prod,
      images: prod.images && prod.images.length > 0 ? prod.images : ['/images/aanu-blooms-signature-set.jpeg']
    });
    setShowProductModal(true);
  };

  // Save (Create or Update) Product
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name.trim()) {
      addToast('Please enter a product name', 'error');
      return;
    }

    try {
      if (editingProduct) {
        const res = await api.updateProduct(editingProduct.id, productForm);
        if (res.success) {
          addToast(`"${productForm.name}" updated successfully! 🌸`, 'success');
        }
      } else {
        const res = await api.createProduct(productForm);
        if (res.success) {
          addToast(`"${productForm.name}" added to AanuBlooms store! 🛍️`, 'success');
        }
      }
      setShowProductModal(false);
      setEditingProduct(null);
      fetchData();
    } catch (err) {
      addToast(err.message || 'Could not save product', 'error');
    }
  };

  // Delete Product
  const handleDeleteProduct = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to remove "${productName}" from the store catalog?`)) {
      try {
        const res = await api.deleteProduct(productId);
        if (res.success) {
          addToast(`"${productName}" removed from store`, 'info');
          setProducts(prev => prev.filter(p => p.id !== productId));
        }
      } catch (err) {
        addToast('Could not delete product', 'error');
      }
    }
  };

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesCategory = productCategoryFilter === 'all' || p.category === productCategoryFilter;
    const matchesSearch =
      !productSearch.trim() ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    const matchesSearch =
      !orderSearchQuery.trim() ||
      o.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.customer?.name?.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.customer?.city?.toLowerCase().includes(orderSearchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Studio Header & Top Action */}
      <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-5 sm:p-7 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-0.5 rounded-full bg-bloom-100 dark:bg-bloom-950 text-bloom-700 dark:text-bloom-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                Artisan Admin Studio
              </span>
              <span className="text-xs text-warmgray-400">Live Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-warmgray-900 dark:text-white">
              Store Sales & Catalog Manager
            </h1>
            <p className="text-xs text-warmgray-500 dark:text-warmgray-400 mt-0.5">
              Add new crochet items, adjust prices & stock in 1 click, and manage customer orders across India.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigate('shop')}
              className="px-3.5 py-2.5 bg-warmgray-100 dark:bg-warmgray-800 hover:bg-warmgray-200 text-warmgray-800 dark:text-warmgray-200 rounded-2xl font-bold text-xs flex items-center gap-1.5"
            >
              <span>View Store</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {/* Direct 1-Click Upload from Device */}
            <label className="cursor-pointer px-4 py-2.5 bg-warmgray-900 hover:bg-black text-white dark:bg-white dark:text-warmgray-900 rounded-2xl font-bold text-xs shadow-cozy flex items-center gap-2 transform hover:scale-102 transition-transform">
              <Camera className="w-3.5 h-3.5 text-bloom-400 dark:text-bloom-600" />
              <span>📁 Upload Photo (PC / Mobile)</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleDirectPhotoLaunch}
                className="hidden"
              />
            </label>

            <button
              onClick={openAddModal}
              className="px-4 py-2.5 bg-bloom-500 hover:bg-bloom-600 text-white rounded-2xl font-bold text-xs shadow-cozy flex items-center gap-2 transform hover:scale-102 transition-transform"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Product</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-warmgray-100 dark:border-warmgray-800">
          <div className="p-3.5 rounded-2xl bg-warmgray-50 dark:bg-warmgray-800/60 border border-warmgray-200/80 dark:border-warmgray-700">
            <span className="text-[10px] font-bold uppercase tracking-wider text-warmgray-400 block">Total Revenue</span>
            <p className="text-xl sm:text-2xl font-serif font-bold text-warmgray-900 dark:text-white mt-0.5">
              ₹{analytics?.totalRevenue?.toLocaleString('en-IN') || '0'}
            </p>
            <span className="text-[10px] text-emerald-600 font-semibold">From {orders.length} orders sold</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-warmgray-50 dark:bg-warmgray-800/60 border border-warmgray-200/80 dark:border-warmgray-700">
            <span className="text-[10px] font-bold uppercase tracking-wider text-warmgray-400 block">Active Store Items</span>
            <p className="text-xl sm:text-2xl font-serif font-bold text-bloom-600 dark:text-bloom-400 mt-0.5">
              {products.length} Products
            </p>
            <span className="text-[10px] text-warmgray-500">Across 9 boutique categories</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-warmgray-50 dark:bg-warmgray-800/60 border border-warmgray-200/80 dark:border-warmgray-700">
            <span className="text-[10px] font-bold uppercase tracking-wider text-warmgray-400 block">Customer Orders</span>
            <p className="text-xl sm:text-2xl font-serif font-bold text-purple-600 dark:text-purple-400 mt-0.5">
              {orders.length} Orders
            </p>
            <span className="text-[10px] text-warmgray-500">Live craft tracking active</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-warmgray-50 dark:bg-warmgray-800/60 border border-warmgray-200/80 dark:border-warmgray-700">
            <span className="text-[10px] font-bold uppercase tracking-wider text-warmgray-400 block">Custom Inquiries</span>
            <p className="text-xl sm:text-2xl font-serif font-bold text-amber-600 dark:text-amber-400 mt-0.5">
              {customRequests.length} Inquiries
            </p>
            <span className="text-[10px] text-warmgray-500">Bespoke commissions</span>
          </div>
        </div>
      </div>

      {/* Clean Tab Navigation */}
      <div className="flex gap-2 border-b border-warmgray-200 dark:border-warmgray-800 pb-2 overflow-x-auto">
        {[
          { id: 'products', label: `📦 Manage Products (${products.length})` },
          { id: 'orders', label: `🛍️ Customer Orders & Sales (${orders.length})` },
          { id: 'commissions', label: `🎨 Custom Inquiries (${customRequests.length})` },
          { id: 'feedbacks', label: `⭐ Reviews & Stories (${feedbacks.length})` },
          { id: 'messages', label: `✉️ Customer Notes (${contactMessages.length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-2xl font-bold text-xs transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-bloom-500 text-white shadow-cozy'
                : 'bg-warmgray-100 dark:bg-warmgray-800 text-warmgray-700 dark:text-warmgray-300 hover:bg-warmgray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ========================================================= */}
      {/* TAB 1: PRODUCTS & INVENTORY MANAGEMENT (ADD / REMOVE / EDIT) */}
      {/* ========================================================= */}
      {activeTab === 'products' && (
        <div className="space-y-5">
          
          {/* Controls: Search, Category Filters, and Add Button */}
          <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-4 sm:p-5 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-warmgray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search products by name or category..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full text-xs py-2.5 pl-9 pr-3 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
                />
              </div>

              <button
                onClick={openAddModal}
                className="w-full sm:w-auto px-4 py-2 bg-bloom-500 hover:bg-bloom-600 text-white rounded-xl font-bold text-xs shadow-cozy flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </button>
            </div>

            {/* Category Filter Chips */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 pt-1">
              {[
                { id: 'all', label: 'All Categories' },
                { id: 'forever-blooms', label: '🌸 Forever Blooms' },
                { id: 'amigurumi-plushies', label: '🧸 Plushies' },
                { id: 'hair-accessories', label: '🎀 Hair Bows' },
                { id: 'bookmarks', label: '🔖 Bookmarks' },
                { id: 'keychains', label: '🔑 Keychains' },
                { id: 'home-living', label: '🏡 Home Decor' },
                { id: 'bags-accessories', label: '👜 Bags' },
                { id: 'wearables-apparel', label: '🧶 Wearables' },
                { id: 'diy-kits-patterns', label: '📦 DIY Kits' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setProductCategoryFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    productCategoryFilter === cat.id
                      ? 'bg-warmgray-900 text-white dark:bg-white dark:text-warmgray-900 font-bold shadow-xs'
                      : 'bg-warmgray-100 dark:bg-warmgray-800 text-warmgray-600 dark:text-warmgray-400 hover:bg-warmgray-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Items Grid */}
          {isLoading ? (
            <div className="py-16 text-center text-xs text-warmgray-500">
              Loading store catalog...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-warmgray-900 rounded-3xl border border-warmgray-200 dark:border-warmgray-800">
              <Package className="w-10 h-10 text-warmgray-400 mx-auto mb-2" />
              <h4 className="font-serif font-bold text-sm text-warmgray-900 dark:text-white mb-1">
                No products found
              </h4>
              <p className="text-xs text-warmgray-500 mb-4">
                Try clearing your search or add a new handcrafted product!
              </p>
              <button
                onClick={openAddModal}
                className="px-5 py-2 bg-bloom-500 text-white rounded-full text-xs font-bold"
              >
                + Add First Product
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map(prod => (
                <div
                  key={prod.id}
                  className="bg-white dark:bg-warmgray-900 rounded-3xl p-4 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                >
                  {/* Top: Image & Info */}
                  <div className="space-y-3">
                    <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-warmgray-100 dark:bg-warmgray-800 border border-warmgray-200/60 dark:border-warmgray-700">
                      <img
                        src={prod.images?.[0] || '/images/aanu-blooms-signature-set.jpeg'}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider">
                        {prod.category}
                      </span>
                      {prod.isBestseller && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                          ★ Bestseller
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="font-serif font-bold text-sm text-warmgray-900 dark:text-white line-clamp-1">
                        {prod.name}
                      </h4>
                      <p className="text-[11px] text-warmgray-500 dark:text-warmgray-400 line-clamp-1 mt-0.5">
                        {prod.shortDescription || prod.yarnMaterial}
                      </p>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-warmgray-100 dark:border-warmgray-800">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-serif font-bold text-base text-bloom-600 dark:text-bloom-400">
                            ₹{prod.price?.toLocaleString('en-IN')}
                          </span>
                          {prod.originalPrice > prod.price && (
                            <span className="text-[11px] text-warmgray-400 line-through">
                              ₹{prod.originalPrice?.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>

                        {/* Quick Stock Adjuster Controls */}
                        <div className="flex items-center gap-1 bg-warmgray-50 dark:bg-warmgray-800 px-2 py-1 rounded-xl border border-warmgray-200 dark:border-warmgray-700">
                          <span className="text-[10px] text-warmgray-500 font-semibold mr-1">Stock:</span>
                          <button
                            onClick={() => handleAdjustStock(prod, -1)}
                            className="w-4 h-4 rounded bg-white dark:bg-warmgray-700 text-warmgray-800 dark:text-warmgray-200 text-xs font-bold flex items-center justify-center hover:bg-warmgray-200"
                            title="Decrease Stock"
                          >
                            -
                          </button>
                          <span className={`text-xs font-bold px-1 ${prod.stock <= 3 ? 'text-red-500' : 'text-warmgray-900 dark:text-white'}`}>
                            {prod.stock || 0}
                          </span>
                          <button
                            onClick={() => handleAdjustStock(prod, 1)}
                            className="w-4 h-4 rounded bg-bloom-100 dark:bg-bloom-950 text-bloom-700 dark:text-bloom-300 text-xs font-bold flex items-center justify-center hover:bg-bloom-200"
                            title="Increase Stock"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom: Edit & Remove Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-warmgray-100 dark:border-warmgray-800">
                    <button
                      onClick={() => openEditModal(prod)}
                      className="py-2 px-3 rounded-xl bg-warmgray-100 hover:bg-warmgray-200 dark:bg-warmgray-800 dark:hover:bg-warmgray-700 text-warmgray-800 dark:text-warmgray-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Item</span>
                    </button>

                    <button
                      onClick={() => handleDeleteProduct(prod.id, prod.name)}
                      className="py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/50 dark:hover:bg-red-950 dark:text-red-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: STORE SALES & ORDERS */}
      {/* ========================================================= */}
      {activeTab === 'orders' && (
        <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-5 sm:p-6 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-warmgray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search orders by ID or customer..."
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                className="w-full text-xs py-2 pl-9 pr-3 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
              />
            </div>

            <div className="flex gap-1 overflow-x-auto w-full sm:w-auto">
              {['all', 'placed', 'handcrafting', 'packaging', 'shipped', 'delivered'].map(st => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                    orderStatusFilter === st
                      ? 'bg-warmgray-900 text-white dark:bg-white dark:text-warmgray-900 font-bold shadow-xs'
                      : 'bg-warmgray-100 dark:bg-warmgray-800 text-warmgray-600 dark:text-warmgray-400'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-warmgray-200 dark:border-warmgray-800 text-warmgray-400 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Order ID & Date</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Items</th>
                  <th className="py-2.5 px-3">Total (₹)</th>
                  <th className="py-2.5 px-3">Live Craft Stage</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warmgray-100 dark:divide-warmgray-800">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-warmgray-50/50 dark:hover:bg-warmgray-800/40 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-mono font-bold text-bloom-600 dark:text-bloom-400 block">{order.id}</span>
                      <span className="text-[10px] text-warmgray-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-warmgray-900 dark:text-white">{order.customer?.name}</p>
                      <p className="text-[11px] text-warmgray-500">{order.customer?.city || 'India'} · {order.customer?.phone}</p>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-warmgray-800 dark:text-warmgray-200">
                        {order.items?.length} piece(s)
                      </span>
                    </td>
                    <td className="py-3 px-3 font-serif font-bold text-warmgray-900 dark:text-white">
                      ₹{order.total?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        className={`text-xs font-bold py-1 px-2.5 rounded-xl border focus:outline-none ${
                          order.status === 'delivered'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                            : order.status === 'shipped'
                            ? 'bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300'
                            : order.status === 'handcrafting'
                            ? 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-rosewood-50 text-rosewood-800 border-rosewood-300 dark:bg-rosewood-950 dark:text-rosewood-300'
                        }`}
                      >
                        <option value="placed">⏱️ Placed (Pending Yarn)</option>
                        <option value="handcrafting">🧶 Handcrafting & Stitching</option>
                        <option value="packaging">🌸 Ribbon & Packaging</option>
                        <option value="shipped">📦 Shipped</option>
                        <option value="delivered">🏡 Delivered</option>
                      </select>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onNavigate('track-order', { id: order.id })}
                        className="px-2.5 py-1 bg-warmgray-100 hover:bg-warmgray-200 dark:bg-warmgray-800 text-warmgray-800 dark:text-warmgray-200 rounded-lg text-[11px] font-bold inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Tracker</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: CUSTOM BESPOKE INQUIRIES */}
      {/* ========================================================= */}
      {activeTab === 'commissions' && (
        <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-5 sm:p-6 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft space-y-4">
          <h3 className="font-serif font-bold text-base sm:text-lg text-warmgray-900 dark:text-white">
            Customer Custom Commissions ({customRequests.length})
          </h3>
          <div className="space-y-3">
            {customRequests.map((comm) => (
              <div key={comm.id} className="p-4 rounded-2xl border border-warmgray-200 dark:border-warmgray-800 bg-warmgray-50 dark:bg-warmgray-800/50 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-bloom-600">#{comm.id}</span>
                    <h4 className="font-bold text-sm text-warmgray-900 dark:text-white">{comm.itemType}</h4>
                    <p className="text-xs text-warmgray-500">From: <strong>{comm.customerName}</strong> ({comm.customerEmail}) · Phone: {comm.customerPhone}</p>
                  </div>
                  <span className="text-xs font-bold text-bloom-600 bg-bloom-50 dark:bg-bloom-950 px-2.5 py-1 rounded-full">
                    Budget: {comm.estimatedBudget}
                  </span>
                </div>
                <p className="text-xs text-warmgray-700 dark:text-warmgray-300 bg-white dark:bg-warmgray-900 p-2.5 rounded-xl border border-warmgray-100 dark:border-warmgray-700">
                  {comm.specialNotes}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: FEEDBACKS */}
      {/* ========================================================= */}
      {activeTab === 'feedbacks' && (
        <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-5 sm:p-6 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft space-y-4">
          <h3 className="font-serif font-bold text-base sm:text-lg text-warmgray-900 dark:text-white">
            Customer Reviews & Stories ({feedbacks.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {feedbacks.map((fb) => (
              <div key={fb.id} className="p-4 rounded-2xl border border-warmgray-200 dark:border-warmgray-800 bg-warmgray-50/50 dark:bg-warmgray-800/40 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-warmgray-900 dark:text-white">{fb.name}</h4>
                    <p className="text-[11px] text-warmgray-500">{fb.city} · <span className="text-bloom-600 dark:text-bloom-400 font-semibold">{fb.category}</span></p>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < fb.rating ? 'fill-amber-400 text-amber-400' : 'text-warmgray-300 dark:text-warmgray-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-warmgray-700 dark:text-warmgray-300 italic">
                  "{fb.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: CONTACT NOTES */}
      {/* ========================================================= */}
      {activeTab === 'messages' && (
        <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-5 sm:p-6 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft space-y-4">
          <h3 className="font-serif font-bold text-base sm:text-lg text-warmgray-900 dark:text-white">
            Customer Contact Inquiries ({contactMessages.length})
          </h3>
          <div className="space-y-3">
            {contactMessages.map((msg) => (
              <div key={msg.id} className="p-4 rounded-2xl border border-warmgray-200 dark:border-warmgray-800 bg-warmgray-50 dark:bg-warmgray-800/50 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-rosewood-600">{msg.subject}</span>
                    <h4 className="font-bold text-sm text-warmgray-900 dark:text-white">{msg.name}</h4>
                    <p className="text-xs text-warmgray-500">{msg.email} {msg.orderId ? `· Order #${msg.orderId}` : ''}</p>
                  </div>
                  <span className="text-[10px] text-warmgray-400">
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-warmgray-700 dark:text-warmgray-300 bg-white dark:bg-warmgray-900 p-2.5 rounded-xl border border-warmgray-100 dark:border-warmgray-700">
                  {msg.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ========================================================= */}
      {/* PRODUCT ADD / EDIT MODAL */}
      {/* ========================================================= */}
      {showProductModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowProductModal(false);
          }}
        >
          <div className="relative bg-white dark:bg-warmgray-900 rounded-3xl max-w-xl w-full border border-warmgray-200 dark:border-warmgray-800 shadow-2xl z-10 flex flex-col max-h-[88vh] overflow-hidden animate-in zoom-in-95">
            
            {/* STICKY MODAL HEADER with Clear Close Button */}
            <div className="px-5 sm:px-6 py-4 border-b border-warmgray-100 dark:border-warmgray-800 flex items-center justify-between bg-white dark:bg-warmgray-900 z-10 shrink-0">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-bloom-600 dark:text-bloom-400 block">
                  {editingProduct ? 'Update Existing Item' : 'Create New Boutique Item'}
                </span>
                <h3 className="font-serif font-bold text-lg text-warmgray-900 dark:text-white">
                  {editingProduct ? 'Edit Handcrafted Piece' : 'Add New Crochet Product'}
                </h3>
              </div>
              
              <button 
                type="button"
                onClick={() => setShowProductModal(false)} 
                className="p-2 rounded-full bg-warmgray-100 hover:bg-warmgray-200 dark:bg-warmgray-800 dark:hover:bg-warmgray-700 text-warmgray-600 dark:text-warmgray-300 transition-colors"
                title="Close modal (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* SCROLLABLE FORM BODY */}
            <form onSubmit={handleSaveProduct} className="flex flex-col flex-1 overflow-hidden">
              <div className="overflow-y-auto px-5 sm:px-6 py-4 space-y-4 flex-1">
                
                {/* Product Name */}
                <div>
                  <label className="block text-xs font-bold text-warmgray-700 dark:text-warmgray-300 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. Pink Tulip & Daisy Handcrafted Bouquet"
                    className="w-full text-xs p-2.5 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
                  />
                </div>

                {/* Category & Price */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-warmgray-700 dark:text-warmgray-300 mb-1">
                      Store Category *
                    </label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
                    >
                      <option value="forever-blooms">🌸 Forever Blooms & Pots</option>
                      <option value="amigurumi-plushies">🧸 Amigurumi Plushies</option>
                      <option value="hair-accessories">🎀 Hair Bows & Parandis</option>
                      <option value="bookmarks">🔖 Botanical Bookmarks</option>
                      <option value="keychains">🔑 Keychains & Charms</option>
                      <option value="home-living">🏡 Cozy Home & Living</option>
                      <option value="bags-accessories">👜 Bags & Totes</option>
                      <option value="wearables-apparel">🧶 Wearables & Cardigans</option>
                      <option value="diy-kits-patterns">📦 DIY Kits & Patterns</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-warmgray-700 dark:text-warmgray-300 mb-1">
                      Selling Price (₹ INR) *
                    </label>
                    <input
                      type="number"
                      step="1"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) })}
                      className="w-full text-xs p-2.5 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Compare Price & Initial Stock */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-warmgray-700 dark:text-warmgray-300 mb-1">
                      Compare / MRP Price (₹)
                    </label>
                    <input
                      type="number"
                      value={productForm.originalPrice}
                      onChange={(e) => setProductForm({ ...productForm, originalPrice: parseFloat(e.target.value) })}
                      className="w-full text-xs p-2.5 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-warmgray-700 dark:text-warmgray-300 mb-1">
                      Available Stock *
                    </label>
                    <input
                      type="number"
                      required
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) })}
                      className="w-full text-xs p-2.5 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                {/* Device Photo Upload (PC / Mobile / Laptop) & Studio Image Selector */}
                <div className="p-3.5 bg-gradient-to-r from-bloom-50/70 to-rosewood-50/50 dark:from-warmgray-800/80 dark:to-warmgray-800/60 rounded-2xl border-2 border-dashed border-bloom-300 dark:border-warmgray-700 space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-warmgray-900 dark:text-white flex items-center gap-1.5">
                        <Upload className="w-4 h-4 text-bloom-600 dark:text-bloom-400" />
                        <span>Upload Product Photo from PC / Phone</span>
                      </span>
                      <p className="text-[11px] text-warmgray-500">
                        Choose any picture from your laptop files or mobile camera/gallery (PNG, JPG, WEBP).
                      </p>
                    </div>

                    <label className="cursor-pointer px-3.5 py-2 bg-bloom-500 hover:bg-bloom-600 text-white rounded-xl text-xs font-bold shadow-cozy flex items-center gap-1.5 shrink-0 transform hover:scale-102 transition-transform">
                      <Camera className="w-3.5 h-3.5" />
                      <span>Choose Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleDeviceFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Current Active Photo Preview */}
                  {productForm.images?.[0] && (
                    <div className="flex items-center gap-3 p-2 bg-white dark:bg-warmgray-900 rounded-xl border border-warmgray-200 dark:border-warmgray-700 shadow-xs">
                      <img
                        src={productForm.images[0]}
                        alt="Product Preview"
                        className="w-14 h-14 rounded-lg object-cover border border-bloom-300 shadow-xs"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Photo Selected & Ready to Showcase</span>
                        </span>
                        <p className="text-xs font-mono text-warmgray-600 dark:text-warmgray-300 truncate mt-0.5">
                          {productForm.images[0].startsWith('data:') ? '📸 Uploaded from your device' : productForm.images[0]}
                        </p>
                      </div>
                      <label className="text-xs font-bold text-bloom-600 dark:text-bloom-400 hover:underline cursor-pointer px-2 py-1">
                        Replace
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleDeviceFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}

                  {/* Studio Preset Quick-Pick Options */}
                  <div className="pt-2 border-t border-bloom-100 dark:border-warmgray-700">
                    <span className="text-[10px] font-bold text-warmgray-400 uppercase tracking-wider block mb-1.5">
                      — Or Pick from Studio Preset Photos —
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {studioPresetImages.map(img => (
                        <button
                          key={img.url}
                          type="button"
                          onClick={() => setProductForm(prev => ({ ...prev, images: [img.url] }))}
                          className={`px-2 py-1 rounded-xl text-[10px] font-semibold border transition-all ${
                            productForm.images?.[0] === img.url
                              ? 'border-bloom-500 bg-bloom-500 text-white font-bold'
                              : 'border-warmgray-200 dark:border-warmgray-700 bg-white dark:bg-warmgray-900 text-warmgray-700 dark:text-warmgray-300 hover:border-bloom-300'
                          }`}
                        >
                          📷 {img.label}
                        </button>
                      ))}
                    </div>

                    <div className="pt-2">
                      <input
                        type="text"
                        value={productForm.images?.[0] || ''}
                        onChange={(e) => setProductForm({ ...productForm, images: [e.target.value] })}
                        placeholder="Or enter custom image URL: /images/... or https://..."
                        className="w-full text-xs p-2 rounded-xl bg-white dark:bg-warmgray-900 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Descriptions */}
                <div>
                  <label className="block text-xs font-bold text-warmgray-700 dark:text-warmgray-300 mb-1">
                    Short Description
                  </label>
                  <input
                    type="text"
                    value={productForm.shortDescription}
                    onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                    placeholder="e.g. Never-wilting hand-crocheted bouquet of blushing pink tulips."
                    className="w-full text-xs p-2.5 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
                  />
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.isBestseller}
                      onChange={(e) => setProductForm({ ...productForm, isBestseller: e.target.checked })}
                      className="w-4 h-4 text-bloom-500 rounded"
                    />
                    <span>Mark as Bestseller ★</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.featured}
                      onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                      className="w-4 h-4 text-bloom-500 rounded"
                    />
                    <span>Feature on Homepage ✨</span>
                  </label>
                </div>
              </div>

              {/* STICKY MODAL FOOTER ACTION BUTTONS */}
              <div className="px-5 sm:px-6 py-3.5 border-t border-warmgray-100 dark:border-warmgray-800 flex items-center justify-between bg-warmgray-50/80 dark:bg-warmgray-900/80 z-10 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 text-xs font-bold text-warmgray-600 dark:text-warmgray-300 hover:text-warmgray-900 dark:hover:text-white rounded-xl hover:bg-warmgray-200 dark:hover:bg-warmgray-800 transition-colors"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-bloom-500 hover:bg-bloom-600 text-white rounded-full font-bold text-xs shadow-cozy transform hover:scale-102 transition-transform"
                >
                  {editingProduct ? 'Save Product Changes' : 'Publish Product to Store 🌸'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
