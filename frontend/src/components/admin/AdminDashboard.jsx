import React, { useState, useEffect } from 'react';
import {
  Home,
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
  ShieldAlert,
  ShieldCheck,
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
  Check,
  Bell,
  Calendar,
  ChevronDown,
  Menu,
  Users,
  FolderPlus,
  Ticket,
  Megaphone,
  BarChart3,
  Settings,
  Truck,
  CreditCard,
  UserCheck,
  Clock,
  ExternalLink,
  MessageCircle,
  Video,
  FileText,
  AlertTriangle,
  RefreshCw,
  Filter,
  MoreVertical,
  ChevronRight,
  ArrowRight,
  Copy,
  Archive,
  Lock
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StoreSettingsModule } from './settings/StoreSettingsModule';

export const AdminDashboard = ({ onNavigate }) => {
  const { user, login } = useAuth();
  const { addToast } = useToast();

  // Admin Access Verification
  const isAdmin = user && (
    user.role === 'admin' ||
    user.email === 'aanu@aanublooms.com' ||
    user.email === 'priya@stitchandlove.com' ||
    user.name?.toLowerCase().includes('aanu') ||
    user.name?.toLowerCase().includes('priya') ||
    user.name?.toLowerCase().includes('admin')
  );

  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'products' | 'categories' | 'collections' | 'inventory' | 'orders' | 'custom-orders' | 'enquiries' | 'customers' | 'media' | 'coupons' | 'settings' | 'reports'
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [salesTimeframe, setSalesTimeframe] = useState('7-days'); // 'today' | '7-days' | '30-days' | '3-months' | '1-year'
  const [selectedDateRange, setSelectedDateRange] = useState('19 May – 25 May 2026');

  const [analytics, setAnalytics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [customRequests, setCustomRequests] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter state for Products
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');

  // Search & Filter state for Orders
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Customer Directory Search, Sort & Selection State
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [customerSortBy, setCustomerSortBy] = useState('recent'); // 'recent' | 'spend' | 'orders'
  const [selectedCustomerDetails, setSelectedCustomerDetails] = useState(null);

  // Selected Order for Modal View
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  // Product Add / Edit Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
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

  // Low Stock Items State
  const [lowStockItems, setLowStockItems] = useState([
    { id: 'mat-1', name: 'Pink Cotton Yarn', count: '2 balls remaining', type: 'Raw Material', urgency: 'high' },
    { id: 'mat-2', name: 'Cream Velvet Chenille', count: '3 balls remaining', type: 'Raw Material', urgency: 'medium' },
    { id: 'mat-3', name: 'Artisan Packaging Boxes', count: '5 remaining', type: 'Packaging', urgency: 'medium' }
  ]);

  // Notifications dropdown toggle
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

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

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [analyticsRes, ordersRes, productsRes, catsRes, customRes, contactRes, feedbackRes, couponsRes] = await Promise.all([
        api.getAnalytics().catch(() => ({ data: {} })),
        api.getOrders().catch(() => ({ data: [] })),
        api.getProducts().catch(() => ({ data: [] })),
        api.getCategories().catch(() => ({ data: [] })),
        api.getCustomRequests().catch(() => ({ data: [] })),
        api.getContactMessages().catch(() => ({ data: [] })),
        api.getFeedbacks().catch(() => ({ data: [] })),
        api.getCoupons().catch(() => ({ data: [] }))
      ]);
      setAnalytics(analyticsRes.data || {});
      setOrders(ordersRes.data || []);
      setProducts(productsRes.data || []);
      setCategories(catsRes.data || []);
      setCustomRequests(customRes.data || []);
      setContactMessages(contactRes.data || []);
      setFeedbacks(feedbackRes.data || []);
      setCoupons(couponsRes.data || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      addToast('📸 Photo selected from device!', 'success');
    };
    reader.readAsDataURL(file);
  };

  // Fast direct photo launch from header
  const handleDirectPhotoLaunch = (e) => {
    if (!isAdmin) {
      addToast('Admin access required to add products', 'error');
      return;
    }
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
      addToast('📸 Photo loaded! Enter details and publish.', 'success');
    };
    reader.readAsDataURL(file);
  };

  // Update order stage
  const handleUpdateStatus = async (orderId, newStatus) => {
    if (!isAdmin) {
      addToast('Admin access required to update orders', 'error');
      return;
    }
    try {
      const res = await api.updateOrderStatus(orderId, newStatus, `Stage updated to ${newStatus}`);
      if (res.success) {
        addToast(`Order #${orderId} status updated to ${newStatus}! 📦`, 'success');
        setOrders(prev => prev.map(o => (o.id === orderId ? res.data : o)));
      }
    } catch (err) {
      addToast('Could not update order stage', 'error');
    }
  };

  // Quick Stock Adjuster (+1 / -1)
  const handleAdjustStock = async (prod, delta) => {
    if (!isAdmin) {
      addToast('Admin access required to adjust stock', 'error');
      return;
    }
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

  // Derive Unique Customer Buyers List from Orders
  const uniqueCustomersList = React.useMemo(() => {
    const customerMap = new Map();

    orders.forEach(ord => {
      const emailKey = (ord.customer?.email || ord.customer?.name || 'unknown').toLowerCase().trim();
      const existing = customerMap.get(emailKey);

      if (existing) {
        existing.totalOrders += 1;
        existing.totalSpent += (ord.total || 0);
        existing.ordersList.push(ord);
        if (new Date(ord.createdAt || 0) > new Date(existing.latestOrderDate || 0)) {
          existing.latestOrderDate = ord.createdAt;
          existing.latestOrderId = ord.id;
          existing.latestOrderStatus = ord.status;
        }
      } else {
        customerMap.set(emailKey, {
          id: `cust-${customerMap.size + 1}`,
          name: ord.customer?.name || 'Valued Buyer',
          email: ord.customer?.email || 'N/A',
          phone: ord.customer?.phone || 'N/A',
          address: ord.customer?.address || '',
          city: ord.customer?.city || 'Pune',
          state: ord.customer?.state || 'Maharashtra',
          zip: ord.customer?.zip || '411038',
          fullAddress: `${ord.customer?.address || ''}, ${ord.customer?.city || 'Pune'}, ${ord.customer?.state || 'Maharashtra'} - ${ord.customer?.zip || ''}`,
          totalOrders: 1,
          totalSpent: (ord.total || 0),
          latestOrderDate: ord.createdAt || new Date().toISOString(),
          latestOrderId: ord.id,
          latestOrderStatus: ord.status,
          ordersList: [ord]
        });
      }
    });

    let list = Array.from(customerMap.values());

    // Apply Search
    if (customerSearchQuery.trim()) {
      const q = customerSearchQuery.toLowerCase().trim();
      list = list.filter(c => 
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
      );
    }

    // Apply Sort
    if (customerSortBy === 'spend') {
      list.sort((a, b) => b.totalSpent - a.totalSpent);
    } else if (customerSortBy === 'orders') {
      list.sort((a, b) => b.totalOrders - a.totalOrders);
    } else {
      list.sort((a, b) => new Date(b.latestOrderDate) - new Date(a.latestOrderDate));
    }

    return list;
  }, [orders, customerSearchQuery, customerSortBy]);

  // Open Add Modal
  const openAddModal = () => {
    if (!isAdmin) {
      addToast('Admin access required to add products', 'error');
      return;
    }
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

  // Open Edit Modal
  const openEditModal = (prod) => {
    if (!isAdmin) {
      addToast('Admin access required to edit products', 'error');
      return;
    }
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
    if (!isAdmin) {
      addToast('Admin access required to save products', 'error');
      return;
    }
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
          addToast(`"${productForm.name}" added to store catalog! 🛍️`, 'success');
        }
      }
      setShowProductModal(false);
      setEditingProduct(null);
      fetchData();
    } catch (err) {
      addToast(err.message || 'Could not save product', 'error');
    }
  };

  // Delete Product (Admin Only)
  const handleDeleteProduct = async (productId, productName) => {
    if (!isAdmin) {
      addToast('Admin access required to delete products', 'error');
      return;
    }
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

  // Top Products Ranked List (01 to 05)
  const topProductsList = [
    { rank: '01', name: 'Daisy Crochet Bag', sold: '42 sold', revenue: '₹54,558', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=120&q=80' },
    { rank: '02', name: 'Tulip Flower Bouquet', sold: '35 sold', revenue: '₹41,965', image: '/images/pink-tulip-stem.jpeg' },
    { rank: '03', name: 'Cute Bunny Amigurumi', sold: '28 sold', revenue: '₹24,920', image: 'https://images.unsplash.com/photo-1558877385-81a1c7e67d72?auto=format&fit=crop&w=120&q=80' },
    { rank: '04', name: 'Sunflower Keychain', sold: '26 sold', revenue: '₹9,074', image: '/images/sunflower-cupcake-pot.jpeg' },
    { rank: '05', name: 'Heart Coaster Set', sold: '22 sold', revenue: '₹6,578', image: '/images/blossom-pots-collection.jpeg' }
  ];

  // Restock action handler for low stock items
  const handleRestock = (item) => {
    addToast(`Restock PO order generated for ${item.name}! 📦`, 'success');
  };

  // Admin Login Form State
  const [adminEmail, setAdminEmail] = useState('admin@aanublooms.com');
  const [adminPassword, setAdminPassword] = useState('');

  const handleAdminFormLogin = (e) => {
    e.preventDefault();
    if (adminEmail && adminPassword) {
      const res = login(adminEmail, adminPassword);
      if (!res.success) {
        // feedback handled in login
      }
    }
  };

  // =========================================================================
  // IF USER IS NOT LOGGED IN AS ADMIN: DISPLAY REAL ADMIN LOGIN GATE
  // =========================================================================
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#F8F6F3] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 border border-[#E9E2DC] shadow-[0_4px_20px_rgba(0,0,0,0.06)] max-w-md w-full text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-[#D96C65]/10 text-[#D96C65] mx-auto flex items-center justify-center">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#756A65] block">
              STITCH & LOVE · ADMIN STUDIO
            </span>
            <h2 className="text-xl font-serif font-bold text-[#3E2B25] mt-1">
              Admin Portal Sign In
            </h2>
            <p className="text-xs text-[#756A65] mt-1.5 leading-relaxed">
              Enter authorized administrator credentials to manage products, view sales, and fulfill customer orders.
            </p>
          </div>

          <form onSubmit={handleAdminFormLogin} className="space-y-3 text-left">
            <div>
              <label className="block text-xs font-semibold text-[#3E2B25] mb-1">
                Admin Email Address
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@aanublooms.com"
                className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25] focus:outline-none focus:border-[#D96C65]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3E2B25] mb-1">
                Admin Password
              </label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25] focus:outline-none focus:border-[#D96C65]"
              />
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#D96C65] hover:bg-[#C95B55] text-white rounded-xl font-semibold text-xs transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>Sign In to Admin Studio</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAdminEmail('admin@aanublooms.com');
                  setAdminPassword('adminpassword123');
                  login('admin@aanublooms.com', 'adminpassword123');
                }}
                className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>⚡ 1-Click Fill & Sign In as Admin</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="w-full py-2.5 px-4 bg-[#F8F6F3] hover:bg-[#E9E2DC] text-[#3E2B25] rounded-xl font-semibold text-xs transition-colors"
              >
                Return to Storefront
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MAIN ADMIN SAAS APPLICATION SHELL
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#F8F6F3] text-[#3E2B25] flex antialiased font-sans">
      
      {/* 1. FIXED / STICKY DARK COCOA SIDEBAR (Width: 250px, Color: #3E2B25) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[250px] bg-[#3E2B25] text-white flex flex-col justify-between p-4 shadow-xl transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="space-y-5 overflow-y-auto pr-1 scrollbar-none">
          
          {/* Brand Logo & Studio Mark */}
          <div className="flex items-center justify-between px-2 pt-2 pb-1 border-b border-white/10">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-base tracking-tight text-white">
                  STITCH & LOVE
                </span>
                <span className="text-[#D96C65] text-xs">♡</span>
              </div>
              <span className="text-[9px] uppercase tracking-widest text-[#E9E2DC]/60 font-semibold block">
                ADMIN STUDIO
              </span>
            </div>
            
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Section: OVERVIEW */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 px-3 block">
              OVERVIEW
            </span>
            <button
              onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors text-left ${
                activeTab === 'dashboard'
                  ? 'bg-[#D96C65] text-white shadow-sm'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
          </div>

          {/* Nav Section: SHOP */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 px-3 block">
              SHOP
            </span>
            <button
              onClick={() => { setActiveTab('products'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                activeTab === 'products'
                  ? 'bg-[#D96C65] text-white font-semibold'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Products ({products.length || 27})</span>
            </button>
            <button
              onClick={() => { setActiveTab('categories'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                activeTab === 'categories'
                  ? 'bg-[#D96C65] text-white font-semibold'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Categories</span>
            </button>
            <button
              onClick={() => { setActiveTab('collections'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                activeTab === 'collections'
                  ? 'bg-[#D96C65] text-white font-semibold'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <FolderPlus className="w-4 h-4" />
              <span>Collections</span>
            </button>
            <button
              onClick={() => { setActiveTab('inventory'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                activeTab === 'inventory'
                  ? 'bg-[#D96C65] text-white font-semibold'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Inventory</span>
            </button>
          </div>

          {/* Nav Section: ORDERS */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 px-3 block">
              ORDERS
            </span>
            <button
              onClick={() => { setActiveTab('orders'); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                activeTab === 'orders'
                  ? 'bg-[#D96C65] text-white font-semibold'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" />
                <span>All Orders</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#D65C5C] text-white text-[10px] font-bold">
                {orders.length || 12}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('custom-orders'); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                activeTab === 'custom-orders'
                  ? 'bg-[#D96C65] text-white font-semibold'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Palette className="w-4 h-4" />
                <span>Custom Orders</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#D99A35] text-white text-[10px] font-bold">
                {customRequests.length || 7}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('enquiries'); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                activeTab === 'enquiries'
                  ? 'bg-[#D96C65] text-white font-semibold'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquareHeart className="w-4 h-4" />
                <span>Enquiries</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold">
                {contactMessages.length || 3}
              </span>
            </button>
          </div>

          {/* Nav Section: CUSTOMERS */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 px-3 block">
              CUSTOMERS
            </span>
            <button
              onClick={() => { setActiveTab('customers'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                activeTab === 'customers'
                  ? 'bg-[#D96C65] text-white font-semibold'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Customers</span>
            </button>
          </div>

          {/* Nav Section: CONTENT */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 px-3 block">
              CONTENT
            </span>
            <button
              onClick={() => onNavigate('home')}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors text-left"
            >
              <Home className="w-4 h-4" />
              <span>Homepage</span>
            </button>
            <button
              onClick={() => { setActiveTab('media'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                activeTab === 'media'
                  ? 'bg-[#D96C65] text-white font-semibold'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Media Library</span>
            </button>
          </div>

          {/* Nav Section: MARKETING */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 px-3 block">
              MARKETING
            </span>
            <button
              onClick={() => { setActiveTab('coupons'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                activeTab === 'coupons'
                  ? 'bg-[#D96C65] text-white font-semibold'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>Coupons & Offers</span>
            </button>
          </div>

          {/* Nav Section: ANALYTICS */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 px-3 block">
              ANALYTICS
            </span>
            <button
              onClick={() => { setActiveTab('reports'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                activeTab === 'reports'
                  ? 'bg-[#D96C65] text-white font-semibold'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Reports</span>
            </button>
          </div>

          {/* Nav Section: SETTINGS */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 px-3 block">
              SETTINGS
            </span>
            <button
              onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                activeTab === 'settings'
                  ? 'bg-[#D96C65] text-white font-semibold'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Store Settings</span>
            </button>
          </div>

        </div>

        {/* Bottom Sidebar: View Store & Profile */}
        <div className="pt-3 border-t border-white/10 space-y-2 mt-2">
          <button
            onClick={() => onNavigate('shop')}
            className="w-full py-2 px-3 rounded-xl border border-white/20 hover:bg-white/10 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <span>View Store</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#D96C65]" />
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* 2. DEDICATED ADMIN CONTENT AREA */}
      <div className="flex-1 lg:ml-[250px] flex flex-col min-h-screen">
        
        {/* DEDICATED ADMIN TOPBAR (64px) */}
        <header className="sticky top-0 z-30 bg-white border-b border-[#E9E2DC] h-16 px-5 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-[#F8F6F3] text-[#3E2B25]"
            >
              <Menu className="w-5 h-5" />
            </button>

            <span className="font-serif font-bold text-lg text-[#3E2B25] capitalize">
              {activeTab.replace('-', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Input */}
            <div className="relative hidden md:block w-64">
              <Search className="w-3.5 h-3.5 text-[#756A65] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full text-xs py-2 pl-9 pr-3 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25] placeholder-[#756A65]/70 focus:outline-none focus:border-[#D96C65]"
              />
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl bg-[#F8F6F3] hover:bg-[#E9E2DC] text-[#3E2B25] relative transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#D65C5C] rounded-full" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#E9E2DC] p-3.5 z-50 text-xs animate-in fade-in">
                  <div className="flex justify-between items-center pb-2.5 border-b border-[#E9E2DC] font-bold">
                    <span>Recent Notifications</span>
                    <span className="text-[10px] text-[#D96C65]">5 New</span>
                  </div>
                  <div className="divide-y divide-[#E9E2DC]/60 space-y-1 mt-1">
                    <p className="py-2 text-[#3E2B25]">🛍️ <strong>New order received</strong>: #SL1024 has been placed (2m ago)</p>
                    <p className="py-2 text-[#3E2B25]">🎨 <strong>New custom order</strong>: #CO1023 requires your review (15m ago)</p>
                    <p className="py-2 text-[#3E2B25]">⚠️ <strong>Low stock alert</strong>: Pink Yarn is running low (1h ago)</p>
                    <p className="py-2 text-[#3E2B25]">💬 <strong>New enquiry</strong>: Riya sent a message (2h ago)</p>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 pl-2 border-l border-[#E9E2DC] hover:opacity-80 transition-opacity"
              >
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                  alt="Admin"
                  className="w-8 h-8 rounded-full object-cover border border-[#E9E2DC]"
                />
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold leading-none text-[#3E2B25]">{user?.name || 'Aanu (Admin)'}</p>
                  <span className="text-[10px] text-[#756A65] leading-tight">Store Admin</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#756A65]" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#E9E2DC] p-1.5 z-50 text-xs animate-in fade-in">
                  <button
                    onClick={() => { setActiveTab('settings'); setShowProfileMenu(false); }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#F8F6F3] text-[#3E2B25] font-medium"
                  >
                    Store Settings
                  </button>
                  <button
                    onClick={() => onNavigate('shop')}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#F8F6F3] text-[#3E2B25] font-medium flex items-center justify-between"
                  >
                    <span>View Storefront</span>
                    <ArrowUpRight className="w-3 h-3 text-[#756A65]" />
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* ========================================================= */}
        {/* TAB: DASHBOARD (PROPORTIONAL, SAAS PRODUCTION LAYOUT) */}
        {/* ========================================================= */}
        {activeTab === 'dashboard' && (
          <main className="p-5 sm:p-7 space-y-6 max-w-7xl w-full">
            
            {/* PAGE HEADER & DATE SELECTOR */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#3E2B25]">
                  Dashboard
                </h2>
                <p className="text-xs text-[#756A65] mt-0.5">
                  Welcome back, Priya. Here's what's happening with your store today.
                </p>
              </div>

              {/* Date Range Selector */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E9E2DC] rounded-xl text-xs font-semibold text-[#3E2B25] shadow-2xs">
                  <Calendar className="w-3.5 h-3.5 text-[#756A65]" />
                  <span>{selectedDateRange}</span>
                  <ChevronDown className="w-3 h-3 text-[#756A65]" />
                </div>
              </div>
            </div>

            {/* ROW 1: 6 KPI CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
              
              {/* 1. Total Sales */}
              <div className="bg-white rounded-2xl p-4 border border-[#E9E2DC] shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-[#756A65]">Total Sales</span>
                  <div className="w-6 h-6 rounded-full bg-[#D96C65]/10 text-[#D96C65] flex items-center justify-center font-bold text-xs">
                    ₹
                  </div>
                </div>
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#3E2B25]">
                  ₹1,24,500
                </h3>
                <span className="text-[10px] text-[#4F9D69] font-bold block">
                  +24.5% <span className="text-[#756A65] font-normal">vs last 7 days</span>
                </span>
              </div>

              {/* 2. Total Orders */}
              <div className="bg-white rounded-2xl p-4 border border-[#E9E2DC] shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-[#756A65]">Total Orders</span>
                  <div className="w-6 h-6 rounded-full bg-[#D99A35]/10 text-[#D99A35] flex items-center justify-center font-bold text-xs">
                    📦
                  </div>
                </div>
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#3E2B25]">
                  86
                </h3>
                <span className="text-[10px] text-[#4F9D69] font-bold block">
                  +15.2% <span className="text-[#756A65] font-normal">vs last 7 days</span>
                </span>
              </div>

              {/* 3. Customers */}
              <div className="bg-white rounded-2xl p-4 border border-[#E9E2DC] shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-[#756A65]">Customers</span>
                  <div className="w-6 h-6 rounded-full bg-[#4F9D69]/10 text-[#4F9D69] flex items-center justify-center font-bold text-xs">
                    👥
                  </div>
                </div>
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#3E2B25]">
                  62
                </h3>
                <span className="text-[10px] text-[#4F9D69] font-bold block">
                  +10.3% <span className="text-[#756A65] font-normal">vs last 7 days</span>
                </span>
              </div>

              {/* 4. Products */}
              <div className="bg-white rounded-2xl p-4 border border-[#E9E2DC] shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-[#756A65]">Products</span>
                  <div className="w-6 h-6 rounded-full bg-[#9B5DE5]/10 text-[#9B5DE5] flex items-center justify-center font-bold text-xs">
                    🛍️
                  </div>
                </div>
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#3E2B25]">
                  {products.length || 27}
                </h3>
                <span className="text-[10px] text-[#4F9D69] font-bold block">
                  +5.6% <span className="text-[#756A65] font-normal">vs last 7 days</span>
                </span>
              </div>

              {/* 5. Pending Orders */}
              <div className="bg-white rounded-2xl p-4 border border-[#E9E2DC] shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-[#756A65]">Pending Orders</span>
                  <div className="w-6 h-6 rounded-full bg-[#D99A35]/10 text-[#D99A35] flex items-center justify-center font-bold text-xs">
                    📋
                  </div>
                </div>
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#3E2B25]">
                  12
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-[10px] text-[#D96C65] font-bold hover:underline flex items-center gap-0.5"
                >
                  <span>View all</span>
                  <span>→</span>
                </button>
              </div>

              {/* 6. Custom Orders */}
              <div className="bg-white rounded-2xl p-4 border border-[#E9E2DC] shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-[#756A65]">Custom Orders</span>
                  <div className="w-6 h-6 rounded-full bg-[#D65C5C]/10 text-[#D65C5C] flex items-center justify-center font-bold text-xs">
                    🎁
                  </div>
                </div>
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#3E2B25]">
                  7
                </h3>
                <button
                  onClick={() => setActiveTab('custom-orders')}
                  className="text-[10px] text-[#D96C65] font-bold hover:underline flex items-center gap-0.5"
                >
                  <span>View all</span>
                  <span>→</span>
                </button>
              </div>

            </div>

            {/* ROW 2: Sales Overview Chart + Top Products + Recent Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
              
              {/* Sales Overview Line/Area Chart (6 cols) */}
              <div className="lg:col-span-6 bg-white rounded-2xl p-5 border border-[#E9E2DC] shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#3E2B25]">
                      Sales Overview
                    </h3>
                    <div className="flex items-center gap-4 text-xs mt-1">
                      <span className="flex items-center gap-1.5 text-[#756A65]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#D96C65]" />
                        Current Period
                      </span>
                      <span className="flex items-center gap-1.5 text-[#756A65]/70">
                        <span className="w-2.5 h-0.5 bg-[#756A65]/50 border-dashed" />
                        Previous Period
                      </span>
                    </div>
                  </div>

                  {/* Timeframe Controls */}
                  <div className="flex items-center bg-[#F8F6F3] p-1 rounded-xl border border-[#E9E2DC]">
                    {[
                      { id: 'today', label: 'Today' },
                      { id: '7-days', label: '7 Days' },
                      { id: '30-days', label: '30 Days' },
                      { id: '3-months', label: '3M' },
                      { id: '1-year', label: '1Y' }
                    ].map(tf => (
                      <button
                        key={tf.id}
                        onClick={() => setSalesTimeframe(tf.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                          salesTimeframe === tf.id
                            ? 'bg-white text-[#3E2B25] font-bold shadow-2xs'
                            : 'text-[#756A65] hover:text-[#3E2B25]'
                        }`}
                      >
                        {tf.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SVG Line Graph */}
                <div className="relative h-48 sm:h-52 w-full pt-1">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 500 170">
                    <line x1="40" y1="20" x2="490" y2="20" stroke="#E9E2DC" strokeDasharray="3 3" />
                    <line x1="40" y1="55" x2="490" y2="55" stroke="#E9E2DC" strokeDasharray="3 3" />
                    <line x1="40" y1="90" x2="490" y2="90" stroke="#E9E2DC" strokeDasharray="3 3" />
                    <line x1="40" y1="125" x2="490" y2="125" stroke="#E9E2DC" strokeDasharray="3 3" />

                    <text x="5" y="24" fontSize="10" fill="#756A65">₹40k</text>
                    <text x="5" y="59" fontSize="10" fill="#756A65">₹30k</text>
                    <text x="5" y="94" fontSize="10" fill="#756A65">₹20k</text>
                    <text x="5" y="129" fontSize="10" fill="#756A65">₹10k</text>
                    <text x="20" y="162" fontSize="10" fill="#756A65">₹0</text>

                    {/* Previous period line */}
                    <path
                      d="M 50 145 Q 120 120 190 115 T 330 85 T 470 55"
                      fill="none"
                      stroke="#B8ADA5"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />

                    {/* Current period area gradient */}
                    <defs>
                      <linearGradient id="coralSalesGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#D96C65" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#D96C65" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 50 135 Q 110 85 170 95 T 290 75 T 410 38 L 470 28 L 470 160 L 50 160 Z"
                      fill="url(#coralSalesGradient)"
                    />

                    {/* Current period line */}
                    <path
                      d="M 50 135 Q 110 85 170 95 T 290 75 T 410 38 L 470 28"
                      fill="none"
                      stroke="#D96C65"
                      strokeWidth="2.5"
                    />

                    <circle cx="50" cy="135" r="3.5" fill="#D96C65" />
                    <circle cx="120" cy="90" r="3.5" fill="#D96C65" />
                    <circle cx="190" cy="93" r="3.5" fill="#D96C65" />
                    <circle cx="260" cy="85" r="3.5" fill="#D96C65" />
                    <circle cx="330" cy="65" r="3.5" fill="#D96C65" />
                    <circle cx="400" cy="40" r="3.5" fill="#D96C65" />
                    <circle cx="470" cy="28" r="4.5" fill="#D96C65" stroke="#FFF" strokeWidth="2" />

                    <text x="40" y="162" fontSize="10" fill="#756A65">19 May</text>
                    <text x="110" y="162" fontSize="10" fill="#756A65">20 May</text>
                    <text x="180" y="162" fontSize="10" fill="#756A65">21 May</text>
                    <text x="250" y="162" fontSize="10" fill="#756A65">22 May</text>
                    <text x="320" y="162" fontSize="10" fill="#756A65">23 May</text>
                    <text x="390" y="162" fontSize="10" fill="#756A65">24 May</text>
                    <text x="455" y="162" fontSize="10" fill="#756A65">25 May</text>
                  </svg>
                </div>
              </div>

              {/* Top Products (3 cols) */}
              <div className="lg:col-span-3 bg-white rounded-2xl p-5 border border-[#E9E2DC] shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-base text-[#3E2B25]">
                    Top Products
                  </h3>
                  <button onClick={() => setActiveTab('products')} className="text-xs text-[#D96C65] font-semibold hover:underline">
                    View all
                  </button>
                </div>

                <div className="divide-y divide-[#E9E2DC]/60">
                  {topProductsList.map(item => (
                    <div key={item.rank} className="py-2 flex items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-[11px] font-mono font-bold text-[#756A65] w-4">{item.rank}</span>
                        <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover border border-[#E9E2DC] shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#3E2B25] truncate">{item.name}</p>
                          <span className="text-[10px] text-[#756A65]">{item.sold}</span>
                        </div>
                      </div>
                      <span className="font-serif font-bold text-xs text-[#3E2B25] shrink-0">
                        {item.revenue}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Notifications (3 cols) */}
              <div className="lg:col-span-3 bg-white rounded-2xl p-5 border border-[#E9E2DC] shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-base text-[#3E2B25]">
                    Recent Notifications
                  </h3>
                  <span className="text-[10px] text-[#D96C65] font-semibold">Live Feed</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#D96C65]/10 text-[#D96C65] flex items-center justify-center shrink-0">
                      🛍️
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#3E2B25]">New order received</p>
                      <p className="text-[11px] text-[#756A65]">Order #SL1024 has been placed</p>
                    </div>
                    <span className="text-[10px] text-[#756A65]">2m ago</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#9B5DE5]/10 text-[#9B5DE5] flex items-center justify-center shrink-0">
                      🎁
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#3E2B25]">New custom order</p>
                      <p className="text-[11px] text-[#756A65]">#CO1023 requires review</p>
                    </div>
                    <span className="text-[10px] text-[#756A65]">15m ago</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#D99A35]/10 text-[#D99A35] flex items-center justify-center shrink-0">
                      ⚠️
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#3E2B25]">Low stock alert</p>
                      <p className="text-[11px] text-[#756A65]">Pink Yarn is running low</p>
                    </div>
                    <span className="text-[10px] text-[#756A65]">1h ago</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#4F9D69]/10 text-[#4F9D69] flex items-center justify-center shrink-0">
                      💬
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#3E2B25]">New enquiry</p>
                      <p className="text-[11px] text-[#756A65]">Riya sent a message</p>
                    </div>
                    <span className="text-[10px] text-[#756A65]">2h ago</span>
                  </div>
                </div>
              </div>

            </div>

            {/* ROW 3: Recent Orders Table + Sales by Category */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
              
              {/* Recent Orders Table (8 cols) */}
              <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-[#E9E2DC] shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-base text-[#3E2B25]">
                    Recent Orders
                  </h3>
                  <button onClick={() => setActiveTab('orders')} className="text-xs text-[#D96C65] font-semibold hover:underline">
                    View all orders →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-[#E9E2DC] text-[#756A65] text-[10px] uppercase font-bold">
                        <th className="pb-2.5 px-2 font-mono">Order ID</th>
                        <th className="pb-2.5 px-2">Customer</th>
                        <th className="pb-2.5 px-2">Product</th>
                        <th className="pb-2.5 px-2">Amount</th>
                        <th className="pb-2.5 px-2">Payment</th>
                        <th className="pb-2.5 px-2">Status</th>
                        <th className="pb-2.5 px-2">Date</th>
                        <th className="pb-2.5 px-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E9E2DC]/50">
                      {[
                        { id: '#SL1024', name: 'Priya Sharma', product: 'Daisy Crochet Bag', amount: '₹1,299', payment: 'Paid', status: 'Processing', statusColor: 'bg-[#D99A35]/15 text-[#D99A35]', date: '25 May', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80' },
                        { id: '#SL1023', name: 'Ananya Joshi', product: 'Tulip Flower Bouquet', amount: '₹1,199', payment: 'Paid', status: 'Shipped', statusColor: 'bg-[#3B82F6]/15 text-[#3B82F6]', date: '25 May', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80' },
                        { id: '#SL1022', name: 'Riya Patel', product: 'Cute Bunny (Amigurumi)', amount: '₹899', payment: 'Paid', status: 'Delivered', statusColor: 'bg-[#4F9D69]/15 text-[#4F9D69]', date: '24 May', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=100&q=80' },
                        { id: '#SL1021', name: 'Meera Iyer', product: 'Sunflower Keychain', amount: '₹349', payment: 'Paid', status: 'Confirmed', statusColor: 'bg-[#4F9D69]/15 text-[#4F9D69]', date: '24 May', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80' },
                        { id: '#SL1020', name: 'Kavya Singh', product: 'Heart Coaster Set', amount: '₹299', payment: 'COD', status: 'Pending', statusColor: 'bg-[#D65C5C]/15 text-[#D65C5C]', date: '23 May', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80' }
                      ].map(order => (
                        <tr key={order.id} className="hover:bg-[#F8F6F3]/60 transition-colors">
                          <td className="py-2.5 px-2 font-mono font-bold text-[#D96C65]">{order.id}</td>
                          <td className="py-2.5 px-2">
                            <div className="flex items-center gap-2">
                              <img src={order.avatar} alt={order.name} className="w-5 h-5 rounded-full object-cover" />
                              <span className="font-semibold text-[#3E2B25]">{order.name}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-2 text-[#756A65]">{order.product}</td>
                          <td className="py-2.5 px-2 font-serif font-bold text-[#3E2B25]">{order.amount}</td>
                          <td className="py-2.5 px-2 text-[#756A65] text-[11px]">{order.payment}</td>
                          <td className="py-2.5 px-2">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${order.statusColor}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-2 text-[#756A65]">{order.date}</td>
                          <td className="py-2.5 px-2 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button onClick={() => setActiveTab('orders')} className="p-1 rounded-md hover:bg-[#E9E2DC] text-[#756A65]" title="View Details">
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <a href="https://wa.me/" target="_blank" rel="noreferrer" className="p-1 rounded-md hover:bg-emerald-50 text-[#4F9D69]" title="WhatsApp Customer">
                                <MessageCircle className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sales by Category Donut Chart (4 cols) */}
              <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-[#E9E2DC] shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3.5">
                <h3 className="font-serif font-bold text-base text-[#3E2B25]">
                  Sales by Category
                </h3>

                <div className="flex items-center justify-between gap-4">
                  {/* SVG Donut Chart */}
                  <div className="relative w-28 h-28 shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path className="text-[#F8F6F3]" strokeWidth="4.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <path stroke="#D96C65" strokeWidth="4.5" strokeDasharray="35, 100" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <path stroke="#D99A35" strokeWidth="4.5" strokeDasharray="25, 100" strokeDashoffset="-35" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <path stroke="#81B29A" strokeWidth="4.5" strokeDasharray="20, 100" strokeDashoffset="-60" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <path stroke="#9B5DE5" strokeWidth="4.5" strokeDasharray="10, 100" strokeDashoffset="-80" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-[8px] text-[#756A65] font-bold uppercase leading-none">Total</span>
                      <span className="text-[11px] font-serif font-bold text-[#3E2B25] leading-tight">₹1.24L</span>
                    </div>
                  </div>

                  {/* Donut Legend */}
                  <div className="space-y-1 text-[11px] flex-1">
                    <div className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-[#756A65]"><span className="w-2 h-2 rounded-full bg-[#D96C65]"></span>Bags</span><span className="font-bold text-[#3E2B25]">35%</span></div>
                    <div className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-[#756A65]"><span className="w-2 h-2 rounded-full bg-[#D99A35]"></span>Flowers</span><span className="font-bold text-[#3E2B25]">25%</span></div>
                    <div className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-[#756A65]"><span className="w-2 h-2 rounded-full bg-[#81B29A]"></span>Amigurumi</span><span className="font-bold text-[#3E2B25]">20%</span></div>
                    <div className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-[#756A65]"><span className="w-2 h-2 rounded-full bg-[#9B5DE5]"></span>Accessories</span><span className="font-bold text-[#3E2B25]">10%</span></div>
                    <div className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-[#756A65]"><span className="w-2 h-2 rounded-full bg-[#756A65]/40"></span>Home Decor</span><span className="font-bold text-[#3E2B25]">7%</span></div>
                  </div>
                </div>
              </div>

            </div>

            {/* ROW 4: Low Stock Alerts + Custom Order Pipeline + Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
              
              {/* Low Stock Alerts (4 cols) */}
              <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-[#E9E2DC] shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-[#D99A35]" />
                    <h3 className="font-serif font-bold text-base text-[#3E2B25]">Low Stock Alerts</h3>
                  </div>
                  <span className="text-[10px] font-bold text-[#D99A35] bg-[#D99A35]/15 px-2 py-0.5 rounded-full">
                    3 items
                  </span>
                </div>

                <div className="space-y-2.5">
                  {lowStockItems.map(item => (
                    <div key={item.id} className="p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] flex items-center justify-between gap-2">
                      <div>
                        <p className="text-xs font-bold text-[#3E2B25]">{item.name}</p>
                        <p className="text-[10px] text-[#D65C5C] font-semibold">{item.count}</p>
                      </div>
                      <button
                        onClick={() => handleRestock(item)}
                        className="px-2.5 py-1 bg-white hover:bg-[#E9E2DC] text-[#3E2B25] rounded-lg text-[10px] font-bold border border-[#E9E2DC] transition-colors"
                      >
                        Restock
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Order Pipeline (5 cols) */}
              <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-[#E9E2DC] shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-base text-[#3E2B25]">Custom Order Pipeline</h3>
                  <button onClick={() => setActiveTab('custom-orders')} className="text-xs text-[#D96C65] font-semibold hover:underline">
                    Manage →
                  </button>
                </div>

                {/* 7-Stage Clickable Pipeline */}
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 text-center">
                  {[
                    { label: 'New', count: 7, color: 'bg-[#D96C65]/15 text-[#D96C65]' },
                    { label: 'Discuss', count: 3, color: 'bg-[#D99A35]/15 text-[#D99A35]' },
                    { label: 'Quoted', count: 2, color: 'bg-purple-100 text-purple-700' },
                    { label: 'Approved', count: 4, color: 'bg-[#4F9D69]/15 text-[#4F9D69]' },
                    { label: 'Making', count: 5, color: 'bg-blue-100 text-blue-700' },
                    { label: 'Ready', count: 2, color: 'bg-emerald-100 text-emerald-700' },
                    { label: 'Done', count: 18, color: 'bg-gray-100 text-gray-700' }
                  ].map(stage => (
                    <div
                      key={stage.label}
                      onClick={() => setActiveTab('custom-orders')}
                      className="p-2 rounded-xl bg-[#F8F6F3] hover:bg-[#E9E2DC] cursor-pointer transition-colors"
                    >
                      <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${stage.color} block mb-1`}>
                        {stage.count}
                      </span>
                      <span className="text-[9px] font-bold text-[#756A65] block uppercase">
                        {stage.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Summary Pills */}
                <div className="pt-2 border-t border-[#E9E2DC] grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-[#F8F6F3]">
                    <span className="text-[10px] text-[#756A65] block">Awaiting Quote</span>
                    <span className="font-bold text-[#3E2B25]">3 requests</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#F8F6F3]">
                    <span className="text-[10px] text-[#756A65] block">In Production</span>
                    <span className="font-bold text-[#3E2B25]">5 orders</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#F8F6F3]">
                    <span className="text-[10px] text-[#756A65] block">Due This Week</span>
                    <span className="font-bold text-[#D65C5C]">2 pieces</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions (3 cols) */}
              <div className="lg:col-span-3 bg-white rounded-2xl p-5 border border-[#E9E2DC] shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3.5">
                <h3 className="font-serif font-bold text-base text-[#3E2B25]">Quick Actions</h3>

                <div className="space-y-2">
                  <button
                    onClick={openAddModal}
                    className="w-full py-2 px-3 bg-[#D96C65] hover:bg-[#C95B55] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Product</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('categories')}
                    className="w-full py-2 px-3 bg-[#F8F6F3] hover:bg-[#E9E2DC] text-[#3E2B25] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[#E9E2DC]"
                  >
                    <Layers className="w-3.5 h-3.5 text-[#756A65]" />
                    <span>+ Add Category</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('coupons')}
                    className="w-full py-2 px-3 bg-[#F8F6F3] hover:bg-[#E9E2DC] text-[#3E2B25] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[#E9E2DC]"
                  >
                    <Ticket className="w-3.5 h-3.5 text-[#756A65]" />
                    <span>+ Create Coupon</span>
                  </button>
                </div>
              </div>

            </div>

          </main>
        )}

        {/* ========================================================= */}
        {/* TAB: PRODUCTS (SAAS CATALOG MANAGEMENT TABLE) */}
        {/* ========================================================= */}
        {activeTab === 'products' && (
          <main className="p-5 sm:p-7 space-y-6 max-w-7xl w-full">
            <div className="bg-white rounded-2xl p-5 border border-[#E9E2DC] shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#3E2B25]">
                    Products Management ({products.length})
                  </h2>
                  <p className="text-xs text-[#756A65] mt-0.5">
                    View, add, edit, adjust stock, and manage your handcrafted crochet inventory.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 self-start sm:self-auto">
                  <label className="cursor-pointer px-3.5 py-2 bg-[#F8F6F3] hover:bg-[#E9E2DC] border border-[#E9E2DC] text-[#3E2B25] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors">
                    <Camera className="w-3.5 h-3.5 text-[#D96C65]" />
                    <span>Upload Photo (PC/Phone)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleDirectPhotoLaunch}
                      className="hidden"
                    />
                  </label>

                  <button
                    onClick={openAddModal}
                    className="px-4 py-2 bg-[#D96C65] hover:bg-[#C95B55] text-white rounded-xl text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add Product</span>
                  </button>
                </div>
              </div>

              {/* Filters Bar */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-[#E9E2DC]/60">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-[#756A65] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by product name, category..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full text-xs py-2 pl-9 pr-3 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25]"
                  />
                </div>

                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {['all', 'forever-blooms', 'amigurumi-plushies', 'hair-accessories', 'home-living', 'bags-accessories'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setProductCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                        productCategoryFilter === cat
                          ? 'bg-[#3E2B25] text-white font-bold'
                          : 'bg-[#F8F6F3] text-[#756A65] hover:text-[#3E2B25]'
                      }`}
                    >
                      {cat.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Products Table */}
              <div className="overflow-x-auto pt-2">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-[#E9E2DC] text-[#756A65] text-[10px] uppercase font-bold">
                      <th className="pb-2.5 px-2">Image</th>
                      <th className="pb-2.5 px-2">Product Name</th>
                      <th className="pb-2.5 px-2">Category</th>
                      <th className="pb-2.5 px-2">Price</th>
                      <th className="pb-2.5 px-2">Stock</th>
                      <th className="pb-2.5 px-2">Status</th>
                      <th className="pb-2.5 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9E2DC]/60">
                    {filteredProducts.map(prod => (
                      <tr key={prod.id} className="hover:bg-[#F8F6F3]/50 transition-colors">
                        <td className="py-2.5 px-2">
                          <img
                            src={prod.images?.[0] || '/images/aanu-blooms-signature-set.jpeg'}
                            alt={prod.name}
                            className="w-10 h-10 rounded-xl object-contain bg-[#F8F6F3] p-1 border border-[#E9E2DC]"
                          />
                        </td>
                        <td className="py-2.5 px-2 font-semibold text-[#3E2B25] max-w-xs truncate">
                          {prod.name}
                        </td>
                        <td className="py-2.5 px-2 text-[#756A65]">{prod.category}</td>
                        <td className="py-2.5 px-2 font-serif font-bold text-[#3E2B25]">
                          ₹{prod.price?.toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 px-2">
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleAdjustStock(prod, -1)} className="w-5 h-5 rounded bg-[#F8F6F3] hover:bg-[#E9E2DC] font-bold">-</button>
                            <span className="font-mono font-bold px-1">{prod.stock || 0}</span>
                            <button onClick={() => handleAdjustStock(prod, 1)} className="w-5 h-5 rounded bg-[#D96C65]/15 text-[#D96C65] font-bold">+</button>
                          </div>
                        </td>
                        <td className="py-2.5 px-2">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            prod.stock > 0 ? 'bg-[#4F9D69]/15 text-[#4F9D69]' : 'bg-[#D65C5C]/15 text-[#D65C5C]'
                          }`}>
                            {prod.stock > 0 ? 'Active' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEditModal(prod)}
                              className="p-1.5 rounded-lg hover:bg-[#E9E2DC] text-[#756A65]"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id, prod.name)}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-[#D65C5C]"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        )}

        {/* ========================================================= */}
        {/* TAB: ALL ORDERS (SEGMENTED ORDERS WORKFLOW) */}
        {/* ========================================================= */}
        {activeTab === 'orders' && (
          <main className="p-5 sm:p-7 space-y-6 max-w-7xl w-full">
            <div className="bg-white rounded-2xl p-5 border border-[#E9E2DC] shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#3E2B25]">
                    Orders & Fulfillment ({orders.length})
                  </h2>
                  <p className="text-xs text-[#756A65] mt-0.5">
                    Track live fulfillment, manage packing steps, and view invoice details.
                  </p>
                </div>
              </div>

              {/* Status Segmented Tabs */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 border-b border-[#E9E2DC]/60">
                {['all', 'placed', 'handcrafting', 'packaging', 'shipped', 'delivered'].map(st => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      orderStatusFilter === st
                        ? 'bg-[#3E2B25] text-white font-bold'
                        : 'bg-[#F8F6F3] text-[#756A65] hover:text-[#3E2B25]'
                    }`}
                  >
                    {st.charAt(0).toUpperCase() + st.slice(1)}
                  </button>
                ))}
              </div>

              {/* Orders Table */}
              <div className="overflow-x-auto pt-2">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-[#E9E2DC] text-[#756A65] text-[10px] uppercase font-bold">
                      <th className="pb-2.5 px-3">Order ID</th>
                      <th className="pb-2.5 px-3">Customer</th>
                      <th className="pb-2.5 px-3">Amount</th>
                      <th className="pb-2.5 px-3">Fulfillment Stage</th>
                      <th className="pb-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9E2DC]/60">
                    {filteredOrders.map(order => (
                      <tr key={order.id} className="hover:bg-[#F8F6F3]/50 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-[#D96C65]">{order.id}</td>
                        <td className="py-3 px-3">
                          <p className="font-semibold text-[#3E2B25]">{order.customer?.name}</p>
                          <p className="text-[10px] text-[#756A65]">{order.customer?.city || 'India'}</p>
                        </td>
                        <td className="py-3 px-3 font-serif font-bold text-[#3E2B25]">
                          ₹{order.total?.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                            className="text-xs font-semibold py-1 px-2.5 rounded-lg border border-[#E9E2DC] bg-[#F8F6F3] text-[#3E2B25]"
                          >
                            <option value="placed">⏱️ Placed</option>
                            <option value="handcrafting">🧶 Handcrafting</option>
                            <option value="packaging">🌸 Packaging</option>
                            <option value="shipped">📦 Shipped</option>
                            <option value="delivered">🏡 Delivered</option>
                          </select>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => onNavigate('track-order', { id: order.id })}
                            className="px-2.5 py-1 bg-[#F8F6F3] hover:bg-[#E9E2DC] rounded-lg text-xs font-semibold text-[#3E2B25] transition-colors"
                          >
                            Track
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        )}

        {/* ========================================================= */}
        {/* TAB: CUSTOM ORDERS WORKFLOW */}
        {/* ========================================================= */}
        {activeTab === 'custom-orders' && (
          <main className="p-5 sm:p-7 space-y-6 max-w-7xl w-full">
            <div className="bg-white rounded-2xl p-5 border border-[#E9E2DC] shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
              <div>
                <h2 className="text-xl font-serif font-bold text-[#3E2B25]">
                  Custom Orders & Bespoke Inquiries ({customRequests.length || 7})
                </h2>
                <p className="text-xs text-[#756A65] mt-0.5">
                  Manage personalized crochet commissions, custom bouquets, and special event quotes.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {(customRequests.length > 0 ? customRequests : [
                  { id: 'CO1023', customerName: 'Rhea Sen', customerPhone: '+91 98201 23456', itemType: 'Pastel Lilac & Rose Bouquet', estimatedBudget: '₹2,500', specialNotes: 'Needs embroidery on ribbon: Happy 25th Anniversary Mom & Dad. Delivery by Friday.' },
                  { id: 'CO1024', customerName: 'Arjun Verma', customerPhone: '+91 97112 88442', itemType: 'Giant Velvet Sunflower Pot', estimatedBudget: '₹1,200', specialNotes: 'Custom golden yellow tone with dark brown pistil.' }
                ]).map(req => (
                  <div key={req.id} className="p-4 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-[#D96C65]">#{req.id}</span>
                        <h4 className="font-bold text-sm text-[#3E2B25]">{req.itemType}</h4>
                        <p className="text-xs text-[#756A65]">From: {req.customerName} ({req.customerPhone})</p>
                      </div>
                      <span className="text-xs font-bold text-[#4F9D69] bg-[#4F9D69]/15 px-2.5 py-1 rounded-full">
                        {req.estimatedBudget}
                      </span>
                    </div>

                    <p className="text-xs text-[#3E2B25] bg-white p-3 rounded-lg border border-[#E9E2DC] leading-relaxed">
                      "{req.specialNotes}"
                    </p>

                    <div className="flex justify-end gap-2 pt-1">
                      <a href={`https://wa.me/?text=Hi%20${req.customerName}`} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-[#4F9D69] text-white rounded-lg text-xs font-semibold flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat on WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        )}

        {/* ========================================================= */}
        {/* TAB: CUSTOMERS DIRECTORY & BUYERS ROSTER */}
        {/* ========================================================= */}
        {activeTab === 'customers' && (
          <main className="p-5 sm:p-7 space-y-6 max-w-7xl w-full animate-in fade-in">
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E9E2DC] shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-5">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E9E2DC]">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#3E2B25] flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#D96C65]" />
                    <span>Customer Directory & Buyers ({uniqueCustomersList.length})</span>
                  </h2>
                  <p className="text-xs text-[#756A65] mt-0.5">
                    Dedicated list of all individual customers who have placed orders on AanuBlooms.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#F8F6F3] text-[#756A65] border border-[#E9E2DC]">
                    🌸 {orders.length} Total Orders Across {uniqueCustomersList.length} Clients
                  </span>
                </div>
              </div>

              {/* 4 Quick Stat Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#756A65] block">Unique Buyers</span>
                  <span className="text-xl font-serif font-bold text-[#3E2B25] mt-0.5 block">{uniqueCustomersList.length}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#756A65] block">Total Orders</span>
                  <span className="text-xl font-serif font-bold text-[#D96C65] mt-0.5 block">{orders.length}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#756A65] block">Total Revenue</span>
                  <span className="text-xl font-serif font-bold text-[#4F9D69] mt-0.5 block">
                    ₹{orders.reduce((sum, o) => sum + (o.total || 0), 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#756A65] block">Avg Spend / Buyer</span>
                  <span className="text-xl font-serif font-bold text-[#3E2B25] mt-0.5 block">
                    ₹{uniqueCustomersList.length ? Math.round(orders.reduce((sum, o) => sum + (o.total || 0), 0) / uniqueCustomersList.length).toLocaleString('en-IN') : 0}
                  </span>
                </div>
              </div>

              {/* Search and Sort Toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-[#756A65]/50 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search buyer name, email, phone, city..."
                    value={customerSearchQuery}
                    onChange={(e) => setCustomerSearchQuery(e.target.value)}
                    className="w-full text-xs py-2 pl-9 pr-3 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25] focus:outline-none focus:ring-1 focus:ring-[#D96C65]"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <span className="text-xs text-[#756A65] whitespace-nowrap">Sort By:</span>
                  <select
                    value={customerSortBy}
                    onChange={(e) => setCustomerSortBy(e.target.value)}
                    className="text-xs py-2 px-3 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25] focus:outline-none"
                  >
                    <option value="recent">Most Recent Buyer</option>
                    <option value="spend">Highest Lifetime Spend (₹)</option>
                    <option value="orders">Most Orders Placed</option>
                  </select>
                </div>
              </div>

              {/* Customers Directory Table */}
              {uniqueCustomersList.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-[#E9E2DC]">
                  <table className="w-full text-left text-xs text-[#3E2B25]">
                    <thead className="bg-[#F8F6F3] border-b border-[#E9E2DC] text-[10px] font-bold uppercase tracking-wider text-[#756A65]">
                      <tr>
                        <th className="py-3 px-4">Customer Name & Contact</th>
                        <th className="py-3 px-3">Delivery Location</th>
                        <th className="py-3 px-3 text-center">Orders</th>
                        <th className="py-3 px-3 text-right">Lifetime Spend</th>
                        <th className="py-3 px-3">Latest Purchase</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E9E2DC] bg-white">
                      {uniqueCustomersList.map((cust) => {
                        const initials = cust.name
                          ? cust.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                          : 'AB';

                        return (
                          <tr key={cust.id} className="hover:bg-[#F8F6F3]/50 transition-colors">
                            {/* Name & Contact */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#D96C65] to-[#C45750] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                                  {initials}
                                </div>
                                <div className="min-w-0">
                                  <strong className="block text-sm text-[#3E2B25] truncate">
                                    {cust.name}
                                  </strong>
                                  <span className="text-[11px] text-[#756A65] block truncate">
                                    {cust.email}
                                  </span>
                                  <span className="text-[11px] text-[#756A65] block font-mono">
                                    📞 {cust.phone}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Delivery Address */}
                            <td className="py-3.5 px-3 max-w-[200px]">
                              <p className="text-xs text-[#3E2B25] line-clamp-2 leading-relaxed">
                                {cust.address ? `${cust.address}, ` : ''}<strong>{cust.city}</strong>, {cust.state}
                              </p>
                              <span className="text-[10px] text-[#756A65] font-mono">PIN: {cust.zip}</span>
                            </td>

                            {/* Orders Count Badge */}
                            <td className="py-3.5 px-3 text-center">
                              <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25]">
                                {cust.totalOrders} {cust.totalOrders === 1 ? 'order' : 'orders'}
                              </span>
                            </td>

                            {/* Total Spent */}
                            <td className="py-3.5 px-3 text-right">
                              <span className="font-serif font-bold text-sm text-[#D96C65]">
                                ₹{cust.totalSpent.toLocaleString('en-IN')}
                              </span>
                            </td>

                            {/* Latest Purchase */}
                            <td className="py-3.5 px-3">
                              <div className="space-y-0.5">
                                <span className="font-mono text-xs font-bold text-[#3E2B25] block">
                                  #{cust.latestOrderId}
                                </span>
                                <span className="text-[11px] text-[#756A65] block">
                                  {new Date(cust.latestOrderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#4F9D69]/10 text-[#4F9D69] capitalize">
                                  {cust.latestOrderStatus}
                                </span>
                              </div>
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setSelectedCustomerDetails(cust)}
                                  className="px-3 py-1.5 bg-[#F8F6F3] hover:bg-[#E9E2DC] text-[#3E2B25] rounded-lg text-xs font-semibold transition-colors whitespace-nowrap"
                                >
                                  View Orders ({cust.totalOrders})
                                </button>

                                {cust.phone && cust.phone !== 'N/A' && (
                                  <a
                                    href={`https://wa.me/${cust.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(cust.name)}%2C%20thank%20you%20for%20ordering%20with%20AanuBlooms!`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1.5 bg-[#4F9D69]/15 text-[#4F9D69] hover:bg-[#4F9D69] hover:text-white rounded-lg transition-colors"
                                    title="WhatsApp Customer"
                                  >
                                    <MessageCircle className="w-4 h-4" />
                                  </a>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-[#756A65] space-y-2">
                  <Users className="w-8 h-8 text-[#756A65]/40 mx-auto" />
                  <p>No customers matching your search criteria found.</p>
                </div>
              )}

            </div>
          </main>
        )}

        {/* ========================================================= */}
        {/* TAB: COUPONS & MARKETING */}
        {/* ========================================================= */}
        {activeTab === 'coupons' && (
          <main className="p-5 sm:p-7 space-y-6 max-w-7xl w-full">
            <div className="bg-white rounded-2xl p-5 border border-[#E9E2DC] shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
              <div>
                <h2 className="text-xl font-serif font-bold text-[#3E2B25]">
                  Coupons & Promotional Offers
                </h2>
                <p className="text-xs text-[#756A65] mt-0.5">
                  Manage discount codes and seasonal craft promotions.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {[
                  { code: 'AANU15', discount: '15% OFF', desc: 'Welcome first order coupon' },
                  { code: 'FLOWER10', discount: '10% OFF', desc: 'Forever blooms orders above ₹999' },
                  { code: 'FREESHIP', discount: 'Free Shipping', desc: 'Pan-India free delivery promo' }
                ].map(cp => (
                  <div key={cp.code} className="p-4 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] space-y-2">
                    <span className="px-3 py-1 bg-[#D96C65]/15 text-[#D96C65] font-mono font-bold text-sm rounded-lg inline-block">
                      {cp.code}
                    </span>
                    <p className="font-bold text-xs text-[#4F9D69]">{cp.discount}</p>
                    <p className="text-[11px] text-[#756A65]">{cp.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </main>
        )}

        {/* ========================================================= */}
        {/* TAB: STORE SETTINGS */}
        {/* ========================================================= */}
        {activeTab === 'settings' && (
          <main className="p-5 sm:p-7 max-w-7xl w-full">
            <StoreSettingsModule />
          </main>
        )}

      </div>

      {/* ========================================================= */}
      {/* PRODUCT ADD / EDIT MODAL POP-UP */}
      {/* ========================================================= */}
      {showProductModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowProductModal(false);
          }}
        >
          <div className="relative bg-white rounded-2xl max-w-xl w-full border border-[#E9E2DC] shadow-2xl z-10 flex flex-col max-h-[88vh] overflow-hidden animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#E9E2DC] flex items-center justify-between bg-white z-10 shrink-0">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D96C65] block">
                  {editingProduct ? 'Update Product' : 'New Catalog Item'}
                </span>
                <h3 className="font-serif font-bold text-lg text-[#3E2B25]">
                  {editingProduct ? 'Edit Handcrafted Piece' : 'Add New Crochet Product'}
                </h3>
              </div>
              
              <button 
                type="button"
                onClick={() => setShowProductModal(false)} 
                className="p-1.5 rounded-lg bg-[#F8F6F3] hover:bg-[#E9E2DC] text-[#756A65] transition-colors"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveProduct} className="flex flex-col flex-1 overflow-hidden">
              <div className="overflow-y-auto px-6 py-4 space-y-4 flex-1">
                
                <div>
                  <label className="block text-xs font-bold text-[#3E2B25] mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. Pink Tulip & Daisy Handcrafted Bouquet"
                    className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25] focus:outline-none focus:border-[#D96C65]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#3E2B25] mb-1">
                      Store Category *
                    </label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25]"
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
                    <label className="block text-xs font-bold text-[#3E2B25] mb-1">
                      Selling Price (₹ INR) *
                    </label>
                    <input
                      type="number"
                      step="1"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) })}
                      className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25] font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#3E2B25] mb-1">
                      Compare MRP (₹)
                    </label>
                    <input
                      type="number"
                      value={productForm.originalPrice}
                      onChange={(e) => setProductForm({ ...productForm, originalPrice: parseFloat(e.target.value) })}
                      className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3E2B25] mb-1">
                      Available Stock *
                    </label>
                    <input
                      type="number"
                      required
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) })}
                      className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25] font-mono"
                    />
                  </div>
                </div>

                {/* Device Photo Upload */}
                <div className="p-3.5 bg-[#F8F6F3] rounded-xl border border-[#E9E2DC] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#3E2B25] flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5 text-[#D96C65]" />
                        <span>Upload Product Photo from PC / Phone</span>
                      </span>
                      <p className="text-[11px] text-[#756A65]">PNG, JPG, WEBP formats supported.</p>
                    </div>

                    <label className="cursor-pointer px-3 py-1.5 bg-[#D96C65] hover:bg-[#C95B55] text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors">
                      <Camera className="w-3.5 h-3.5" />
                      <span>Choose File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleDeviceFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {productForm.images?.[0] && (
                    <div className="flex items-center gap-3 p-2 bg-white rounded-lg border border-[#E9E2DC]">
                      <img
                        src={productForm.images[0]}
                        alt="Preview"
                        className="w-12 h-12 rounded-lg object-contain p-1 border border-[#E9E2DC]"
                      />
                      <span className="text-xs text-[#3E2B25] font-semibold truncate flex-1">
                        {productForm.images[0].startsWith('data:') ? '📸 Device photo ready' : productForm.images[0]}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3E2B25] mb-1">
                    Short Description
                  </label>
                  <input
                    type="text"
                    value={productForm.shortDescription}
                    onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                    placeholder="e.g. Handcrafted floral cupcake blossom pot in sunshine yellow."
                    className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25]"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-3.5 border-t border-[#E9E2DC] flex items-center justify-between bg-[#F8F6F3] z-10 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#756A65] hover:text-[#3E2B25]"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D96C65] hover:bg-[#C95B55] text-white rounded-xl font-semibold text-xs transition-colors shadow-sm"
                >
                  {editingProduct ? 'Save Changes' : 'Publish Product 🌸'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* CUSTOMER ORDER HISTORY MODAL POP-UP */}
      {/* ========================================================= */}
      {selectedCustomerDetails && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedCustomerDetails(null);
          }}
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 border border-[#E9E2DC] shadow-2xl space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#E9E2DC]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#D96C65] to-[#C45750] text-white font-bold text-sm flex items-center justify-center">
                  {selectedCustomerDetails.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#3E2B25]">
                    {selectedCustomerDetails.name}
                  </h3>
                  <p className="text-xs text-[#756A65]">
                    {selectedCustomerDetails.email} · 📞 {selectedCustomerDetails.phone}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCustomerDetails(null)}
                className="p-1.5 rounded-full text-[#756A65] hover:text-[#3E2B25]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Address & Lifetime Stats Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-xs">
              <div>
                <strong className="text-[#3E2B25] block mb-1">📍 Delivery Address:</strong>
                <p className="text-[#756A65] leading-relaxed">
                  {selectedCustomerDetails.fullAddress}
                </p>
              </div>
              <div className="sm:text-right space-y-1">
                <div>
                  <span className="text-[#756A65]">Total Orders Placed: </span>
                  <strong className="text-[#3E2B25]">{selectedCustomerDetails.totalOrders}</strong>
                </div>
                <div>
                  <span className="text-[#756A65]">Lifetime Store Spend: </span>
                  <strong className="font-serif font-bold text-sm text-[#D96C65]">
                    ₹{selectedCustomerDetails.totalSpent.toLocaleString('en-IN')}
                  </strong>
                </div>
              </div>
            </div>

            {/* Orders History List */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-sm text-[#3E2B25]">
                Order Purchase History ({selectedCustomerDetails.ordersList?.length || 0})
              </h4>

              <div className="space-y-2.5">
                {selectedCustomerDetails.ordersList?.map((ord) => (
                  <div key={ord.id} className="p-3.5 rounded-xl border border-[#E9E2DC] bg-white space-y-2 text-xs">
                    <div className="flex justify-between items-center pb-2 border-b border-[#E9E2DC]">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#3E2B25]">#{ord.id}</span>
                        <span className="text-[#756A65]">
                          {new Date(ord.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-sm text-[#D96C65]">
                          ₹{(ord.total || 0).toLocaleString('en-IN')}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#4F9D69]/10 text-[#4F9D69] text-[10px] font-bold capitalize">
                          {ord.status}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 text-[#756A65]">
                      {ord.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span>{item.quantity || 1}x {item.name} {item.selectedColor ? `(${item.selectedColor})` : ''}</span>
                          <span className="font-semibold text-[#3E2B25]">₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedCustomerDetails(null)}
                className="px-5 py-2 bg-[#3E2B25] text-white rounded-xl font-semibold text-xs hover:bg-black transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
