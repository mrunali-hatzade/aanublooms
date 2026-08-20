import React, { useState, useEffect } from 'react';
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
  IndianRupee
} from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AdminDashboard = ({ onNavigate }) => {
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products' | 'commissions' | 'messages' | 'feedbacks'
  const [analytics, setAnalytics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customRequests, setCustomRequests] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Status filter for orders
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Product modal
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'forever-blooms',
    price: 999,
    originalPrice: 1299,
    yarnMaterial: '100% Combed Milk Cotton',
    craftTimeHours: 6,
    difficulty: 'Intermediate',
    stock: 15,
    shortDescription: '',
    description: '',
    images: ['https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=800&q=80'],
    colors: [
      { name: 'Blush Pink', hex: '#F4B6C2', inStock: true },
      { name: 'Cream White', hex: '#FAF8F5', inStock: true }
    ],
    sizes: ['Standard Size'],
    featured: true,
    isBestseller: false
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [analyticsRes, ordersRes, productsRes, customRes, contactRes, feedbackRes] = await Promise.all([
        api.getAnalytics(),
        api.getOrders(),
        api.getProducts(),
        api.getCustomRequests(),
        api.getContactMessages(),
        api.getFeedbacks()
      ]);
      setAnalytics(analyticsRes.data);
      setOrders(ordersRes.data || []);
      setProducts(productsRes.data || []);
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

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await api.updateOrderStatus(orderId, newStatus, `Artisan updated stage to ${newStatus}`);
      if (res.success) {
        addToast(`Order #${orderId} status updated to ${newStatus}! 🧶`, 'success');
        setOrders(prev => prev.map(o => (o.id === orderId ? res.data : o)));
      }
    } catch (err) {
      addToast('Could not update order status', 'error');
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        const res = await api.updateProduct(editingProduct.id, productForm);
        if (res.success) {
          addToast(`"${productForm.name}" updated successfully!`, 'success');
        }
      } else {
        const res = await api.createProduct(productForm);
        if (res.success) {
          addToast(`"${productForm.name}" added to AanuBlooms catalog! 🌸`, 'success');
        }
      }
      setShowProductModal(false);
      setEditingProduct(null);
      fetchData();
    } catch (err) {
      addToast(err.message || 'Could not save product', 'error');
    }
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to remove "${productName}" from the store?`)) {
      try {
        const res = await api.deleteProduct(productId);
        if (res.success) {
          addToast('Product removed', 'info');
          fetchData();
        }
      } catch (err) {
        addToast('Could not delete product', 'error');
      }
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'forever-blooms',
      price: 999,
      originalPrice: 1299,
      yarnMaterial: '100% Combed Milk Cotton',
      craftTimeHours: 6,
      difficulty: 'Intermediate',
      stock: 15,
      shortDescription: 'Handcrafted floral creation with premium milk cotton.',
      description: 'Handmade with love and patience in AanuBlooms studio.',
      images: ['https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=800&q=80'],
      colors: [
        { name: 'Blush Pink', hex: '#F4B6C2', inStock: true },
        { name: 'Cream White', hex: '#FAF8F5', inStock: true }
      ],
      sizes: ['Standard'],
      featured: true,
      isBestseller: false
    });
    setShowProductModal(true);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setProductForm({ ...prod });
    setShowProductModal(true);
  };

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    const matchesSearch = !orderSearchQuery ||
      o.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.customer?.name?.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.customer?.email?.toLowerCase().includes(orderSearchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Artisan Maker Dashboard
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-warmgray-900 dark:text-white">
            AanuBlooms Studio Management
          </h1>
          <p className="text-xs text-warmgray-500 dark:text-warmgray-400 mt-0.5">
            Manage your handcrafted orders, track yarn inventory, and update live crafting stages.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={openAddModal}
            className="px-4 py-2.5 bg-bloom-500 hover:bg-bloom-600 text-white rounded-2xl font-bold text-xs shadow-cozy flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Crochet Piece</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-warmgray-900 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft">
          <div className="flex items-center justify-between text-warmgray-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Sales</span>
            <div className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-warmgray-900 dark:text-white">
            ₹{analytics?.totalRevenue?.toLocaleString('en-IN') || '0'}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">
            From {analytics?.totalOrders || 0} handcrafted orders
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-warmgray-900 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft">
          <div className="flex items-center justify-between text-warmgray-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Orders</span>
            <div className="w-7 h-7 rounded-xl bg-bloom-100 dark:bg-bloom-950 text-bloom-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-warmgray-900 dark:text-white">
            {analytics?.totalOrders || 0}
          </p>
          <span className="text-[11px] text-warmgray-500 mt-0.5 block">
            Avg Order: ₹{Math.round(analytics?.avgOrderValue || 0).toLocaleString('en-IN')}
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-warmgray-900 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft">
          <div className="flex items-center justify-between text-warmgray-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Catalog</span>
            <div className="w-7 h-7 rounded-xl bg-rosewood-100 dark:bg-rosewood-950 text-rosewood-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-warmgray-900 dark:text-white">
            {products.length} Pieces
          </p>
          <span className="text-[11px] text-warmgray-500 mt-0.5 block">
            Handcrafted categories
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-warmgray-900 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft">
          <div className="flex items-center justify-between text-warmgray-500 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider">Customer Feedbacks</span>
            <div className="w-7 h-7 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
              <MessageSquareHeart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-warmgray-900 dark:text-white">
            {feedbacks.length} Reviews
          </p>
          <span className="text-[11px] text-amber-600 font-semibold mt-0.5 block">
            Community ratings & stories
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2.5 border-b border-warmgray-200 dark:border-warmgray-800 pb-2 overflow-x-auto">
        {[
          { id: 'orders', label: `Customer Orders (${orders.length})` },
          { id: 'products', label: `Crochet Pieces (${products.length})` },
          { id: 'commissions', label: `Bespoke Inquiries (${customRequests.length})` },
          { id: 'feedbacks', label: `Customer Feedback (${feedbacks.length})` },
          { id: 'messages', label: `Contact Notes (${contactMessages.length})` }
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

      {/* TAB 1: Orders Management */}
      {activeTab === 'orders' && (
        <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-5 sm:p-6 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft space-y-5">
          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-warmgray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by Order ID or Customer..."
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                className="w-full text-xs py-2 pl-9 pr-3 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
              />
            </div>

            <div className="flex gap-1.5 w-full sm:w-auto overflow-x-auto">
              {['all', 'placed', 'handcrafting', 'packaging', 'shipped', 'delivered'].map(st => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                    orderStatusFilter === st
                      ? 'bg-warmgray-900 text-white dark:bg-white dark:text-warmgray-900'
                      : 'bg-warmgray-100 dark:bg-warmgray-800 text-warmgray-600 dark:text-warmgray-400'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-warmgray-200 dark:border-warmgray-800 text-warmgray-400 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Items</th>
                  <th className="py-2.5 px-3">Total</th>
                  <th className="py-2.5 px-3">Current Craft Stage</th>
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
                      <p className="text-[11px] text-warmgray-500">{order.customer?.email}</p>
                      {order.giftWrap && (
                        <span className="text-[10px] text-rosewood-600 font-semibold block mt-0.5">🎁 Gift Wrapped</span>
                      )}
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
                        <option value="placed">Placed (Pending Yarn)</option>
                        <option value="handcrafting">🧶 Handcrafting & Stitching</option>
                        <option value="packaging">🌸 Quality & Packaging</option>
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
                        <span>Timeline</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Products CRUD */}
      {activeTab === 'products' && (
        <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-5 sm:p-6 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(prod => (
              <div key={prod.id} className="p-3.5 rounded-2xl border border-warmgray-200 dark:border-warmgray-800 flex gap-3.5 bg-warmgray-50/50 dark:bg-warmgray-800/40">
                <img src={prod.images?.[0]} alt={prod.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-xs sm:text-sm text-warmgray-900 dark:text-white truncate">{prod.name}</h4>
                    <p className="text-xs text-bloom-600 dark:text-bloom-400 font-bold">₹{prod.price?.toLocaleString('en-IN')}</p>
                    <p className="text-[11px] text-warmgray-500 mt-0.5">Stock: <strong className={prod.stock <= 5 ? 'text-red-500' : 'text-warmgray-700 dark:text-warmgray-300'}>{prod.stock} left</strong></p>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => openEditModal(prod)}
                      className="px-2 py-1 bg-warmgray-200 dark:bg-warmgray-700 hover:bg-warmgray-300 text-warmgray-800 dark:text-warmgray-200 rounded-lg text-[10px] font-bold flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(prod.id, prod.name)}
                      className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-950 dark:text-red-300 rounded-lg text-[10px] font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Commissions */}
      {activeTab === 'commissions' && (
        <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-5 sm:p-6 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft space-y-4">
          <h3 className="font-serif font-bold text-base sm:text-lg text-warmgray-900 dark:text-white">
            Customer Bespoke Inquiries ({customRequests.length})
          </h3>
          <div className="space-y-3">
            {customRequests.map((comm) => (
              <div key={comm.id} className="p-4 rounded-2xl border border-warmgray-200 dark:border-warmgray-800 bg-warmgray-50 dark:bg-warmgray-800/50 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-bloom-600">#{comm.id}</span>
                    <h4 className="font-bold text-sm text-warmgray-900 dark:text-white">{comm.itemType}</h4>
                    <p className="text-xs text-warmgray-500">From: <strong>{comm.customerName}</strong> ({comm.customerEmail})</p>
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

      {/* TAB 4: Customer Feedbacks */}
      {activeTab === 'feedbacks' && (
        <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-5 sm:p-6 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft space-y-4">
          <h3 className="font-serif font-bold text-base sm:text-lg text-warmgray-900 dark:text-white">
            Customer Stories & Reviews ({feedbacks.length})
          </h3>
          {feedbacks.length === 0 ? (
            <div className="text-center py-8 text-xs text-warmgray-500">
              No customer feedback received yet.
            </div>
          ) : (
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
                  {fb.tag && (
                    <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-bloom-100 dark:bg-bloom-950 text-bloom-700 dark:text-bloom-300">
                      ✨ {fb.tag}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: Contact Messages */}
      {activeTab === 'messages' && (
        <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-5 sm:p-6 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft space-y-4">
          <h3 className="font-serif font-bold text-base sm:text-lg text-warmgray-900 dark:text-white">
            Customer Contact Notes ({contactMessages.length})
          </h3>
          {contactMessages.length === 0 ? (
            <div className="text-center py-8 text-xs text-warmgray-500">
              No customer messages yet.
            </div>
          ) : (
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
          )}
        </div>
      )}

      {/* Product Add / Edit Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative bg-white dark:bg-warmgray-900 rounded-3xl p-6 sm:p-7 max-w-xl w-full border border-warmgray-200 dark:border-warmgray-800 shadow-2xl z-10 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-warmgray-100 dark:border-warmgray-800">
              <h3 className="font-serif font-bold text-lg text-warmgray-900 dark:text-white">
                {editingProduct ? 'Edit Handcrafted Piece' : 'Add New Crochet Creation'}
              </h3>
              <button onClick={() => setShowProductModal(false)} className="text-warmgray-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3.5 mt-3">
              <div>
                <label className="block text-xs font-bold text-warmgray-700 dark:text-warmgray-300 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Lavender Blossom Crochet Bouquet"
                  className="w-full text-xs p-2.5 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-warmgray-700 dark:text-warmgray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
                  >
                    <option value="forever-blooms">Forever Blooms & Pots</option>
                    <option value="amigurumi-plushies">Amigurumi Plushies</option>
                    <option value="bags-accessories">Bags & Accessories</option>
                    <option value="wearables-apparel">Wearables & Cardigans</option>
                    <option value="home-living">Cozy Home & Living</option>
                    <option value="diy-kits-patterns">DIY Kits & Patterns</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-warmgray-700 dark:text-warmgray-300 mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) })}
                    className="w-full text-xs p-2.5 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-warmgray-700 dark:text-warmgray-300 mb-1">
                    Yarn Material
                  </label>
                  <input
                    type="text"
                    value={productForm.yarnMaterial}
                    onChange={(e) => setProductForm({ ...productForm, yarnMaterial: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-warmgray-700 dark:text-warmgray-300 mb-1">
                    Handcraft Time (Hours)
                  </label>
                  <input
                    type="number"
                    value={productForm.craftTimeHours}
                    onChange={(e) => setProductForm({ ...productForm, craftTimeHours: parseInt(e.target.value) })}
                    className="w-full text-xs p-2.5 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-warmgray-700 dark:text-warmgray-300 mb-1">
                    Available Stock
                  </label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) })}
                    className="w-full text-xs p-2.5 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-warmgray-700 dark:text-warmgray-300 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={productForm.images?.[0]}
                    onChange={(e) => setProductForm({ ...productForm, images: [e.target.value] })}
                    className="w-full text-xs p-2.5 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-warmgray-700 dark:text-warmgray-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-warmgray-100 dark:border-warmgray-800">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-warmgray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-bloom-500 hover:bg-bloom-600 text-white rounded-full font-bold text-xs shadow-cozy"
                >
                  {editingProduct ? 'Save Changes' : 'Create Piece'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
