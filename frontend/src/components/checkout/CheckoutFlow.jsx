import React, { useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Truck,
  Gift,
  Lock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShoppingBag,
  Building2,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Tag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useLocation } from '../../context/LocationContext';
import { api } from '../../services/api';

export const CheckoutFlow = ({ onOrderPlaced, onNavigate }) => {
  const {
    items,
    subtotal,
    discountAmount,
    appliedCoupon,
    giftWrap,
    setGiftWrap,
    giftMessage,
    setGiftMessage,
    giftWrapFee,
    shippingFee,
    total,
    clearCart
  } = useCart();

  const { addToast } = useToast();
  const { location: savedLocation, isDetecting, detectCurrentLocation } = useLocation();

  const [isProcessing, setIsProcessing] = useState(false);

  // Guest Contact & Address form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    landmark: '',
    city: 'Pune',
    state: 'Maharashtra',
    zip: '411038',
    country: 'India'
  });

  // Shipping method
  const isFreeEligible = subtotal >= 999;
  const [shippingMethod, setShippingMethod] = useState(
    isFreeEligible ? 'Free Handcrafted Delivery (Pune & India)' : 'Standard Handcrafted Delivery'
  );
  const [shippingSpeedFee, setShippingSpeedFee] = useState(isFreeEligible ? 0 : 80);

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('upi');

  const indianStates = [
    'Maharashtra', 'Delhi NCR', 'Karnataka', 'Gujarat', 'Tamil Nadu',
    'Telangana', 'Uttar Pradesh', 'West Bengal', 'Rajasthan', 'Kerala',
    'Andhra Pradesh', 'Goa', 'Haryana', 'Punjab', 'Madhya Pradesh', 'Bihar', 'Assam'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleShippingSelect = (method, fee) => {
    setShippingMethod(method);
    setShippingSpeedFee(fee);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim()) {
      addToast('Please provide your Full Name and Mobile Number.', 'error');
      return;
    }

    if (!formData.address.trim() || !formData.city.trim() || !formData.zip.trim()) {
      addToast('Please provide your complete Delivery Address & PIN Code.', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.log(e);
      }

      const calculatedTotal = subtotal - discountAmount + (giftWrap ? giftWrapFee : 0) + shippingSpeedFee;

      const orderPayload = {
        customer: {
          name: formData.name.trim(),
          email: formData.email.trim() || `${formData.phone.trim()}@guest.aanublooms.com`,
          phone: formData.phone.trim(),
          address: formData.landmark.trim() ? `${formData.address.trim()}, Near ${formData.landmark.trim()}` : formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          zip: formData.zip.trim(),
          country: formData.country
        },
        items,
        subtotal,
        discount: discountAmount,
        appliedCoupon: appliedCoupon ? appliedCoupon.code : null,
        giftWrap,
        giftWrapFee: giftWrap ? giftWrapFee : 0,
        giftMessage: giftWrap ? giftMessage : '',
        shipping: shippingSpeedFee,
        shippingMethod,
        total: calculatedTotal,
        paymentMethod:
          paymentMethod === 'upi'
            ? 'UPI (Google Pay / PhonePe / Paytm / QR)'
            : paymentMethod === 'card'
            ? 'Credit / Debit Card (Online)'
            : 'Cash on Delivery (COD)'
      };

      const res = await api.createOrder(orderPayload);
      if (res.success && res.data) {
        clearCart();
        addToast('🌸 Order Placed Successfully! Artisan Aanu is preparing your yarn stitches.', 'success');
        if (onOrderPlaced) {
          onOrderPlaced(res.data);
        }
      }
    } catch (err) {
      addToast(err.message || 'Could not place order. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-16 text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 rounded-full bg-bloom-50 dark:bg-warmgray-800 text-bloom-500 mx-auto flex items-center justify-center mb-3">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-warmgray-900 dark:text-white mb-2">
          Your Basket is Empty
        </h2>
        <p className="text-xs text-warmgray-500 dark:text-warmgray-400 mb-5">
          Your basket is waiting for something handmade. Explore our handcrafted forever blooms and plushies.
        </p>
        <button
          onClick={() => onNavigate('shop')}
          className="px-6 py-2.5 bg-bloom-500 hover:bg-bloom-600 text-white rounded-full font-bold text-xs shadow-cozy transition-colors"
        >
          Explore Collection 🌸
        </button>
      </div>
    );
  }

  const finalTotal = subtotal - discountAmount + (giftWrap ? giftWrapFee : 0) + shippingSpeedFee;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title & Trust Banner */}
      <div className="mb-8 text-center sm:text-left">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bloom-100 dark:bg-bloom-950 text-bloom-800 dark:text-bloom-300 text-[11px] font-bold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          Frictionless 1-Step Guest Checkout (No Account Needed)
        </span>
        <h1 className="text-3xl font-serif font-bold text-warmgray-900 dark:text-white">
          Complete Your Order
        </h1>
        <p className="text-xs text-warmgray-500 dark:text-warmgray-400 mt-1">
          Handcrafted with love by artisan Aanu. Free delivery in Pune & across India on orders over ₹999.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Details (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Contact Information */}
          <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-6 border border-warmgray-200 dark:border-warmgray-800 shadow-soft-lg space-y-4">
            <div className="flex items-center justify-between border-b border-warmgray-100 dark:border-warmgray-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-bloom-100 dark:bg-bloom-900/50 text-bloom-700 dark:text-bloom-300 flex items-center justify-center text-xs font-extrabold">
                  01
                </div>
                <h2 className="text-base font-serif font-bold text-warmgray-900 dark:text-white">
                  Contact Information
                </h2>
              </div>
              <span className="text-[10px] text-warmgray-400 uppercase tracking-widest font-bold">Guest Order</span>
            </div>

            <p className="text-[11px] text-warmgray-500 dark:text-warmgray-400">
              We'll use these details to send your order confirmation and delivery updates.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Pooja Sharma"
                  required
                  className="w-full text-xs p-3 rounded-2xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white focus:ring-2 focus:ring-bloom-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                  Mobile Number (for Dispatch SMS/WhatsApp) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-warmgray-400">+91</span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="98765 43210"
                    required
                    className="w-full text-xs p-3 pl-11 rounded-2xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white focus:ring-2 focus:ring-bloom-400"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                  Email Address (Optional — for Digital Receipt)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-warmgray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="pooja@example.com"
                    className="w-full text-xs p-3 pl-10 rounded-2xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white focus:ring-2 focus:ring-bloom-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Delivery Address */}
          <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-6 border border-warmgray-200 dark:border-warmgray-800 shadow-soft-lg space-y-4">
            <div className="flex items-center justify-between border-b border-warmgray-100 dark:border-warmgray-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-bloom-100 dark:bg-bloom-900/50 text-bloom-700 dark:text-bloom-300 flex items-center justify-center text-xs font-extrabold">
                  02
                </div>
                <h2 className="text-base font-serif font-bold text-warmgray-900 dark:text-white">
                  Delivery Address
                </h2>
              </div>
              <span className="text-[11px] text-bloom-600 font-bold">India</span>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                  Flat / House No. / Building / Society *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="e.g. Flat 402, Rohan Viti, Kothrud"
                  required
                  className="w-full text-xs p-3 rounded-2xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white focus:ring-2 focus:ring-bloom-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleInputChange}
                  placeholder="e.g. Near City Pride Kothrud"
                  className="w-full text-xs p-3 rounded-2xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white focus:ring-2 focus:ring-bloom-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Pune"
                    required
                    className="w-full text-xs p-3 rounded-2xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white focus:ring-2 focus:ring-bloom-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                    State *
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full text-xs p-3 rounded-2xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white focus:ring-2 focus:ring-bloom-400"
                  >
                    {indianStates.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                    PIN Code (6 digits) *
                  </label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    placeholder="411038"
                    maxLength={6}
                    required
                    className="w-full text-xs p-3 rounded-2xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white focus:ring-2 focus:ring-bloom-400 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Shipping Speed */}
          <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-6 border border-warmgray-200 dark:border-warmgray-800 shadow-soft-lg space-y-3">
            <div className="flex items-center gap-2 border-b border-warmgray-100 dark:border-warmgray-800 pb-3">
              <div className="w-7 h-7 rounded-full bg-bloom-100 dark:bg-bloom-900/50 text-bloom-700 dark:text-bloom-300 flex items-center justify-center text-xs font-extrabold">
                03
              </div>
              <h2 className="text-base font-serif font-bold text-warmgray-900 dark:text-white">
                Shipping Method
              </h2>
            </div>

            <div className="space-y-2.5">
              <label
                onClick={() => handleShippingSelect(isFreeEligible ? 'Free Handcrafted Delivery (Pune & India)' : 'Standard Handcrafted Delivery', isFreeEligible ? 0 : 80)}
                className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  shippingSpeedFee === (isFreeEligible ? 0 : 80)
                    ? 'border-bloom-500 bg-bloom-50/40 dark:bg-bloom-950/20'
                    : 'border-warmgray-200 dark:border-warmgray-700 hover:border-warmgray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shippingSpeed"
                    checked={shippingSpeedFee === (isFreeEligible ? 0 : 80)}
                    onChange={() => {}}
                    className="text-bloom-600 focus:ring-bloom-400"
                  />
                  <div>
                    <p className="text-xs font-bold text-warmgray-900 dark:text-white">
                      {isFreeEligible ? '🌸 Free Handcrafted Delivery' : '📦 Standard Handcrafted Delivery'}
                    </p>
                    <p className="text-[11px] text-warmgray-500 dark:text-warmgray-400">
                      Delivered carefully in 3–6 business days with protective box packaging.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-bloom-600">
                  {isFreeEligible ? 'FREE' : '₹80'}
                </span>
              </label>

              <label
                onClick={() => handleShippingSelect('Express Studio Dispatch (Priority Stitches)', 150)}
                className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  shippingSpeedFee === 150
                    ? 'border-bloom-500 bg-bloom-50/40 dark:bg-bloom-950/20'
                    : 'border-warmgray-200 dark:border-warmgray-700 hover:border-warmgray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shippingSpeed"
                    checked={shippingSpeedFee === 150}
                    onChange={() => {}}
                    className="text-bloom-600 focus:ring-bloom-400"
                  />
                  <div>
                    <p className="text-xs font-bold text-warmgray-900 dark:text-white">
                      ⚡ Priority Studio Dispatch (Pune Same/Next Day Dispatch)
                    </p>
                    <p className="text-[11px] text-warmgray-500 dark:text-warmgray-400">
                      Top priority crafting queue & expedited delivery.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-warmgray-900 dark:text-white">₹150</span>
              </label>
            </div>
          </div>

          {/* 4. Payment Selection */}
          <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-6 border border-warmgray-200 dark:border-warmgray-800 shadow-soft-lg space-y-4">
            <div className="flex items-center gap-2 border-b border-warmgray-100 dark:border-warmgray-800 pb-3">
              <div className="w-7 h-7 rounded-full bg-bloom-100 dark:bg-bloom-900/50 text-bloom-700 dark:text-bloom-300 flex items-center justify-center text-xs font-extrabold">
                04
              </div>
              <h2 className="text-base font-serif font-bold text-warmgray-900 dark:text-white">
                Payment Method
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                  paymentMethod === 'upi'
                    ? 'border-bloom-500 bg-bloom-50/50 dark:bg-bloom-950/30 text-bloom-900 dark:text-bloom-100 shadow-xs'
                    : 'border-warmgray-200 dark:border-warmgray-700 hover:border-warmgray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <QrCode className="w-5 h-5 text-bloom-600" />
                  {paymentMethod === 'upi' && <CheckCircle2 className="w-4 h-4 text-bloom-600" />}
                </div>
                <div>
                  <p className="text-xs font-bold">UPI / QR</p>
                  <p className="text-[10px] text-warmgray-500 dark:text-warmgray-400">GPay, PhonePe, Paytm</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                  paymentMethod === 'card'
                    ? 'border-bloom-500 bg-bloom-50/50 dark:bg-bloom-950/30 text-bloom-900 dark:text-bloom-100 shadow-xs'
                    : 'border-warmgray-200 dark:border-warmgray-700 hover:border-warmgray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <CreditCard className="w-5 h-5 text-bloom-600" />
                  {paymentMethod === 'card' && <CheckCircle2 className="w-4 h-4 text-bloom-600" />}
                </div>
                <div>
                  <p className="text-xs font-bold">Cards / Banking</p>
                  <p className="text-[10px] text-warmgray-500 dark:text-warmgray-400">RuPay, Visa, NetBanking</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                  paymentMethod === 'cod'
                    ? 'border-bloom-500 bg-bloom-50/50 dark:bg-bloom-950/30 text-bloom-900 dark:text-bloom-100 shadow-xs'
                    : 'border-warmgray-200 dark:border-warmgray-700 hover:border-warmgray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Truck className="w-5 h-5 text-bloom-600" />
                  {paymentMethod === 'cod' && <CheckCircle2 className="w-4 h-4 text-bloom-600" />}
                </div>
                <div>
                  <p className="text-xs font-bold">Cash on Delivery</p>
                  <p className="text-[10px] text-warmgray-500 dark:text-warmgray-400">Pay on Hand Delivery</p>
                </div>
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Order Summary & Place Order (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-5">
          
          <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-6 border border-warmgray-200 dark:border-warmgray-800 shadow-soft-lg space-y-4">
            <h2 className="text-base font-serif font-bold text-warmgray-900 dark:text-white border-b border-warmgray-100 dark:border-warmgray-800 pb-3">
              Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
            </h2>

            {/* Items List */}
            <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <img
                    src={item.image || item.images?.[0] || 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=150'}
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover border border-warmgray-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-warmgray-900 dark:text-white truncate">{item.name}</h4>
                    <p className="text-[11px] text-warmgray-500">Qty: {item.quantity || 1} · ₹{item.price}</p>
                  </div>
                  <span className="text-xs font-bold text-warmgray-900 dark:text-white">
                    ₹{(item.price || 0) * (item.quantity || 1)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 border-t border-warmgray-100 dark:border-warmgray-800 pt-3 text-xs">
              <div className="flex justify-between text-warmgray-600 dark:text-warmgray-300">
                <span>Subtotal</span>
                <span className="font-semibold">₹{subtotal}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    Coupon Discount {appliedCoupon ? `(${appliedCoupon.code})` : ''}
                  </span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}

              {giftWrap && (
                <div className="flex justify-between text-warmgray-600 dark:text-warmgray-300">
                  <span>Gift Packaging & Handwritten Note</span>
                  <span className="font-semibold">+₹{giftWrapFee}</span>
                </div>
              )}

              <div className="flex justify-between text-warmgray-600 dark:text-warmgray-300">
                <span>Shipping ({shippingMethod.split(' ')[0]})</span>
                <span className="font-semibold text-bloom-600">
                  {shippingSpeedFee === 0 ? 'FREE' : `₹${shippingSpeedFee}`}
                </span>
              </div>

              <div className="flex justify-between items-center border-t border-warmgray-200 dark:border-warmgray-700 pt-3 text-sm">
                <span className="font-serif font-bold text-warmgray-900 dark:text-white">Grand Total</span>
                <span className="text-lg font-extrabold text-bloom-600 dark:text-bloom-400 font-mono">
                  ₹{finalTotal}
                </span>
              </div>
            </div>

            {/* Place Order CTA Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-bloom-500 to-rosewood-500 hover:from-bloom-600 hover:to-rosewood-600 text-white font-bold text-sm shadow-soft-lg transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isProcessing ? 'Handcrafting Order ID...' : `Place Order (₹${finalTotal})`}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="pt-2 flex items-center justify-center gap-4 text-[10px] text-warmgray-400 border-t border-warmgray-100 dark:border-warmgray-800">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" /> 100% Secure Checkout
              </span>
              <span>·</span>
              <span>🌸 Handmade in Pune</span>
            </div>
          </div>

        </div>

      </form>

    </div>
  );
};
