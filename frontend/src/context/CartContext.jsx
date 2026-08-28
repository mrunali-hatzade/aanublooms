import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useToast } from './ToastContext';
import { api } from '../services/api';
import { useSettings } from './SettingsContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('aanublooms_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isCouponLoading, setIsCouponLoading] = useState(false);

  const { addToast } = useToast();
  const { settings } = useSettings();

  useEffect(() => {
    localStorage.setItem('aanublooms_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product, quantity = 1, options = {}) => {
    const { selectedColor, selectedSize, customNotes } = options;
    const colorName = selectedColor || (product.colors?.[0]?.name || 'Default');
    const sizeName = selectedSize || (product.sizes?.[0] || 'Standard');

    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(
        item => item.id === product.id && item.selectedColor === colorName && item.selectedSize === sizeName
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevItems,
          {
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.images?.[0] || product.image,
            category: product.category,
            craftTimeHours: product.craftTimeHours,
            material: product.material,
            selectedColor: colorName,
            selectedSize: sizeName,
            customNotes: customNotes || '',
            quantity
          }
        ];
      }
    });

    addToast(`Added ${quantity}x "${product.name}" to your basket! 🧶`, 'success');
    setIsCartOpen(true);
  };

  const updateQuantity = (id, selectedColor, selectedSize, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id, selectedColor, selectedSize);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item => {
        if (item.id === id && item.selectedColor === selectedColor && item.selectedSize === selectedSize) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (id, selectedColor, selectedSize) => {
    setItems(prevItems =>
      prevItems.filter(
        item => !(item.id === id && item.selectedColor === selectedColor && item.selectedSize === selectedSize)
      )
    );
    addToast('Item removed from basket', 'info');
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    setGiftWrap(false);
    setGiftMessage('');
  };

  // Subtotal calculation
  const subtotal = useMemo(() => {
    return Number(items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2));
  }, [items]);

  const totalItemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  // Shipping from store settings
  const freeShippingThreshold = settings?.shipping?.freeShippingThreshold ?? 0;
  const standardShippingCharge = settings?.shipping?.standardCharge ?? 0;
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = freeShippingThreshold > 0 ? Math.min(100, (subtotal / freeShippingThreshold) * 100) : 100;

  const giftWrapFee = giftWrap ? 99 : 0;

  // Coupon discount calculation
  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discountType === 'percentage') {
      return Math.round((subtotal * appliedCoupon.value) / 100);
    }
    if (appliedCoupon.discountType === 'fixed') {
      return Math.min(subtotal, appliedCoupon.value);
    }
    return 0;
  }, [appliedCoupon, subtotal]);

  // Shipping calculation
  const isFreeShipping = subtotal >= freeShippingThreshold || appliedCoupon?.discountType === 'shipping';
  const shippingFee = isFreeShipping || items.length === 0 ? 0 : standardShippingCharge;

  // Total
  const total = useMemo(() => {
    if (items.length === 0) return 0;
    const calculated = subtotal - discountAmount + giftWrapFee + shippingFee;
    return Math.max(0, calculated);
  }, [subtotal, discountAmount, giftWrapFee, shippingFee, items]);

  const applyCoupon = async (code) => {
    if (!code) return { success: false, message: 'Please enter a coupon code' };
    setIsCouponLoading(true);
    try {
      const data = await api.validateCoupon(code, subtotal);
      if (data.success) {
        setAppliedCoupon(data.coupon);
        addToast(data.message, 'success');
        return { success: true, message: data.message };
      }
    } catch (err) {
      addToast(err.message || 'Invalid coupon code', 'error');
      return { success: false, message: err.message };
    } finally {
      setIsCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('Coupon removed', 'info');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        giftWrap,
        setGiftWrap,
        giftMessage,
        setGiftMessage,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        isCouponLoading,
        subtotal,
        totalItemCount,
        discountAmount,
        giftWrapFee,
        shippingFee,
        isFreeShipping,
        freeShippingThreshold,
        freeShippingRemaining,
        freeShippingProgress,
        total
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
