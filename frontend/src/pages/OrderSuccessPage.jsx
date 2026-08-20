import React, { useState } from 'react';
import { CheckCircle2, Sparkles, Truck, Printer, ArrowRight, Heart, Flower2 } from 'lucide-react';
import { PrintableInvoice } from '../components/orders/PrintableInvoice';

export const OrderSuccessPage = ({ order, onNavigate }) => {
  const [showPrintModal, setShowPrintModal] = useState(false);

  if (!order) {
    return (
      <div className="py-24 text-center max-w-md mx-auto px-4">
        <h2 className="font-serif font-bold text-2xl mb-3">No Order Found</h2>
        <button
          onClick={() => onNavigate('home')}
          className="px-6 py-2.5 bg-bloom-500 text-white rounded-full font-bold text-xs"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="py-16 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-8 sm:p-12 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft-lg text-center space-y-8 animate-in zoom-in-95">
        
        {/* Confetti Celebration Icon */}
        <div className="relative inline-block">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-bloom-500 to-rosewood-500 text-white mx-auto flex items-center justify-center shadow-cozy">
            <Flower2 className="w-10 h-10 animate-bounce" />
          </div>
          <Sparkles className="w-6 h-6 text-amber-400 absolute -top-2 -right-2 animate-spin" style={{ animationDuration: '4s' }} />
        </div>

        {/* Headlines */}
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 block mb-1">
            Payment Confirmed · Stitch Queue Reserved
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-warmgray-900 dark:text-white">
            Thank you for your order, {order.customer?.name}!
          </h1>
          <p className="text-sm text-warmgray-600 dark:text-warmgray-300 mt-2 max-w-md mx-auto leading-relaxed">
            Order <strong className="font-mono text-bloom-600 dark:text-bloom-400">#{order.id}</strong> has been received by Artisan Aanu. A confirmation email with live tracking has been sent to <strong>{order.customer?.email}</strong>.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="p-6 rounded-2xl bg-warmgray-50 dark:bg-warmgray-800/60 border border-warmgray-100 dark:border-warmgray-700/60 text-left space-y-4 text-xs">
          <div className="flex justify-between items-center pb-3 border-b border-warmgray-200 dark:border-warmgray-700">
            <div>
              <span className="text-warmgray-400 block text-[10px] uppercase font-bold">Order ID</span>
              <span className="font-mono font-bold text-warmgray-900 dark:text-white text-sm">{order.id}</span>
            </div>
            <div className="text-right">
              <span className="text-warmgray-400 block text-[10px] uppercase font-bold">Total Paid</span>
              <span className="font-serif font-bold text-bloom-600 dark:text-bloom-400 text-sm">${order.total?.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-2">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-warmgray-700 dark:text-warmgray-300">
                <span className="truncate max-w-[280px]">
                  {item.quantity}x {item.name} ({item.selectedColor})
                </span>
                <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {order.giftWrap && (
            <div className="pt-2 border-t border-warmgray-200 dark:border-warmgray-700 text-rosewood-600 dark:text-rosewood-400 font-semibold">
              🎁 Includes Artisan Gift Box & Note: "{order.giftMessage}"
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('track-order', { id: order.id })}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-bloom-500 to-rosewood-500 hover:from-bloom-600 hover:to-rosewood-600 text-white rounded-full font-bold text-xs shadow-cozy flex items-center justify-center gap-2"
          >
            <Truck className="w-4 h-4" />
            <span>Track Handcrafting Timeline</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowPrintModal(true)}
            className="w-full sm:w-auto px-6 py-3.5 bg-warmgray-100 hover:bg-warmgray-200 dark:bg-warmgray-800 dark:hover:bg-warmgray-700 text-warmgray-800 dark:text-warmgray-200 rounded-full font-bold text-xs flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>View Printable Receipt</span>
          </button>
        </div>

        {/* Back to shop */}
        <button
          onClick={() => onNavigate('shop')}
          className="text-xs text-warmgray-500 hover:text-bloom-600 dark:text-warmgray-400 font-semibold"
        >
          ← Continue Browsing AanuBlooms
        </button>

      </div>

      {/* Printable Invoice Modal */}
      {showPrintModal && (
        <PrintableInvoice
          order={order}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </div>
  );
};
