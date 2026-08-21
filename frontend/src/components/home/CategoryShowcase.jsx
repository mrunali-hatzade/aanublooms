import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export const CategoryShowcase = ({ categories = [], onNavigate }) => {
  // 6 Primary Curated Categories matching the boutique aesthetic
  const displayCategories = [
    {
      id: 'bags-accessories',
      name: 'Bags',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'forever-blooms',
      name: 'Flowers & Bouquets',
      image: '/images/aanu-blooms-signature-set.jpeg'
    },
    {
      id: 'amigurumi-plushies',
      name: 'Amigurumi',
      image: 'https://images.unsplash.com/photo-1558877385-81a1c7e67d72?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'hair-accessories',
      name: 'Accessories',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'home-living',
      name: 'Home Decor',
      image: '/images/sunflower-cupcake-pot.jpeg'
    },
    {
      id: 'diy-kits-patterns',
      name: 'Gifts & Hampers',
      image: '/images/blossom-pots-collection.jpeg'
    }
  ];

  return (
    <section className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-6">
          <div className="flex items-center justify-center gap-2 text-[#D96C65] mb-1">
            <span className="h-px w-8 bg-[#D96C65]/30"></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#D96C65]">
              Handcrafted Collections
            </span>
            <span className="h-px w-8 bg-[#D96C65]/30"></span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-warmgray-900 dark:text-white">
            Explore by Category
          </h2>
          <p className="text-xs text-warmgray-500 dark:text-warmgray-400 mt-1">
            Discover our slow-stitched forever blooms, plushies, hair accessories & gift hampers.
          </p>
        </div>

        {/* Compact 6-Card Category Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {displayCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate('shop', { category: cat.id })}
              className="group cursor-pointer flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-1"
            >
              {/* Rounded Square Image Container */}
              <div className="w-full aspect-square rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-warmgray-800 border border-warmgray-200/70 dark:border-warmgray-700/80 shadow-xs group-hover:shadow-md transition-shadow">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Bottom White/Cream Pill Name Tag */}
              <div className="w-full mt-2 py-1.5 px-2 rounded-xl bg-white dark:bg-warmgray-800 border border-warmgray-200/80 dark:border-warmgray-700/80 shadow-2xs group-hover:border-bloom-400 dark:group-hover:border-bloom-500 transition-colors">
                <span className="text-xs font-serif font-bold text-warmgray-900 dark:text-white truncate block">
                  {cat.name}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
