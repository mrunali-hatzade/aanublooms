import React, { useState } from 'react';
import {
  Package,
  Sparkles,
  CheckCircle2,
  Clock,
  Truck,
  Heart,
  Search,
  Printer,
  Calendar,
  Flower2
} from 'lucide-react';

export const CraftTimelineTracker = ({ initialOrder, onPrintInvoice }) => {
  const [order, setOrder] = useState(initialOrder || null);
  const [searchId, setSearchId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const stages = [
    { key: 'placed', label: 'Order Placed', desc: 'Order confirmed & yarn reserved', icon: Package },
    { key: 'handcrafting', label: '🧶 Handcrafting & Stitching', desc: 'Artisan Aanu is hand-stitching with love', icon: Sparkles },
    { key: 'packaging', label: '🌸 Quality & Ribbon Packaging', desc: 'Protected in kraft box with lavender sachet', icon: Flower2 },
    { key: 'shipped', label: '📦 Shipped with Tracking', desc: 'Carrier on the way to your door', icon: Truck },
    { key: 'delivered', label: '🏡 Delivered & Blooming Forever', desc: 'Cherished in your home', icon: Heart }
  ];

  const getStageIndex = (status) => {
    switch (status?.toLowerCase()) {
      case 'placed': return 0;
      case 'handcrafting': return 1;
      case 'packaging': return 2;
      case 'shipped': return 3;
      case 'delivered': return 4;
      default: return 0;
    }
  };

  const currentIdx = order ? getStageIndex(order.status) : 0;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {order ? (
        <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-6 sm:p-10 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft-lg space-y-8 animate-in fade-in">
          
          {/* Order Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-warmgray-100 dark:border-warmgray-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-bloom-600 dark:text-bloom-400">
                  Live Crafting Status
                </span>
                <span className="px-2 py-0.5 rounded-full bg-bloom-100 dark:bg-bloom-950 text-bloom-800 dark:text-bloom-300 text-[10px] font-bold uppercase">
                  {order.status}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-warmgray-900 dark:text-white">
                Order #{order.id}
              </h2>
              <p className="text-xs text-warmgray-500 dark:text-warmgray-400 flex items-center gap-1.5 mt-1">
                <Calendar className="w-3.5 h-3.5" />
                Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
              </p>
            </div>

            {onPrintInvoice && (
              <button
                onClick={() => onPrintInvoice(order)}
                className="px-5 py-2.5 bg-warmgray-100 hover:bg-warmgray-200 dark:bg-warmgray-800 dark:hover:bg-warmgray-700 text-warmgray-800 dark:text-warmgray-200 rounded-full font-bold text-xs transition-colors inline-flex items-center gap-2 self-start"
              >
                <Printer className="w-4 h-4" />
                <span>Print Artisan Receipt</span>
              </button>
            )}
          </div>

          {/* Stepper Timeline */}
          <div className="py-4">
            <div className="relative">
              
              {/* Progress Line */}
              <div className="hidden sm:block absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-warmgray-200 dark:bg-warmgray-700 -z-0">
                <div
                  className="bg-gradient-to-r from-bloom-500 to-rosewood-500 h-full transition-all duration-700"
                  style={{ width: `${(currentIdx / (stages.length - 1)) * 100}%` }}
                />
              </div>

              {/* Steps Icons */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2 relative z-10">
                {stages.map((stg, idx) => {
                  const Icon = stg.icon;
                  const isCompleted = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div key={stg.key} className="flex sm:flex-col items-center gap-4 sm:gap-2 text-left sm:text-center">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md transition-all ${
                          isCurrent
                            ? 'bg-bloom-500 text-white ring-4 ring-bloom-200 dark:ring-bloom-900 scale-110'
                            : isCompleted
                            ? 'bg-rosewood-500 text-white'
                            : 'bg-warmgray-100 dark:bg-warmgray-800 text-warmgray-400'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className={`text-xs font-bold ${isCompleted ? 'text-warmgray-900 dark:text-white' : 'text-warmgray-400'}`}>
                          {stg.label}
                        </h4>
                        <p className="text-[11px] text-warmgray-500 dark:text-warmgray-400 leading-tight">
                          {stg.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

          {/* Tracking Number Callout */}
          {order.trackingNumber && (
            <div className="p-4 rounded-2xl bg-bloom-50/70 dark:bg-warmgray-800/80 border border-bloom-200 dark:border-bloom-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <Truck className="w-5 h-5 text-bloom-600 dark:text-bloom-400" />
                <div>
                  <span className="text-xs font-bold text-warmgray-900 dark:text-white block">
                    AWB Tracking: <span className="font-mono text-bloom-600 dark:text-bloom-400">{order.trackingNumber}</span>
                  </span>
                  <span className="text-[11px] text-warmgray-500">Shipped via {order.shippingMethod} (Delhivery / BlueDart)</span>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                In Transit
              </span>
            </div>
          )}

          {/* Timeline Notes History */}
          {order.statusHistory && order.statusHistory.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="font-serif font-bold text-sm text-warmgray-900 dark:text-white">
                Artisan Studio Log
              </h4>
              <div className="space-y-2">
                {order.statusHistory.map((hist, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-warmgray-50 dark:bg-warmgray-800/50 text-xs border border-warmgray-100 dark:border-warmgray-700/50">
                    <CheckCircle2 className="w-4 h-4 text-bloom-500 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-warmgray-900 dark:text-white">{hist.note}</p>
                      <p className="text-[10px] text-warmgray-400 mt-0.5">{new Date(hist.time).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Items & Shipping Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-warmgray-100 dark:border-warmgray-800">
            <div>
              <h4 className="font-serif font-bold text-sm text-warmgray-900 dark:text-white mb-3">
                Ordered Creations ({order.items?.length})
              </h4>
              <div className="space-y-2.5">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 rounded-xl bg-warmgray-50 dark:bg-warmgray-800/40">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-warmgray-900 dark:text-white truncate">{item.name}</p>
                      <p className="text-[11px] text-warmgray-500">{item.selectedColor} · Qty {item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold text-warmgray-900 dark:text-white">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-serif font-bold text-sm text-warmgray-900 dark:text-white mb-3">
                Shipping Destination
              </h4>
              <div className="p-4 rounded-2xl bg-warmgray-50 dark:bg-warmgray-800/40 text-xs text-warmgray-700 dark:text-warmgray-300 space-y-1">
                <p className="font-bold text-warmgray-900 dark:text-white">{order.customer?.name}</p>
                <p>{order.customer?.address}</p>
                <p>{order.customer?.city}, {order.customer?.state} {order.customer?.zip}</p>
                <p>{order.customer?.country}</p>
                <p className="text-warmgray-500 pt-1">Phone: {order.customer?.phone}</p>
                {order.giftWrap && (
                  <div className="mt-2 pt-2 border-t border-warmgray-200 dark:border-warmgray-700 text-rosewood-600 dark:text-rosewood-400 font-semibold">
                    🎁 Gift Wrapped with note: "{order.giftMessage}"
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-8 sm:p-12 text-center border border-warmgray-200 dark:border-warmgray-800 shadow-soft max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-bloom-100 dark:bg-warmgray-800 text-bloom-500 mx-auto flex items-center justify-center mb-4">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="font-serif font-bold text-xl text-warmgray-900 dark:text-white mb-2">
            Track Any Order
          </h3>
          <p className="text-xs text-warmgray-500 dark:text-warmgray-400 mb-6">
            Enter your order number (e.g. <code>AANU-89421</code>) to see live crafting and delivery updates.
          </p>
        </div>
      )}

    </div>
  );
};
