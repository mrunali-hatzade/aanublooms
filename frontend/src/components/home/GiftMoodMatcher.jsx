import React, { useState } from 'react';
import { Sparkles, Heart, Gift, ArrowRight, Check, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export const GiftMoodMatcher = ({ onNavigate }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [recipient, setRecipient] = useState('friend');
  const [vibe, setVibe] = useState('cheerful');
  const [isAdded, setIsAdded] = useState(false);

  const recipientOptions = [
    { id: 'friend', label: 'Best Friend', emoji: '👯‍♀️' },
    { id: 'partner', label: 'Partner / Love', emoji: '💖' },
    { id: 'mom', label: 'Mom / Family', emoji: '🌸' },
    { id: 'self', label: 'Myself (Self-Care)', emoji: '🧘‍♀️' },
    { id: 'graduation', label: 'Celebration / Grad', emoji: '🎓' }
  ];

  const vibeOptions = [
    { id: 'cheerful', label: 'Sunny & Cheerful', emoji: '🌻', color: 'from-amber-100 to-yellow-100 dark:from-amber-950 dark:to-yellow-900' },
    { id: 'romantic', label: 'Soft & Romantic', emoji: '🌷', color: 'from-rose-100 to-pink-100 dark:from-rose-950 dark:to-pink-900' },
    { id: 'cottagecore', label: 'Cottagecore Earthy', emoji: '🌿', color: 'from-emerald-100 to-teal-100 dark:from-emerald-950 dark:to-teal-900' },
    { id: 'cuddly', label: 'Velvet & Cuddly', emoji: '🧸', color: 'from-purple-100 to-indigo-100 dark:from-purple-950 dark:to-indigo-900' }
  ];

  // Smart matching pairings based on recipient and vibe
  const bundleDatabase = {
    'friend-cheerful': {
      title: 'The Sunshine Joy Gift Hamper',
      subtitle: 'Sunflower Bloom Pot + Velvet Honeybee + Free Gift Box',
      price: 1099,
      originalPrice: 1398,
      image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=600&q=80',
      itemsIncluded: ['Sunny Sunflower in Ceramic Pot', 'Chubby Velvet Honeybee flower pots', 'Artisan Gift Ribbon & Card']
    },
    'partner-romantic': {
      title: 'The Forever Romance Keepsake Box',
      subtitle: 'Everlasting Pink Tulip Bouquet + Strawberry Bunny + Satin Box',
      price: 1999,
      originalPrice: 2499,
      image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=600&q=80',
      itemsIncluded: ['Everlasting 9-Stem Tulip Bouquet', 'Strawberry Milk Bunny Plush', 'Embroidered Keepsake Ribbon']
    },
    'mom-cottagecore': {
      title: 'The Cozy Home Comfort Bundle',
      subtitle: 'Floral Coaster Set of 4 + Daisy Granny Square Tote',
      price: 1899,
      originalPrice: 2398,
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
      itemsIncluded: ['Pastel Daisy Market Tote', 'Botanical Mug Rug Coaster Set', 'Organic Cotton Canvas Bag']
    },
    'self-cuddly': {
      title: 'The Ultimate Snuggle Self-Care Treat',
      subtitle: 'Strawberry Bunny Plushie + Velvet Duo Scrunchies',
      price: 1199,
      originalPrice: 1498,
      image: 'https://images.unsplash.com/photo-1558877385-81a1c7e67d72?auto=format&fit=crop&w=600&q=80',
      itemsIncluded: ['Chubby Chenille Bunny Plush', 'Velvet Strawberry Hair Scrunchies (Pack of 2)', 'Scented Lavender Bag']
    },
    'graduation-cheerful': {
      title: 'The Bright Future Graduation creations Box',
      subtitle: 'Sunflower Bloom + Daisy Keychain + Custom Note',
      price: 849,
      originalPrice: 1048,
      image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=600&q=80',
      itemsIncluded: ['Sunny Sunflower Desk Pot', 'Lucky Daisy Golden Keychain', 'Handwritten Congratulations Note']
    }
  };

  const key = `${recipient}-${vibe}`;
  const currentBundle = bundleDatabase[key] || bundleDatabase['friend-cheerful'];

  const handleAddBundleToCart = () => {
    const bundleProduct = {
      id: `bundle-${key}-${Date.now()}`,
      name: currentBundle.title,
      price: currentBundle.price,
      originalPrice: currentBundle.originalPrice,
      material: 'Premium colourful pipe cleaners',
      rating: 5.0,
      image: currentBundle.image,
      isBestseller: true
    };

    addToCart(bundleProduct, 1, {
      selectedColor: 'Curated Artisan Palette',
      selectedSize: 'Deluxe Gift Box Bundle'
    });

    setIsAdded(true);
    showToast(`Added ${currentBundle.title} to Basket! 🎁`, 'success');
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <section className="py-8 sm:py-12 bg-gradient-to-b from-rose-50/50 via-warmgray-50 to-purple-50/40 dark:from-warmgray-950 dark:via-warmgray-900 dark:to-warmgray-950 border-b border-warmgray-200 dark:border-warmgray-800 transition-colors">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-7">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Interactive Gift Matcher
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-warmgray-900 dark:text-white whitespace-nowrap">
            Find the Perfect Handcrafted Gift in 2 Clicks
          </h2>
          <p className="text-xs sm:text-sm text-warmgray-500 dark:text-warmgray-400 mt-1">
            Tell us who it's for and the mood — we'll pair the ideal bouquet and plushie combination.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white dark:bg-warmgray-900 rounded-3xl p-6 sm:p-8 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft">
          
          {/* Left: Interactive Quiz Selectors */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Step 1: Who is this for? */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-warmgray-600 dark:text-warmgray-400 mb-2">
                1. Who are you gifting today?
              </label>
              <div className="flex flex-wrap gap-2">
                {recipientOptions.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setRecipient(item.id)}
                    className={`px-3.5 py-2 rounded-2xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
                      recipient === item.id
                        ? 'border-bloom-500 bg-bloom-50 dark:bg-bloom-950 text-bloom-700 dark:text-bloom-300 ring-2 ring-bloom-400/30 scale-102 shadow-xs'
                        : 'border-warmgray-200 dark:border-warmgray-700 bg-warmgray-50 dark:bg-warmgray-800/60 text-warmgray-700 dark:text-warmgray-300 hover:border-warmgray-300'
                    }`}
                  >
                    <span>{item.emoji}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: What's the vibe? */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-warmgray-600 dark:text-warmgray-400 mb-2">
                2. What vibe or aesthetic do they love?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5">
                {vibeOptions.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setVibe(item.id)}
                    className={`p-3 rounded-2xl text-xs font-bold border text-left flex items-center gap-2.5 transition-all ${
                      vibe === item.id
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 ring-2 ring-purple-400/30 shadow-xs'
                        : 'border-warmgray-200 dark:border-warmgray-700 bg-warmgray-50 dark:bg-warmgray-800/60 text-warmgray-700 dark:text-warmgray-300 hover:border-warmgray-300'
                    }`}
                  >
                    <span className="text-xl">{item.emoji}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Free Gift Packaging Badge */}
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 flex items-center gap-3">
              <Gift className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-amber-900 dark:text-amber-200 block">
                  Includes Free Luxury Gift Box & Handwritten Card
                </span>
                <span className="text-amber-700 dark:text-amber-400 text-[11px]">
                  All bundle gift pairings arrive wrapped with satin ribbon and bubble protection across Pune.
                </span>
              </div>
            </div>

          </div>

          {/* Right: Smart Matched Pairing Result */}
          <div className="lg:col-span-5 bg-gradient-to-tr from-bloom-50/80 to-purple-50/80 dark:from-warmgray-800 dark:to-warmgray-800/60 rounded-2xl p-5 border border-bloom-200/80 dark:border-warmgray-700 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-bloom-700 dark:text-bloom-300 bg-white dark:bg-warmgray-900 px-2.5 py-0.5 rounded-full shadow-xs">
                  ✨ Perfect Match
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                  Save ₹{(currentBundle.originalPrice - currentBundle.price)}
                </span>
              </div>

              {/* Matched Photo */}
              <div className="aspect-[4/2.8] rounded-xl overflow-hidden mb-3 border border-white dark:border-warmgray-700 shadow-sm bg-white">
                <img
                  src={currentBundle.image}
                  alt={currentBundle.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="font-serif font-bold text-base sm:text-lg text-warmgray-900 dark:text-white leading-snug mb-1">
                {currentBundle.title}
              </h3>
              <p className="text-xs text-warmgray-600 dark:text-warmgray-400 mb-3">
                {currentBundle.subtitle}
              </p>

              {/* Items included pill list */}
              <div className="space-y-1 mb-4">
                {currentBundle.itemsIncluded.map((itm, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-xs text-warmgray-700 dark:text-warmgray-300">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate">{itm}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price and Add Button */}
            <div className="pt-3 border-t border-warmgray-200 dark:border-warmgray-700 flex items-center justify-between gap-2">
              <div>
                <span className="text-xs text-warmgray-400 line-through mr-1.5">
                  ₹{currentBundle.originalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xl font-serif font-bold text-bloom-600 dark:text-bloom-400">
                  ₹{currentBundle.price.toLocaleString('en-IN')}
                </span>
              </div>

              <button
                onClick={handleAddBundleToCart}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-cozy ${
                  isAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-bloom-500 hover:bg-bloom-600 text-white'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Added Bundle!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add Bundle to Basket</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
