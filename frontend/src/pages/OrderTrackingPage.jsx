import React, { useState, useEffect } from 'react';
import { CraftTimelineTracker } from '../components/orders/CraftTimelineTracker';
import { PrintableInvoice } from '../components/orders/PrintableInvoice';
import { Search, Package, ArrowRight, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export const OrderTrackingPage = ({ orderId, onNavigate }) => {
  const { addToast } = useToast();
  const [searchInput, setSearchInput] = useState(orderId || 'AANU-89421');
  const [currentOrder, setCurrentOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const fetchOrder = async (idToSearch) => {
    if (!idToSearch) return;
    setIsLoading(true);
    try {
      const res = await api.getOrderById(idToSearch.trim());
      if (res.success && res.data) {
        setCurrentOrder(res.data);
      } else {
        setCurrentOrder(null);
        addToast(`Order "${idToSearch}" not found. Try searching for AANU-89421 or AANU-78103`, 'error');
      }
    } catch (err) {
      setCurrentOrder(null);
      addToast(`Order "${idToSearch}" not found. Try searching for AANU-89421 or AANU-78103`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      setSearchInput(orderId);
      fetchOrder(orderId);
    } else {
      fetchOrder('AANU-89421'); // Seed default
    }
  }, [orderId]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      fetchOrder(searchInput.trim());
    }
  };

  return (
    <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 min-h-[75vh]">
      
      {/* Search Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bloom-100 dark:bg-bloom-950 text-bloom-800 dark:text-bloom-300 text-xs font-bold uppercase tracking-wider">
          <Package className="w-3.5 h-3.5" />
          Live Crafting & Delivery Tracker
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-warmgray-900 dark:text-white">
          Track Your Stitches
        </h1>
        <p className="text-xs text-warmgray-500 dark:text-warmgray-400">
          Watch your order progress live from yarn selection to ribbon packaging and shipping.
        </p>

        {/* Search Bar Form */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-warmgray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Enter Order ID (e.g. AANU-89421)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full text-xs py-3 pl-10 pr-4 rounded-2xl bg-white dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white font-mono uppercase focus:ring-2 focus:ring-bloom-400"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-bloom-500 hover:bg-bloom-600 text-white rounded-2xl font-bold text-xs shadow-cozy transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Searching...' : 'Track'}
          </button>
        </form>

        {/* Quick Demo links */}
        <div className="flex items-center justify-center gap-2 text-xs text-warmgray-400">
          <span>Try demo orders:</span>
          <button onClick={() => { setSearchInput('AANU-89421'); fetchOrder('AANU-89421'); }} className="text-bloom-600 dark:text-bloom-400 font-mono font-bold underline">
            AANU-89421
          </button>
          <span>·</span>
          <button onClick={() => { setSearchInput('AANU-78103'); fetchOrder('AANU-78103'); }} className="text-bloom-600 dark:text-bloom-400 font-mono font-bold underline">
            AANU-78103
          </button>
        </div>
      </div>

      {/* Tracker Content */}
      {currentOrder && (
        <CraftTimelineTracker
          initialOrder={currentOrder}
          onPrintInvoice={() => setShowPrintModal(true)}
        />
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
