import React from 'react';

export const WhatWouldYouLikeSection = ({ categories = [], onNavigate }) => {
  // Category styling configuration matching our boutique color palette
  const categoryConfig = {
    'hair-accessories': {
      icon: '🎀',
      name: 'Hair Accessories',
      glow: 'from-pink-100 to-purple-100 dark:from-pink-950/40 dark:to-purple-950/40',
      ring: 'border-purple-200/80 dark:border-purple-800/60 group-hover:border-purple-400 group-hover:shadow-[0_0_20px_rgba(216,180,254,0.6)]'
    },
    'home-living': {
      icon: '🏡',
      name: 'Home Decor',
      glow: 'from-emerald-100 to-teal-100 dark:from-emerald-950/40 dark:to-teal-950/40',
      ring: 'border-emerald-200/80 dark:border-emerald-800/60 group-hover:border-teal-400 group-hover:shadow-[0_0_20px_rgba(153,246,228,0.6)]'
    },
    'bookmarks': {
      icon: '🔖',
      name: 'Bookmarks',
      glow: 'from-rose-100 to-pink-100 dark:from-rose-950/40 dark:to-pink-950/40',
      ring: 'border-rose-200/80 dark:border-rose-800/60 group-hover:border-rose-400 group-hover:shadow-[0_0_20px_rgba(254,205,211,0.6)]'
    },
    'keychains': {
      icon: '🔑',
      name: 'Keychains',
      glow: 'from-amber-100 to-yellow-100 dark:from-amber-950/40 dark:to-yellow-950/40',
      ring: 'border-amber-200/80 dark:border-amber-800/60 group-hover:border-amber-400 group-hover:shadow-[0_0_20px_rgba(254,240,138,0.6)]'
    },
    'forever-blooms': {
      icon: '🌸',
      name: 'Floral Botanicals',
      glow: 'from-bloom-100 to-rosewood-100 dark:from-bloom-950/40 dark:to-rosewood-950/40',
      ring: 'border-bloom-200/80 dark:border-bloom-800/60 group-hover:border-bloom-400 group-hover:shadow-[0_0_20px_rgba(251,146,60,0.6)]'
    },
    'wearables-apparel': {
      icon: '🧶',
      name: 'Apparel & Cardigans',
      glow: 'from-indigo-100 to-purple-100 dark:from-indigo-950/40 dark:to-purple-950/40',
      ring: 'border-indigo-200/80 dark:border-indigo-800/60 group-hover:border-indigo-400 group-hover:shadow-[0_0_20px_rgba(199,210,254,0.6)]'
    },
    'amigurumi-plushies': {
      icon: '🧸',
      name: 'Velvet Plushies',
      glow: 'from-pink-100 to-amber-100 dark:from-pink-950/40 dark:to-amber-950/40',
      ring: 'border-pink-200/80 dark:border-pink-800/60 group-hover:border-pink-400 group-hover:shadow-[0_0_20px_rgba(244,114,182,0.6)]'
    },
    'bags-accessories': {
      icon: '👜',
      name: 'Bags & Totes',
      glow: 'from-teal-100 to-cyan-100 dark:from-teal-950/40 dark:to-cyan-950/40',
      ring: 'border-teal-200/80 dark:border-teal-800/60 group-hover:border-teal-400 group-hover:shadow-[0_0_20px_rgba(45,212,191,0.6)]'
    }
  };

  // Primary 6 curated discovery bubbles
  const displayCategoryIds = [
    'hair-accessories',
    'home-living',
    'bookmarks',
    'keychains',
    'forever-blooms',
    'wearables-apparel'
  ];

  const discoveryItems = displayCategoryIds.map(id => {
    const config = categoryConfig[id] || {};
    const liveCat = categories.find(c => c.id === id);
    return {
      id,
      name: config.name || liveCat?.name || 'Handmade',
      items: liveCat?.itemCount ? `${liveCat.itemCount} items` : 'Explore items',
      icon: config.icon || '🌸',
      glow: config.glow || 'from-bloom-100 to-rosewood-100',
      ring: config.ring || 'border-purple-200 group-hover:border-bloom-400'
    };
  });

  return (
    <section className="py-7 sm:py-9 bg-gradient-to-r from-purple-50/70 via-rose-50/50 to-purple-50/70 dark:from-purple-950/20 dark:via-warmgray-900 dark:to-purple-950/20 border-y border-purple-100/70 dark:border-purple-950/60 relative overflow-hidden transition-colors">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-purple-200/30 dark:bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 bg-pink-200/30 dark:bg-pink-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Aesthetic Header */}
        <div className="text-center mb-6 sm:mb-7">
          <p className="text-xs uppercase tracking-widest text-purple-600 dark:text-purple-400 font-bold mb-1">
            Handcrafted With Care
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-purple-950 dark:text-purple-200 tracking-wide font-normal">
            — What would you like? —
          </h2>
        </div>

        {/* Circular Bubbles Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 justify-items-center">
          {discoveryItems.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate('shop', { category: cat.id })}
              className="group flex flex-col items-center text-center cursor-pointer transition-all duration-300 transform hover:-translate-y-1.5"
            >
              {/* Glowing Circular Ring */}
              <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white dark:bg-warmgray-800 border-2 p-1 shadow-md transition-all duration-300 ${cat.ring} flex items-center justify-center relative overflow-hidden`}>
                <div className={`w-full h-full rounded-full bg-gradient-to-tr ${cat.glow} flex items-center justify-center text-2xl sm:text-3xl transition-transform group-hover:scale-110 duration-300`}>
                  <span>{cat.icon}</span>
                </div>
              </div>

              {/* Title & Real Items Tag */}
              <span className="mt-2.5 font-handwritten text-lg sm:text-xl text-purple-900 dark:text-purple-200 group-hover:text-bloom-600 dark:group-hover:text-bloom-400 transition-colors font-medium">
                {cat.name}
              </span>
              <span className="text-[11px] text-purple-700/70 dark:text-purple-300/70 font-medium">
                {cat.items}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
