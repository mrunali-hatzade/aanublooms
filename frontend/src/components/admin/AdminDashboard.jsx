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
  MessageSquare,
  Mail,
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
import { MediaLibraryManager } from './MediaLibraryManager';
import { CollectionsManager } from './CollectionsManager';
import { StoreSettingsModule } from './settings/StoreSettingsModule';

const defaultVideos = [
  {
    id: 'vid-1',
    title: 'Creating Beautiful Handmade Creations',
    caption: 'Watch how we carefully shape and assemble handmade flowers and pots, one creation at a time.',
    url: '/images/whatsapp-craft-video.mp4',
    poster: '/images/aanu-blooms-signature-set.jpeg',
    tag: '🌸 Studio Reel'
  }
];

export const AdminDashboard = ({ onNavigate }) => {
  const { user, login, isLoadingAuth } = useAuth();
  const { addToast } = useToast();

  // Admin Security Authentication State
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);

  React.useEffect(() => {
    if (user?.role === 'admin') {
      setIsAdminUnlocked(true);
    } else {
      setIsAdminUnlocked(false);
    }
  }, [user]);

  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleUnlockAdmin = async (e) => {
    e.preventDefault();
    setAuthError('');
    const cleanEmail = adminEmail.trim().toLowerCase();
    const cleanPass = adminPassword.trim();
    
    if (!cleanEmail || !cleanPass) {
      setAuthError('Please enter both email and passcode.');
      return;
    }

    try {
      const res = await login(cleanEmail, cleanPass);
      if (res?.success && res?.user?.role === 'admin') {
        setIsAdminUnlocked(true);
        addToast('👑 Admin Access Granted! Welcome back.', 'success');
        setAuthError('');
      } else if (res?.success && res?.user?.role !== 'admin') {
        setAuthError('This account does not have admin privileges.');
        addToast('Admin access required', 'error');
      } else {
        setAuthError('Invalid credentials. Please check your email and password.');
      }
    } catch (err) {
      setAuthError(err.message || 'Login failed. Please try again.');
      addToast(err.message || 'Login failed', 'error');
    }
  };

  const handleLockAdmin = () => {
    setIsAdminUnlocked(false);
    addToast('Admin session locked 🔒', 'info');
  };

  const isAdmin = isAdminUnlocked;
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'products' | 'categories' | 'collections' | 'inventory' | 'orders' | 'custom-orders' | 'enquiries' | 'customers' | 'media' | 'coupons' | 'settings' | 'reports' | 'studio-videos'
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");

  // Studio Videos Manager State
  const [studioVideos, setStudioVideos] = useState(() => {
    try {
      const saved = localStorage.getItem('aanublooms_studio_videos_v3');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultVideos;
    } catch {
      return defaultVideos;
    }
  });

  const [showVideoModal, setShowVideoModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [videoForm, setVideoForm] = useState({
    title: '',
    caption: '',
    url: '',
    tag: '🌸 Studio Reel',
    poster: '/images/aanu-blooms-signature-set.jpeg'
  });

  const handleSaveVideo = (e) => {
    e.preventDefault();
    if (!videoForm.title || !videoForm.url) {
      addToast('Title and Video URL are required', 'error');
      return;
    }

    let updated;
    if (editingVideo) {
      updated = studioVideos.map(v => v.id === editingVideo.id ? { ...v, ...videoForm } : v);
      addToast('Video updated successfully! 🎥', 'success');
    } else {
      const newVideo = {
        id: `vid-${Date.now()}`,
        ...videoForm
      };
      updated = [newVideo, ...studioVideos];
      addToast('New video added successfully! 🎥', 'success');
    }

    setStudioVideos(updated);
    localStorage.setItem('aanublooms_studio_videos_v3', JSON.stringify(updated));
    window.dispatchEvent(new Event('aanublooms_data_updated'));
    setShowVideoModal(false);
    setEditingVideo(null);
    setVideoForm({
      title: '',
      caption: '',
      url: '',
      tag: '🌸 Studio Reel',
      poster: '/images/aanu-blooms-signature-set.jpeg'
    });
  };

  const handleDeleteVideo = (id) => {
    if (window.confirm('Are you sure you want to remove this video from the website?')) {
      const updated = studioVideos.filter(v => v.id !== id);
      setStudioVideos(updated);
      localStorage.setItem('aanublooms_studio_videos_v3', JSON.stringify(updated));
      window.dispatchEvent(new Event('aanublooms_data_updated'));
      addToast('Video removed successfully! 🗑️', 'info');
    }
  };

  const handleVideoFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      addToast('Please select a valid video file', 'error');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      addToast('Video file should be under 50MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setVideoForm(prev => ({
        ...prev,
        url: event.target.result,
        title: prev.title || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
      }));
      addToast('🎥 Video file uploaded and ready!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [salesTimeframe, setSalesTimeframe] = useState('7-days'); // 'today' | '7-days' | '30-days' | '3-months' | '1-year'
  const [selectedDateRange, setSelectedDateRange] = useState('Today');

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

  // Global Search State
  const [showGlobalSearchResults, setShowGlobalSearchResults] = useState(false);

  const globalSearchResults = React.useMemo(() => {
    if (!globalSearchQuery.trim()) return [];
    const query = globalSearchQuery.toLowerCase().trim();
    const results = [];

    // Search Products
    products.forEach(p => {
      if (p.name?.toLowerCase().includes(query) || p.id?.toLowerCase().includes(query)) {
        results.push({ type: 'product', label: `📦 Product: ${p.name}`, id: p.id, data: p });
      }
    });

    // Search Orders
    orders.forEach(o => {
      if (o.id?.toLowerCase().includes(query) || o.customer?.name?.toLowerCase().includes(query) || o.customer?.email?.toLowerCase().includes(query) || o.customer?.phone?.includes(query)) {
        results.push({ type: 'order', label: `🛍️ Order #${o.id} - ${o.customer?.name || ''}`, id: o.id, data: o });
      }
    });

    // Search Custom Requests
    customRequests.forEach(cr => {
      if (cr.id?.toLowerCase().includes(query) || cr.customerName?.toLowerCase().includes(query) || cr.customerEmail?.toLowerCase().includes(query) || cr.itemType?.toLowerCase().includes(query)) {
        results.push({ type: 'customRequest', label: `🎨 Custom: ${cr.itemType} for ${cr.customerName}`, id: cr.id, data: cr });
      }
    });

    // Search Customers (derived from orders)
    const uniqueCustomers = Array.from(new Set(orders.map(o => o.customer?.email).filter(Boolean)))
      .map(email => orders.find(o => o.customer?.email === email)?.customer)
      .filter(Boolean);
    uniqueCustomers.forEach(c => {
      if (c.name?.toLowerCase().includes(query) || c.email?.toLowerCase().includes(query) || c.phone?.includes(query)) {
        results.push({ type: 'customer', label: `👤 Customer: ${c.name} (${c.email})`, id: c.email, data: c });
      }
    });

    return results.slice(0, 8); // Max 8 results
  }, [globalSearchQuery, products, orders, customRequests]);

  const handleGlobalSearchResultClick = (res) => {
    setShowGlobalSearchResults(false);
    setGlobalSearchQuery('');
    
    if (res.type === 'product') {
      setActiveTab('products');
      setEditingProduct(res.data);
      setProductForm(res.data);
      setShowProductModal(true);
    } else if (res.type === 'order') {
      setActiveTab('all-orders');
      setSelectedOrderDetails(res.data);
    } else if (res.type === 'customRequest') {
      setActiveTab('custom-orders');
      setSelectedCustomRequest(res.data);
    } else if (res.type === 'customer') {
      setActiveTab('customers');
      // For customers, we need to construct the full customer details object
      const customerOrders = orders.filter(o => o.customer?.email === res.data.email);
      const custObj = {
        name: res.data.name,
        email: res.data.email,
        phone: res.data.phone,
        fullAddress: `${res.data.address || ''}, ${res.data.city || ''}, ${res.data.state || ''} - ${res.data.zip || ''}`,
        totalOrders: customerOrders.length,
        totalSpent: customerOrders.reduce((sum, o) => sum + (o.total || 0), 0),
        ordersList: customerOrders
      };
      setSelectedCustomerDetails(custObj);
    }
  };

  // Selected Custom Request Modal View
  const [selectedCustomRequest, setSelectedCustomRequest] = useState(null);


  // Selected Order for Modal View
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  // Product Add / Edit Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    price: 599,
    originalPrice: 799,
    material: '100% Combed Milk Cotton',
    craftTimeHours: 4,
    difficulty: 'Intermediate',
    stock: 12,
    shortDescription: 'Slow-crafted handcrafted pipe cleaner piece made with love.',
    description: 'Handmade with ultra-soft milk cotton and velvet chenille. Perfect for thoughtful gifting and forever home decor.',
    images: ['/images/aanu-blooms-signature-set.jpeg'],
    featured: true,
    isBestseller: false
  });

  // Low Stock Items State
  const [lowStockItems, setLowStockItems] = useState([
    { id: 'mat-1', name: 'Pink Cotton pipe cleaners', count: '2 balls remaining', type: 'Raw Material', urgency: 'high' },
    { id: 'mat-2', name: 'Cream Velvet Chenille', count: '3 balls remaining', type: 'Raw Material', urgency: 'medium' },
    { id: 'mat-3', name: 'Artisan Packaging Boxes', count: '5 remaining', type: 'Packaging', urgency: 'medium' }
  ]);

  // Category Manager State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    image: '/images/category/1st_category_flower.jpeg'
  });

  
  const dashboardStats = React.useMemo(() => {
    const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;
    const completed = orders.filter(o => o.status === 'delivered' || o.status === 'completed').length;
    const completionRate = totalOrders > 0 ? Math.round((completed / totalOrders) * 100) : 0;
    const pendingOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'completed').length;
    const totalCustomers = [...new Set(orders.map(o => o.customer?.email).filter(Boolean))].length;
    return { totalSales, totalOrders, avgOrderValue, completionRate, pendingOrders, totalCustomers };
  }, [orders]);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.name) {
      addToast('Category name is required', 'error');
      return;
    }
    const newCat = {
      id: editingCategory ? editingCategory.id : (categoryForm.slug || categoryForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')),
      name: categoryForm.name,
      description: categoryForm.description,
      image: categoryForm.image || '/images/category/1st_category_flower.jpeg',
      itemCount: editingCategory ? editingCategory.itemCount : 0
    };

    let updated;
    try {
      if (editingCategory) {
        await api.updateCategory(editingCategory.id, newCat).catch(() => {});
        updated = categories.map(c => c.id === editingCategory.id ? newCat : c);
        addToast('Category updated successfully', 'success');
      } else {
        await api.addCategory(newCat).catch(() => {});
        updated = [...categories, newCat];
        addToast('Category added successfully', 'success');
      }
      
      setCategories(updated);
      localStorage.setItem('aanublooms_categories_v2', JSON.stringify(updated));
      window.dispatchEvent(new Event('aanublooms_data_updated'));
      setShowCategoryModal(false);
      setCategoryForm({ name: '', slug: '', description: '', image: '/images/category/1st_category_flower.jpeg' });
      setEditingCategory(null);
    } catch (error) {
      addToast('Failed to save category', 'error');
    }
  };

  const handleDeleteCategory = async (catId) => {
    if (window.confirm('Are you sure you want to remove this category?')) {
      try {
        await api.deleteCategory(catId).catch(() => {});
        const updated = categories.filter(c => c.id !== catId);
        setCategories(updated);
        localStorage.setItem('aanublooms_categories_v2', JSON.stringify(updated));
        window.dispatchEvent(new Event('aanublooms_data_updated'));
        addToast('Category removed from website', 'info');
      } catch (error) {
        addToast('Failed to delete category', 'error');
      }
    }
  };

  const handleCategoryPhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setCategoryForm(prev => ({ ...prev, image: event.target.result }));
      addToast('Category photo uploaded!', 'success');
    };
    reader.readAsDataURL(file);
  };

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

  // Coupons Manager State
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [couponForm, setCouponForm] = useState({
    code: '',
    discount: '',
    desc: ''
  });

  const handleSaveCoupon = (e) => {
    e.preventDefault();
    if (!couponForm.code.trim()) return;

    let updatedCoupons;
    if (editingCoupon) {
      updatedCoupons = coupons.map(c => c.code === editingCoupon.code ? couponForm : c);
      addToast('Coupon updated successfully!', 'success');
    } else {
      updatedCoupons = [...coupons, couponForm];
      addToast('New coupon created!', 'success');
    }
    setCoupons(updatedCoupons);
    setShowCouponModal(false);
    setEditingCoupon(null);
    setCouponForm({ code: '', discount: '', desc: '' });
  };

  const handleDeleteCoupon = (code) => {
    if (window.confirm(`Are you sure you want to delete coupon ${code}?`)) {
      setCoupons(coupons.filter(c => c.code !== code));
      addToast('Coupon deleted.', 'info');
    }
  };

  const handleDeleteCustomRequest = async (id) => {
    if (window.confirm('Are you sure you want to delete this custom order inquiry? This action cannot be undone.')) {
      try {
        await api.deleteCustomRequest(id).catch(() => {});
        const updated = customRequests.filter(r => r.id !== id && r._id !== id);
        setCustomRequests(updated);
        addToast('Custom order deleted successfully! 🗑️', 'info');
      } catch (err) {
        console.error('Error deleting custom request:', err);
        addToast('Failed to delete custom order', 'error');
      }
    }
  };

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
        category: '',
        price: 599,
        originalPrice: 799,
        material: '100% Combed Milk Cotton',
        craftTimeHours: 4,
        difficulty: 'Intermediate',
        stock: 10,
        shortDescription: 'Slow-crafted handcrafted pipe cleaner piece made with love.',
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
  const handleDeleteOrder = async (id, e) => { if(e) e.stopPropagation(); if(window.confirm("Delete order?")) { await api.deleteOrder(id); setOrders(prev => prev.filter(o => o.id !== id)); addToast("Order deleted", "info"); } }; const handleDeleteCustom = async (id, e) => { if(e) e.stopPropagation(); if(window.confirm("Delete custom request?")) { await api.deleteCustomRequest(id); setCustomRequests(prev => prev.filter(r => r.id !== id)); addToast("Request deleted", "info"); } }; const handleDeleteEnquiry = async (id, e) => { if(e) e.stopPropagation(); if(window.confirm("Delete enquiry?")) { await api.deleteContactMessage(id); setContactMessages(prev => prev.filter(m => m.id !== id)); addToast("Enquiry deleted", "info"); } }; const handleDeleteFeedback = async (id, e) => { if(e) e.stopPropagation(); if(window.confirm("Delete feedback?")) { await api.deleteFeedback(id); setFeedbacks(prev => prev.filter(f => f.id !== id)); addToast("Feedback deleted", "info"); } };
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
      category: '',
      price: 599,
      originalPrice: 799,
      material: '100% Combed Milk Cotton',
      craftTimeHours: 4,
      difficulty: 'Intermediate',
      stock: 12,
      shortDescription: 'Slow-crafted handcrafted pipe cleaner piece made with love.',
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
      let updatedProducts = [];
      const finalProductForm = {
        ...productForm,
        category: productForm.category || (categories.length > 0 ? categories[0].id : '')
      };

      if (editingProduct) {
        const res = await api.updateProduct(editingProduct.id, finalProductForm);
        const savedProduct = res.data || { ...editingProduct, ...finalProductForm };
        updatedProducts = products.map(p => p.id === editingProduct.id ? savedProduct : p);
        addToast(`"${finalProductForm.name}" updated successfully! 🌸`, 'success');
      } else {
        const newId = `prod-${Date.now()}`;
        const newProduct = {
          ...finalProductForm,
          id: newId,
          rating: 5.0,
          reviewCount: 1,
          inStock: true,
          image: finalProductForm.images?.[0] || '/images/category/1st_category_flower.jpeg'
        };
        const res = await api.createProduct(newProduct);
        const savedProduct = res.data || newProduct;
        updatedProducts = [savedProduct, ...products];
        addToast(`"${finalProductForm.name}" added to store catalog! 🛍️`, 'success');
      }
      setProducts(updatedProducts);
      localStorage.setItem('aanublooms_products_v2', JSON.stringify(updatedProducts));
      window.dispatchEvent(new Event('aanublooms_data_updated'));
      setShowProductModal(false);
      setEditingProduct(null);
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
        await api.deleteProduct(productId).catch(() => {});
        const updated = products.filter(p => p.id !== productId);
        setProducts(updated);
        localStorage.setItem('aanublooms_products_v2', JSON.stringify(updated));
        window.dispatchEvent(new Event('aanublooms_data_updated'));
        addToast(`"${productName}" removed from store`, 'info');
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
  
  const customOrderStats = React.useMemo(() => {
    const stats = { new: 0, discuss: 0, quoted: 0, approved: 0, making: 0, ready: 0, done: 0 };
    customRequests.forEach(req => {
      const st = req.status || 'new';
      if (st === 'new') stats.new++;
      if (st === 'discussion') stats.discuss++;
      if (st === 'quote_sent') stats.quoted++;
      if (st === 'approved') stats.approved++;
      if (st === 'in_production') stats.making++;
      if (st === 'ready') stats.ready++;
      if (st === 'completed') stats.done++;
    });
    return stats;
  }, [customRequests]);

  const salesByCategory = React.useMemo(() => {
    const totals = {};
    let grand = 0;
    orders.forEach(o => {
      (o.items || []).forEach(item => {
        const p = products.find(prod => prod.id === item.productId);
        const cat = p?.category || 'forever-blooms';
        const line = (item.price || 0) * (item.quantity || 1);
        totals[cat] = (totals[cat] || 0) + line;
        grand += line;
      });
    });

    return {
      total: grand,
      bags: grand > 0 ? Math.round(((totals['wearables'] || 0) / grand) * 100) : 0,
      flowers: grand > 0 ? Math.round(((totals['forever-blooms'] || 0) / grand) * 100) : 0,
      'flower pots': grand > 0 ? Math.round(((totals['flower pots'] || 0) / grand) * 100) : 0,
      accessories: grand > 0 ? Math.round(((totals['accessories'] || 0) / grand) * 100) : 0,
      home: grand > 0 ? Math.round(((totals['home-decor'] || 0) / grand) * 100) : 0
    };
  }, [orders, products]);

  const topProductsList = React.useMemo(() => { return [...products].sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0)).slice(0, 5).map((p, idx) => ({ rank: "0" + (idx + 1), name: p.name, sold: (p.reviewCount || 0) + " sold", revenue: "₹" + (((p.reviewCount || 0) * (p.price || 0)) || 0).toLocaleString(), image: p.image || (p.images && p.images[0]) || "/images/category/1st_category_flower.jpeg" })); }, [products]);

  // Restock action handler for low stock items
  const handleRestock = (item) => {
    addToast(`Restock PO order generated for ${item.name}! 📦`, 'success');
  };



  // =========================================================================
  // IF NOT AUTHENTICATED: DISPLAY ADMIN SECURITY LOCK SCREEN
  // =========================================================================
  if (isLoadingAuth) {
    return <div className="min-h-screen bg-[#F8F6F3] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#D96C65] border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!isAdminUnlocked) {
    return (
      <div className="min-h-screen bg-[#F8F6F3] flex items-center justify-center p-4 antialiased font-sans">
        <div className="bg-white rounded-3xl p-8 border border-[#E9E2DC] shadow-[0_8px_30px_rgba(0,0,0,0.08)] max-w-md w-full text-center space-y-6 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-2xl bg-[#D96C65]/15 text-[#D96C65] mx-auto flex items-center justify-center shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#D96C65] bg-[#D96C65]/10 px-3 py-1 rounded-full border border-[#D96C65]/20 inline-block mb-2">
              🔒 ADMIN SECURITY PORTAL
            </span>
            <h2 className="text-2xl font-serif font-bold text-[#3E2B25]">
              Admin Security Access
            </h2>
            <p className="text-xs text-[#756A65] mt-1.5 leading-relaxed">
              Enter administrator passcode to access AanuBlooms management, stock controls, and customer data.
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
              {authError}
            </div>
          )}

          <form onSubmit={handleUnlockAdmin} className="space-y-4 text-left">
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
                className="w-full text-xs p-3 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25] focus:outline-none focus:border-[#D96C65]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3E2B25] mb-1">
                Admin Passcode / Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter passcode (e.g. adminpassword123 or 1234)"
                  className="w-full text-xs p-3 pr-10 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25] focus:outline-none focus:border-[#D96C65]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#756A65] hover:text-[#3E2B25]"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="pt-2 space-y-2.5">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#D96C65] hover:bg-[#C95B55] text-white rounded-xl font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>Authenticate & Open Admin Portal 🔓</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="w-full py-2.5 px-4 bg-[#F8F6F3] hover:bg-[#E9E2DC] text-[#3E2B25] rounded-xl font-semibold text-xs transition-colors"
              >
                ← Return to Storefront Home Page
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
                  AanuBlooms
                </span>
                <span className="text-[#D96C65] text-xs">✨</span>
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
              <span>Products ({products.length})</span>
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
                {orders.length}
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
                {customRequests.length}
              </span>
            </button>

            {/* Contact Us Enquiries Tab */}
            <button
              onClick={() => { setActiveTab('contact-messages'); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                activeTab === 'contact-messages'
                  ? 'bg-[#D96C65] text-white font-semibold'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                <span>Contact Enquiries</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold">
                {contactMessages.length}
              </span>
            </button>

            {/* Customer Feedbacks Tab */}
            <button
              onClick={() => { setActiveTab('customer-feedbacks'); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                activeTab === 'customer-feedbacks'
                  ? 'bg-[#D96C65] text-white font-semibold'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Star className="w-4 h-4 text-amber-400" />
                <span>Customer Feedbacks</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                {feedbacks.length}
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
            <button
              onClick={() => { setActiveTab('studio-videos'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                activeTab === 'studio-videos'
                  ? 'bg-[#D96C65] text-white font-semibold'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Studio Videos</span>
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
            <div className="relative hidden md:block w-64 z-50">
              <Search className="w-3.5 h-3.5 text-[#756A65] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search anything..."
                value={globalSearchQuery}
                onChange={(e) => {
                  setGlobalSearchQuery(e.target.value);
                  setShowGlobalSearchResults(true);
                }}
                onFocus={() => setShowGlobalSearchResults(true)}
                className="w-full text-xs py-2 pl-9 pr-3 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25] placeholder-[#756A65]/70 focus:outline-none focus:border-[#D96C65]"
              />
              
              {showGlobalSearchResults && globalSearchQuery.trim() !== '' && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-[#E9E2DC] p-2 max-h-80 overflow-y-auto">
                  {globalSearchResults.length > 0 ? (
                    <div className="space-y-1">
                      {globalSearchResults.map((res, idx) => (
                        <div 
                          key={`${res.type}-${res.id}-${idx}`}
                          onClick={() => handleGlobalSearchResultClick(res)}
                          className="px-3 py-2 hover:bg-[#F8F6F3] rounded-lg cursor-pointer transition-colors"
                        >
                          <p className="text-xs text-[#3E2B25] font-semibold truncate">{res.label}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center">
                      <p className="text-xs text-[#756A65]">No matching records found for "{globalSearchQuery}"</p>
                    </div>
                  )}
                </div>
              )}
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
                    <span className="text-[10px] text-[#D96C65]">{orders.length} New</span>
                  </div>
                  <div className="divide-y divide-[#E9E2DC]/60 space-y-1 mt-1">
                    <p className="py-2 text-[#3E2B25]">🛍️ <strong>New order received</strong>: #SL1024 has been placed (2m ago)</p>
                    <p className="py-2 text-[#3E2B25]">🎨 <strong>New custom order</strong>: #CO1023 requires your review (15m ago)</p>
                    <p className="py-2 text-[#3E2B25]">⚠️ <strong>Low stock alert</strong>: Pink pipe cleaners is running low (1h ago)</p>
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
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#E9E2DC] p-1.5 z-50 text-xs animate-in fade-in space-y-0.5">
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
                  <div className="pt-1 border-t border-[#E9E2DC]">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        handleLockAdmin();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-bold flex items-center justify-between transition-colors"
                    >
                      <span>Lock Admin Session</span>
                      <Lock className="w-3.5 h-3.5" />
                    </button>
                  </div>
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
                  Welcome back, {user?.name || 'Admin'}. Here's what's happening with your store today.
                </p>
              </div>

              {/* Date Range Selector */}
              
  <div className="flex items-center gap-2 self-start sm:self-auto">
    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E9E2DC] rounded-xl text-xs font-semibold text-[#3E2B25] shadow-2xs relative">
      <Calendar className="w-3.5 h-3.5 text-[#756A65] pointer-events-none" />
      <select 
        value={selectedDateRange}
        onChange={(e) => setSelectedDateRange(e.target.value)}
        className="appearance-none bg-transparent outline-none cursor-pointer pr-4"
      >
        <option value="Today">Today</option>
        <option value="Last 7 Days">Last 7 Days</option>
        <option value="Last 30 Days">Last 30 Days</option>
        <option value="This Month">This Month</option>
        <option value="This Year">This Year</option>
        <option value="19 May – 25 May 2026">19 May – 25 May 2026</option>
      </select>
      <ChevronDown className="w-3 h-3 text-[#756A65] absolute right-3 pointer-events-none" />
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
                  ₹{(dashboardStats?.totalSales || 0).toLocaleString("en-IN")}
                </h3>
                <span className="text-[10px] text-[#4F9D69] font-bold block">
                  {dashboardStats.totalOrders > 0 ? "Live data" : "No orders yet"}
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
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#3E2B25]">{dashboardStats.totalOrders}</h3>
                <span className="text-[10px] text-[#4F9D69] font-bold block">
                  {dashboardStats.totalOrders > 0 ? "Live data" : "No orders yet"}
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
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#3E2B25]">{dashboardStats.totalCustomers}</h3>
                <span className="text-[10px] text-[#4F9D69] font-bold block">
                  {dashboardStats.totalCustomers > 0 ? "Live data" : "No customers yet"}
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
                  {products.length}
                </h3>
                <span className="text-[10px] text-[#4F9D69] font-bold block">
                  {products.length > 0 ? "Live data" : "No products yet"}
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
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#3E2B25]">{dashboardStats.pendingOrders}</h3>
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
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#3E2B25]">{customRequests.length}</h3>
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
                      <p className="text-[11px] text-[#756A65]">Pink pipe cleaners is running low</p>
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
                        { id: '#SL1024', name: 'Priya Sharma', product: 'Daisy handmade Bag', amount: '₹1,299', payment: 'Paid', status: 'Processing', statusColor: 'bg-[#D99A35]/15 text-[#D99A35]', date: '25 May', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80' },
                        { id: '#SL1023', name: 'Ananya Joshi', product: 'Tulip Flower Bouquet', amount: '₹1,199', payment: 'Paid', status: 'Shipped', statusColor: 'bg-[#3B82F6]/15 text-[#3B82F6]', date: '25 May', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80' },
                        { id: '#SL1022', name: 'Riya Patel', product: 'Cute Bunny (flower pots)', amount: '₹899', payment: 'Paid', status: 'Delivered', statusColor: 'bg-[#4F9D69]/15 text-[#4F9D69]', date: '24 May', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=100&q=80' },
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
                    <div className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-[#756A65]"><span className="w-2 h-2 rounded-full bg-[#81B29A]"></span>flower pots</span><span className="font-bold text-[#3E2B25]">20%</span></div>
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
                    <span>Add Product</span>
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
                    View, add, edit, adjust stock, and manage your handcrafted pipe cleaner inventory.
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
                    <span>Add Product</span>
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
                    className="w-full text-xs py-2 pl-9 pr-8 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25]"
                  />
                  {productSearch && (
                    <button
                      onClick={() => setProductSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-[#756A65] hover:text-[#3E2B25] rounded-full"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {[{ id: 'all', name: 'All' }, ...categories].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setProductCategoryFilter(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                        productCategoryFilter === cat.id
                          ? 'bg-[#3E2B25] text-white font-bold'
                          : 'bg-[#F8F6F3] text-[#756A65] hover:text-[#3E2B25]'
                      }`}
                    >
                      {cat.name}
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
        {/* TAB: CATEGORIES (BOUTIQUE CATEGORY MANAGEMENT) */}
        {/* ========================================================= */}
        {activeTab === 'categories' && (
          <main className="p-5 sm:p-7 space-y-6 max-w-7xl w-full">
            <div className="bg-white rounded-2xl p-5 border border-[#E9E2DC] shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#3E2B25]">
                    Categories Management ({categories.length})
                  </h2>
                  <p className="text-xs text-[#756A65] mt-0.5">
                    Add, edit, remove, and manage featured storefront categories live on the main page.
                  </p>
                </div>

                <button
                  onClick={() => { setEditingCategory(null); setCategoryForm({ name: "", slug: "", description: "", image: "/images/category/1st_category_flower.jpeg" }); setShowCategoryModal(true); }}
                  className="px-4 py-2 bg-[#D96C65] hover:bg-[#C95B55] text-white rounded-xl text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Category</span>
                </button>
              </div>

              {/* Categories Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {categories.map((cat) => {
                  const prodCount = products.filter(p => p.category === cat.id).length;
                  return (
                    <div
                      key={cat.id}
                      className="bg-[#F8F6F3] rounded-2xl p-4 border border-[#E9E2DC] flex items-center gap-3 relative group"
                    >
                      <img
                        src={cat.image || '/images/category/1st_category_flower.jpeg'}
                        alt={cat.name}
                        className="w-16 h-16 rounded-xl object-cover border border-[#E9E2DC] bg-white shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif font-bold text-sm text-[#3E2B25] truncate">
                          {cat.name}
                        </h4>
                        <p className="text-[11px] text-[#756A65] truncate mt-0.5">
                          ID: <span className="font-mono text-[#D96C65]">{cat.id}</span>
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-white rounded-md text-[10px] font-bold text-[#756A65] border border-[#E9E2DC]">
                          {prodCount} Products
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => { setEditingCategory(cat); setCategoryForm(cat); setShowCategoryModal(true); }}
                          className="p-2 rounded-xl text-[#756A65] hover:bg-[#E9E2DC] transition-colors"
                          title="Edit category"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {!['forever-blooms', 'flower pots-plushies'].includes(cat.id) && (
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                            title="Remove category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </main>
        )}

        {/* ========================================================= */}
        {/* TAB: COLLECTIONS */}
        {/* ========================================================= */}
        {activeTab === 'collections' && (
          <main className="p-5 sm:p-7 space-y-6 max-w-7xl w-full">
            <CollectionsManager />
          </main>
        )}

        {/* ========================================================= */}
        {/* TAB: INVENTORY */}
        {/* ========================================================= */}
        {activeTab === 'inventory' && (
          <main className="p-5 sm:p-7 space-y-6 max-w-7xl w-full">
            <div className="bg-white rounded-2xl p-5 border border-[#E9E2DC] shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
              <div>
                <h2 className="text-xl font-serif font-bold text-[#3E2B25]">
                  Inventory Management
                </h2>
                <p className="text-xs text-[#756A65] mt-0.5">
                  Track raw materials, packaging, and pipe cleaners stock levels.
                </p>
              </div>

              <div className="p-8 text-center bg-[#F8F6F3] rounded-2xl border border-[#E9E2DC]">
                <BarChart3 className="w-8 h-8 text-[#756A65]/40 mx-auto mb-2" />
                <p className="text-xs text-[#756A65]">
                  Advanced raw material inventory tracking is coming soon. Keep an eye out for updates!
                </p>
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
                      <th className="pb-2.5 px-3">Items to Craft</th>
                      <th className="pb-2.5 px-3">Amount</th>
                      <th className="pb-2.5 px-3">Fulfillment Stage</th>
                      <th className="pb-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9E2DC]/60">
                    {filteredOrders.map(order => (
                      <tr key={order.id} className="hover:bg-[#F8F6F3]/50 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-[#D96C65]">
                          <button
                            onClick={() => setSelectedOrderDetails(order)}
                            className="hover:underline text-left font-mono font-bold text-[#D96C65]"
                            title="Click to view full order & crafting details"
                          >
                            #{order.id}
                          </button>
                        </td>
                        <td className="py-3 px-3">
                          <div 
                            onClick={() => setSelectedOrderDetails(order)}
                            className="cursor-pointer hover:bg-[#F8F6F3] p-1.5 -ml-1.5 rounded-lg transition-colors border border-transparent hover:border-[#E9E2DC]"
                            title="Click to view order & customer details"
                          >
                            <p className="font-semibold text-[#3E2B25]">{order.customer?.name || 'Customer'}</p>
                            <p className="text-[10px] text-[#756A65]">{order.customer?.city || 'Pune'}</p>
                          </div>
                        </td>
                        <td className="py-3 px-3 max-w-[220px]">
                          <div 
                            onClick={() => setSelectedOrderDetails(order)}
                            className="cursor-pointer group"
                            title="Click to view items to craft"
                          >
                            <div className="text-xs font-semibold text-[#3E2B25] line-clamp-1 group-hover:text-[#D96C65] transition-colors">
                              {order.items?.map(i => `${i.quantity || 1}x ${i.name}${i.selectedColor ? ` (${i.selectedColor})` : ''}`).join(', ') || 'Handcrafted items'}
                            </div>
                            <span className="text-[10px] text-[#756A65] block font-mono">
                              🧶 {order.items?.reduce((sum, i) => sum + (i.quantity || 1), 0) || 0} total piece(s)
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-serif font-bold text-[#3E2B25]">₹{order.total?.toLocaleString('en-IN')}</div>
                          <div className="text-[10px] font-medium mt-0.5">
                            <span className={order.paymentStatus === 'paid' ? 'text-green-600 font-bold' : 'text-orange-500'}>
                              {order.paymentStatus === 'paid' ? 'Paid ✓' : 'Pending'}
                            </span>
                            <span className="text-[#756A65] ml-1">
                              • {order.paymentMethod || 'COD'}
                            </span>
                          </div>
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
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedOrderDetails(order)}
                              className="px-2.5 py-1 bg-[#D96C65]/15 hover:bg-[#D96C65] text-[#D96C65] hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                              title="View Order & Crafting Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Items</span>
                            </button>

                            <button
                              onClick={() => onNavigate('track-order', { id: order.id })}
                              className="px-2.5 py-1 bg-[#F8F6F3] hover:bg-[#E9E2DC] rounded-lg text-xs font-semibold text-[#3E2B25] transition-colors"
                            >
                              Track
                            </button>

                            <button onClick={(e) => handleDeleteOrder(order.id, e)} className="p-1 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors" title="Delete Order">
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
        {/* TAB: CONTACT US ENQUIRIES */}
        {/* ========================================================= */}
        {activeTab === 'contact-messages' && (
          <main className="p-5 sm:p-7 space-y-6 max-w-7xl w-full">
            <div className="bg-white rounded-2xl p-5 border border-[#E9E2DC] shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#3E2B25] flex items-center gap-2">
                    <Mail className="w-5 h-5 text-[#D96C65]" />
                    <span>Contact Us Form Messages ({contactMessages.length})</span>
                  </h2>
                  <p className="text-xs text-[#756A65] mt-0.5">
                    Direct inquiries and customer notes submitted through the Contact Us form on the store.
                  </p>
                </div>
              </div>

              {contactMessages.length === 0 ? (
                <div className="p-8 text-center bg-[#F8F6F3] rounded-2xl border border-[#E9E2DC]">
                  <p className="text-xs text-[#756A65]">
                    No contact messages received yet. Once visitors submit the Contact Us form, their messages will appear here!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {contactMessages.map(msg => (
                    <div key={msg.id} className="p-4 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-sm text-[#3E2B25]">{msg.name}</h4>
                          <p className="text-xs text-[#756A65]">{msg.email}</p>
                          {msg.orderId && (
                            <span className="inline-block mt-1 text-[10px] font-mono font-bold text-[#D96C65] bg-white px-2 py-0.5 rounded border border-[#E9E2DC]">
                              Order #{msg.orderId}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-semibold bg-white px-2 py-0.5 rounded-md border border-[#E9E2DC] text-[#756A65]">
                          {msg.subject || 'General Inquiry'}
                        </span>
                      </div>

                      <p className="text-xs text-[#3E2B25] bg-white p-3 rounded-lg border border-[#E9E2DC] leading-relaxed">
                        "{msg.message}"
                      </p>

                      <div className="flex justify-between items-center text-[10px] text-[#756A65] pt-1">
                        <span>Submitted on {msg.date || new Date().toLocaleDateString()}</span>
                        <div className="flex gap-2">
                          <a
                            href={`mailto:${msg.email}?subject=Re:%20${encodeURIComponent(msg.subject || 'AanuBlooms Inquiry')}`}
                            className="px-2.5 py-1 bg-[#D96C65] text-white rounded-md font-bold text-[10px] hover:bg-[#c85b54] transition-colors"
                          >
                            Reply via Email
                          </a>
                          <button
                            onClick={() => {
                              if (window.confirm('Delete this enquiry permanently?')) {
                                api.deleteContactMessage(msg.id || msg._id).then(() => {
                                  const updated = contactMessages.filter(m => (m.id || m._id) !== (msg.id || msg._id));
                                  setContactMessages(updated);
                                  addToast('Enquiry deleted', 'info');
                                }).catch(() => addToast('Failed to delete', 'error'));
                              }
                            }}
                            className="px-2.5 py-1 bg-red-50 text-red-600 border border-red-200 rounded-md font-bold text-[10px] hover:bg-red-100 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        )}

        {/* ========================================================= */}
        {/* TAB: REAL CUSTOMER FEEDBACK & REVIEWS */}
        {/* ========================================================= */}
        {activeTab === 'customer-feedbacks' && (
          <main className="p-5 sm:p-7 space-y-6 max-w-7xl w-full">
            <div className="bg-white rounded-2xl p-5 border border-[#E9E2DC] shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#3E2B25] flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                    <span>Real Customer Feedbacks & Product Reviews ({feedbacks.length})</span>
                  </h2>
                  <p className="text-xs text-[#756A65] mt-0.5">
                    Live product reviews, ratings, and quotes submitted by real buyers on your website.
                  </p>
                </div>
              </div>

              {feedbacks.length === 0 ? (
                <div className="p-8 text-center bg-[#F8F6F3] rounded-2xl border border-[#E9E2DC]">
                  <p className="text-xs text-[#756A65]">
                    No real customer feedback submitted yet. Once customers submit reviews on the site, they will appear here live!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {feedbacks.map(fb => (
                    <div key={fb.id} className="p-4 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-1 text-amber-500 text-xs">
                            {[...Array(fb.rating || 5)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <h4 className="font-bold text-sm text-[#3E2B25] mt-1">{fb.author || fb.name} ({fb.city || 'India'})</h4>
                          {fb.email && <p className="text-xs text-[#756A65]">{fb.email}</p>}
                        </div>
                        <span className="text-[10px] font-semibold bg-white px-2 py-0.5 rounded-md border border-[#E9E2DC] text-[#756A65]">
                          {fb.productCategory || 'General'}
                        </span>
                      </div>

                      {fb.highlight && (
                        <p className="text-xs font-bold text-[#D96C65]">
                          ✨ "{fb.highlight}"
                        </p>
                      )}

                      <p className="text-xs text-[#3E2B25] bg-white p-3 rounded-lg border border-[#E9E2DC] leading-relaxed italic">
                        "{fb.comment || fb.message}"
                      </p>

                      <div className="flex justify-between items-center text-[10px] text-[#756A65] pt-1">
                        <span>Submitted on {fb.date || 'Recent'}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={async () => {
                              const replyText = window.prompt('Enter your public reply to this feedback (shown on site):', fb.adminReply || '');
                              if (replyText !== null) {
                                try {
                                  const updated = await api.replyToFeedback(fb.id || fb._id, replyText);
                                  const updatedFeedbacks = feedbacks.map(f => (f.id || f._id) === (fb.id || fb._id) ? { ...f, adminReply: replyText } : f);
                                  setFeedbacks(updatedFeedbacks);
                                  addToast('Reply saved!', 'success');
                                } catch (err) {
                                  addToast('Failed to save reply', 'error');
                                }
                              }
                            }}
                            className="px-2.5 py-1 bg-bloom-50 text-bloom-600 border border-bloom-200 rounded-md font-bold text-[10px] hover:bg-bloom-100 transition-colors"
                          >
                            Site Reply
                          </button>
                          {fb.email && (
                            <a
                              href={`mailto:${fb.email}?subject=Re:%20Thank%20you%20for%20your%20feedback!`}
                              className="px-2.5 py-1 bg-[#D96C65] text-white rounded-md font-bold text-[10px] hover:bg-[#c85b54] transition-colors"
                            >
                              Email Reply
                            </a>
                          )}
                          <button
                            onClick={() => {
                              if (window.confirm('Delete this feedback entry permanently?')) {
                                api.deleteFeedback(fb.id || fb._id).then(() => {
                                  const updated = feedbacks.filter(f => (f.id || f._id) !== (fb.id || fb._id));
                                  setFeedbacks(updated);
                                  addToast('Feedback deleted', 'info');
                                }).catch(() => addToast('Failed to delete feedback', 'error'));
                              }
                            }}
                            className="px-2.5 py-1 bg-red-50 text-red-600 border border-red-200 rounded-md font-bold text-[10px] hover:bg-red-100 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      {fb.adminReply && (
                        <div className="mt-2 p-2 bg-bloom-50 border border-bloom-100 rounded text-xs text-bloom-900">
                          <span className="font-bold text-[10px] uppercase text-bloom-600 block mb-0.5">Your Reply:</span>
                          {fb.adminReply}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        )}

        {/* ========================================================= */}
        {/* ========================================================= */}
        {/* TAB: CUSTOM ORDERS WORKFLOW */}
        {/* ========================================================= */}
        {activeTab === 'custom-orders' && (
          <main className="p-5 sm:p-7 space-y-6 max-w-7xl w-full">
            <div className="bg-white rounded-2xl p-5 border border-[#E9E2DC] shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
              <div>
                <h2 className="text-xl font-serif font-bold text-[#3E2B25]">
                  Custom Orders & Bespoke Inquiries ({customRequests.length})
                </h2>
                <p className="text-xs text-[#756A65] mt-0.5">
                  Manage personalized handmade commissions, custom bouquets, and special event quotes.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                {customRequests.length === 0 ? (
                  <div className="col-span-2 text-center py-12 bg-[#F8F6F3] rounded-2xl border border-dashed border-[#E9E2DC]">
                    <Sparkles className="w-8 h-8 text-[#D96C65] mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-bold text-[#3E2B25]">No custom orders yet</p>
                    <p className="text-xs text-[#756A65] mt-1">Custom orders and photo references from customers will appear here.</p>
                  </div>
                ) : (
                  customRequests.map(req => (
                    <div key={req.id || req._id} className="p-4 sm:p-5 rounded-2xl bg-[#F8F6F3] border border-[#E9E2DC] space-y-3.5 shadow-sm hover:shadow-md transition-shadow">
                      {/* Top Header */}
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-[#D96C65] bg-[#D96C65]/10 px-2 py-0.5 rounded-md inline-block mb-1">
                            #{req.id}
                          </span>
                          <h4 className="font-bold text-base text-[#3E2B25]">{req.itemType}</h4>
                          <p className="text-xs text-[#756A65]">
                            From: <strong className="text-[#3E2B25]">{req.customerName}</strong> {req.customerPhone && `(${req.customerPhone})`}
                          </p>
                          {req.customerEmail && (
                            <p className="text-[11px] text-[#756A65]">{req.customerEmail}</p>
                          )}
                        </div>
                        <span className="text-xs font-bold text-[#4F9D69] bg-[#4F9D69]/15 px-3 py-1 rounded-full whitespace-nowrap">
                          {req.estimatedBudget || 'Quote Requested'}
                        </span>
                      </div>

                      {/* Customer Reference Image (If Uploaded) */}
                      {req.referenceImage ? (
                        <div className="rounded-xl overflow-hidden border border-[#E9E2DC] bg-white p-2.5 space-y-2">
                          <div className="flex items-center justify-between text-xs font-bold text-[#D96C65]">
                            <span className="flex items-center gap-1.5">
                              <Camera className="w-3.5 h-3.5" />
                              Customer Reference Photo
                            </span>
                            <span className="text-[10px] text-[#756A65] font-normal">(Click to enlarge)</span>
                          </div>
                          <div
                            onClick={() => setSelectedCustomRequest(req)}
                            className="relative aspect-video sm:aspect-[16/9] max-h-48 rounded-lg overflow-hidden cursor-pointer group bg-warmgray-100 dark:bg-warmgray-800 border border-warmgray-200"
                          >
                            <img
                              src={req.referenceImage}
                              alt={`Reference for ${req.itemType}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5 backdrop-blur-[2px]">
                              <Eye className="w-4 h-4" />
                              <span>Click to Zoom Reference</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="py-1.5 px-3 rounded-lg bg-white/70 border border-dashed border-[#E9E2DC] text-[11px] text-[#756A65] flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-[#756A65]/60" />
                          <span>No reference image attached by customer</span>
                        </div>
                      )}

                      {/* Color Palette (If specified) */}
                      {req.colorPalette && Array.isArray(req.colorPalette) && req.colorPalette.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#756A65]">Palette:</span>
                          {req.colorPalette.map((col, cIdx) => (
                            <span key={cIdx} className="text-[11px] px-2 py-0.5 rounded-md bg-white border border-[#E9E2DC] text-[#3E2B25] font-medium flex items-center gap-1">
                              {col.startsWith('#') && (
                                <span className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block" style={{ backgroundColor: col }} />
                              )}
                              <span>{col}</span>
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Custom Specs & Notes Box */}
                      <div className="text-xs text-[#3E2B25] bg-white p-3 rounded-xl border border-[#E9E2DC] leading-relaxed">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#756A65] block mb-1">Specifications:</span>
                        <p className="whitespace-pre-line font-medium text-xs">
                          {req.specialNotes || 'Standard custom specifications'}
                        </p>
                      </div>

                      {/* Action Buttons: Delete + WhatsApp */}
                      <div className="flex justify-end items-center gap-2 pt-2 border-t border-[#E9E2DC]">
                        <button
                          type="button"
                          onClick={() => handleDeleteCustomRequest(req.id || req._id)}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-rose-200 transition-colors shadow-sm cursor-pointer"
                          title="Delete this custom order"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>

                        <a
                          href={`https://wa.me/${(req.customerPhone || '').replace(/\D/g, '') || ''}?text=Hi%20${encodeURIComponent(req.customerName || 'there')}%2C%20regarding%20your%20custom%20order%20%23${req.id}%20(${encodeURIComponent(req.itemType || 'item')})%20on%20AanuBlooms%3A`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-1.5 bg-[#4F9D69] hover:bg-[#438a5b] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Chat on WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Reference Image Lightbox / Full-View Modal */}
            {selectedCustomRequest && selectedCustomRequest.referenceImage && (
              <div
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
                onClick={() => setSelectedCustomRequest(null)}
              >
                <div
                  className="bg-white rounded-2xl max-w-3xl w-full p-5 sm:p-6 shadow-2xl border border-warmgray-200 relative animate-in zoom-in-95 space-y-4"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#E9E2DC]">
                    <div>
                      <h3 className="font-serif font-bold text-base text-[#3E2B25] flex items-center gap-2">
                        <Camera className="w-4 h-4 text-[#D96C65]" />
                        <span>Reference Photo — #{selectedCustomRequest.id}</span>
                      </h3>
                      <p className="text-xs text-[#756A65]">
                        {selectedCustomRequest.itemType} for {selectedCustomRequest.customerName} ({selectedCustomRequest.customerPhone})
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedCustomRequest(null)}
                      className="p-1.5 rounded-full hover:bg-warmgray-100 text-warmgray-500 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="py-2 flex items-center justify-center bg-warmgray-950 rounded-xl overflow-hidden max-h-[65vh]">
                    <img
                      src={selectedCustomRequest.referenceImage}
                      alt="Customer reference"
                      className="max-h-[60vh] w-auto object-contain rounded-lg shadow-lg"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#756A65]">
                    <p className="line-clamp-2 max-w-lg">
                      <strong className="text-[#3E2B25]">Notes:</strong> "{selectedCustomRequest.specialNotes}"
                    </p>
                    <a
                      href={selectedCustomRequest.referenceImage}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#D96C65] font-semibold hover:underline flex items-center gap-1 whitespace-nowrap"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Open Full Image in Tab
                    </a>
                  </div>
                </div>
              </div>
            )}
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
                    ₹{(orders.reduce((sum, o) => sum + (o.total || 0), 0) || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#756A65] block">Avg Spend / Buyer</span>
                  <span className="text-xl font-serif font-bold text-[#3E2B25] mt-0.5 block">
                    ₹{uniqueCustomersList.length ? Math.round((orders.reduce((sum, o) => sum + (o.total || 0), 0) / uniqueCustomersList.length) || 0).toLocaleString('en-IN') : 0}
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
                                ₹{(cust?.totalSpent || 0).toLocaleString('en-IN')}
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#3E2B25]">
                    Coupons & Promotional Offers
                  </h2>
                  <p className="text-xs text-[#756A65] mt-0.5">
                    Manage discount codes and seasonal craft promotions.
                  </p>
                </div>
                <button
                  onClick={() => { setEditingCoupon(null); setCouponForm({ code: '', discount: '', desc: '' }); setShowCouponModal(true); }}
                  className="px-4 py-2 bg-[#D96C65] hover:bg-[#C95B55] text-white rounded-xl text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Create Coupon</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {coupons.map(cp => (
                  <div key={cp.code} className="p-4 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] space-y-2 relative group">
                    <span className="px-3 py-1 bg-[#D96C65]/15 text-[#D96C65] font-mono font-bold text-sm rounded-lg inline-block">
                      {cp.code}
                    </span>
                    <p className="font-bold text-xs text-[#4F9D69]">{cp.discount}</p>
                    <p className="text-[11px] text-[#756A65]">{cp.desc}</p>
                    <div className="absolute top-3 right-3 flex opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                      <button onClick={() => { setEditingCoupon(cp); setCouponForm(cp); setShowCouponModal(true); }} className="p-1 rounded hover:bg-[#E9E2DC] text-[#756A65]" title="Edit Coupon"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDeleteCoupon(cp.code)} className="p-1 rounded hover:bg-red-50 text-red-500" title="Delete Coupon"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        )}

        {/* ========================================================= */}
        {/* TAB: MEDIA LIBRARY */}
        {/* ========================================================= */}
        {activeTab === 'media' && (
          <main className="p-5 sm:p-7 space-y-6 max-w-7xl w-full">
            <MediaLibraryManager />
          </main>
        )}

        {/* ========================================================= */}
        {/* TAB: STUDIO VIDEOS */}
        {/* ========================================================= */}
        {activeTab === 'studio-videos' && (
          <main className="p-5 sm:p-7 space-y-6 max-w-7xl w-full">
            <div className="bg-white rounded-2xl p-5 border border-[#E9E2DC] shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#3E2B25]">
                    Studio Video Gallery Manager
                  </h2>
                  <p className="text-xs text-[#756A65] mt-0.5">
                    Manage the reels and videos displayed in the "Behind the Creations" section of the homepage.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingVideo(null);
                    setVideoForm({
                      title: '',
                      caption: '',
                      url: '',
                      tag: '🌸 Studio Reel',
                      poster: '/images/aanu-blooms-signature-set.jpeg'
                    });
                    setShowVideoModal(true);
                  }}
                  className="px-4 py-2 bg-[#D96C65] hover:bg-[#C95B55] text-white rounded-xl text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Video</span>
                </button>
              </div>

              {studioVideos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {studioVideos.map((vid) => (
                    <div key={vid.id} className="rounded-2xl border border-[#E9E2DC] bg-[#F8F6F3] overflow-hidden flex flex-col justify-between">
                      {/* Video Preview or Poster */}
                      <div className="aspect-[9/13] bg-black relative flex items-center justify-center overflow-hidden max-h-[300px]">
                        <video
                          src={vid.url}
                          poster={vid.poster}
                          controls
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/65 text-white text-[10px] font-bold">
                          {vid.tag}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                        <div className="space-y-1">
                          <h4 className="font-bold text-sm text-[#3E2B25] line-clamp-1">{vid.title}</h4>
                          <p className="text-xs text-[#756A65] line-clamp-2 leading-relaxed">{vid.caption || 'No caption provided.'}</p>
                          <p className="text-[10px] text-[#756A65]/70 font-mono truncate" title={vid.url}>URL: {vid.url.substring(0, 50)}...</p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2 border-t border-[#E9E2DC]/50 mt-2">
                          <button
                            onClick={() => {
                              setEditingVideo(vid);
                              setVideoForm({
                                title: vid.title,
                                caption: vid.caption,
                                url: vid.url,
                                tag: vid.tag || '🌸 Studio Reel',
                                poster: vid.poster || '/images/aanu-blooms-signature-set.jpeg'
                              });
                              setShowVideoModal(true);
                            }}
                            className="flex-1 py-1.5 bg-white border border-[#E9E2DC] hover:bg-[#E9E2DC] text-[#3E2B25] text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-[#D96C65]" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteVideo(vid.id)}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors"
                            title="Delete Video"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-[#756A65] space-y-2 bg-[#F8F6F3] rounded-xl border border-dashed border-[#E9E2DC]">
                  <Video className="w-8 h-8 text-[#756A65]/40 mx-auto" />
                  <p>No studio videos found. Click "Add Video" to get started!</p>
                </div>
              )}
            </div>
          </main>
        )}

        {/* ========================================================= */}
        {/* TAB: REPORTS */}
        {/* ========================================================= */}
        {activeTab === 'reports' && (
          <main className="p-5 sm:p-7 space-y-6 max-w-7xl w-full">
            <div className="bg-white rounded-2xl p-5 border border-[#E9E2DC] shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
              <div>
                <h2 className="text-xl font-serif font-bold text-[#3E2B25]">
                  Advanced Reports
                </h2>
                <p className="text-xs text-[#756A65] mt-0.5">
                  View detailed sales analytics, product performance, and customer trends.
                </p>
              </div>

              <div className="p-8 text-center bg-[#F8F6F3] rounded-2xl border border-[#E9E2DC]">
                <BarChart3 className="w-8 h-8 text-[#756A65]/40 mx-auto mb-2" />
                <p className="text-xs text-[#756A65]">
                  Comprehensive analytics and exportable reports are being developed. Check back later!
                </p>
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
                  {editingProduct ? 'Edit Handcrafted Piece' : 'Add New handmade Product'}
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
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
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
                    ₹{(selectedCustomerDetails?.totalSpent || 0).toLocaleString('en-IN')}
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

      {/* Category Add/Edit Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl max-w-md w-full border border-[#E9E2DC] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9E2DC]">
              <h3 className="font-serif font-bold text-lg text-[#3E2B25]">
                {editingCategory ? 'Edit Category 🌸' : 'Add New Category 🌸'}
              </h3>
              <button onClick={() => { setShowCategoryModal(false); setEditingCategory(null); setCategoryForm({ name: "", slug: "", description: "", image: "/images/category/1st_category_flower.jpeg" }); }} className="p-1 text-[#756A65] hover:text-[#3E2B25]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#3E2B25] mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                    setCategoryForm({ ...categoryForm, name, slug });
                  }}
                  placeholder="e.g. Forever Bouquets"
                  className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25] font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3E2B25] mb-1">
                  Category Slug / ID
                </label>
                <input
                  type="text"
                  required
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                  placeholder="e.g. forever-bouquets"
                  className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] font-mono text-[#3E2B25]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3E2B25] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  placeholder="handcrafted pipe cleaner floral bouquets..."
                  className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25]"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-xs font-semibold text-[#3E2B25] mb-1">
                  Category Image
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={categoryForm.image}
                    onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                    placeholder="/images/category/1st_category_flower.jpeg"
                    className="flex-1 text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] font-mono"
                  />
                  <label className="cursor-pointer px-3.5 py-2.5 bg-[#D96C65] hover:bg-[#C95B55] text-white rounded-xl text-xs font-bold shrink-0 flex items-center gap-1 transition-colors">
                    <Camera className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCategoryPhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E9E2DC]">
                <button
                  type="button"
                  onClick={() => { setShowCategoryModal(false); setEditingCategory(null); setCategoryForm({ name: "", slug: "", description: "", image: "/images/category/1st_category_flower.jpeg" }); }}
                  className="px-4 py-2 text-xs font-semibold text-[#756A65]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D96C65] hover:bg-[#C95B55] text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  {editingCategory ? 'Update Category 🌸' : 'Add Category 🌸'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coupon Add/Edit Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl max-w-md w-full border border-[#E9E2DC] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9E2DC]">
              <h3 className="font-serif font-bold text-lg text-[#3E2B25]">
                {editingCoupon ? 'Edit Coupon 🎟️' : 'Create New Coupon 🎟️'}
              </h3>
              <button onClick={() => setShowCouponModal(false)} className="p-1 text-[#756A65] hover:text-[#3E2B25]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#3E2B25] mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. AANU15"
                  className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25] font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3E2B25] mb-1">
                  Discount Value *
                </label>
                <input
                  type="text"
                  required
                  value={couponForm.discount}
                  onChange={(e) => setCouponForm({ ...couponForm, discount: e.target.value })}
                  placeholder="e.g. 15% OFF or ₹200 OFF"
                  className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3E2B25] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={couponForm.desc}
                  onChange={(e) => setCouponForm({ ...couponForm, desc: e.target.value })}
                  placeholder="Welcome first order coupon"
                  className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E9E2DC]">
                <button
                  type="button"
                  onClick={() => setShowCouponModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#756A65]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D96C65] hover:bg-[#C95B55] text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* ========================================================= */}
      {/* ORDER & CRAFTING DETAILS MODAL POP-UP */}
      {/* ========================================================= */}
      {selectedOrderDetails && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedOrderDetails(null);
          }}
        >
          <div className="relative bg-white rounded-3xl max-w-2xl w-full border border-[#E9E2DC] shadow-2xl z-10 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#E9E2DC] flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#D96C65]/15 text-[#D96C65] font-bold text-lg flex items-center justify-center">
                  🧶
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#D96C65] text-base">#{selectedOrderDetails.id}</span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#4F9D69]/15 text-[#4F9D69] capitalize">
                      {selectedOrderDetails.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#756A65] mt-0.5">
                    Placed on {new Date(selectedOrderDetails.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setSelectedOrderDetails(null)} 
                className="p-2 rounded-xl bg-[#F8F6F3] hover:bg-[#E9E2DC] text-[#756A65] transition-colors"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto px-6 py-5 space-y-5 flex-1 text-xs">
              
              {/* Crafting Requirements Banner */}
              <div className="p-4 rounded-2xl bg-[#FDF8F5] border border-[#F3E5DC] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-sm text-[#3E2B25] flex items-center gap-2">
                    <span>🌸 Handcrafted Items Required to Make</span>
                    <span className="text-[10px] font-sans font-bold bg-[#D96C65] text-white px-2 py-0.5 rounded-full">
                      {selectedOrderDetails.items?.reduce((sum, i) => sum + (i.quantity || 1), 0) || 0} Total Pieces
                    </span>
                  </h4>
                </div>

                <div className="divide-y divide-[#E9E2DC]/80 bg-white rounded-xl border border-[#EDE5DF] overflow-hidden">
                  {selectedOrderDetails.items?.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between gap-3 hover:bg-[#F8F6F3]/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image || '/images/aanu-blooms-signature-set.jpeg'}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-contain bg-[#F8F6F3] p-1 border border-[#E9E2DC] shrink-0"
                        />
                        <div>
                          <h5 className="font-bold text-xs text-[#3E2B25]">{item.name}</h5>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] font-semibold text-[#D96C65]">
                              Qty: {item.quantity || 1}
                            </span>
                            {item.selectedColor && (
                              <span className="text-[10px] bg-[#F8F6F3] text-[#756A65] px-2 py-0.5 rounded-md border border-[#E9E2DC]">
                                🎨 Color: {item.selectedColor}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-serif font-bold text-xs text-[#3E2B25]">
                          ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                        </span>
                        <span className="block text-[10px] text-[#756A65]">
                          ₹{(item.price || 0).toLocaleString('en-IN')} each
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer & Shipping Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Customer Info */}
                <div className="p-4 rounded-2xl bg-[#F8F6F3] border border-[#E9E2DC] space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#756A65] block">
                    👤 Customer Details
                  </span>
                  <h5 className="font-bold text-xs text-[#3E2B25]">{selectedOrderDetails.customer?.name || 'N/A'}</h5>
                  <p className="text-[11px] text-[#756A65]">{selectedOrderDetails.customer?.email || 'N/A'}</p>
                  <p className="text-[11px] text-[#756A65] font-mono">📞 {selectedOrderDetails.customer?.phone || 'N/A'}</p>
                  
                  {selectedOrderDetails.customer?.phone && (
                    <a
                      href={`https://wa.me/${selectedOrderDetails.customer.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(selectedOrderDetails.customer.name || '')}%2C%20regarding%20your%20AanuBlooms%20order%20%23${selectedOrderDetails.id}...`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#4F9D69] text-white rounded-lg text-[11px] font-semibold mt-1 transition-colors hover:bg-[#3f8356]"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  )}
                </div>

                {/* Shipping Address */}
                <div className="p-4 rounded-2xl bg-[#F8F6F3] border border-[#E9E2DC] space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#756A65] block">
                    📍 Shipping Address
                  </span>
                  <p className="text-xs text-[#3E2B25] font-semibold leading-relaxed">
                    {selectedOrderDetails.customer?.address || 'No address provided'}
                  </p>
                  <p className="text-[11px] text-[#756A65]">
                    {selectedOrderDetails.customer?.city || 'Pune'}, {selectedOrderDetails.customer?.state || 'Maharashtra'} - {selectedOrderDetails.customer?.zip || ''}
                  </p>
                </div>
              </div>

              {/* Financial & Payment Summary */}
              <div className="p-4 rounded-2xl bg-[#F8F6F3] border border-[#E9E2DC] space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#756A65] block">
                  💳 Payment Breakdown
                </span>
                <div className="space-y-1 text-xs text-[#5C4D46]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{(selectedOrderDetails.subtotal || selectedOrderDetails.total || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping (Pune Region)</span>
                    <span>{selectedOrderDetails.shipping === 0 ? <strong className="text-[#4F9D69]">FREE</strong> : `₹${selectedOrderDetails.shipping || 0}`}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#E9E2DC] font-bold text-sm text-[#3E2B25]">
                    <span>Total Paid Amount</span>
                    <span className="font-serif text-[#D96C65]">₹{(selectedOrderDetails.total || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <div className="pt-2 text-[11px] flex items-center justify-between text-[#756A65]">
                  <span>Method: <strong>{selectedOrderDetails.paymentMethod || 'Razorpay / Online'}</strong></span>
                  <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${selectedOrderDetails.paymentStatus === 'paid' ? 'bg-[#4F9D69]/15 text-[#4F9D69]' : 'bg-amber-500/15 text-amber-600'}`}>
                    {selectedOrderDetails.paymentStatus === 'paid' ? 'Paid ✓' : 'Payment Pending'}
                  </span>
                </div>
              </div>

              {/* Quick Fulfillment Stage Change inside Modal */}
              <div className="p-4 rounded-2xl bg-white border border-[#E9E2DC] space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#756A65] block">
                  ⚙️ Update Fulfillment Stage
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'placed', label: '⏱️ Placed' },
                    { id: 'handcrafting', label: '🧶 Handcrafting' },
                    { id: 'packaging', label: '🌸 Packaging' },
                    { id: 'shipped', label: '📦 Shipped' },
                    { id: 'delivered', label: '🏡 Delivered' }
                  ].map(st => (
                    <button
                      key={st.id}
                      onClick={() => {
                        handleUpdateStatus(selectedOrderDetails.id, st.id);
                        setSelectedOrderDetails(prev => ({ ...prev, status: st.id }));
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        selectedOrderDetails.status === st.id
                          ? 'bg-[#D96C65] text-white font-bold shadow-xs'
                          : 'bg-[#F8F6F3] text-[#756A65] hover:bg-[#E9E2DC] hover:text-[#3E2B25]'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-[#E9E2DC] flex items-center justify-between bg-[#F8F6F3] shrink-0">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-white border border-[#E9E2DC] hover:bg-[#E9E2DC] text-[#3E2B25] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <FileText className="w-4 h-4 text-[#D96C65]" />
                <span>Print Craft Slip / Invoice</span>
              </button>

              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="px-5 py-2 bg-[#3E2B25] hover:bg-black text-white rounded-xl text-xs font-bold transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}



    {/* Video Manage Modal */}
      {showVideoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowVideoModal(false);
          }}
        >
          <div className="relative bg-white rounded-3xl max-w-md w-full border border-[#E9E2DC] shadow-2xl p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9E2DC]">
              <h3 className="font-serif font-bold text-lg text-[#3E2B25]">
                {editingVideo ? 'Edit Studio Video 🎥' : 'Add Studio Video 🎥'}
              </h3>
              <button
                onClick={() => {
                  setShowVideoModal(false);
                  setEditingVideo(null);
                }}
                className="p-1 text-[#756A65] hover:text-[#3E2B25]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVideo} className="space-y-4">
              {/* File Uploader */}
              <div className="p-4 rounded-2xl border-2 border-dashed border-[#D96C65]/30 bg-[#F8F6F3] space-y-2">
                <span className="text-xs font-bold text-[#3E2B25] flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-[#D96C65]" />
                  <span>Choose Video from Device</span>
                </span>
                <p className="text-[11px] text-[#756A65]">
                  Select any MP4, WEBM, or MOV video clip from your device.
                </p>

                <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 bg-[#D96C65] hover:bg-[#C95B55] text-white rounded-xl text-xs font-bold shadow-cozy mt-1 transition-colors">
                  <Video className="w-3.5 h-3.5" />
                  <span>Browse Device Files</span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoFileUpload}
                    className="hidden"
                  />
                </label>

                {videoForm.url && videoForm.url.startsWith('data:') && (
                  <div className="mt-2 p-2 bg-white rounded-xl border border-[#E9E2DC] flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#4F9D69] truncate">
                      ✓ Video file loaded successfully!
                    </span>
                  </div>
                )}
              </div>

              {/* Or Video URL */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#3E2B25]">
                  Or Paste Video URL / Path
                </label>
                <input
                  type="text"
                  value={videoForm.url}
                  onChange={(e) => setVideoForm({ ...videoForm, url: e.target.value })}
                  placeholder="e.g. /images/artisan-craft-video.mp4 or https://..."
                  className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25] focus:outline-none focus:border-[#D96C65]"
                />
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#3E2B25]">
                  Video Title *
                </label>
                <input
                  type="text"
                  required
                  value={videoForm.title}
                  onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                  placeholder="e.g. Crafting Pink Velvet Tulip Petals"
                  className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25] focus:outline-none focus:border-[#D96C65]"
                />
              </div>

              {/* Caption */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#3E2B25]">
                  Short Caption
                </label>
                <input
                  type="text"
                  value={videoForm.caption}
                  onChange={(e) => setVideoForm({ ...videoForm, caption: e.target.value })}
                  placeholder="e.g. Step-by-step slow handmade loop stitch."
                  className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25] focus:outline-none focus:border-[#D96C65]"
                />
              </div>

              {/* Tag */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#3E2B25]">
                  Video Badge Tag
                </label>
                <select
                  value={videoForm.tag}
                  onChange={(e) => setVideoForm({ ...videoForm, tag: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25] focus:outline-none focus:border-[#D96C65]"
                >
                  <option value="🌸 Studio Reel">🌸 Studio Reel</option>
                  <option value="🧶 Behind The creations">🧶 Behind The creations</option>
                  <option value="🎀 Gift Packaging">🎀 Gift Packaging</option>
                  <option value="✨ Flower Assembly">✨ Flower Assembly</option>
                  <option value="🪴 Showcase">🪴 Showcase</option>
                </select>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-[#E9E2DC]">
                <button
                  type="button"
                  onClick={() => {
                    setShowVideoModal(false);
                    setEditingVideo(null);
                  }}
                  className="px-4 py-2 text-xs font-bold text-[#756A65] hover:text-[#3E2B25]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#D96C65] hover:bg-[#C95B55] text-white rounded-full font-bold text-xs shadow-md transition-all hover:scale-[1.02]"
                >
                  {editingVideo ? 'Update Video' : 'Publish Video 🎥'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
