import React, { useState } from 'react';
import { Heart, Star, ShoppingBag, Eye, Check, Share2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';

export const ProductCard = ({ product, onNavigate, onQuickView }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();

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
    setTimeout(() => setIsAddedAnim(false), 1600);
  };

  const handleShareProduct = async (e) => {
    e.stopPropagation();
    const productUrl = `${window.location.origin}/product/${product.id}`;
    if (navigator.share && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: `${product.name} | AanuBlooms`,
          text: `Check out "${product.name}" on AanuBlooms!`,
          url: productUrl
        });
        addToast('🌸 Shared successfully!', 'success');
        return;
      } catch (err) {
        if (err.name === 'AbortError') return;
      }
    }
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(productUrl);
        addToast(`🌸 Link to ${product.name} copied to clipboard!`, 'success');
      } catch {
        addToast('Unable to copy link.', 'info');
      }
    }
  };

  return (
    <div
      onClick={() => onNavigate('product-detail', { id: product.id })}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer flex flex-col justify-between bg-[#946171] dark:bg-[#7D4C5C] text-white rounded-2xl p-2.5 sm:p-3 border border-[#835261]/80 shadow-sm hover:shadow-xl card-hover-3d transition-all duration-300"
    >
      <div>
        {/* 1. Square Image Box */}
        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white dark:bg-warmgray-800 border border-white/20 shadow-2xs">
          <img
            src={currentImage}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
            loading="lazy"
          />

          {/* Top-Left Bestseller Pill Badge */}
          {product.isBestseller && (
            <span className="absolute top-2 left-2 z-10 px-2.5 py-0.5 rounded-full bg-honey-500 text-white font-bold text-[9px] tracking-wide shadow-2xs animate-pulse-subtle">
              ✨ Bestseller
            </span>
          )}

          {/* Top-Right Action Group: Wishlist & Share */}
          <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
            <button
              onClick={handleShareProduct}
              className="p-1.5 rounded-full bg-black/35 hover:bg-black/55 backdrop-blur-xs text-white hover:scale-110 transition-all active:scale-90 shadow-2xs"
              title="Share product link"
              aria-label="Share product"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(product);
              }}
              className="p-1.5 rounded-full bg-black/35 hover:bg-black/55 backdrop-blur-xs text-white hover:scale-110 transition-all active:scale-90 shadow-2xs"
              aria-label="Save to wishlist"
              title="Save to Wishlist"
            >
              <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-white text-white' : ''}`} />
            </button>
          </div>

          {/* Quick View Button on Hover */}
          {onQuickView && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              className="hidden md:flex absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-white/95 text-bloom-900 shadow-xs opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white items-center gap-1 text-[10px] font-bold transform translate-y-1 group-hover:translate-y-0"
            >
              <Eye className="w-3 h-3" />
              <span>Quick View</span>
            </button>
          )}
        </div>

        {/* 2. Product Details */}
        <div className="mt-2.5 space-y-1 text-left">
          {/* Title */}
          <h4 className="font-serif font-bold text-xs sm:text-sm text-white line-clamp-1 group-hover:text-honey-200 transition-colors">
            {product.name}
          </h4>

          {/* Tagline / Subtitle */}
          <p className="text-[11px] text-bloom-100/90 truncate font-medium">
            {product.shortDescription || 'Beautifully handcrafted with love'}
          </p>

          {/* Star Rating + Review Count */}
          <div className="flex items-center gap-1 text-[10px] text-bloom-100/80">
            <div className="flex items-center text-amber-300">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-2.5 h-2.5 transition-transform group-hover:scale-110 ${i < Math.round(product.rating || 5) ? 'fill-amber-300' : 'opacity-30'}`}
                />
              ))}
            </div>
            <span>({product.reviewCount || 28})</span>
          </div>

          {/* Price */}
          <div className="pt-0.5">
            <span className="font-serif font-extrabold text-sm sm:text-base text-white">
              ₹{product.price?.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Prominent Add to Cart & Wishlist Button Row */}
      <div className="mt-2.5 pt-2 border-t border-white/20 flex items-center gap-2">
        <button
          onClick={handleQuickAdd}
          className={`flex-1 py-2 px-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all transform active:scale-95 shadow-xs ${
            isAddedAnim
              ? 'bg-emerald-600 text-white scale-102'
              : 'bg-honey-500 hover:bg-honey-600 text-white btn-shimmer hover:shadow-md'
          }`}
          title="Add to Cart"
        >
          {isAddedAnim ? (
            <>
              <Check className="w-3.5 h-3.5 animate-bounce-subtle" />
              <span>Added!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="p-2 rounded-xl border border-white/30 text-white hover:bg-white/15 transition-all active:scale-90 shadow-2xs shrink-0"
          aria-label="Save to wishlist"
          title="Save to Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-white text-white' : ''}`} />
        </button>
      </div>
    </div>
  );
};
