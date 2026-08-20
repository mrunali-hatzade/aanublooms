import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export const CategoryShowcase = ({ categories = [], onNavigate }) => {
  return (
    <section className="py-16 bg-warmgray-50 dark:bg-warmgray-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bloom-100 dark:bg-bloom-950/80 text-bloom-800 dark:text-bloom-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Curated Collections
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-warmgray-900 dark:text-white">
            Explore Handcrafted Categories
          </h2>
          <p className="text-sm text-warmgray-600 dark:text-warmgray-400 mt-2">
            From everlasting floral stems and squishy amigurumi to wearable hexagon cardigans and DIY beginner boxes.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={cat.id || idx}
              onClick={() => onNavigate('shop', { category: cat.id })}
              className="group relative rounded-3xl overflow-hidden bg-white dark:bg-warmgray-900 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft hover:shadow-soft-lg cursor-pointer transform hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
            >
              {/* Image with zoom */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-warmgray-100 dark:bg-warmgray-800">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                
                {/* Floating Content Over Image */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-amber-300 mb-1 block">
                    {cat.itemCount || 12}+ Creations
                  </span>
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-white">
                    {cat.name}
                  </h3>
                </div>
              </div>

              {/* Bottom text & arrow */}
              <div className="p-5 flex items-center justify-between bg-white dark:bg-warmgray-900">
                <p className="text-xs text-warmgray-600 dark:text-warmgray-400 line-clamp-2 max-w-[240px]">
                  {cat.description}
                </p>
                <div className="w-9 h-9 rounded-full bg-bloom-50 dark:bg-warmgray-800 text-bloom-600 dark:text-bloom-400 group-hover:bg-bloom-500 group-hover:text-white flex items-center justify-center transition-colors shrink-0 shadow-xs">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
