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
      className="group bg-white dark:bg-warmgray-900 rounded-3xl overflow-hidden border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft hover:shadow-soft-lg transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1 relative"
    >
      {/* Badges Overlay */}
      <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1.5 items-start pointer-events-none">
        {product.isBestseller && (
          <span className="px-2.5 py-1 rounded-full bg-amber-400 text-warmgray-950 font-extrabold text-[10px] uppercase tracking-wider shadow-sm flex items-center gap-1">
            <Sparkles className="w-3 h-3 fill-warmgray-950" />
            Bestseller
          </span>
        )}
        {product.isNew && (
          <span className="px-2.5 py-1 rounded-full bg-rosewood-500 text-white font-extrabold text-[10px] uppercase tracking-wider shadow-sm">
            Fresh Stitch
          </span>
        )}
        {discountPercent > 0 && (
          <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-extrabold text-[10px] tracking-wider shadow-sm">
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
        className="absolute top-3.5 right-3.5 z-10 p-2.5 rounded-full bg-white/90 dark:bg-warmgray-900/90 backdrop-blur-md shadow-md text-warmgray-600 hover:text-rosewood-500 dark:text-warmgray-300 dark:hover:text-rosewood-400 transition-transform active:scale-90"
        aria-label="Save to wishlist"
      >
        <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rosewood-500 text-rosewood-500' : ''}`} />
      </button>

      {/* Image Container */}
      <div className="relative aspect-square w-full bg-warmgray-100 dark:bg-warmgray-800 overflow-hidden">
        <img
          src={currentImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Craft hours badge at bottom left of image */}
        {product.craftTimeHours > 0 && (
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-[11px] font-medium flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-amber-300" />
            <span>~{product.craftTimeHours}h handcraft</span>
          </div>
        )}

        {/* Quick View Button on Desktop Hover */}
        {onQuickView && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="hidden md:flex absolute bottom-3 right-3 p-2.5 rounded-xl bg-white/90 dark:bg-warmgray-900/90 backdrop-blur-md text-warmgray-800 dark:text-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-warmgray-800 items-center gap-1.5 text-xs font-semibold"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Yarn Material Pill */}
          <div className="flex items-center justify-between text-xs text-warmgray-500 dark:text-warmgray-400 mb-1.5">
            <span className="font-medium truncate max-w-[180px]">{product.yarnMaterial}</span>
            <div className="flex items-center gap-1 text-amber-500 font-bold shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-warmgray-400 text-[10px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-serif font-bold text-warmgray-900 dark:text-white text-base leading-snug line-clamp-2 group-hover:text-bloom-600 dark:group-hover:text-bloom-400 transition-colors">
            {product.name}
          </h3>

          {/* Short description */}
          <p className="text-xs text-warmgray-500 dark:text-warmgray-400 line-clamp-2 mt-1.5">
            {product.shortDescription}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-warmgray-100 dark:border-warmgray-800/80">
          {/* Color swatches preview */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 mb-3">
              {product.colors.map((color, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedColor(color.name);
                  }}
                  style={{ backgroundColor: color.hex }}
                  className={`w-4 h-4 rounded-full border transition-all ${
                    selectedColor === color.name
                      ? 'ring-2 ring-bloom-500 scale-110 border-white'
                      : 'border-warmgray-300 dark:border-warmgray-600'
                  }`}
                  title={color.name}
                  aria-label={color.name}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="text-[10px] text-warmgray-400 ml-1 font-medium">+{product.colors.length - 3}</span>
              )}
            </div>
          )}

          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg sm:text-xl font-bold font-serif text-warmgray-900 dark:text-white">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-warmgray-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleQuickAdd}
              className={`p-2.5 sm:px-3.5 sm:py-2 rounded-2xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs ${
                isAddedAnim
                  ? 'bg-emerald-600 text-white'
                  : 'bg-bloom-500 hover:bg-bloom-600 active:scale-95 text-white'
              }`}
              title="Add to Yarn Basket"
            >
              {isAddedAnim ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
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
