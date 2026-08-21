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
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { PrintableInvoice } from '../components/orders/PrintableInvoice';

export const CustomerDashboardPage = ({ onNavigate }) => {
  const { user, login, logout, updateProfile, addAddress, deleteAddress, setDefaultAddress, openAuthModal } = useAuth();
  const { wishlistItems = [], removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'addresses' | 'commissions' | 'wishlist' | 'settings'
  const [orders, setOrders] = useState([]);
  const [customRequests, setCustomRequests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);

  // Order Search & Filter
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // New Address Form Modal
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState({
    title: 'Home',
    name: user?.name || '',
    phone: user?.phone || '',
    address: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    zip: '560038',
    country: 'India',
    isDefault: false
  });

  // Profile Edit Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    city: user?.city || 'Bengaluru',
    avatar: user?.avatar || ''
  });

  const indianStates = [
    'Andhra Pradesh', 'Assam', 'Bihar', 'Delhi NCR', 'Goa', 'Gujarat',
    'Haryana', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
    'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'
  ];

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        city: user.city || 'Bengaluru',
        avatar: user.avatar || ''
      });
      setAddressForm(prev => ({
        ...prev,
        name: user.name || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  useEffect(() => {
    const fetchCustomerData = async () => {
      setIsLoading(true);
      try {
        const [ordersRes, customRes, catsRes] = await Promise.all([
          api.getOrders(),
          api.getCustomRequests(),
          api.getCategories()
        ]);
        
        const allOrders = ordersRes.data || [];
        const userOrders = user?.email
          ? allOrders.filter(o => o.customer?.email?.toLowerCase() === user.email.toLowerCase() || (user.name && o.customer?.name?.toLowerCase().includes(user.name.toLowerCase().split(' ')[0])))
          : allOrders;
        setOrders(userOrders.length > 0 ? userOrders : allOrders);

        const allCustom = customRes.data || [];
        const userCustom = user?.email
          ? allCustom.filter(c => c.customerEmail?.toLowerCase() === user.email.toLowerCase() || (user.name && c.customerName?.toLowerCase().includes(user.name.toLowerCase().split(' ')[0])))
          : allCustom;
        setCustomRequests(userCustom.length > 0 ? userCustom : allCustom);

        setCategories(catsRes.data || []);
      } catch (err) {
        console.error('Error fetching customer data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomerData();
  }, [user]);

  // Guest State - Friendly & 1-Click Interactive
  if (!user) {
    return (
      <div className="py-12 sm:py-16 max-w-lg mx-auto px-4 text-center">
        <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-8 border border-warmgray-200 dark:border-warmgray-800 shadow-soft space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-bloom-100 dark:bg-warmgray-800 text-bloom-600 dark:text-bloom-400 mx-auto flex items-center justify-center shadow-xs">
            <User className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-serif font-bold text-warmgray-900 dark:text-white">
              Customer Account & Orders
            </h2>
            <p className="text-xs text-warmgray-500 dark:text-warmgray-400 mt-1">
              Sign in to view your live crafting progress, order history, saved Pan-India addresses, printable GST receipts, and custom commission requests.
            </p>
          </div>

          <button
            onClick={() => openAuthModal('login')}
            className="w-full py-3 bg-bloom-500 hover:bg-bloom-600 text-white rounded-2xl font-bold text-xs shadow-cozy transition-transform hover:scale-102"
          >
            Sign In / Create Account 🌸
          </button>

          <div className="pt-4 border-t border-warmgray-100 dark:border-warmgray-800 space-y-2">
            <span className="text-[11px] font-bold text-warmgray-400 uppercase tracking-wider block">
              — Quick 1-Click Demo Login —
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => login('pooja.sharma@example.com', 'password123')}
                className="p-2.5 rounded-xl bg-warmgray-50 hover:bg-warmgray-100 dark:bg-warmgray-800 dark:hover:bg-warmgray-700 border border-warmgray-200 dark:border-warmgray-700 text-left text-xs text-warmgray-800 dark:text-warmgray-200 transition-all"
              >
                <strong className="block text-bloom-600 dark:text-bloom-400">Pooja Sharma</strong>
                <span className="text-[10px] text-warmgray-500">Bengaluru · Orders Active</span>
              </button>
              <button
                onClick={() => login('priya.nair@example.com', 'password123')}
                className="p-2.5 rounded-xl bg-warmgray-50 hover:bg-warmgray-100 dark:bg-warmgray-800 dark:hover:bg-warmgray-700 border border-warmgray-200 dark:border-warmgray-700 text-left text-xs text-warmgray-800 dark:text-warmgray-200 transition-all"
              >
                <strong className="block text-purple-600 dark:text-purple-400">Priya Nair</strong>
                <span className="text-[10px] text-warmgray-500">Mumbai · Custom Requests</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (addressForm.address && addressForm.name) {
      addAddress(addressForm);
      setShowAddAddressModal(false);
      setAddressForm({
        title: 'Home',
        name: user?.name || '',
        phone: user?.phone || '',
        address: '',
        city: 'Bengaluru',
        state: 'Karnataka',
        zip: '560038',
        country: 'India',
        isDefault: false
      });
    }
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfile(profileForm);
  };

  const handleReorder = (order) => {
    order.items?.forEach(item => {
      addToCart(item, item.quantity || 1, {
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize
      });
    });
    addToast(`Re-added ${order.items?.length || 0} items from #${order.id} to Basket! 🛍️`, 'success');
  };

  const getStageBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold">🏡 Delivered</span>;
      case 'shipped':
        return <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-[11px] font-bold">📦 In Transit</span>;
      case 'handcrafting':
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[11px] font-bold">🧶 Hand-Stitching</span>;
      case 'packaging':
        return <span className="px-2.5 py-0.5 rounded-full bg-rosewood-100 dark:bg-rosewood-950 text-rosewood-800 dark:text-rosewood-300 text-[11px] font-bold">🌸 Ribbon Packaging</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full bg-warmgray-100 dark:bg-warmgray-800 text-warmgray-800 dark:text-warmgray-200 text-[11px] font-bold">⏱️ Order Confirmed</span>;
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    const matchesStatus =
      orderStatusFilter === 'all' ||
      (orderStatusFilter === 'delivered' && o.status?.toLowerCase() === 'delivered') ||
      (orderStatusFilter === 'active' && o.status?.toLowerCase() !== 'delivered');
    
    const matchesSearch =
      !orderSearch.trim() ||
      o.id?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.items?.some(i => i.name?.toLowerCase().includes(orderSearch.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* 2-Column Dashboard Grid: Left Sidebar & Right Content Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================= */}
        {/* LEFT SIDEBAR PANEL */}
        {/* ========================================================= */}
        <aside className="lg:col-span-4 space-y-5">
          
          {/* User Mini Profile Card */}
          <div className="bg-gradient-to-br from-bloom-50 via-rosewood-50/60 to-white dark:from-warmgray-900 dark:via-warmgray-900 dark:to-warmgray-800 rounded-3xl p-5 border border-bloom-100 dark:border-warmgray-800 shadow-soft">
            <div className="flex items-center gap-3.5 mb-3.5">
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.name || 'user')}`}
                alt={user.name || 'Member'}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-white dark:border-warmgray-700 shadow-md"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-bloom-100 dark:bg-bloom-950 text-bloom-700 dark:text-bloom-300 inline-block mb-1">
                  {user.role === 'admin' ? 'Artisan Founder' : 'Boutique Member'}
                </span>
                <h2 className="font-serif font-bold text-base text-warmgray-900 dark:text-white truncate">
                  {user.name || 'Customer'}
                </h2>
                <p className="text-xs text-warmgray-500 dark:text-warmgray-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-warmgray-100 dark:border-warmgray-800 text-[11px] text-warmgray-600 dark:text-warmgray-400 flex items-center justify-between">
              <span>📍 {user.city || 'India'}, India</span>
              <span className="font-mono text-warmgray-500">{user.phone || '+91 98765 43210'}</span>
            </div>
          </div>

          {/* Navigation Tabs Menu */}
          <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-3 border border-warmgray-200/80 dark:border-warmgray-800 shadow-xs space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-warmgray-400 px-3 py-1.5 block">
              Dashboard Navigation
            </span>

            {[
              { id: 'orders', label: 'Order History & Status', count: orders.length, icon: Package },
              { id: 'addresses', label: 'Saved Delivery Addresses', count: user.savedAddresses?.length || 0, icon: MapPin },
              { id: 'commissions', label: 'Custom Inquiries', count: customRequests.length, icon: Palette },
              { id: 'wishlist', label: 'My Saved Wishlist', count: wishlistItems.length, icon: Heart },
              { id: 'settings', label: 'Profile Settings', icon: Settings }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all text-left ${
                    isActive
                      ? 'bg-bloom-500 text-white shadow-cozy'
                      : 'text-warmgray-700 dark:text-warmgray-300 hover:bg-warmgray-50 dark:hover:bg-warmgray-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.count !== undefined && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                      isActive
                        ? 'bg-white/25 text-white'
                        : 'bg-warmgray-100 dark:bg-warmgray-800 text-warmgray-600 dark:text-warmgray-400'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-2 mt-2 border-t border-warmgray-100 dark:border-warmgray-800 space-y-1">
              {user?.role === 'admin' && (
                <button
                  onClick={() => onNavigate('admin')}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-2xl text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-warmgray-800 transition-colors text-left"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Studio Portal</span>
                </button>
              )}

              <button
                onClick={logout}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-2xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Session</span>
              </button>
            </div>
          </div>

          {/* LEFT SIDEBAR: ALL CATEGORIES QUICK BROWSER */}
          <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-4 border border-warmgray-200/80 dark:border-warmgray-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-warmgray-100 dark:border-warmgray-800">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-warmgray-900 dark:text-white">
                <Layers className="w-4 h-4 text-bloom-500" />
                <span>Shop by Category</span>
              </div>
              <button
                onClick={() => onNavigate('shop')}
                className="text-[11px] font-bold text-bloom-600 dark:text-bloom-400 hover:underline flex items-center gap-0.5"
              >
                <span>All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-1.5">
              {[
                { id: 'forever-blooms', name: 'Forever Blooms & Pots', icon: '🌸', count: 18 },
                { id: 'hair-accessories', name: 'Hair Bows & Parandis', icon: '🎀', count: 9 },
                { id: 'amigurumi-plushies', name: 'Amigurumi Plushies', icon: '🧸', count: 24 },
                { id: 'bookmarks', name: 'Botanical Bookmarks', icon: '🔖', count: 7 },
                { id: 'keychains', name: 'Keychains & Charms', icon: '🔑', count: 6 },
                { id: 'home-living', name: 'Cozy Home & Decor', icon: '🏡', count: 16 },
                { id: 'bags-accessories', name: 'Bags & Totes', icon: '👜', count: 15 },
                { id: 'wearables-apparel', name: 'Wearables & Cardigans', icon: '🧶', count: 12 },
                { id: 'diy-kits-patterns', name: 'DIY Kits & Patterns', icon: '📦', count: 10 }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => onNavigate('shop', { category: cat.id })}
                  className="w-full flex items-center justify-between p-2 rounded-xl text-xs text-warmgray-700 dark:text-warmgray-300 hover:bg-bloom-50 dark:hover:bg-warmgray-800/80 hover:text-bloom-600 dark:hover:text-bloom-400 transition-colors text-left group"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-sm group-hover:scale-110 transition-transform">{cat.icon}</span>
                    <span className="font-medium">{cat.name}</span>
                  </span>
                  <span className="text-[10px] text-warmgray-400 font-semibold group-hover:text-bloom-500">
                    {cat.count} items
                  </span>
                </button>
              ))}
            </div>
          </div>

        </aside>

        {/* ========================================================= */}
        {/* RIGHT MAIN CONTENT PANEL */}
        {/* ========================================================= */}
        <main className="lg:col-span-8 space-y-6">
          
          {/* TAB 1: ORDER HISTORY & STATUS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              
              {/* Order History Header */}
              <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-5 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-serif font-bold text-lg sm:text-xl text-warmgray-900 dark:text-white flex items-center gap-2">
                      <Package className="w-5 h-5 text-bloom-500" />
                      <span>Order History & Dispatch Tracker</span>
                    </h3>
                    <p className="text-xs text-warmgray-500 mt-0.5">
                      Review previous orders, check tracking numbers, and view official tax invoices.
                    </p>
                  </div>

                  <button
                    onClick={() => onNavigate('shop')}
                    className="px-4 py-2 bg-bloom-500 hover:bg-bloom-600 text-white rounded-xl text-xs font-bold shadow-cozy flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Shop New Stitches</span>
                  </button>
                </div>

                {/* Filter & Search Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-3 border-t border-warmgray-100 dark:border-warmgray-800">
                  <div className="sm:col-span-7 relative">
                    <input
                      type="text"
                      placeholder="Search by Order # or item name..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="w-full text-xs py-2 pl-8 pr-3 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
                    />
                    <Search className="w-3.5 h-3.5 text-warmgray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>

                  <div className="sm:col-span-5 flex gap-1.5">
                    {[
                      { id: 'all', label: 'All Orders' },
                      { id: 'active', label: 'In Progress' },
                      { id: 'delivered', label: 'Delivered' }
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => setOrderStatusFilter(f.id)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                          orderStatusFilter === f.id
                            ? 'bg-warmgray-900 dark:bg-white text-white dark:text-warmgray-900 shadow-xs'
                            : 'bg-warmgray-100 dark:bg-warmgray-800 text-warmgray-600 dark:text-warmgray-300'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Cards List */}
              {isLoading ? (
                <div className="py-16 text-center text-xs text-warmgray-500">
                  Loading your handcrafted order history...
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="p-8 text-center bg-white dark:bg-warmgray-900 rounded-3xl border border-warmgray-200 dark:border-warmgray-800">
                  <Package className="w-10 h-10 text-warmgray-400 mx-auto mb-2" />
                  <h4 className="font-serif font-bold text-sm text-warmgray-900 dark:text-white mb-1">
                    No orders matching your filter
                  </h4>
                  <p className="text-xs text-warmgray-500 mb-4">
                    Explore our forever bouquets, hair accessories, and plushies!
                  </p>
                  <button
                    onClick={() => { setOrderStatusFilter('all'); setOrderSearch(''); }}
                    className="px-5 py-2 bg-bloom-500 text-white rounded-full text-xs font-bold"
                  >
                    Clear Filter 🌸
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map(order => (
                    <div
                      key={order.id}
                      className="p-5 rounded-3xl bg-white dark:bg-warmgray-900 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft space-y-3.5 transition-all hover:border-bloom-200 dark:hover:border-warmgray-700"
                    >
                      {/* Order header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-warmgray-100 dark:border-warmgray-800">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-bloom-50 dark:bg-warmgray-800 flex items-center justify-center text-bloom-600 dark:text-bloom-400">
                            <Package className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-xs text-bloom-600 dark:text-bloom-400">
                                #{order.id}
                              </span>
                              {getStageBadge(order.status)}
                            </div>
                            <span className="text-[10px] text-warmgray-400 block mt-0.5">
                              Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                            </span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <button
                            onClick={() => handleReorder(order)}
                            className="px-3 py-1.5 bg-warmgray-100 hover:bg-warmgray-200 dark:bg-warmgray-800 dark:hover:bg-warmgray-700 text-warmgray-800 dark:text-warmgray-200 rounded-lg text-xs font-bold flex items-center gap-1"
                            title="Reorder items from this order"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Re-Order</span>
                          </button>
                          <button
                            onClick={() => setSelectedInvoiceOrder(order)}
                            className="px-3 py-1.5 bg-warmgray-100 hover:bg-warmgray-200 dark:bg-warmgray-800 dark:hover:bg-warmgray-700 text-warmgray-800 dark:text-warmgray-200 rounded-lg text-xs font-bold flex items-center gap-1.5"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Invoice</span>
                          </button>
                          <button
                            onClick={() => onNavigate('track-order', { id: order.id })}
                            className="px-3.5 py-1.5 bg-bloom-500 hover:bg-bloom-600 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1"
                          >
                            <span>Live Tracker</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Order Items list */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex gap-2.5 p-2 rounded-xl bg-warmgray-50 dark:bg-warmgray-800/40 border border-warmgray-100 dark:border-warmgray-800 items-center">
                            <img src={item.image} alt={item.name} className="w-11 h-11 rounded-lg object-cover" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-warmgray-900 dark:text-white truncate">{item.name}</p>
                              <p className="text-[10px] text-warmgray-500">{item.selectedColor} · Qty {item.quantity}</p>
                            </div>
                            <span className="text-xs font-bold text-warmgray-900 dark:text-white shrink-0">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Order footer info */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-warmgray-100 dark:border-warmgray-800 text-xs text-warmgray-600 dark:text-warmgray-400">
                        <div className="flex items-center gap-3">
                          <span>Delivery To: <strong>{order.customer?.city || user.city || 'India'}, India</strong></span>
                          {order.trackingNumber && (
                            <span className="text-bloom-600 dark:text-bloom-400 font-mono text-[11px]">AWB: {order.trackingNumber}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs">Grand Total:</span>
                          <span className="font-serif font-bold text-sm text-bloom-600 dark:text-bloom-400">
                            ₹{order.total?.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* TAB 2: SAVED ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white dark:bg-warmgray-900 rounded-3xl p-5 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft">
                <div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-warmgray-900 dark:text-white">
                    Saved Delivery Addresses
                  </h3>
                  <p className="text-xs text-warmgray-500">
                    Addresses for 1-click expedited checkout across India.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddAddressModal(true)}
                  className="px-3.5 py-2 bg-bloom-500 hover:bg-bloom-600 text-white rounded-xl text-xs font-bold shadow-cozy flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(user.savedAddresses || []).map((addr) => (
                  <div
                    key={addr.id}
                    className={`p-5 rounded-3xl border-2 transition-all bg-white dark:bg-warmgray-900 relative ${
                      addr.isDefault
                        ? 'border-bloom-500 shadow-soft'
                        : 'border-warmgray-200 dark:border-warmgray-800'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-warmgray-900 dark:text-white">
                          {addr.title || 'Address'}
                        </span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-bloom-100 dark:bg-bloom-950 text-bloom-700 dark:text-bloom-300">
                            Default
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="text-warmgray-400 hover:text-red-500 p-1"
                        title="Delete Address"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-xs text-warmgray-600 dark:text-warmgray-300 space-y-1">
                      <p className="font-semibold text-warmgray-900 dark:text-white">{addr.name}</p>
                      <p>{addr.address}</p>
                      <p>{addr.city}, {addr.state} - {addr.zip}</p>
                      <p className="text-warmgray-500">Phone: {addr.phone}</p>
                    </div>

                    {!addr.isDefault && (
                      <button
                        onClick={() => setDefaultAddress(addr.id)}
                        className="mt-3 text-[11px] font-bold text-bloom-600 dark:text-bloom-400 hover:underline block"
                      >
                        Set as default delivery address
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOM COMMISSIONS */}
          {activeTab === 'commissions' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white dark:bg-warmgray-900 rounded-3xl p-5 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft">
                <div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-warmgray-900 dark:text-white">
                    My Bespoke Studio Inquiries
                  </h3>
                  <p className="text-xs text-warmgray-500">
                    Track custom bouquets and personalized amigurumi commissions.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('custom-order')}
                  className="px-3.5 py-2 bg-bloom-500 hover:bg-bloom-600 text-white rounded-xl text-xs font-bold shadow-cozy flex items-center gap-1.5"
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Design New Commission</span>
                </button>
              </div>

              {customRequests.length === 0 ? (
                <div className="p-8 text-center bg-white dark:bg-warmgray-900 rounded-3xl border border-warmgray-200 dark:border-warmgray-800">
                  <Palette className="w-10 h-10 text-warmgray-400 mx-auto mb-2" />
                  <h4 className="font-serif font-bold text-sm text-warmgray-900 dark:text-white mb-1">
                    No custom inquiries yet
                  </h4>
                  <p className="text-xs text-warmgray-500 mb-4">
                    Use our interactive custom builder to design personalized flower bouquets or plushies!
                  </p>
                  <button
                    onClick={() => onNavigate('custom-order')}
                    className="px-5 py-2.5 bg-bloom-500 text-white rounded-full text-xs font-bold shadow-cozy"
                  >
                    Open Commission Builder 🌸
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {customRequests.map(comm => (
                    <div
                      key={comm.id}
                      className="p-5 rounded-3xl bg-white dark:bg-warmgray-900 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft space-y-2.5"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-bloom-600 dark:text-bloom-400">#{comm.id}</span>
                          <h4 className="font-bold text-sm text-warmgray-900 dark:text-white">{comm.itemType}</h4>
                          <p className="text-xs text-warmgray-500">Yarn: <strong>{comm.yarnPreference || 'Combed Milk Cotton'}</strong></p>
                        </div>
                        <span className="text-xs font-bold text-bloom-600 dark:text-bloom-400 bg-bloom-50 dark:bg-bloom-950 px-2.5 py-1 rounded-full">
                          Value: {comm.estimatedBudget}
                        </span>
                      </div>

                      <p className="text-xs text-warmgray-700 dark:text-warmgray-300 bg-warmgray-50 dark:bg-warmgray-800 p-3 rounded-xl border border-warmgray-100 dark:border-warmgray-700">
                        {comm.specialNotes}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-warmgray-500 pt-1">
                        <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Artisan Aanu has received your stitch specifications
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white dark:bg-warmgray-900 rounded-3xl p-5 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft">
                <h3 className="font-serif font-bold text-base sm:text-lg text-warmgray-900 dark:text-white">
                  My Saved Favorites ({wishlistItems.length})
                </h3>
              </div>

              {wishlistItems.length === 0 ? (
                <div className="p-8 text-center bg-white dark:bg-warmgray-900 rounded-3xl border border-warmgray-200 dark:border-warmgray-800">
                  <Heart className="w-10 h-10 text-warmgray-400 mx-auto mb-2" />
                  <p className="text-xs text-warmgray-500 mb-4">Your wishlist is currently empty.</p>
                  <button
                    onClick={() => onNavigate('shop')}
                    className="px-5 py-2.5 bg-bloom-500 text-white rounded-full text-xs font-bold"
                  >
                    Browse Creations
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlistItems.map(item => (
                    <div key={item.id} className="p-3.5 rounded-2xl bg-white dark:bg-warmgray-900 border border-warmgray-200 dark:border-warmgray-800 flex gap-3.5 items-center">
                      <img src={item.images?.[0] || item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif font-bold text-xs text-warmgray-900 dark:text-white truncate">{item.name}</h4>
                        <p className="text-xs font-bold text-bloom-600 dark:text-bloom-400">₹{item.price?.toLocaleString('en-IN')}</p>
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => addToCart(item, 1)}
                            className="px-2.5 py-1 bg-bloom-500 text-white rounded-lg text-[11px] font-bold"
                          >
                            Add to Basket
                          </button>
                          <button
                            onClick={() => removeFromWishlist(item.id)}
                            className="p-1 text-warmgray-400 hover:text-red-500"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: PROFILE SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-6 sm:p-8 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft">
              <h3 className="font-serif font-bold text-base sm:text-lg text-warmgray-900 dark:text-white mb-4">
                Customer Profile Details
              </h3>

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                      Mobile Number (+91)
                    </label>
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                      City (India)
                    </label>
                    <input
                      type="text"
                      value={profileForm.city}
                      onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                    Avatar Image URL
                  </label>
                  <input
                    type="url"
                    value={profileForm.avatar}
                    onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-bloom-500 hover:bg-bloom-600 text-white rounded-xl font-bold text-xs shadow-cozy"
                  >
                    Save Profile Changes
                  </button>
                </div>
              </form>
            </div>
          )}

        </main>

      </div>

      {/* Add New Address Modal */}
      {showAddAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative bg-white dark:bg-warmgray-900 rounded-3xl p-6 max-w-md w-full border border-warmgray-200 dark:border-warmgray-800 shadow-2xl z-10 animate-in zoom-in-95">
            <h4 className="font-serif font-bold text-base text-warmgray-900 dark:text-white mb-3">
              Add New Delivery Address
            </h4>

            <form onSubmit={handleSaveAddress} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                  Address Label (e.g. Home / Office)
                </label>
                <input
                  type="text"
                  value={addressForm.title}
                  onChange={(e) => setAddressForm({ ...addressForm, title: e.target.value })}
                  className="w-full text-xs p-2 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                  Street Address & Flat / Door No. *
                </label>
                <input
                  type="text"
                  required
                  value={addressForm.address}
                  onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                  className="w-full text-xs p-2 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full text-xs p-2 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                    State *
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
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={addressForm.zip}
                    onChange={(e) => setAddressForm({ ...addressForm, zip: e.target.value })}
                    className="w-full text-xs p-2 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-warmgray-100 dark:border-warmgray-800">
                <button
                  type="button"
                  onClick={() => setShowAddAddressModal(false)}
                  className="px-3.5 py-1.5 text-xs text-warmgray-500 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-bloom-500 text-white rounded-xl text-xs font-bold"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {selectedInvoiceOrder && (
        <PrintableInvoice
          order={selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}

    </div>
  );
};
