import React, { useState, useEffect } from 'react';
import { CraftTimelineTracker } from '../components/orders/CraftTimelineTracker';
import { PrintableInvoice } from '../components/orders/PrintableInvoice';
import { Search, Package, Phone, ArrowRight, Sparkles, CheckCircle2, Truck, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export const OrderTrackingPage = ({ orderId, onNavigate }) => {
  const { addToast } = useToast();
  const [orderIdInput, setOrderIdInput] = useState(orderId || '');
  const [phoneInput, setPhoneInput] = useState('');
  const [currentOrder, setCurrentOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const fetchOrder = async (idToSearch, phoneToVerify = '') => {
    if (!idToSearch) return;
    setIsLoading(true);
    try {
      if (phoneToVerify.trim()) {
        const res = await api.trackOrder(idToSearch.trim(), phoneToVerify.trim());
        if (res.success && res.data) {
          setCurrentOrder(res.data);
          addToast('🌸 Order verified successfully!', 'success');
        } else {
          setCurrentOrder(null);
          addToast('No order found matching this Order ID and phone number.', 'error');
        }
      } else {
        // Fallback direct fetch by ID (or recent receipt lookup)
        const res = await api.getOrderById(idToSearch.trim());
        if (res.success && res.data) {
          setCurrentOrder(res.data);
        } else {
          setCurrentOrder(null);
          addToast(`Order "${idToSearch}" not found.`, 'error');
        }
      }
    } catch (err) {
      setCurrentOrder(null);
      addToast(err.message || `Order "${idToSearch}" not found.`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      setOrderIdInput(orderId);
      fetchOrder(orderId);
    }
  }, [orderId]);

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (!orderIdInput.trim()) {
      addToast('Please enter your Order ID (e.g. SL-1025 or AANU-89421)', 'error');
      return;
    }
    fetchOrder(orderIdInput.trim(), phoneInput.trim());
  };

  return (
    <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 min-h-[75vh]">
      
      {/* Search Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 relative">
        {/* Ambient Glow */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-bloom-100/40 dark:bg-bloom-950/20 rounded-full blur-3xl pointer-events-none animate-blob-drift" />
        
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-bloom-100 dark:bg-bloom-950/80 text-bloom-800 dark:text-bloom-300 text-xs font-bold uppercase tracking-wider animate-bounce-subtle">
          <Truck className="w-3.5 h-3.5 animate-wiggle" />
          <span>Handmade Order & Crafting Tracker</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-warmgray-900 dark:text-white">
          Track Your Order 🧶
        </h1>
        <p className="text-xs sm:text-sm text-warmgray-600 dark:text-warmgray-400">
          Enter your Order ID and mobile number to see live crafting, packaging, and delivery updates.
        </p>

        {/* Search Bar Form */}
        <form onSubmit={handleTrackSubmit} className="bg-white dark:bg-warmgray-800 p-5 rounded-3xl border border-warmgray-200 dark:border-warmgray-700 shadow-soft-lg space-y-3 mt-4 text-left max-w-lg mx-auto card-hover-3d hover:shadow-xl transition-all duration-300 relative z-10">
          <div>
            <label className="block text-[11px] font-bold uppercase text-warmgray-500 dark:text-warmgray-400 mb-1">
              Order ID *
            </label>
            <div className="relative">
              <Package className="w-4 h-4 text-warmgray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. SL-1025 or AANU-89421"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
                required
                className="w-full text-xs py-2.5 pl-10 pr-4 rounded-xl bg-warmgray-50 dark:bg-warmgray-900 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white font-mono uppercase focus:ring-2 focus:ring-bloom-400 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-warmgray-500 dark:text-warmgray-400 mb-1">
              Mobile Number (Used at Checkout)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-warmgray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                placeholder="e.g. 9876543210"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                className="w-full text-xs py-2.5 pl-10 pr-4 rounded-xl bg-warmgray-50 dark:bg-warmgray-900 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white focus:ring-2 focus:ring-bloom-400 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-bloom-500 hover:bg-bloom-600 text-white rounded-xl font-bold text-xs shadow-cozy btn-shimmer transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>{isLoading ? 'Verifying Order...' : 'Track My Order'}</span>
          </button>
        </form>

        {/* Demo order badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-warmgray-400 pt-1">
          <span>Try demo order:</span>
          <button
            type="button"
            onClick={() => {
              setOrderIdInput('AANU-89421');
              setPhoneInput('9876543210');
              fetchOrder('AANU-89421', '9876543210');
            }}
            className="text-bloom-600 dark:text-bloom-400 font-mono font-bold underline hover:scale-105 transition-transform"
          >
            AANU-89421
          </button>
        </div>
      </div>

      {/* Tracker Content */}
      {currentOrder && (
        <div className="space-y-6">
          <CraftTimelineTracker
            initialOrder={currentOrder}
            onPrintInvoice={() => setShowPrintModal(true)}
          />

          <div className="text-center pt-4">
            <button
              onClick={() => onNavigate('shop')}
              className="px-6 py-2.5 rounded-full bg-warmgray-900 hover:bg-black text-white dark:bg-white dark:text-warmgray-900 text-xs font-bold transition-all shadow"
            >
              Continue Shopping 🌸
            </button>
          </div>
        </div>
      )}

      {/* Printable Invoice Modal */}
      {showPrintModal && (
        <PrintableInvoice
          order={currentOrder}
          onClose={() => setShowPrintModal(false)}
        />
      )}

    </div>
  );
};
