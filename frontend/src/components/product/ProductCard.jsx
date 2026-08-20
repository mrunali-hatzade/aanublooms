import React, { useState } from 'react';
import { Heart, Star, ShoppingBag, Eye, Clock, Sparkles, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const ProductCard = ({ product, onNavigate, onQuickView }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || '');
  const [isAddedAnim, setIsAddedAnim] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const currentImage = (isHovered && product.images?.[1]) ? product.images[1] : (product.images?.[0] || product.image);

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addToCart(product, 1, {
      selectedColor: selectedColor || product.colors?.[0]?.name,
      selectedSize: product.sizes?.[0] || 'Standard'
    });
    setIsAddedAnim(true);
    setTimeout(() => setIsAddedAnim(false), 1500);
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      onClick={() => onNavigate('product-detail', { id: product.id })}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group bg-white dark:bg-warmgray-900 rounded-2xl overflow-hidden border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft hover:shadow-soft-lg transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1 relative"
    >
      {/* Badges Overlay */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start pointer-events-none">
        {product.isBestseller && (
          <span className="px-2 py-0.5 rounded-full bg-amber-400 text-warmgray-950 font-extrabold text-[9px] uppercase tracking-wider shadow-xs flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 fill-warmgray-950" />
            Bestseller
          </span>
        )}
        {product.isNew && (
          <span className="px-2 py-0.5 rounded-full bg-rosewood-500 text-white font-extrabold text-[9px] uppercase tracking-wider shadow-xs">
            Fresh Stitch
          </span>
        )}
        {discountPercent > 0 && (
          <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-extrabold text-[9px] tracking-wider shadow-xs">
            Save {discountPercent}%
          </span>
        )}
      </div>

      {/* Wishlist Heart Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product);
        }}
        className="absolute top-2.5 right-2.5 z-10 p-2 rounded-full bg-white/90 dark:bg-warmgray-900/90 backdrop-blur-md shadow-xs text-warmgray-600 hover:text-rosewood-500 dark:text-warmgray-300 dark:hover:text-rosewood-400 transition-transform active:scale-90"
        aria-label="Save to wishlist"
      >
        <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-rosewood-500 text-rosewood-500' : ''}`} />
      </button>

      {/* Image Container */}
      <div className="relative aspect-[4/3.2] sm:aspect-square w-full bg-warmgray-100 dark:bg-warmgray-800 overflow-hidden">
        <img
          src={currentImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Craft hours badge at bottom left of image */}
        {product.craftTimeHours > 0 && (
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] font-medium flex items-center gap-1">
            <Clock className="w-2.5 h-2.5 text-amber-300" />
            <span>~{product.craftTimeHours}h craft</span>
          </div>
        )}

        {/* Quick View Button on Desktop Hover */}
        {onQuickView && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="hidden md:flex absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-white/90 dark:bg-warmgray-900/90 backdrop-blur-md text-warmgray-800 dark:text-white shadow-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-warmgray-800 items-center gap-1 text-[11px] font-semibold"
          >
            <Eye className="w-3 h-3" />
            <span>Quick View</span>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Yarn Material & Rating */}
          <div className="flex items-center justify-between text-[11px] text-warmgray-500 dark:text-warmgray-400 mb-1">
            <span className="font-medium truncate max-w-[140px]">{product.yarnMaterial}</span>
            <div className="flex items-center gap-0.5 text-amber-500 font-bold shrink-0">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-warmgray-400 text-[9px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-serif font-bold text-warmgray-900 dark:text-white text-xs sm:text-sm leading-snug line-clamp-1 group-hover:text-bloom-600 dark:group-hover:text-bloom-400 transition-colors">
            {product.name}
          </h3>

          {/* Short description */}
          <p className="text-[11px] text-warmgray-500 dark:text-warmgray-400 line-clamp-1 mt-1">
            {product.shortDescription}
          </p>
        </div>

        <div className="mt-2.5 pt-2 border-t border-warmgray-100 dark:border-warmgray-800/80">
          {/* Color swatches preview */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1 mb-2">
              {product.colors.map((color, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedColor(color.name);
                  }}
                  style={{ backgroundColor: color.hex }}
                  className={`w-3 h-3 rounded-full border transition-all ${
                    selectedColor === color.name
                      ? 'ring-2 ring-bloom-500 scale-110 border-white'
                      : 'border-warmgray-300 dark:border-warmgray-600'
                  }`}
                  title={color.name}
                  aria-label={color.name}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="text-[9px] text-warmgray-400 ml-0.5 font-medium">+{product.colors.length - 3}</span>
              )}
            </div>
          )}

          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between gap-1.5">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-sm sm:text-base font-bold font-serif text-warmgray-900 dark:text-white">
                  ₹{product.price?.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-[10px] text-warmgray-400 line-through">
                    ₹{product.originalPrice?.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleQuickAdd}
              className={`p-1.5 sm:px-3 sm:py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1 transition-all shadow-xs ${
                isAddedAnim
                  ? 'bg-emerald-600 text-white'
                  : 'bg-bloom-500 hover:bg-bloom-600 active:scale-95 text-white'
              }`}
              title="Add to Basket"
            >
              {isAddedAnim ? (
                <>
                  <Check className="w-3 h-3" />
                  <span className="hidden sm:inline">Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3 h-3" />
                  <span className="hidden sm:inline">Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
