import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Heart, ShoppingBag, Trash2, Sparkles, ArrowRight } from 'lucide-react';

export const WishlistPage = ({ onNavigate }) => {
  const { wishlist, toggleWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddAllToCart = () => {
    wishlist.forEach(item => {
      addToCart(item, 1);
    });
  };

  return (
    <div className="py-12 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 min-h-[70vh]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-warmgray-200 dark:border-warmgray-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rosewood-600 dark:text-rosewood-400 block mb-1">
            Your Saved creations
          </span>
          <h1 className="text-3xl font-serif font-bold text-warmgray-900 dark:text-white">
            Handcrafted Wishlist ({wishlist.length})
          </h1>
          <p className="text-[11px] text-warmgray-500 dark:text-warmgray-400 mt-1">
            🌸 Your wishlist is saved locally on this device.
          </p>
        </div>

        {wishlist.length > 0 && (
          <div className="flex gap-3">
            <button
              onClick={handleAddAllToCart}
              className="px-5 py-2.5 bg-bloom-500 hover:bg-bloom-600 text-white rounded-full font-bold text-xs shadow-cozy flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add All to Basket</span>
            </button>
            <button
              onClick={clearWishlist}
              className="px-4 py-2.5 bg-warmgray-100 dark:bg-warmgray-800 text-warmgray-600 dark:text-warmgray-400 rounded-full font-bold text-xs hover:bg-warmgray-200"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="py-20 text-center max-w-md mx-auto relative">
          <div className="w-16 h-16 rounded-full bg-rosewood-50 dark:bg-warmgray-800 text-rosewood-500 mx-auto flex items-center justify-center mb-4 shadow-sm animate-float-slow">
            <Heart className="w-8 h-8 fill-rosewood-100 dark:fill-warmgray-700" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-warmgray-900 dark:text-white mb-2">
            Your Wishlist is Empty
          </h2>
          <p className="text-xs text-warmgray-500 dark:text-warmgray-400 mb-6">
            Tap the heart icon on any flower bouquet, flower pot, or gift to save it here!
          </p>
          <button
            onClick={() => onNavigate('shop')}
            className="px-7 py-3.5 bg-bloom-500 hover:bg-bloom-600 text-white rounded-full font-bold text-xs shadow-cozy btn-shimmer transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 active:scale-95 inline-flex items-center gap-2 group"
          >
            <span>Explore Handcrafted Catalog</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map(item => (
            <div
              key={item.id}
              className="bg-white dark:bg-warmgray-900 rounded-3xl overflow-hidden border border-warmgray-200 dark:border-warmgray-800 shadow-soft flex flex-col justify-between card-hover-3d hover:shadow-lg transition-all duration-300 group"
            >
              <div
                onClick={() => onNavigate('product-detail', { id: item.id })}
                className="cursor-pointer"
              >
                <div className="aspect-square w-full bg-warmgray-100 dark:bg-warmgray-800 relative overflow-hidden">
                  <img
                    src={item.images?.[0] || item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(item);
                    }}
                    className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-warmgray-900/90 rounded-full text-red-500 shadow-md hover:scale-110 active:scale-90 transition-transform"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4">
                  <span className="text-[11px] text-warmgray-500 block truncate">{item.material}</span>
                  <h3 className="font-serif font-bold text-sm text-warmgray-900 dark:text-white line-clamp-1 mt-0.5 group-hover:text-bloom-600 dark:group-hover:text-bloom-400 transition-colors">
                    {item.name}
                  </h3>
                  <p className="font-serif font-bold text-base text-bloom-600 dark:text-bloom-400 mt-2">
                    ₹{item.price?.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() => addToCart(item, 1)}
                  className="w-full py-2.5 bg-bloom-500 hover:bg-bloom-600 text-white rounded-xl font-bold text-xs shadow-xs btn-shimmer transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Move to Basket</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
