import React, { useState, useEffect } from 'react';
import { ImageGallery } from '../components/product/ImageGallery';
import { ReviewsSection } from '../components/product/ReviewsSection';
import { ProductCard } from '../components/product/ProductCard';
import {
  Star,
  ShoppingBag,
  Heart,
  Clock,
  CheckCircle2,
  Truck,
  Sparkles,
  ShieldCheck,
  ArrowLeft,
  Share2,
  Check,
  Info
} from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export const ProductDetailPage = ({ productId, onNavigate }) => {
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description'); // 'description' | 'specs' | 'care' | 'reviews'
  const [isAddedAnim, setIsAddedAnim] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();
  const { user, isLoggedIn, openAuthModal } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const res = await api.getProductById(productId);
        setProduct(res.data);
        setRelated(res.related || []);
        setSelectedColor(res.data?.colors?.[0]?.name || '');
        setSelectedSize(res.data?.sizes?.[0] || 'Standard');
      } catch (err) {
        console.error('Product detail error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    if (productId) {
      fetchProduct();
      window.scrollTo(0, 0);
    }
  }, [productId]);

  if (isLoading) {
    return (
      <div className="py-32 text-center">
        <div className="w-12 h-12 border-4 border-bloom-200 border-t-bloom-500 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-warmgray-500">Unpacking handcrafted stitches...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-20 text-center max-w-md mx-auto">
        <h2 className="font-serif font-bold text-2xl mb-2">Crochet Piece Not Found</h2>
        <button
          onClick={() => onNavigate('shop')}
          className="px-6 py-2.5 bg-bloom-500 text-white rounded-full text-xs font-bold"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, { selectedColor, selectedSize });
    setIsAddedAnim(true);
    setTimeout(() => setIsAddedAnim(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, { selectedColor, selectedSize });
    if (!isLoggedIn || !user) {
      addToast('Please sign in or create an account to proceed to checkout 🌸', 'info');
      openAuthModal('login');
      return;
    }
    onNavigate('checkout');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('🌸 Link copied to clipboard to share!', 'success');
    }
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Breadcrumb / Back button */}
      <div className="flex items-center justify-between text-xs text-warmgray-500 dark:text-warmgray-400">
        <button
          onClick={() => onNavigate('shop')}
          className="flex items-center gap-1.5 hover:text-bloom-600 dark:hover:text-bloom-400 font-semibold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Handcrafted Catalog</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 hover:text-bloom-600 transition-colors p-1"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share Piece</span>
        </button>
      </div>

      {/* Main Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left: Multi-Image Gallery */}
        <div className="lg:col-span-7">
          <ImageGallery images={product.images} productName={product.name} />
        </div>

        {/* Right: Buy Box & Details */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Header & Badges */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-bloom-100 dark:bg-bloom-950 text-bloom-800 dark:text-bloom-300 text-xs font-bold uppercase tracking-wider">
                {product.yarnMaterial}
              </span>
              <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-warmgray-400 font-normal">({product.reviewCount} reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-warmgray-900 dark:text-white leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mt-3">
              <span className="text-3xl font-serif font-bold text-warmgray-900 dark:text-white">
                ₹{product.price?.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-base text-warmgray-400 line-through">
                  ₹{product.originalPrice?.toLocaleString('en-IN')}
                </span>
              )}
              {product.stock > 0 && (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                  In Stock ({product.stock} available)
                </span>
              )}
            </div>
          </div>

          {/* Craft Hours Highlight */}
          {product.craftTimeHours > 0 && (
            <div className="p-4 rounded-2xl bg-rosewood-50/70 dark:bg-warmgray-800/80 border border-rosewood-100 dark:border-warmgray-700 flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-rosewood-500 text-white shadow-xs">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-sm">
                <span className="font-bold text-warmgray-900 dark:text-white block">
                  Artisan Handcrafted in ~{product.craftTimeHours} Hours
                </span>
                <span className="text-xs sm:text-sm text-warmgray-600 dark:text-warmgray-400">
                  Tight uniform stitches, zero factory mass manufacturing.
                </span>
              </div>
            </div>
          )}

          {/* Color Palette Selector */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <div className="flex justify-between items-center text-sm font-bold mb-2">
                <span className="text-warmgray-700 dark:text-warmgray-300">
                  Select Color Tone: <span className="font-semibold text-bloom-600 dark:text-bloom-400">{selectedColor}</span>
                </span>
              </div>
              <div className="flex gap-2.5">
                {product.colors.map(color => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    style={{ backgroundColor: color.hex }}
                    className={`w-9 h-9 rounded-full border-2 transition-all ${
                      selectedColor === color.name
                        ? 'ring-2 ring-bloom-500 scale-110 border-white shadow-sm'
                        : 'border-warmgray-300 dark:border-warmgray-600'
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size / Arrangement Selector */}
          {product.sizes && product.sizes.length > 1 && (
            <div>
              <label className="block text-sm font-bold text-warmgray-700 dark:text-warmgray-300 mb-2">
                Size / Stem Bundle Option
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                      selectedSize === size
                        ? 'border-bloom-500 bg-bloom-50 dark:bg-bloom-950 text-bloom-800 dark:text-bloom-300 font-bold shadow-xs'
                        : 'border-warmgray-200 dark:border-warmgray-700 text-warmgray-700 dark:text-warmgray-300 hover:bg-warmgray-50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Actions */}
          <div className="space-y-3.5 pt-2">
            <div className="flex gap-3">
              {/* Quantity */}
              <div className="flex items-center border border-warmgray-200 dark:border-warmgray-700 rounded-2xl p-1 bg-warmgray-50 dark:bg-warmgray-800">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base text-warmgray-600 hover:bg-warmgray-200 dark:text-warmgray-300 transition-colors"
                >
                  -
                </button>
                <span className="w-8 text-center text-sm font-bold text-warmgray-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base text-warmgray-600 hover:bg-warmgray-200 dark:text-warmgray-300 transition-colors"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm sm:text-base shadow-cozy transition-all flex items-center justify-center gap-2 ${
                  isAddedAnim
                    ? 'bg-emerald-600 text-white'
                    : 'bg-bloom-500 hover:bg-bloom-600 text-white transform hover:scale-[1.02]'
                }`}
              >
                {isAddedAnim ? (
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

              {/* Wishlist button */}
              <button
                onClick={() => toggleWishlist(product)}
                className="p-3.5 rounded-2xl border border-warmgray-200 dark:border-warmgray-700 hover:bg-warmgray-50 dark:hover:bg-warmgray-800 text-warmgray-600 dark:text-warmgray-300 transition-colors"
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-rosewood-500 text-rosewood-500' : ''}`} />
              </button>
            </div>

            {/* Instant Buy Now */}
            <button
              onClick={handleBuyNow}
              className="w-full py-3.5 bg-warmgray-900 hover:bg-black text-white dark:bg-warmgray-800 dark:hover:bg-warmgray-700 rounded-2xl font-bold text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Instant Buy Now with Express Checkout</span>
            </button>
          </div>

          {/* Artisan Guarantees list */}
          <div className="pt-4 border-t border-warmgray-100 dark:border-warmgray-800 space-y-2.5 text-sm text-warmgray-600 dark:text-warmgray-300">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-bloom-500 shrink-0" />
              <span>Free delivery across India on orders over ₹999</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Lifetime bloom promise — never withers or wilts</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Includes dried French lavender sachet for gentle scent</span>
            </div>
          </div>

        </div>

      </div>

      {/* Tabs: Description, Specs, Care, Reviews */}
      <div className="pt-10 border-t border-warmgray-200 dark:border-warmgray-800">
        
        {/* Tab Headers */}
        <div className="flex gap-6 border-b border-warmgray-200 dark:border-warmgray-800 pb-3 overflow-x-auto text-sm sm:text-base font-bold">
          {[
            { id: 'description', label: 'Story & Description' },
            { id: 'specs', label: 'Stitch & Yarn Specs' },
            { id: 'care', label: 'Washing & Care Guide' },
            { id: 'reviews', label: `Customer Reviews (${product.reviewCount || 0})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2 border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-bloom-500 text-bloom-600 dark:text-bloom-400 font-extrabold'
                  : 'border-transparent text-warmgray-500 hover:text-warmgray-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="py-8">
          {activeTab === 'description' && (
            <div className="max-w-3xl space-y-4 text-base text-warmgray-700 dark:text-warmgray-300 leading-relaxed">
              <p>{product.description}</p>
              <p>{product.shortDescription}</p>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="max-w-xl bg-white dark:bg-warmgray-900 rounded-3xl p-6 border border-warmgray-200 dark:border-warmgray-800 text-sm space-y-3.5">
              <div className="flex justify-between py-2 border-b border-warmgray-100 dark:border-warmgray-800">
                <span className="font-bold text-warmgray-500">Yarn Material</span>
                <span className="font-semibold text-warmgray-900 dark:text-white">{product.yarnMaterial}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-warmgray-100 dark:border-warmgray-800">
                <span className="font-bold text-warmgray-500">Handcraft Duration</span>
                <span className="font-semibold text-warmgray-900 dark:text-white">~{product.craftTimeHours} Hours</span>
              </div>
              <div className="flex justify-between py-2 border-b border-warmgray-100 dark:border-warmgray-800">
                <span className="font-bold text-warmgray-500">Dimensions</span>
                <span className="font-semibold text-warmgray-900 dark:text-white">{product.dimensions || 'Custom Fit'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-warmgray-100 dark:border-warmgray-800">
                <span className="font-bold text-warmgray-500">Difficulty Grade</span>
                <span className="font-semibold text-warmgray-900 dark:text-white">{product.difficulty}</span>
              </div>
            </div>
          )}

          {activeTab === 'care' && (
            <div className="max-w-2xl bg-white dark:bg-warmgray-900 rounded-3xl p-6 sm:p-8 border border-warmgray-200 dark:border-warmgray-800 space-y-4 text-sm text-warmgray-700 dark:text-warmgray-300">
              <h4 className="font-serif font-bold text-lg text-warmgray-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-bloom-500" />
                <span>How to keep your crochet piece beautiful for decades</span>
              </h4>
              <p className="leading-relaxed text-sm sm:text-base">{product.careInstructions}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm">
                <div className="p-3.5 bg-warmgray-50 dark:bg-warmgray-800 rounded-2xl">
                  <strong>🌸 Dusting:</strong> Use a soft blush makeup brush or blowdryer on cold low setting.
                </div>
                <div className="p-3.5 bg-warmgray-50 dark:bg-warmgray-800 rounded-2xl">
                  <strong>🧼 Washing:</strong> Hand wash gently in cold water with mild wool detergent.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <ReviewsSection
              product={product}
              onReviewAdded={(updated) => setProduct(updated)}
            />
          )}
        </div>

      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="pt-10 border-t border-warmgray-200 dark:border-warmgray-800">
          <h3 className="text-2xl font-serif font-bold text-warmgray-900 dark:text-white mb-6">
            You May Also Love
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map(rel => (
              <ProductCard
                key={rel.id}
                product={rel}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
