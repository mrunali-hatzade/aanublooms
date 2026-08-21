import React, { useState } from 'react';
import { Heart, Star, ShoppingBag, Eye, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const ProductCard = ({ product, onNavigate, onQuickView }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [isHovered, setIsHovered] = useState(false);
  const [isAddedAnim, setIsAddedAnim] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const currentImage = (isHovered && product.images?.[1]) ? product.images[1] : (product.images?.[0] || product.image || '/images/aanu-blooms-signature-set.jpeg');

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addToCart(product, 1, {
      selectedColor: product.colors?.[0]?.name || 'Standard',
      selectedSize: product.sizes?.[0] || 'Standard'
    });
    setIsAddedAnim(true);
    setTimeout(() => setIsAddedAnim(false), 1500);
  };

  return (
    <div
      onClick={() => onNavigate('product-detail', { id: product.id })}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer flex flex-col transition-all duration-300"
    >
      {/* 1. Square Image Box */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-warmgray-800 border border-warmgray-200/70 dark:border-warmgray-700/80 shadow-2xs group-hover:shadow-md transition-all duration-300">
        <img
          src={currentImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Top-Left Bestseller Pill Badge */}
        {product.isBestseller && (
          <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-[#E07A5F] text-white font-medium text-[9px] tracking-wide shadow-2xs">
            Bestseller
          </span>
        )}

        {/* Top-Right Wishlist Heart */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/80 dark:bg-warmgray-900/80 backdrop-blur-xs text-warmgray-600 hover:text-rosewood-500 dark:text-warmgray-300 transition-transform active:scale-90 shadow-2xs"
          aria-label="Save to wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-[#E07A5F] text-[#E07A5F]' : ''}`} />
        </button>

        {/* Quick View Button on Hover */}
        {onQuickView && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="hidden md:flex absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-white/95 dark:bg-warmgray-900/95 backdrop-blur-xs text-warmgray-800 dark:text-white shadow-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-warmgray-800 items-center gap-1 text-[10px] font-semibold"
          >
            <Eye className="w-3 h-3" />
            <span>Quick View</span>
          </button>
        )}
      </div>

      {/* 2. Compact Product Details */}
      <div className="mt-2 space-y-0.5 text-left">
        {/* Title */}
        <h4 className="font-serif font-bold text-xs sm:text-sm text-warmgray-900 dark:text-white line-clamp-1 group-hover:text-bloom-600 dark:group-hover:text-bloom-400 transition-colors">
          {product.name}
        </h4>

        {/* Price and Quick Add */}
        <div className="flex items-center justify-between pt-0.5">
          <span className="font-serif font-bold text-xs sm:text-sm text-warmgray-900 dark:text-white">
            ₹{product.price?.toLocaleString('en-IN')}
          </span>

          <button
            onClick={handleQuickAdd}
            className={`p-1 rounded-lg transition-all ${
              isAddedAnim
                ? 'bg-emerald-600 text-white'
                : 'text-warmgray-500 hover:text-bloom-600 hover:bg-bloom-50 dark:hover:bg-warmgray-800'
            }`}
            title="Add to Basket"
          >
            {isAddedAnim ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Star Rating + Review Count */}
        <div className="flex items-center gap-1 text-[10px] text-warmgray-500 dark:text-warmgray-400">
          <div className="flex items-center text-[#E07A5F]">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-2.5 h-2.5 ${i < Math.round(product.rating || 5) ? 'fill-[#E07A5F]' : 'opacity-30'}`}
              />
            ))}
          </div>
          <span>({product.reviewCount || 32})</span>
        </div>
      </div>
    </div>
  );
};
