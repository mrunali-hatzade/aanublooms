import React from 'react';
import { Flower2, Printer, X } from 'lucide-react';

export const PrintableInvoice = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative bg-white text-warmgray-900 rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-warmgray-200 my-8">
        
        {/* Actions */}
        <div className="flex justify-between items-center pb-6 border-b border-warmgray-200 print:hidden">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-bloom-500 hover:bg-bloom-600 text-white rounded-full font-bold text-xs shadow-cozy flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice Receipt</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 text-warmgray-400 hover:text-warmgray-700 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Header */}
        <div className="pt-6 flex justify-between items-start">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-bloom-500 text-white flex items-center justify-center">
              <Flower2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl text-warmgray-900">AanuBlooms Studio</h2>
              <p className="text-[11px] text-warmgray-500">Handcrafted Crochet & Forever Blooms (India)</p>
            </div>
          </div>

          <div className="text-right">
            <h3 className="font-serif font-bold text-base text-warmgray-900">TAX INVOICE RECEIPT</h3>
            <p className="font-mono text-xs font-bold text-bloom-600 mt-0.5">#{order.id}</p>
            <p className="text-[11px] text-warmgray-500">
              Date: {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Billed To & Status */}
        <div className="grid grid-cols-2 gap-6 my-6 p-4 rounded-2xl bg-warmgray-50 border border-warmgray-100 text-xs">
          <div>
            <span className="font-bold text-warmgray-400 uppercase tracking-wider block text-[10px] mb-1">
              Billed & Delivered To
            </span>
            <p className="font-bold text-warmgray-900">{order.customer?.name}</p>
            <p className="text-warmgray-600">{order.customer?.address}</p>
            <p className="text-warmgray-600">{order.customer?.city}, {order.customer?.state} - {order.customer?.zip}</p>
            <p className="text-warmgray-600">Phone: {order.customer?.phone}</p>
            <p className="text-warmgray-600">{order.customer?.email}</p>
          </div>

          <div>
            <span className="font-bold text-warmgray-400 uppercase tracking-wider block text-[10px] mb-1">
              Payment & Fulfillment
            </span>
            <p><strong className="text-warmgray-900">Status:</strong> {order.status?.toUpperCase()}</p>
            <p><strong className="text-warmgray-900">Method:</strong> {order.paymentMethod}</p>
            <p><strong className="text-warmgray-900">Shipping:</strong> {order.shippingMethod}</p>
            {order.trackingNumber && (
              <p><strong className="text-warmgray-900">AWB Tracking:</strong> {order.trackingNumber}</p>
            )}
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full text-xs text-left mb-6">
          <thead>
            <tr className="border-b border-warmgray-200 text-warmgray-400 uppercase tracking-wider text-[10px]">
              <th className="py-2.5">Item</th>
              <th className="py-2.5 text-center">Qty</th>
              <th className="py-2.5 text-right">Unit Price</th>
              <th className="py-2.5 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-warmgray-100">
            {order.items?.map((item, idx) => (
              <tr key={idx}>
                <td className="py-3">
                  <p className="font-bold text-warmgray-900">{item.name}</p>
                  <p className="text-[11px] text-warmgray-500">{item.selectedColor} · {item.selectedSize}</p>
                </td>
                <td className="py-3 text-center text-warmgray-700">{item.quantity}</td>
                <td className="py-3 text-right text-warmgray-700">₹{item.price?.toLocaleString('en-IN')}</td>
                <td className="py-3 text-right font-bold text-warmgray-900">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="w-64 ml-auto space-y-1.5 text-xs text-warmgray-700 pt-4 border-t border-warmgray-200">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{order.subtotal?.toLocaleString('en-IN')}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Coupon ({order.appliedCoupon})</span>
              <span>-₹{order.discount?.toLocaleString('en-IN')}</span>
            </div>
          )}
          {order.giftWrap && (
            <div className="flex justify-between">
              <span>Gift Box & Card</span>
              <span>+₹{order.giftWrapFee?.toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Delivery</span>
            <span>{order.shipping === 0 ? 'FREE' : `₹${order.shipping?.toLocaleString('en-IN')}`}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-warmgray-900 pt-2 border-t border-warmgray-200">
            <span>Grand Total Paid</span>
            <span className="text-base text-bloom-600 font-serif font-bold">
              ₹{order.total?.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Gift Message Note if any */}
        {order.giftWrap && order.giftMessage && (
          <div className="mt-6 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs">
            <p className="font-bold text-rose-900 mb-0.5">🎁 Handwritten Gift Message Attached:</p>
            <p className="italic text-rose-800">"{order.giftMessage}"</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-warmgray-200 text-center text-xs text-warmgray-500 space-y-1">
          <p className="font-serif font-bold text-warmgray-800">Thank you for supporting slow artisan craft!</p>
          <p>Questions? Reach Artisan Aanu at <span className="underline">maker@aanublooms.com</span></p>
        </div>

      </div>
    </div>
  );
};
