import React, { useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Truck,
  Gift,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
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

  const { user } = useAuth();
  const { addToast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Address form
  const [formData, setFormData] = useState({
    name: user?.name || 'Sophie Martin',
    email: user?.email || 'sophie.m@example.com',
    phone: '+1 (555) 234-5678',
    address: '124 Blossom Lane, Apt 3B',
    city: 'Portland',
    state: 'OR',
    zip: '97201',
    country: 'United States'
  });

  // Shipping method
  const [shippingMethod, setShippingMethod] = useState('Standard Craft Delivery');
  const [shippingSpeedFee, setShippingSpeedFee] = useState(shippingFee);

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [cardData, setCardData] = useState({
    number: '4242 •••• •••• 4242',
    name: 'Sophie Martin',
    expiry: '12/28',
    cvv: '888'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.address || !formData.city || !formData.zip) {
      addToast('Please complete all shipping address fields', 'error');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      // Trigger celebrate confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.log(e);
      }

      const orderPayload = {
        customer: formData,
        items,
        subtotal,
        discount: discountAmount,
        appliedCoupon: appliedCoupon ? appliedCoupon.code : null,
        giftWrap,
        giftWrapFee,
        giftMessage,
        shipping: shippingSpeedFee,
        shippingMethod,
        total: total + (shippingSpeedFee - shippingFee),
        paymentMethod: paymentMethod === 'credit_card' ? 'Credit Card (•••• 4242)' : paymentMethod === 'upi' ? 'UPI / QR Payment' : paymentMethod === 'paypal' ? 'PayPal' : 'Cash on Delivery'
      };

      const res = await api.createOrder(orderPayload);
      if (res.success) {
        clearCart();
        addToast('🌸 Order Placed with Love! Artisan Aanu is preparing your yarn.', 'success');
        if (onOrderPlaced) {
          onOrderPlaced(res.data);
        }
      }
    } catch (err) {
      addToast(err.message || 'Could not process order', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-20 text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 rounded-full bg-bloom-50 dark:bg-warmgray-800 text-bloom-500 mx-auto flex items-center justify-center mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-warmgray-900 dark:text-white mb-2">
          Your Basket is Empty
        </h2>
        <p className="text-xs text-warmgray-500 dark:text-warmgray-400 mb-6">
          Add some handcrafted bouquets or plushies before checking out.
        </p>
        <button
          onClick={() => onNavigate('shop')}
          className="px-6 py-3 bg-bloom-500 hover:bg-bloom-600 text-white rounded-full font-bold text-xs shadow-cozy"
        >
          Browse Crochet Catalog 🌸
        </button>
      </div>
    );
  }

  const finalGrandTotal = total + (shippingSpeedFee - shippingFee);

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Checkout Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-warmgray-900 dark:text-white">
          Secure Handcrafted Checkout
        </h1>
        <p className="text-xs text-warmgray-500 dark:text-warmgray-400 mt-1">
          Hand-stitched items packaged with care and sent straight from Aanu's studio.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form Flow (Steps) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Step Progress Bar */}
          <div className="flex items-center justify-between p-4 bg-white dark:bg-warmgray-900 rounded-2xl border border-warmgray-200/80 dark:border-warmgray-800 shadow-xs text-xs font-bold">
            <button
              onClick={() => setCurrentStep(1)}
              className={`flex items-center gap-1.5 ${currentStep === 1 ? 'text-bloom-600 dark:text-bloom-400 font-extrabold' : 'text-warmgray-500'}`}
            >
              <span className="w-5 h-5 rounded-full bg-bloom-100 dark:bg-bloom-950 flex items-center justify-center text-[10px]">1</span>
              <span>Shipping Address</span>
            </button>
            <span>→</span>
            <button
              onClick={() => validateStep1() && setCurrentStep(2)}
              className={`flex items-center gap-1.5 ${currentStep === 2 ? 'text-bloom-600 dark:text-bloom-400 font-extrabold' : 'text-warmgray-500'}`}
            >
              <span className="w-5 h-5 rounded-full bg-bloom-100 dark:bg-bloom-950 flex items-center justify-center text-[10px]">2</span>
              <span>Craft Delivery</span>
            </button>
            <span>→</span>
            <button
              onClick={() => validateStep1() && setCurrentStep(3)}
              className={`flex items-center gap-1.5 ${currentStep === 3 ? 'text-bloom-600 dark:text-bloom-400 font-extrabold' : 'text-warmgray-500'}`}
            >
              <span className="w-5 h-5 rounded-full bg-bloom-100 dark:bg-bloom-950 flex items-center justify-center text-[10px]">3</span>
              <span>Payment & Finish</span>
            </button>
          </div>

          {/* STEP 1: Shipping Address */}
          {currentStep === 1 && (
            <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-6 sm:p-8 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft space-y-4 animate-in fade-in">
              <h3 className="font-serif font-bold text-lg text-warmgray-900 dark:text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-bloom-500" />
                <span>Contact & Shipping Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                    Recipient Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full text-xs p-3 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                    Email Address (for craft updates)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full text-xs p-3 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full text-xs p-3 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                    Street Address & Apartment
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full text-xs p-3 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full text-xs p-3 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                    State / Province
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full text-xs p-3 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                    ZIP / Postal Code
                  </label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    className="w-full text-xs p-3 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => validateStep1() && setCurrentStep(2)}
                  className="px-8 py-3.5 bg-bloom-500 hover:bg-bloom-600 text-white rounded-full font-bold text-xs shadow-cozy flex items-center gap-2"
                >
                  <span>Select Craft Delivery</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Shipping Method & Gift Note */}
          {currentStep === 2 && (
            <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-6 sm:p-8 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft space-y-6 animate-in fade-in">
              <h3 className="font-serif font-bold text-lg text-warmgray-900 dark:text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-bloom-500" />
                <span>Choose Craft Delivery Method</span>
              </h3>

              <div className="space-y-3">
                <label
                  onClick={() => {
                    setShippingMethod('Standard Craft Delivery');
                    setShippingSpeedFee(shippingFee);
                  }}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    shippingMethod === 'Standard Craft Delivery'
                      ? 'border-bloom-500 bg-bloom-50/50 dark:bg-bloom-950/40'
                      : 'border-warmgray-200 dark:border-warmgray-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === 'Standard Craft Delivery'}
                      readOnly
                      className="w-4 h-4 text-bloom-500"
                    />
                    <div>
                      <p className="text-xs font-bold text-warmgray-900 dark:text-white">
                        Standard Handcrafted Delivery (3-5 business days)
                      </p>
                      <p className="text-[11px] text-warmgray-500">
                        Carefully bubble-wrapped and packaged in kraft boxes.
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-xs text-bloom-600 dark:text-bloom-400">
                    {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                  </span>
                </label>

                <label
                  onClick={() => {
                    setShippingMethod('Express Priority Craft Delivery');
                    setShippingSpeedFee(12.00);
                  }}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    shippingMethod === 'Express Priority Craft Delivery'
                      ? 'border-bloom-500 bg-bloom-50/50 dark:bg-bloom-950/40'
                      : 'border-warmgray-200 dark:border-warmgray-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === 'Express Priority Craft Delivery'}
                      readOnly
                      className="w-4 h-4 text-bloom-500"
                    />
                    <div>
                      <p className="text-xs font-bold text-warmgray-900 dark:text-white">
                        Express Priority Rush Delivery (1-2 business days)
                      </p>
                      <p className="text-[11px] text-warmgray-500">
                        Priority stitch queue & expedited air tracking.
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-xs text-bloom-600 dark:text-bloom-400">
                    $12.00
                  </span>
                </label>
              </div>

              {/* Gift Wrap option */}
              <div className="p-4 rounded-2xl bg-rosewood-50 dark:bg-warmgray-800/80 border border-rosewood-200 dark:border-rosewood-900 space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Gift className="w-5 h-5 text-rosewood-500" />
                    <div>
                      <span className="text-xs font-bold text-warmgray-900 dark:text-white">
                        Include Artisan Gift Box & Handwritten Card (+$4.99)
                      </span>
                      <p className="text-[11px] text-warmgray-500">
                        Tied with satin ribbon and dried lavender sprig.
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={giftWrap}
                    onChange={(e) => setGiftWrap(e.target.checked)}
                    className="w-4 h-4 text-rosewood-500 rounded"
                  />
                </label>

                {giftWrap && (
                  <textarea
                    rows={2}
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    placeholder="Enter your personalized gift card message..."
                    className="w-full text-xs p-2.5 rounded-xl bg-white dark:bg-warmgray-900 border border-rosewood-200 dark:border-rosewood-800 text-warmgray-900 dark:text-white"
                  />
                )}
              </div>

              <div className="flex justify-between items-center pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-bold text-warmgray-500 hover:text-warmgray-800 dark:text-warmgray-400 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Address</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-8 py-3.5 bg-bloom-500 hover:bg-bloom-600 text-white rounded-full font-bold text-xs shadow-cozy flex items-center gap-2"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Simulated Payment Method */}
          {currentStep === 3 && (
            <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-6 sm:p-8 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft space-y-6 animate-in fade-in">
              <h3 className="font-serif font-bold text-lg text-warmgray-900 dark:text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-bloom-500" />
                <span>Simulated Secure Payment</span>
              </h3>

              {/* Payment selector tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'credit_card', label: 'Credit Card', icon: CreditCard },
                  { id: 'upi', label: 'UPI / QR Scan', icon: QrCode },
                  { id: 'paypal', label: 'PayPal', icon: ShieldCheck },
                  { id: 'cod', label: 'Cash on Delivery', icon: Truck }
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setPaymentMethod(tab.id)}
                      className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all text-xs font-semibold ${
                        paymentMethod === tab.id
                          ? 'border-bloom-500 bg-bloom-50 dark:bg-warmgray-800 text-bloom-700 dark:text-bloom-300 font-bold shadow-xs'
                          : 'border-warmgray-200 dark:border-warmgray-800 text-warmgray-600 dark:text-warmgray-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Card visual preview */}
              {paymentMethod === 'credit_card' && (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-gradient-to-tr from-warmgray-900 via-bloom-900 to-rosewood-900 text-white shadow-xl max-w-sm mx-auto">
                    <div className="flex justify-between items-center mb-6">
                      <span className="font-serif italic font-bold">AanuBlooms Pay</span>
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <p className="font-mono tracking-widest text-base mb-4">{cardData.number}</p>
                    <div className="flex justify-between text-xs font-medium text-warmgray-300">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider block text-warmgray-400">Cardholder</span>
                        <span>{cardData.name}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-wider block text-warmgray-400">Expires</span>
                        <span>{cardData.expiry}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-warmgray-700 dark:text-warmgray-300 mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardData.number}
                        onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-warmgray-700 dark:text-warmgray-300 mb-1">Name on Card</label>
                      <input
                        type="text"
                        value={cardData.name}
                        onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* UPI Simulator */}
              {paymentMethod === 'upi' && (
                <div className="p-6 rounded-2xl bg-warmgray-50 dark:bg-warmgray-800/80 text-center space-y-3">
                  <div className="w-32 h-32 mx-auto bg-white p-2 rounded-xl shadow border border-warmgray-200 flex items-center justify-center">
                    <QrCode className="w-24 h-24 text-warmgray-900" />
                  </div>
                  <p className="text-xs font-bold text-warmgray-800 dark:text-warmgray-200">
                    Scan with any UPI App (GPay / PhonePe / Paytm)
                  </p>
                  <p className="text-[11px] text-warmgray-500 font-mono">
                    UPI ID: aanublooms@artisanupi
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs font-bold text-warmgray-500 hover:text-warmgray-800 dark:text-warmgray-400 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Shipping</span>
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handlePlaceOrder}
                  className="px-10 py-4 bg-gradient-to-r from-bloom-500 via-bloom-600 to-rosewood-500 hover:from-bloom-600 hover:to-rosewood-600 text-white rounded-full font-bold text-sm shadow-cozy flex items-center gap-2 transform hover:scale-105 transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>{isProcessing ? 'Weaving Order...' : `Complete Order · $${finalGrandTotal.toFixed(2)}`}</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Sticky Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-6 sm:p-7 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft sticky top-28 space-y-5">
            <h3 className="font-serif font-bold text-lg text-warmgray-900 dark:text-white pb-3 border-b border-warmgray-100 dark:border-warmgray-800">
              Basket Items ({items.length})
            </h3>

            {/* List of items */}
            <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
              {items.map((item, idx) => (
                <div key={idx} className="flex gap-3 items-center">
                  <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover border border-warmgray-200 dark:border-warmgray-700 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-warmgray-900 dark:text-white truncate">{item.name}</p>
                    <p className="text-[11px] text-warmgray-500">{item.selectedColor} · {item.selectedSize} · Qty {item.quantity}</p>
                  </div>
                  <span className="font-bold text-xs text-warmgray-900 dark:text-white shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="pt-4 border-t border-warmgray-100 dark:border-warmgray-800 space-y-2 text-xs text-warmgray-600 dark:text-warmgray-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-warmgray-900 dark:text-white">${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              {giftWrap && (
                <div className="flex justify-between">
                  <span>Artisan Gift Box & Note</span>
                  <span>+${giftWrapFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Craft Delivery ({shippingMethod.includes('Express') ? 'Priority' : 'Standard'})</span>
                <span>{shippingSpeedFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `$${shippingSpeedFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-warmgray-900 dark:text-white pt-3 border-t border-warmgray-200 dark:border-warmgray-700">
                <span>Total Due</span>
                <span className="text-bloom-600 dark:text-bloom-400 font-serif font-bold text-lg">
                  ${finalGrandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="p-3 bg-warmgray-50 dark:bg-warmgray-800 rounded-xl text-[11px] text-warmgray-500 dark:text-warmgray-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>256-Bit Encrypted & Artisan Guaranteed Delivery</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
