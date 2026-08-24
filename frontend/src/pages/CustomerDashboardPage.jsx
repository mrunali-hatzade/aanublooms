import React, { useState, useEffect } from 'react';
import {
  User,
  Package,
  MapPin,
  Heart,
  Palette,
  Settings,
  LogOut,
  Plus,
  Trash2,
  CheckCircle2,
  Truck,
  Sparkles,
  ShoppingBag,
  Printer,
  ChevronRight,
  ShieldCheck,
  Edit2,
  Calendar,
  Clock,
  Search,
  RotateCcw,
  Flower2,
  Layers,
  ArrowRight,
  Eye,
  EyeOff,
  X,
  AlertCircle,
  LayoutDashboard,
  Gift,
  Phone,
  Mail,
  Shield,
  KeyRound,
  Check,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { PrintableInvoice } from '../components/orders/PrintableInvoice';

export const CustomerDashboardPage = ({ onNavigate, initialTab = 'overview' }) => {
  const { user, login, logout, updateProfile, addAddress, deleteAddress, setDefaultAddress, openAuthModal } = useAuth();
  const { wishlistItems = [], removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState(initialTab); // 'overview' | 'orders' | 'custom-orders' | 'wishlist' | 'addresses' | 'profile' | 'security'
  const [orders, setOrders] = useState([]);
  const [customRequests, setCustomRequests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [selectedCustomDetails, setSelectedCustomDetails] = useState(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);
  const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  // Order Filters & Search
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Address Form State
  const [addressForm, setAddressForm] = useState({
    title: 'Home',
    name: user?.name || '',
    phone: user?.phone || '',
    address: '',
    city: 'Pune',
    state: 'Maharashtra',
    zip: '411038',
    country: 'India',
    isDefault: false
  });

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    city: user?.city || 'Pune',
    state: user?.state || 'Maharashtra',
    zip: user?.zip || '411038',
    avatar: user?.avatar || '',
    dob: ''
  });

  // Security / Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const indianStates = [
    'Andhra Pradesh', 'Assam', 'Bihar', 'Delhi NCR', 'Goa', 'Gujarat',
    'Haryana', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
    'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'
  ];

  // Sync user profile state
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        city: user.city || 'Pune',
        state: user.state || 'Maharashtra',
        zip: user.zip || '411038',
        avatar: user.avatar || '',
        dob: user.dob || ''
      });
      setAddressForm(prev => ({
        ...prev,
        name: user.name || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  // Fetch real order & custom creation data
  useEffect(() => {
    const fetchCustomerData = async () => {
      setIsLoading(true);
      try {
        const [ordersRes, customRes, catsRes] = await Promise.all([
          api.getOrders(),
          api.getCustomRequests(),
          api.getCategories()
        ]);
        
        const allOrders = Array.isArray(ordersRes.data) ? ordersRes.data : [];
        const userOrders = user?.email
          ? allOrders.filter(o => {
              const custEmail = (o.customer?.email || '').toLowerCase();
              const custName = (o.customer?.name || '').toLowerCase();
              const userEmail = (user.email || '').toLowerCase();
              const userName = (user.name || '').toLowerCase();
              const userFirst = userName ? userName.split(' ')[0] : '';
              return (custEmail && custEmail === userEmail) || (userFirst && custName && custName.includes(userFirst));
            })
          : allOrders;
        setOrders(userOrders);

        const allCustom = Array.isArray(customRes.data) ? customRes.data : [];
        const userCustom = user?.email
          ? allCustom.filter(c => {
              const cEmail = (c.customerEmail || c.email || '').toLowerCase();
              const cName = (c.customerName || c.name || '').toLowerCase();
              const userEmail = (user.email || '').toLowerCase();
              const userName = (user.name || '').toLowerCase();
              const userFirst = userName ? userName.split(' ')[0] : '';
              return (cEmail && cEmail === userEmail) || (userFirst && cName && cName.includes(userFirst));
            })
          : allCustom;
        setCustomRequests(userCustom);

        setCategories(catsRes.data || []);
      } catch (err) {
        console.error('Error fetching customer data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomerData();
  }, [user]);

  // Handle Guest / Unauthenticated State
  if (!user) {
    return (
      <div className="py-16 max-w-md mx-auto px-4 text-center">
        <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-8 border border-warmgray-200 dark:border-warmgray-800 shadow-soft-lg space-y-5 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-3xl bg-bloom-100 dark:bg-warmgray-800 text-bloom-600 dark:text-bloom-400 mx-auto flex items-center justify-center shadow-xs">
            <User className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-bloom-600 dark:text-bloom-400 block mb-1">
              Boutique Account
            </span>
            <h2 className="text-2xl font-serif font-bold text-warmgray-900 dark:text-white">
              Customer Dashboard
            </h2>
            <p className="text-xs text-warmgray-500 dark:text-warmgray-400 mt-1 max-w-sm mx-auto leading-relaxed">
              Please sign in with Google or Email to view your active creations, past purchases, saved addresses, and wishlist.
            </p>
          </div>

          <button
            onClick={() => openAuthModal('login')}
            className="w-full py-3 bg-gradient-to-r from-bloom-500 to-rosewood-500 hover:from-bloom-600 hover:to-rosewood-600 text-white rounded-2xl font-bold text-xs shadow-cozy transition-transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <User className="w-4 h-4" />
            <span>Sign In / Create Account</span>
          </button>
        </div>
      </div>
    );
  }

  // Active in-progress orders
  const activeOrders = orders.filter(o => o.status?.toLowerCase() !== 'delivered' && o.status?.toLowerCase() !== 'cancelled');
  const primaryActiveOrder = activeOrders[0] || orders[0] || null;

  // Handler: Reorder items into Basket
  const handleReorder = (order) => {
    if (!order.items || order.items.length === 0) return;
    order.items.forEach(item => {
      addToCart(item, item.quantity || 1, {
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize
      });
    });
    addToast(`Re-added ${order.items.length} items from #${order.id} to Basket! 🛍️`, 'success');
  };

  // Handler: Save / Edit Address
  const handleSaveAddressSubmit = (e) => {
    e.preventDefault();
    if (!addressForm.address || !addressForm.name) {
      addToast('Please fill in your recipient name and full street address.', 'error');
      return;
    }

    if (editingAddressId) {
      // Edit existing
      const updatedList = (user.savedAddresses || []).map(a => 
        a.id === editingAddressId ? { ...a, ...addressForm } : a
      );
      updateProfile({ savedAddresses: updatedList });
      addToast('Address updated successfully! 📍', 'success');
    } else {
      // Add new
      addAddress(addressForm);
    }

    setShowAddAddressModal(false);
    setEditingAddressId(null);
    setAddressForm({
      title: 'Home',
      name: user?.name || '',
      phone: user?.phone || '',
      address: '',
      city: 'Pune',
      state: 'Maharashtra',
      zip: '411038',
      country: 'India',
      isDefault: false
    });
  };

  // Handler: Open Edit Address Modal
  const handleEditAddressClick = (addr) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      title: addr.title || 'Home',
      name: addr.name || user?.name || '',
      phone: addr.phone || user?.phone || '',
      address: addr.address || '',
      city: addr.city || 'Pune',
      state: addr.state || 'Maharashtra',
      zip: addr.zip || '411038',
      country: 'India',
      isDefault: Boolean(addr.isDefault)
    });
    setShowAddAddressModal(true);
  };

  // Handler: Save Profile Details
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfile(profileForm);
    addToast('Profile details updated successfully! 🌸', 'success');
  };

  // Handler: Change Password
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword) {
      addToast('Please enter your current password.', 'error');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      addToast('New password must be at least 6 characters.', 'error');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      addToast('New passwords do not match.', 'error');
      return;
    }
    
    // Update password in user profile
    updateProfile({ password: passwordForm.newPassword });
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    addToast('Password updated securely! 🔒', 'success');
  };

  // Timeline stage status badge generator
  const getStageBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold">🏡 Delivered</span>;
      case 'shipped':
        return <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-[11px] font-bold">📦 Out for Delivery</span>;
      case 'handcrafting':
      case 'being crafted':
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[11px] font-bold">🧶 Being Crafted</span>;
      case 'packaging':
      case 'ready to ship':
        return <span className="px-2.5 py-0.5 rounded-full bg-rosewood-100 dark:bg-rosewood-950 text-rosewood-800 dark:text-rosewood-300 text-[11px] font-bold">🌸 Ready to Ship</span>;
      case 'cancelled':
        return <span className="px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 text-[11px] font-bold">✕ Cancelled</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full bg-warmgray-100 dark:bg-warmgray-800 text-warmgray-800 dark:text-warmgray-200 text-[11px] font-bold">⏱️ Order Confirmed</span>;
    }
  };

  // Filtered orders list
  const filteredOrders = orders.filter(o => {
    const s = o.status?.toLowerCase() || '';
    const matchesStatus =
      orderStatusFilter === 'all' ||
      (orderStatusFilter === 'delivered' && s === 'delivered') ||
      (orderStatusFilter === 'shipped' && s === 'shipped') ||
      (orderStatusFilter === 'handcrafting' && (s === 'handcrafting' || s === 'being crafted')) ||
      (orderStatusFilter === 'processing' && (s === 'placed' || s === 'confirmed' || s === 'processing')) ||
      (orderStatusFilter === 'cancelled' && s === 'cancelled');
    
    const matchesSearch =
      !orderSearch.trim() ||
      o.id?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.items?.some(i => i.name?.toLowerCase().includes(orderSearch.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  // Calculate initials for avatar
  const customerInitials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'AB';

  return (
    <div className="py-6 sm:py-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

      {/* MOBILE NAVIGATION TABS (Horizontal Scrollable) */}
      <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-warmgray-200 dark:border-warmgray-800">
        {[
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'orders', label: 'My Orders', icon: Package, count: orders.length },
          { id: 'custom-orders', label: 'Custom Orders', icon: Palette, count: customRequests.length },
          { id: 'wishlist', label: 'Wishlist', icon: Heart, count: wishlistItems.length },
          { id: 'addresses', label: 'Addresses', icon: MapPin },
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'security', label: 'Security', icon: ShieldCheck }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                isActive
                  ? 'bg-bloom-500 text-white shadow-xs'
                  : 'bg-white dark:bg-warmgray-800 text-warmgray-700 dark:text-warmgray-300 border border-warmgray-200 dark:border-warmgray-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-warmgray-200 dark:bg-warmgray-700 text-warmgray-800 dark:text-warmgray-200'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 2-COLUMN DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: CUSTOMER PROFILE CARD & NAVIGATION (Desktop Sidebar) */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Customer Profile Summary Card */}
          <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-6 border border-warmgray-200 dark:border-warmgray-800 shadow-soft space-y-4">
            <div className="flex items-center gap-4">
              {user.avatar && !user.avatar.includes('initials') ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-bloom-400 shadow-xs shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-bloom-500 via-pink-500 to-rosewood-500 text-white font-serif font-bold text-xl flex items-center justify-center shadow-cozy shrink-0">
                  {customerInitials}
                </div>
              )}

              <div className="min-w-0">
                <h3 className="font-serif font-bold text-lg text-warmgray-900 dark:text-white truncate">
                  {user.name}
                </h3>
                <p className="text-xs text-warmgray-500 dark:text-warmgray-400 truncate">
                  {user.email}
                </p>
                <div className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-bloom-50 dark:bg-bloom-950/60 border border-bloom-200 dark:border-bloom-800 text-bloom-700 dark:text-bloom-300 text-[10px] font-bold">
                  <span>✓</span>
                  <span>Boutique Member</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-warmgray-100 dark:border-warmgray-800 flex justify-between text-xs text-warmgray-500">
              <span>Member since:</span>
              <strong className="text-warmgray-800 dark:text-warmgray-200">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'August 2026'}
              </strong>
            </div>
          </div>

          {/* Desktop Navigation Links Card */}
          <div className="hidden lg:block bg-white dark:bg-warmgray-900 rounded-3xl p-3 border border-warmgray-200 dark:border-warmgray-800 shadow-soft space-y-1">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard, desc: 'Account at a glance' },
              { id: 'orders', label: 'My Orders', icon: Package, count: orders.length, desc: 'Orders & receipts' },
              { id: 'custom-orders', label: 'Custom Orders', icon: Palette, count: customRequests.length, desc: 'Bespoke commissions' },
              { id: 'wishlist', label: 'My Wishlist', icon: Heart, count: wishlistItems.length, desc: 'Saved forever pieces' },
              { id: 'addresses', label: 'Saved Addresses', icon: MapPin, count: (user.savedAddresses || []).length, desc: 'Delivery locations' },
              { id: 'profile', label: 'Profile Settings', icon: User, desc: 'Name, phone & details' },
              { id: 'security', label: 'Security', icon: ShieldCheck, desc: 'Password & login safety' }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-bloom-500 to-rosewood-500 text-white shadow-cozy font-bold'
                      : 'text-warmgray-700 dark:text-warmgray-300 hover:bg-warmgray-50 dark:hover:bg-warmgray-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-warmgray-400'}`} />
                    <div className="text-left">
                      <span className="block leading-tight">{tab.label}</span>
                      <span className={`text-[10px] font-normal ${isActive ? 'text-rose-100' : 'text-warmgray-400'}`}>
                        {tab.desc}
                      </span>
                    </div>
                  </div>

                  {tab.count !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      isActive ? 'bg-white/25 text-white' : 'bg-warmgray-100 dark:bg-warmgray-800 text-warmgray-600 dark:text-warmgray-400'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Logout Button */}
            <div className="pt-2 mt-2 border-t border-warmgray-100 dark:border-warmgray-800">
              <button
                onClick={() => setShowLogoutConfirmModal(true)}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: MAIN DASHBOARD CONTENT AREA */}
        <div className="lg:col-span-8 space-y-6">

          {/* ======================================================== */}
          {/* TAB 1: OVERVIEW */}
          {/* ======================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in">
              
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-bloom-500 via-bloom-600 to-rosewood-500 rounded-3xl p-6 sm:p-8 text-white shadow-soft relative overflow-hidden">
                <div className="relative z-10 max-w-xl">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold tracking-wider uppercase mb-2 backdrop-blur-sm">
                    <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                    Handcrafted Boutique Hub
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
                    Welcome back, {user.name ? user.name.split(' ')[0] : 'Customer'} ♡
                  </h1>
                  <p className="text-xs sm:text-sm text-rose-100 mt-1 leading-relaxed">
                    Here's everything happening with your handmade floral creations & orders.
                  </p>
                </div>
              </div>

              {/* 4 Clean Account Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {/* 1. Total Orders */}
                <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-4 sm:p-5 border border-warmgray-200 dark:border-warmgray-800 shadow-soft text-center space-y-2 hover:shadow-md transition-shadow">
                  <div className="w-9 h-9 rounded-2xl bg-bloom-50 dark:bg-warmgray-800 text-bloom-600 dark:text-bloom-400 mx-auto flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-2xl font-serif font-bold text-warmgray-900 dark:text-white block">
                      {orders.length}
                    </span>
                    <span className="text-[11px] text-warmgray-500 font-semibold block">Total Orders</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-[11px] font-bold text-bloom-600 dark:text-bloom-400 hover:underline inline-flex items-center gap-0.5"
                  >
                    <span>View Orders</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                {/* 2. In Progress */}
                <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-4 sm:p-5 border border-warmgray-200 dark:border-warmgray-800 shadow-soft text-center space-y-2 hover:shadow-md transition-shadow">
                  <div className="w-9 h-9 rounded-2xl bg-amber-50 dark:bg-warmgray-800 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-2xl font-serif font-bold text-warmgray-900 dark:text-white block">
                      {activeOrders.length}
                    </span>
                    <span className="text-[11px] text-warmgray-500 font-semibold block">In Progress</span>
                  </div>
                  <button
                    onClick={() => {
                      setOrderStatusFilter('all');
                      setActiveTab('orders');
                    }}
                    className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-0.5"
                  >
                    <span>Track Active</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                {/* 3. Wishlist */}
                <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-4 sm:p-5 border border-warmgray-200 dark:border-warmgray-800 shadow-soft text-center space-y-2 hover:shadow-md transition-shadow">
                  <div className="w-9 h-9 rounded-2xl bg-rose-50 dark:bg-warmgray-800 text-rosewood-500 mx-auto flex items-center justify-center">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-2xl font-serif font-bold text-warmgray-900 dark:text-white block">
                      {wishlistItems.length}
                    </span>
                    <span className="text-[11px] text-warmgray-500 font-semibold block">Wishlist</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('wishlist')}
                    className="text-[11px] font-bold text-rosewood-600 dark:text-rosewood-400 hover:underline inline-flex items-center gap-0.5"
                  >
                    <span>View Wishlist</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                {/* 4. Custom Orders */}
                <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-4 sm:p-5 border border-warmgray-200 dark:border-warmgray-800 shadow-soft text-center space-y-2 hover:shadow-md transition-shadow">
                  <div className="w-9 h-9 rounded-2xl bg-purple-50 dark:bg-warmgray-800 text-purple-600 dark:text-purple-400 mx-auto flex items-center justify-center">
                    <Palette className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-2xl font-serif font-bold text-warmgray-900 dark:text-white block">
                      {customRequests.length}
                    </span>
                    <span className="text-[11px] text-warmgray-500 font-semibold block">Custom Orders</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('custom-orders')}
                    className="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline inline-flex items-center gap-0.5"
                  >
                    <span>View Custom</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* CURRENT ORDER TRACKER CARD */}
              <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-6 border border-warmgray-200 dark:border-warmgray-800 shadow-soft space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-warmgray-100 dark:border-warmgray-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-bloom-100 dark:bg-bloom-950 text-bloom-600 dark:text-bloom-400 flex items-center justify-center">
                      <Flower2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-base text-warmgray-900 dark:text-white">
                        Active Order Status
                      </h3>
                      <p className="text-[11px] text-warmgray-500">Live craft & fulfillment stage</p>
                    </div>
                  </div>

                  {primaryActiveOrder && (
                    <span className="font-mono text-xs font-bold text-bloom-600 dark:text-bloom-400">
                      #{primaryActiveOrder.id}
                    </span>
                  )}
                </div>

                {primaryActiveOrder ? (
                  <div className="space-y-5">
                    {/* Active Order Item Preview */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-warmgray-50 dark:bg-warmgray-800/60 border border-warmgray-100 dark:border-warmgray-700">
                      <div className="flex items-center gap-3.5">
                        {primaryActiveOrder.items?.[0]?.image ? (
                          <img
                            src={primaryActiveOrder.items[0].image}
                            alt={primaryActiveOrder.items[0].name}
                            className="w-14 h-14 rounded-2xl object-cover border border-warmgray-200 shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-2xl bg-bloom-100 text-bloom-600 flex items-center justify-center font-bold text-sm shrink-0">
                            🌸
                          </div>
                        )}

                        <div>
                          <h4 className="font-serif font-bold text-sm text-warmgray-900 dark:text-white">
                            {primaryActiveOrder.items?.[0]?.name || 'Handcrafted Forever Bloom'}
                          </h4>
                          <p className="text-xs text-warmgray-500">
                            Qty: {primaryActiveOrder.items?.[0]?.quantity || 1} · {primaryActiveOrder.items?.[0]?.selectedColor || 'Custom Shade'}
                          </p>
                          <span className="font-serif font-bold text-sm text-bloom-600 dark:text-bloom-400 mt-0.5 block">
                            ₹{(primaryActiveOrder.total || 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        {getStageBadge(primaryActiveOrder.status)}
                        <span className="text-[11px] text-warmgray-500 block mt-1">
                          Delivery: Pune Region
                        </span>
                      </div>
                    </div>

                    {/* Horizontal Step Timeline on Desktop / Vertical on Mobile */}
                    <div className="pt-2">
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                        {[
                          { title: 'Order Placed', step: 1 },
                          { title: 'Order Confirmed', step: 2 },
                          { title: '🧶 Being Crafted', step: 3 },
                          { title: 'Ready to Ship', step: 4 },
                          { title: '🏡 Delivered', step: 5 }
                        ].map((st, idx) => {
                          const currentStep = 
                            primaryActiveOrder.status?.toLowerCase() === 'delivered' ? 5 :
                            primaryActiveOrder.status?.toLowerCase() === 'shipped' ? 4 :
                            primaryActiveOrder.status?.toLowerCase() === 'handcrafting' || primaryActiveOrder.status?.toLowerCase() === 'being crafted' ? 3 :
                            primaryActiveOrder.status?.toLowerCase() === 'packaging' ? 4 : 2;

                          const isComplete = currentStep >= st.step;
                          const isCurrent = currentStep === st.step;

                          return (
                            <div key={idx} className="space-y-1.5 p-2 rounded-xl bg-warmgray-50 dark:bg-warmgray-800/40">
                              <div className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center text-[10px] font-bold ${
                                isComplete
                                  ? 'bg-bloom-500 text-white shadow-xs'
                                  : 'bg-warmgray-200 text-warmgray-500'
                              }`}>
                                {isComplete ? '✓' : st.step}
                              </div>
                              <span className={`block font-semibold text-[11px] ${
                                isCurrent ? 'text-bloom-600 dark:text-bloom-400 font-bold' : isComplete ? 'text-warmgray-800 dark:text-warmgray-200' : 'text-warmgray-400'
                              }`}>
                                {st.title}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <p className="text-xs text-center text-warmgray-500 dark:text-warmgray-400 mt-3 italic">
                        "Your handmade piece is thoughtfully crafted by hand with patience and care."
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-warmgray-100 dark:border-warmgray-800">
                      <button
                        onClick={() => setSelectedOrderDetails(primaryActiveOrder)}
                        className="px-4 py-2 bg-bloom-500 hover:bg-bloom-600 text-white rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>View Order Details</span>
                      </button>

                      <button
                        onClick={() => setSelectedInvoiceOrder(primaryActiveOrder)}
                        className="px-4 py-2 bg-warmgray-100 hover:bg-warmgray-200 dark:bg-warmgray-800 text-warmgray-800 dark:text-warmgray-200 rounded-xl font-semibold text-xs transition-colors flex items-center gap-1.5"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Receipt / Invoice</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center space-y-3">
                    <p className="text-xs text-warmgray-500">No orders currently in progress.</p>
                    <button
                      onClick={() => onNavigate('shop')}
                      className="px-5 py-2.5 bg-bloom-500 hover:bg-bloom-600 text-white rounded-full font-bold text-xs shadow-cozy"
                    >
                      Explore Handmade Collection 🌸
                    </button>
                  </div>
                )}
              </div>

              {/* RECENT ORDERS LIST */}
              <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-6 border border-warmgray-200 dark:border-warmgray-800 shadow-soft space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-warmgray-100 dark:border-warmgray-800">
                  <h3 className="font-serif font-bold text-base text-warmgray-900 dark:text-white">
                    Recent Orders
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-bloom-600 dark:text-bloom-400 hover:underline inline-flex items-center gap-1"
                  >
                    <span>View All Orders ({orders.length})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {orders.length > 0 ? (
                  <div className="space-y-3">
                    {orders.slice(0, 3).map((ord) => (
                      <div
                        key={ord.id}
                        className="p-4 rounded-2xl bg-warmgray-50/70 dark:bg-warmgray-800/40 border border-warmgray-100 dark:border-warmgray-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          {ord.items?.[0]?.image ? (
                            <img
                              src={ord.items[0].image}
                              alt={ord.items[0].name}
                              className="w-12 h-12 rounded-xl object-cover border border-warmgray-200 shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-bloom-100 text-bloom-600 flex items-center justify-center font-bold text-xs shrink-0">
                              🌸
                            </div>
                          )}

                          <div>
                            <div className="flex items-center gap-2">
                              <strong className="font-mono text-xs text-warmgray-900 dark:text-white">
                                #{ord.id}
                              </strong>
                              <span className="text-[11px] text-warmgray-400">
                                {new Date(ord.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                              </span>
                            </div>
                            <p className="text-xs text-warmgray-600 dark:text-warmgray-300 font-medium truncate max-w-[200px] sm:max-w-xs">
                              {ord.items?.[0]?.name} {ord.items?.length > 1 ? `+${ord.items.length - 1} more` : ''}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-warmgray-200 dark:border-warmgray-700">
                          <div className="text-left sm:text-right">
                            <span className="font-serif font-bold text-sm text-warmgray-900 dark:text-white block">
                              ₹{(ord.total || 0).toLocaleString('en-IN')}
                            </span>
                            {getStageBadge(ord.status)}
                          </div>

                          <button
                            onClick={() => setSelectedOrderDetails(ord)}
                            className="px-3 py-1.5 bg-white dark:bg-warmgray-700 hover:bg-warmgray-100 border border-warmgray-200 dark:border-warmgray-600 rounded-xl text-xs font-semibold text-warmgray-800 dark:text-warmgray-200 transition-colors"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-warmgray-500">
                    Your first handmade piece is waiting.
                  </div>
                )}
              </div>

              {/* QUICK ACTIONS ROW */}
              <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-5 border border-warmgray-200 dark:border-warmgray-800 shadow-soft">
                <span className="text-[10px] font-bold uppercase tracking-wider text-warmgray-400 block mb-3">
                  Quick Actions
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    onClick={() => onNavigate('shop')}
                    className="p-3 rounded-2xl bg-warmgray-50 hover:bg-bloom-50 dark:bg-warmgray-800 dark:hover:bg-warmgray-700 text-left transition-colors border border-warmgray-100 dark:border-warmgray-700 group"
                  >
                    <ShoppingBag className="w-4 h-4 text-bloom-500 mb-1.5 group-hover:scale-110 transition-transform" />
                    <strong className="block text-xs text-warmgray-900 dark:text-white font-bold">Shop Catalog</strong>
                    <span className="text-[10px] text-warmgray-500">Explore blooms</span>
                  </button>

                  <button
                    onClick={() => onNavigate('custom-order')}
                    className="p-3 rounded-2xl bg-warmgray-50 hover:bg-purple-50 dark:bg-warmgray-800 dark:hover:bg-warmgray-700 text-left transition-colors border border-warmgray-100 dark:border-warmgray-700 group"
                  >
                    <Palette className="w-4 h-4 text-purple-500 mb-1.5 group-hover:scale-110 transition-transform" />
                    <strong className="block text-xs text-warmgray-900 dark:text-white font-bold">Custom Piece</strong>
                    <span className="text-[10px] text-warmgray-500">Bespoke order</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('wishlist')}
                    className="p-3 rounded-2xl bg-warmgray-50 hover:bg-rose-50 dark:bg-warmgray-800 dark:hover:bg-warmgray-700 text-left transition-colors border border-warmgray-100 dark:border-warmgray-700 group"
                  >
                    <Heart className="w-4 h-4 text-rosewood-500 mb-1.5 group-hover:scale-110 transition-transform" />
                    <strong className="block text-xs text-warmgray-900 dark:text-white font-bold">View Wishlist</strong>
                    <span className="text-[10px] text-warmgray-500">{wishlistItems.length} saved pieces</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('addresses')}
                    className="p-3 rounded-2xl bg-warmgray-50 hover:bg-amber-50 dark:bg-warmgray-800 dark:hover:bg-warmgray-700 text-left transition-colors border border-warmgray-100 dark:border-warmgray-700 group"
                  >
                    <MapPin className="w-4 h-4 text-amber-500 mb-1.5 group-hover:scale-110 transition-transform" />
                    <strong className="block text-xs text-warmgray-900 dark:text-white font-bold">Saved Address</strong>
                    <span className="text-[10px] text-warmgray-500">Pune Delivery</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: MY ORDERS */}
          {/* ======================================================== */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-6 border border-warmgray-200 dark:border-warmgray-800 shadow-soft">
                <div className="pb-4 border-b border-warmgray-100 dark:border-warmgray-800">
                  <h2 className="font-serif font-bold text-2xl text-warmgray-900 dark:text-white">
                    My Orders
                  </h2>
                  <p className="text-xs text-warmgray-500 dark:text-warmgray-400 mt-1">
                    Track your handmade creations and revisit your purchases.
                  </p>
                </div>

                {/* Filter and Search Bar */}
                <div className="pt-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
                  {/* Status Pills */}
                  <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto scrollbar-none">
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'processing', label: 'Processing' },
                      { id: 'handcrafting', label: 'Being Crafted' },
                      { id: 'shipped', label: 'Shipped' },
                      { id: 'delivered', label: 'Delivered' }
                    ].map((flt) => (
                      <button
                        key={flt.id}
                        onClick={() => setOrderStatusFilter(flt.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                          orderStatusFilter === flt.id
                            ? 'bg-bloom-500 text-white shadow-xs'
                            : 'bg-warmgray-100 dark:bg-warmgray-800 text-warmgray-600 dark:text-warmgray-300'
                        }`}
                      >
                        {flt.label}
                      </button>
                    ))}
                  </div>

                  {/* Search Box */}
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-warmgray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search order # or item..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="w-full text-xs py-2 pl-8 pr-3 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-bloom-400"
                    />
                  </div>
                </div>
              </div>

              {/* Order Cards List */}
              {filteredOrders.length > 0 ? (
                <div className="space-y-4">
                  {filteredOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-white dark:bg-warmgray-900 rounded-3xl p-5 sm:p-6 border border-warmgray-200 dark:border-warmgray-800 shadow-soft space-y-4 hover:shadow-md transition-shadow"
                    >
                      {/* Card Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-warmgray-100 dark:border-warmgray-800 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-sm text-warmgray-900 dark:text-white">
                            #{ord.id}
                          </span>
                          <span className="text-warmgray-400">·</span>
                          <span className="text-warmgray-500">
                            {new Date(ord.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase">
                            Paid ({ord.paymentMethod || 'Online'})
                          </span>
                          {getStageBadge(ord.status)}
                        </div>
                      </div>

                      {/* Items Row */}
                      <div className="space-y-3">
                        {ord.items?.map((item, i) => (
                          <div key={i} className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-12 h-12 rounded-xl object-cover border border-warmgray-200 shrink-0"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-xl bg-bloom-100 text-bloom-600 flex items-center justify-center text-sm shrink-0">
                                  🌸
                                </div>
                              )}
                              <div>
                                <h4 className="font-serif font-bold text-xs sm:text-sm text-warmgray-900 dark:text-white">
                                  {item.name}
                                </h4>
                                <p className="text-[11px] text-warmgray-500">
                                  Qty: {item.quantity || 1} {item.selectedColor ? `· ${item.selectedColor}` : ''}
                                </p>
                              </div>
                            </div>
                            <span className="font-serif font-bold text-xs sm:text-sm text-warmgray-900 dark:text-white">
                              ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-3 border-t border-warmgray-100 dark:border-warmgray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-warmgray-400 block">Total Amount</span>
                          <span className="font-serif font-bold text-base text-bloom-600 dark:text-bloom-400">
                            ₹{(ord.total || 0).toLocaleString('en-IN')}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setSelectedOrderDetails(ord)}
                            className="px-4 py-2 bg-warmgray-100 hover:bg-warmgray-200 dark:bg-warmgray-800 text-warmgray-800 dark:text-warmgray-200 rounded-xl text-xs font-semibold transition-colors"
                          >
                            View Details
                          </button>

                          <button
                            onClick={() => handleReorder(ord)}
                            className="px-4 py-2 bg-bloom-500 hover:bg-bloom-600 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reorder</span>
                          </button>

                          <button
                            onClick={() => setSelectedInvoiceOrder(ord)}
                            className="px-3 py-2 bg-warmgray-50 hover:bg-warmgray-100 dark:bg-warmgray-800/80 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-700 dark:text-warmgray-300 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Invoice</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-12 text-center border border-warmgray-200 dark:border-warmgray-800 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-bloom-50 text-bloom-500 mx-auto flex items-center justify-center">
                    <Package className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-warmgray-900 dark:text-white">
                    No orders found
                  </h3>
                  <p className="text-xs text-warmgray-500 max-w-sm mx-auto">
                    Your first handmade piece is waiting in our collection.
                  </p>
                  <button
                    onClick={() => onNavigate('shop')}
                    className="px-6 py-2.5 bg-bloom-500 hover:bg-bloom-600 text-white rounded-full font-bold text-xs shadow-cozy"
                  >
                    Explore Shop 🌸
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: CUSTOM ORDERS */}
          {/* ======================================================== */}
          {activeTab === 'custom-orders' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-6 border border-warmgray-200 dark:border-warmgray-800 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif font-bold text-2xl text-warmgray-900 dark:text-white">
                    My Custom Creations
                  </h2>
                  <p className="text-xs text-warmgray-500 dark:text-warmgray-400 mt-1">
                    Personalized pieces made especially for you by Artisan Aanu.
                  </p>
                </div>

                <button
                  onClick={() => onNavigate('custom-order')}
                  className="px-5 py-2.5 bg-gradient-to-r from-bloom-500 to-rosewood-500 hover:from-bloom-600 text-white rounded-xl font-bold text-xs shadow-cozy flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Custom Request</span>
                </button>
              </div>

              {customRequests.length > 0 ? (
                <div className="space-y-4">
                  {customRequests.map((req) => (
                    <div
                      key={req.id}
                      className="bg-white dark:bg-warmgray-900 rounded-3xl p-5 sm:p-6 border border-warmgray-200 dark:border-warmgray-800 shadow-soft space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-warmgray-100 dark:border-warmgray-800 text-xs">
                        <div>
                          <strong className="font-mono text-xs text-warmgray-900 dark:text-white">#{req.id}</strong>
                          <span className="text-warmgray-400 ml-2">
                            {new Date(req.createdAt || Date.now()).toLocaleDateString('en-IN')}
                          </span>
                        </div>

                        <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 text-[11px] font-bold capitalize">
                          ✨ {req.status || 'In Review'}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 items-start">
                        {req.referenceImage && (
                          <img
                            src={req.referenceImage}
                            alt="Custom Reference"
                            className="w-20 h-20 rounded-2xl object-cover border border-warmgray-200 shrink-0"
                          />
                        )}

                        <div className="space-y-1 text-xs">
                          <h4 className="font-serif font-bold text-sm text-warmgray-900 dark:text-white">
                            {req.productType || req.title || 'Bespoke Floral Piece'}
                          </h4>
                          <p className="text-warmgray-600 dark:text-warmgray-300 leading-relaxed">
                            {req.notes || req.description || 'Custom arrangement requested.'}
                          </p>
                          <div className="flex flex-wrap gap-3 pt-1 text-[11px] text-warmgray-500">
                            <span>Colors: <strong>{req.colors || 'Artisan Choice'}</strong></span>
                            <span>Quantity: <strong>{req.quantity || 1}</strong></span>
                            {req.budget && <span>Target Budget: <strong>₹{req.budget}</strong></span>}
                          </div>
                        </div>
                      </div>

                      {/* Custom Order Timeline Preview */}
                      <div className="p-3 bg-warmgray-50 dark:bg-warmgray-800/50 rounded-2xl text-[11px] text-warmgray-600 dark:text-warmgray-300 flex items-center justify-between">
                        <span>Status: <strong>{req.status === 'Approved' ? '🧶 Being Handcrafted' : 'Under Review by Artisan'}</strong></span>
                        <button
                          onClick={() => setSelectedCustomDetails(req)}
                          className="font-bold text-bloom-600 hover:underline"
                        >
                          View Full Details →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-12 text-center border border-warmgray-200 dark:border-warmgray-800 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-purple-50 text-purple-500 mx-auto flex items-center justify-center">
                    <Palette className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-warmgray-900 dark:text-white">
                    Have something special in mind?
                  </h3>
                  <p className="text-xs text-warmgray-500 max-w-sm mx-auto">
                    Submit a custom floral wire piece or personalized bouquet request directly to Artisan Aanu.
                  </p>
                  <button
                    onClick={() => onNavigate('custom-order')}
                    className="px-6 py-2.5 bg-gradient-to-r from-bloom-500 to-rosewood-500 text-white rounded-full font-bold text-xs shadow-cozy"
                  >
                    Create Custom Order 🎨
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: WISHLIST */}
          {/* ======================================================== */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-6 border border-warmgray-200 dark:border-warmgray-800 shadow-soft">
                <h2 className="font-serif font-bold text-2xl text-warmgray-900 dark:text-white">
                  My Wishlist ♡
                </h2>
                <p className="text-xs text-warmgray-500 dark:text-warmgray-400 mt-1">
                  Handcrafted pieces you've saved for later.
                </p>
              </div>

              {wishlistItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishlistItems.map((prod) => (
                    <div
                      key={prod.id}
                      className="bg-white dark:bg-warmgray-900 rounded-3xl overflow-hidden border border-warmgray-200 dark:border-warmgray-800 shadow-soft flex flex-col justify-between group hover:shadow-md transition-shadow"
                    >
                      <div className="relative aspect-square overflow-hidden bg-warmgray-100">
                        <img
                          src={prod.images?.[0] || prod.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80'}
                          alt={prod.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="p-4 space-y-3">
                        <div>
                          <h4 className="font-serif font-bold text-sm text-warmgray-900 dark:text-white truncate">
                            {prod.name}
                          </h4>
                          <span className="font-serif font-bold text-base text-bloom-600 dark:text-bloom-400 mt-0.5 block">
                            ₹{(prod.price || 0).toLocaleString('en-IN')}
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            addToCart(prod, 1);
                            addToast(`Added ${prod.name} to Basket! 🛍️`, 'success');
                          }}
                          className="w-full py-2.5 bg-gradient-to-r from-bloom-500 to-rosewood-500 hover:from-bloom-600 text-white rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Basket</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-12 text-center border border-warmgray-200 dark:border-warmgray-800 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-rose-50 text-rosewood-500 mx-auto flex items-center justify-center">
                    <Heart className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-warmgray-900 dark:text-white">
                    Your wishlist is empty
                  </h3>
                  <p className="text-xs text-warmgray-500 max-w-sm mx-auto">
                    Save pieces you love and find them here later.
                  </p>
                  <button
                    onClick={() => onNavigate('shop')}
                    className="px-6 py-2.5 bg-bloom-500 hover:bg-bloom-600 text-white rounded-full font-bold text-xs shadow-cozy"
                  >
                    Explore Products 🌸
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: SAVED ADDRESSES */}
          {/* ======================================================== */}
          {activeTab === 'addresses' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-6 border border-warmgray-200 dark:border-warmgray-800 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif font-bold text-2xl text-warmgray-900 dark:text-white">
                    Saved Addresses
                  </h2>
                  <p className="text-xs text-warmgray-500 dark:text-warmgray-400 mt-1">
                    Manage your delivery addresses in Pune.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingAddressId(null);
                    setAddressForm({
                      title: 'Home',
                      name: user?.name || '',
                      phone: user?.phone || '',
                      address: '',
                      city: 'Pune',
                      state: 'Maharashtra',
                      zip: '411038',
                      country: 'India',
                      isDefault: (user.savedAddresses || []).length === 0
                    });
                    setShowAddAddressModal(true);
                  }}
                  className="px-5 py-2.5 bg-bloom-500 hover:bg-bloom-600 text-white rounded-xl font-bold text-xs shadow-cozy flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Address</span>
                </button>
              </div>

              {/* Address Cards Grid */}
              {(user.savedAddresses && user.savedAddresses.length > 0) ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user.savedAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`bg-white dark:bg-warmgray-900 rounded-3xl p-5 border shadow-soft space-y-3 relative ${
                        addr.isDefault
                          ? 'border-bloom-400 ring-2 ring-bloom-100 dark:ring-bloom-950'
                          : 'border-warmgray-200 dark:border-warmgray-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-warmgray-100 dark:bg-warmgray-800 text-warmgray-700 dark:text-warmgray-300">
                          {addr.title || 'Home'}
                        </span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Check className="w-3 h-3" /> Default
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-warmgray-700 dark:text-warmgray-300 space-y-1">
                        <strong className="block font-bold text-sm text-warmgray-900 dark:text-white">
                          {addr.name}
                        </strong>
                        <p className="leading-relaxed">{addr.address}</p>
                        <p>{addr.city}, {addr.state} - <strong>{addr.zip}</strong></p>
                        <p className="text-warmgray-500 pt-1">📞 {addr.phone}</p>
                      </div>

                      <div className="pt-3 border-t border-warmgray-100 dark:border-warmgray-800 flex items-center justify-between text-xs">
                        {!addr.isDefault && (
                          <button
                            onClick={() => setDefaultAddress(addr.id)}
                            className="text-[11px] font-semibold text-bloom-600 hover:underline"
                          >
                            Set as Default
                          </button>
                        )}
                        <div className="flex items-center gap-3 ml-auto">
                          <button
                            onClick={() => handleEditAddressClick(addr)}
                            className="text-warmgray-600 hover:text-warmgray-900 font-semibold text-xs flex items-center gap-1"
                          >
                            <Edit2 className="w-3 h-3" /> Edit
                          </button>
                          <button
                            onClick={() => deleteAddress(addr.id)}
                            className="text-red-500 hover:text-red-700 font-semibold text-xs flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-12 text-center border border-warmgray-200 dark:border-warmgray-800 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 mx-auto flex items-center justify-center">
                    <MapPin className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-warmgray-900 dark:text-white">
                    No Saved Addresses
                  </h3>
                  <p className="text-xs text-warmgray-500 max-w-sm mx-auto">
                    Save an address for a faster checkout across Pune.
                  </p>
                  <button
                    onClick={() => {
                      setEditingAddressId(null);
                      setShowAddAddressModal(true);
                    }}
                    className="px-6 py-2.5 bg-bloom-500 hover:bg-bloom-600 text-white rounded-full font-bold text-xs shadow-cozy"
                  >
                    Add Address 📍
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 6: PROFILE SETTINGS */}
          {/* ======================================================== */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-6 sm:p-8 border border-warmgray-200 dark:border-warmgray-800 shadow-soft">
                <div className="pb-5 border-b border-warmgray-100 dark:border-warmgray-800 mb-6">
                  <h2 className="font-serif font-bold text-2xl text-warmgray-900 dark:text-white">
                    Profile Settings
                  </h2>
                  <p className="text-xs text-warmgray-500 dark:text-warmgray-400 mt-1">
                    Manage your personal boutique details and contact information.
                  </p>
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-5 max-w-xl">
                  
                  {/* Avatar Picker / Preview */}
                  <div>
                    <label className="block text-xs font-bold text-warmgray-700 dark:text-warmgray-300 mb-2">
                      Profile Avatar
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-bloom-500 to-rosewood-500 text-white font-serif font-bold text-xl flex items-center justify-center shadow-xs overflow-hidden">
                        {profileForm.avatar && !profileForm.avatar.includes('initials') ? (
                          <img src={profileForm.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          customerInitials
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {[
                          'https://api.dicebear.com/7.x/initials/svg?seed=Aanu',
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
                          'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80'
                        ].map((av, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setProfileForm({ ...profileForm, avatar: av })}
                            className="w-9 h-9 rounded-xl overflow-hidden border-2 hover:border-bloom-500 transition-colors"
                          >
                            <img src={av} alt="option" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full text-xs p-3 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-bloom-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                        Email Address (Verified)
                      </label>
                      <input
                        type="email"
                        disabled
                        value={profileForm.email}
                        className="w-full text-xs p-3 rounded-xl bg-warmgray-100 dark:bg-warmgray-800/50 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-500 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Phone & Birthday */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        placeholder="98765 43210"
                        className="w-full text-xs p-3 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-bloom-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                        Date of Birth (Optional)
                      </label>
                      <input
                        type="date"
                        value={profileForm.dob}
                        onChange={(e) => setProfileForm({ ...profileForm, dob: e.target.value })}
                        className="w-full text-xs p-3 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-bloom-400"
                      />
                    </div>
                  </div>

                  {/* City & State */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={profileForm.city}
                        onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                        className="w-full text-xs p-3 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                        State
                      </label>
                      <select
                        value={profileForm.state}
                        onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                        className="w-full text-xs p-3 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
                      >
                        {indianStates.map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                        PIN Code
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={profileForm.zip}
                        onChange={(e) => setProfileForm({ ...profileForm, zip: e.target.value })}
                        className="w-full text-xs p-3 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      className="px-7 py-3 bg-gradient-to-r from-bloom-500 to-rosewood-500 hover:from-bloom-600 text-white rounded-xl font-bold text-xs shadow-cozy transition-transform active:scale-98 flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save Profile Changes</span>
                    </button>
                  </div>

                </form>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 7: SECURITY */}
          {/* ======================================================== */}
          {activeTab === 'security' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-6 sm:p-8 border border-warmgray-200 dark:border-warmgray-800 shadow-soft space-y-6">
                <div className="pb-4 border-b border-warmgray-100 dark:border-warmgray-800">
                  <h2 className="font-serif font-bold text-2xl text-warmgray-900 dark:text-white">
                    Security & Login
                  </h2>
                  <p className="text-xs text-warmgray-500 dark:text-warmgray-400 mt-1">
                    Manage your account password and review recent login sessions.
                  </p>
                </div>

                {/* Change Password Form */}
                <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                  <h3 className="font-serif font-bold text-base text-warmgray-900 dark:text-white flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-bloom-500" />
                    <span>Change Password</span>
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                      Current Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPass ? 'text' : 'password'}
                        required
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        className="w-full text-xs p-3 pr-10 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-warmgray-400 hover:text-warmgray-600"
                      >
                        {showCurrentPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                      New Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPass ? 'text' : 'password'}
                        required
                        placeholder="At least 6 characters"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className="w-full text-xs p-3 pr-10 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-warmgray-400 hover:text-warmgray-600"
                      >
                        {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                      Confirm New Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPass ? 'text' : 'password'}
                        required
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        className="w-full text-xs p-3 pr-10 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-warmgray-400 hover:text-warmgray-600"
                      >
                        {showConfirmPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-warmgray-900 hover:bg-black text-white dark:bg-white dark:text-warmgray-900 rounded-xl font-bold text-xs shadow-sm transition-colors"
                  >
                    Update Password
                  </button>
                </form>

                {/* Login Activity Card */}
                <div className="pt-4 border-t border-warmgray-100 dark:border-warmgray-800 space-y-3">
                  <h3 className="font-serif font-bold text-sm text-warmgray-900 dark:text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-500" />
                    <span>Active Login Session</span>
                  </h3>
                  <div className="p-4 rounded-2xl bg-warmgray-50 dark:bg-warmgray-800/50 border border-warmgray-100 dark:border-warmgray-700 text-xs space-y-1 text-warmgray-600 dark:text-warmgray-300">
                    <div className="flex items-center justify-between font-bold text-warmgray-900 dark:text-white">
                      <span>💻 Current Device / Browser Session</span>
                      <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">● Active Now</span>
                    </div>
                    <p className="text-[11px] text-warmgray-500">Region: Pune, Maharashtra · Safe Session</p>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: ORDER DETAILS MODAL */}
      {/* ======================================================== */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-warmgray-900 rounded-3xl max-w-lg w-full p-6 border border-warmgray-200 dark:border-warmgray-800 shadow-2xl space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-warmgray-100 dark:border-warmgray-800">
              <div>
                <span className="font-mono text-sm font-bold text-warmgray-900 dark:text-white">
                  Order #{selectedOrderDetails.id}
                </span>
                <span className="text-[11px] text-warmgray-400 block">
                  Placed on {new Date(selectedOrderDetails.createdAt || Date.now()).toLocaleDateString('en-IN')}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="p-1.5 rounded-full text-warmgray-400 hover:text-warmgray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Stage Badge */}
            <div className="flex justify-between items-center bg-warmgray-50 dark:bg-warmgray-800 p-3 rounded-2xl text-xs">
              <span className="text-warmgray-600 dark:text-warmgray-300 font-medium">Fulfillment Status:</span>
              {getStageBadge(selectedOrderDetails.status)}
            </div>

            {/* Items Breakdown */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-bold text-warmgray-400 block">Items in Order</span>
              {selectedOrderDetails.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs pb-2 border-b border-warmgray-100 dark:border-warmgray-800">
                  <div>
                    <strong className="text-warmgray-900 dark:text-white block">{item.name}</strong>
                    <span className="text-warmgray-500 text-[11px]">Qty: {item.quantity || 1} {item.selectedColor ? `· ${item.selectedColor}` : ''}</span>
                  </div>
                  <span className="font-serif font-bold">₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            {/* Address & Payment */}
            <div className="p-3.5 rounded-2xl bg-warmgray-50 dark:bg-warmgray-800/60 text-xs space-y-1.5">
              <strong className="text-warmgray-900 dark:text-white block">📍 Delivery Destination:</strong>
              <p className="text-warmgray-600 dark:text-warmgray-300">
                {selectedOrderDetails.customer?.name} · {selectedOrderDetails.customer?.address}, {selectedOrderDetails.customer?.city || 'Pune'}, {selectedOrderDetails.customer?.state || 'Maharashtra'} - {selectedOrderDetails.customer?.zip}
              </p>
              <p className="text-warmgray-500">📞 Phone: {selectedOrderDetails.customer?.phone || 'N/A'}</p>
            </div>

            {/* Total and Invoice Button */}
            <div className="pt-3 border-t border-warmgray-100 dark:border-warmgray-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-warmgray-400 block">Total Paid</span>
                <span className="font-serif font-bold text-lg text-bloom-600 dark:text-bloom-400">
                  ₹{(selectedOrderDetails.total || 0).toLocaleString('en-IN')}
                </span>
              </div>

              <button
                onClick={() => {
                  setSelectedInvoiceOrder(selectedOrderDetails);
                  setSelectedOrderDetails(null);
                }}
                className="px-4 py-2 bg-bloom-500 hover:bg-bloom-600 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: CUSTOM ORDER DETAILS MODAL */}
      {/* ======================================================== */}
      {selectedCustomDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-warmgray-900 rounded-3xl max-w-lg w-full p-6 border border-warmgray-200 dark:border-warmgray-800 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-warmgray-100 dark:border-warmgray-800">
              <span className="font-mono text-sm font-bold">Custom Request #{selectedCustomDetails.id}</span>
              <button onClick={() => setSelectedCustomDetails(null)} className="p-1 text-warmgray-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <h4 className="font-serif font-bold text-base text-warmgray-900 dark:text-white">
                {selectedCustomDetails.productType || 'Handmade Bespoke Floral Piece'}
              </h4>
              <p className="text-warmgray-600 dark:text-warmgray-300 leading-relaxed">
                {selectedCustomDetails.notes || selectedCustomDetails.description}
              </p>
              <div className="p-3 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 space-y-1">
                <div>Colors: <strong>{selectedCustomDetails.colors || 'Artisan Choice'}</strong></div>
                <div>Quantity: <strong>{selectedCustomDetails.quantity || 1}</strong></div>
                <div>Status: <strong className="text-purple-600">{selectedCustomDetails.status || 'In Review'}</strong></div>
              </div>
            </div>

            <button
              onClick={() => setSelectedCustomDetails(null)}
              className="w-full py-2.5 bg-warmgray-900 text-white rounded-xl font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: ADD / EDIT ADDRESS MODAL */}
      {/* ======================================================== */}
      {showAddAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-warmgray-900 rounded-3xl max-w-md w-full p-6 border border-warmgray-200 dark:border-warmgray-800 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-warmgray-100 dark:border-warmgray-800">
              <h3 className="font-serif font-bold text-base text-warmgray-900 dark:text-white">
                {editingAddressId ? 'Edit Delivery Address' : 'Add New Delivery Address'}
              </h3>
              <button
                onClick={() => setShowAddAddressModal(false)}
                className="p-1 text-warmgray-400 hover:text-warmgray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAddressSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                  Address Label
                </label>
                <input
                  type="text"
                  placeholder="Home, Studio, Office"
                  value={addressForm.title}
                  onChange={(e) => setAddressForm({ ...addressForm, title: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                    Recipient Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.name}
                    onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Flat No, Building, Street Name"
                  value={addressForm.address}
                  onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full text-xs p-2 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                    State
                  </label>
                  <select
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    className="w-full text-xs p-2 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
                  >
                    {indianStates.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={addressForm.zip}
                    onChange={(e) => setAddressForm({ ...addressForm, zip: e.target.value })}
                    className="w-full text-xs p-2 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 pt-1 text-xs text-warmgray-700 dark:text-warmgray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                  className="rounded text-bloom-500"
                />
                <span>Set as Default Delivery Address</span>
              </label>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddAddressModal(false)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold bg-warmgray-100 dark:bg-warmgray-800 text-warmgray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-bloom-500 hover:bg-bloom-600 text-white shadow-xs"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: LOGOUT CONFIRMATION MODAL */}
      {/* ======================================================== */}
      {showLogoutConfirmModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-6 max-w-sm w-full border border-warmgray-200 dark:border-warmgray-800 shadow-2xl text-center space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 mx-auto flex items-center justify-center">
              <LogOut className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-serif font-bold text-lg text-warmgray-900 dark:text-white">
                Log Out of Boutique?
              </h3>
              <p className="text-xs text-warmgray-500 mt-1">
                Are you sure you want to sign out of your AanuBlooms session?
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirmModal(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-warmgray-100 hover:bg-warmgray-200 dark:bg-warmgray-800 text-warmgray-700 dark:text-warmgray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirmModal(false);
                  logout();
                  if (onNavigate) onNavigate('home');
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 5: REAL PRINTABLE INVOICE MODAL */}
      {/* ======================================================== */}
      {selectedInvoiceOrder && (
        <PrintableInvoice
          order={selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}

    </div>
  );
};
