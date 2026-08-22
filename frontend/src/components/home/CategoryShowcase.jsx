import React from 'react';

export const CategoryShowcase = ({ categories = [], onNavigate }) => {
  const displayCategories = Array.isArray(categories) ? categories : [];

  return (
    <section className="py-6 sm:py-8">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
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
        </div>

        {/* Dynamic Category Row */}
        {displayCategories.length === 0 ? (
          <div className="text-center py-6 text-xs text-warmgray-500">
            No categories available. Add categories in the Admin Dashboard to feature them here!
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
            {displayCategories.map((cat, idx) => (
              <div
                key={cat.id || idx}
                onClick={() => onNavigate('shop', { category: cat.id })}
                className="group cursor-pointer flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-1"
              >
                {/* Rounded Square Image Container */}
                <div className="w-full aspect-square rounded-2xl overflow-hidden bg-[#FAF7F2] dark:bg-warmgray-800 border border-warmgray-200/70 dark:border-warmgray-700/80 shadow-xs group-hover:shadow-md transition-shadow relative">
                  <img
                    src={cat.image || '/images/category/1st_category_flower.jpeg'}
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
        )}

      </div>
    </section>
  );
};
