import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Gift,
  ArrowRight,
  Sparkles,
  Tag,
  CheckCircle2,
  Truck
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const CartDrawer = ({ onNavigate }) => {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotal,
    total,
    totalItemCount,
    giftWrap,
    setGiftWrap,
    giftMessage,
    setGiftMessage,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    isCouponLoading,
    discountAmount,
    giftWrapFee,
    shippingFee,
    isFreeShipping,
    freeShippingThreshold,
    freeShippingRemaining,
    freeShippingProgress
  } = useCart();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [showGiftMessageInput, setShowGiftMessageInput] = useState(giftWrap);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (couponCodeInput.trim()) {
      const res = await applyCoupon(couponCodeInput.trim());
      if (res?.success) {
        setCouponCodeInput('');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-warmgray-900 shadow-2xl flex flex-col border-l border-warmgray-200 dark:border-warmgray-800 animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-5 border-b border-warmgray-100 dark:border-warmgray-800 flex items-center justify-between bg-warmgray-50/50 dark:bg-warmgray-800/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-bloom-600 dark:text-bloom-400" />
              <h2 className="font-serif font-bold text-lg text-warmgray-900 dark:text-white">
                Your Yarn Basket ({totalItemCount})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-warmgray-400 hover:text-warmgray-700 dark:hover:text-warmgray-200 rounded-full hover:bg-warmgray-100 dark:hover:bg-warmgray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="px-5 py-3.5 bg-rosewood-50/70 dark:bg-warmgray-800/80 border-b border-rosewood-100 dark:border-warmgray-700">
            <div className="flex items-center justify-between text-xs font-semibold text-warmgray-800 dark:text-warmgray-200 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-bloom-600 dark:text-bloom-400" />
                {isFreeShipping ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    🎉 You unlocked FREE Craft Shipping!
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-bloom-600 dark:text-bloom-400">${freeShippingRemaining.toFixed(2)}</strong> more for FREE Shipping!
                  </span>
                )}
              </span>
              <span>{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="w-full bg-warmgray-200 dark:bg-warmgray-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-bloom-400 to-rosewood-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-bloom-50 dark:bg-warmgray-800 flex items-center justify-center text-bloom-400">
                  <ShoppingBag className="w-10 h-10 stroke-1" />
                </div>
                <h3 className="font-serif font-bold text-lg text-warmgray-900 dark:text-white mb-2">
                  Your basket is empty
                </h3>
                <p className="text-xs text-warmgray-500 dark:text-warmgray-400 max-w-xs mx-auto mb-6">
                  Explore our everlasting flower bouquets, squishy plushies, and handmade accessories!
                </p>
                <button
                  onClick={() => {
                    closeCart();
                    onNavigate('shop');
                  }}
                  className="px-6 py-2.5 bg-bloom-500 hover:bg-bloom-600 text-white rounded-full font-bold text-xs shadow-cozy transition-transform hover:scale-105"
                >
                  Start Shopping Blooms 🌸
                </button>
              </div>
            ) : (
              items.map((item, idx) => (
                <div
                  key={`${item.id}-${item.selectedColor}-${item.selectedSize}-${idx}`}
                  className="flex gap-3.5 p-3 rounded-2xl border border-warmgray-100 dark:border-warmgray-800 bg-white dark:bg-warmgray-800/60 shadow-xs"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover border border-warmgray-200 dark:border-warmgray-700 shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="font-medium text-sm text-warmgray-900 dark:text-white line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id, item.selectedColor, item.selectedSize)}
                          className="text-warmgray-400 hover:text-red-500 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-warmgray-500 dark:text-warmgray-400 mt-0.5">
                        {item.selectedColor} · {item.selectedSize}
                      </p>
                      {item.craftTimeHours > 0 && (
                        <span className="inline-block text-[10px] text-bloom-600 dark:text-bloom-400 font-semibold mt-0.5">
                          ⏱️ ~{item.craftTimeHours} hrs craft time
                        </span>
                      )}
                    </div>

                    {/* Quantity & Price */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-warmgray-200 dark:border-warmgray-700 rounded-lg overflow-hidden bg-warmgray-50 dark:bg-warmgray-900">
                        <button
                          onClick={() => updateQuantity(item.id, item.selectedColor, item.selectedSize, item.quantity - 1)}
                          className="p-1 px-2 text-warmgray-600 dark:text-warmgray-300 hover:bg-warmgray-200 dark:hover:bg-warmgray-700 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-warmgray-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.selectedColor, item.selectedSize, item.quantity + 1)}
                          className="p-1 px-2 text-warmgray-600 dark:text-warmgray-300 hover:bg-warmgray-200 dark:hover:bg-warmgray-700 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-sm text-bloom-600 dark:text-bloom-400">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Actions & Calculations */}
          {items.length > 0 && (
            <div className="p-5 border-t border-warmgray-200 dark:border-warmgray-800 bg-warmgray-50/90 dark:bg-warmgray-900 space-y-4">
              
              {/* Gift Wrap Toggle */}
              <div className="p-3 bg-white dark:bg-warmgray-800 rounded-xl border border-warmgray-200 dark:border-warmgray-700">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-rosewood-500" />
                    <div>
                      <span className="text-xs font-bold text-warmgray-900 dark:text-white block">
                        Add Artisan Gift Wrap (+$4.99)
                      </span>
                      <span className="text-[11px] text-warmgray-500 dark:text-warmgray-400">
                        Includes floral gift box, satin ribbon & handwritten note
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={giftWrap}
                    onChange={(e) => {
                      setGiftWrap(e.target.checked);
                      setShowGiftMessageInput(e.target.checked);
                    }}
                    className="w-4 h-4 text-bloom-500 rounded focus:ring-bloom-400"
                  />
                </label>

                {giftWrap && (
                  <div className="mt-2.5 pt-2.5 border-t border-warmgray-100 dark:border-warmgray-700">
                    <textarea
                      placeholder="Write your personalized handwritten card message..."
                      value={giftMessage}
                      onChange={(e) => setGiftMessage(e.target.value)}
                      rows={2}
                      className="w-full text-xs p-2 rounded-lg bg-warmgray-50 dark:bg-warmgray-900 border border-warmgray-200 dark:border-warmgray-700 focus:outline-none focus:ring-1 focus:ring-bloom-400 text-warmgray-900 dark:text-white placeholder:text-warmgray-400"
                    />
                  </div>
                )}
              </div>

              {/* Coupon Engine */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{appliedCoupon.code} ({appliedCoupon.description})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-red-500 hover:text-red-700 font-bold ml-2 underline text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-warmgray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Promo code (e.g. AANU15)"
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                        className="w-full uppercase text-xs py-2 pl-9 pr-3 rounded-xl bg-white dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-bloom-400 placeholder:normal-case"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isCouponLoading || !couponCodeInput.trim()}
                      className="px-4 py-2 bg-warmgray-800 hover:bg-black text-white dark:bg-warmgray-700 dark:hover:bg-warmgray-600 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
                    >
                      {isCouponLoading ? 'Applying...' : 'Apply'}
                    </button>
                  </form>
                )}
              </div>

              {/* Totals Breakdown */}
              <div className="space-y-1.5 text-xs text-warmgray-600 dark:text-warmgray-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-warmgray-900 dark:text-white">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                {giftWrap && (
                  <div className="flex justify-between">
                    <span>Artisan Gift Wrap & Note</span>
                    <span>+${giftWrapFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Craft Delivery</span>
                  <span>{shippingFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `$${shippingFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-warmgray-900 dark:text-white pt-2 border-t border-warmgray-200 dark:border-warmgray-700">
                  <span>Total</span>
                  <span className="text-base text-bloom-600 dark:text-bloom-400 font-serif font-bold">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  closeCart();
                  onNavigate('checkout');
                }}
                className="w-full py-3.5 bg-gradient-to-r from-bloom-500 to-rosewood-500 hover:from-bloom-600 hover:to-rosewood-600 text-white rounded-2xl font-bold text-sm shadow-cozy transition-all flex items-center justify-center gap-2 group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  closeCart();
                  onNavigate('shop');
                }}
                className="w-full text-center text-xs font-semibold text-warmgray-500 hover:text-bloom-600 dark:text-warmgray-400 transition-colors"
              >
                Continue Browsing Stitches
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
