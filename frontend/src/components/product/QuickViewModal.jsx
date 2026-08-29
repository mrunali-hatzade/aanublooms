import React, { useState } from 'react';
import { X, Star, ShoppingBag, Heart, Clock, Sparkles, Check, ArrowRight, Share2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';

export const QuickViewModal = ({ product, onClose, onNavigate }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();

  const [selectedImage, setSelectedImage] = useState(product?.images?.[0] || product?.image);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, { selectedColor, selectedSize });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleShare = async () => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-warmgray-900 rounded-3xl max-w-3xl w-full border border-warmgray-200 dark:border-warmgray-800 shadow-2xl z-10 overflow-hidden animate-in zoom-in-95 max-h-[90vh] flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/80 dark:bg-warmgray-800/80 backdrop-blur-md text-warmgray-500 hover:text-warmgray-900 dark:hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Image Column */}
        <div className="md:w-1/2 bg-[#FAF7F2] dark:bg-warmgray-800 p-5 flex flex-col justify-between">
          <div className="aspect-square rounded-2xl overflow-hidden mb-3 bg-white dark:bg-warmgray-900 border border-warmgray-200/80 dark:border-warmgray-700 shadow-xs flex items-center justify-center p-2">
            <img src={selectedImage} alt={product.name} className="w-full h-full object-contain" />
          </div>

          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 justify-center">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-12 h-12 rounded-xl overflow-hidden border-2 bg-white dark:bg-warmgray-900 p-0.5 transition-all ${
                    selectedImage === img ? 'border-bloom-500 scale-105 shadow-xs' : 'border-transparent opacity-70'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Column */}
        <div className="md:w-1/2 p-5 sm:p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-bloom-100 dark:bg-bloom-950 text-bloom-800 dark:text-bloom-300">
                {product.material}
              </span>
              <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-warmgray-400 font-normal">({product.reviewCount})</span>
              </div>
            </div>

            <h3 className="font-serif font-bold text-lg text-warmgray-900 dark:text-white leading-tight mb-1.5">
              {product.name}
            </h3>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-xl font-serif font-bold text-warmgray-900 dark:text-white">
                ₹{product.price?.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-warmgray-400 line-through">
                  ₹{product.originalPrice?.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {product.craftTimeHours > 0 && (
              <div className="inline-flex items-center gap-1.5 text-xs text-bloom-700 dark:text-bloom-300 font-semibold mb-3 px-2.5 py-0.5 bg-bloom-50 dark:bg-warmgray-800 rounded-lg">
                <Clock className="w-3.5 h-3.5 text-bloom-500" />
                <span>Handcrafted in ~{product.craftTimeHours} hours</span>
              </div>
            )}

            <p className="text-xs text-warmgray-600 dark:text-warmgray-400 leading-relaxed line-clamp-3 mb-3">
              {product.description}
            </p>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-3">
                <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                  Color Palette: <span className="font-normal text-bloom-600">{selectedColor}</span>
                </label>
                <div className="flex gap-2">
                  {product.colors.map(color => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      style={{ backgroundColor: color.hex }}
                      className={`w-5 h-5 rounded-full border-2 transition-transform ${
                        selectedColor === color.name ? 'ring-2 ring-bloom-500 scale-110 border-white' : 'border-warmgray-300'
                      }`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 1 && (
              <div className="mb-3">
                <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                  Selection Option
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-medium border transition-all ${
                        selectedSize === size
                          ? 'border-bloom-500 bg-bloom-50 dark:bg-bloom-950 text-bloom-800 dark:text-bloom-300 font-bold'
                          : 'border-warmgray-200 dark:border-warmgray-700 text-warmgray-700 dark:text-warmgray-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="space-y-2.5 pt-3 border-t border-warmgray-100 dark:border-warmgray-800">
            <div className="flex gap-2.5">
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-cozy transition-all ${
                  isAdded ? 'bg-emerald-600 text-white' : 'bg-bloom-500 hover:bg-bloom-600 text-white'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Basket!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Basket · ₹{((product.price || 0) * quantity).toLocaleString('en-IN')}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className="p-2.5 rounded-xl border border-warmgray-200 dark:border-warmgray-700 hover:bg-warmgray-50 dark:hover:bg-warmgray-800 text-warmgray-600 dark:text-warmgray-300 transition-colors"
                title="Save to Wishlist"
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rosewood-500 text-rosewood-500' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 rounded-xl border border-warmgray-200 dark:border-warmgray-700 hover:bg-warmgray-50 dark:hover:bg-warmgray-800 text-warmgray-600 dark:text-warmgray-300 transition-colors"
                title="Share Product Link"
              >
                <Share2 className="w-4 h-4 text-bloom-600 dark:text-bloom-400" />
              </button>
            </div>

            <button
              onClick={() => {
                onClose();
                onNavigate('product-detail', { id: product.id });
              }}
              className="w-full text-center text-xs font-semibold text-bloom-600 dark:text-bloom-400 hover:underline flex items-center justify-center gap-1"
            >
              <span>View Full Craft Details & Care Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
