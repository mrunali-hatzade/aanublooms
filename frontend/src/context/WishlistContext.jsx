import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { safeStorage } from '../utils/storage';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    return safeStorage.getJSON('aanublooms_wishlist', []);
  });

  const { addToast } = useToast();

  useEffect(() => {
    safeStorage.setItem('aanublooms_wishlist', wishlist);
  }, [wishlist]);

  const toggleWishlist = (product) => {
    const exists = wishlist.some(item => item.id === product.id);
    if (exists) {
      setWishlist(prev => prev.filter(item => item.id !== product.id));
      addToast(`Removed "${product.name}" from your Wishlist`, 'info');
    } else {
      setWishlist(prev => [...prev, product]);
      addToast(`Saved "${product.name}" to your Wishlist ❤️`, 'success');
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, clearWishlist, count: wishlist.length }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
