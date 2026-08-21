import React, { useState, useEffect } from 'react';
import { Filter, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

const boutiqueValues = [
  {
    icon: '🌸',
    title: '100% Handcrafted',
    desc: 'Every bloom is carefully made by hand.'
  },
  {
    icon: '💖',
    title: 'Made with Love',
    desc: 'Thoughtfully designed with artisan care.'
  },
  {
    icon: '✨',
    title: 'Made to Last',
    desc: 'Forever flowers that never wither or fade.'
  },
  {
    icon: '🎁',
    title: 'Perfect for Gifting',
    desc: 'Thoughtful gifts for birthdays & special smiles.'
  }
];

const ValueSlider = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % boutiqueValues.length);
    }, 3600);
    return () => clearInterval(timer);
  }, [isPaused]);

  const slide = boutiqueValues[currentIdx];

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="p-3.5 rounded-2xl bg-gradient-to-br from-bloom-50/90 via-warmgray-50 to-rosewood-50/70 dark:from-warmgray-800 dark:to-warmgray-800/80 border border-bloom-200/70 dark:border-warmgray-700 shadow-xs relative overflow-hidden transition-all"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white dark:bg-warmgray-700 shadow-xs flex items-center justify-center text-base shrink-0">
            {slide.icon}
          </div>
          <div>
            <h5 className="font-serif font-bold text-xs text-warmgray-900 dark:text-white">
              {slide.title}
            </h5>
            <p className="text-[11px] text-warmgray-600 dark:text-warmgray-300 leading-snug mt-0.5">
              {slide.desc}
            </p>
          </div>
        </div>
      </div>

      {/* Slider dots and navigation controls */}
      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-warmgray-200/60 dark:border-warmgray-700/60">
        <div className="flex items-center gap-1.5">
          {boutiqueValues.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIdx(idx)}
              className={`h-1.5 rounded-full transition-all ${
                currentIdx === idx
                  ? 'w-5 bg-bloom-500'
                  : 'w-1.5 bg-warmgray-300 dark:bg-warmgray-600 hover:bg-warmgray-400'
              }`}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentIdx((prev) => (prev === 0 ? boutiqueValues.length - 1 : prev - 1))}
            className="p-1 rounded-md text-warmgray-400 hover:text-warmgray-800 dark:hover:text-white hover:bg-white/60 dark:hover:bg-warmgray-700 transition-colors"
            title="Previous"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setCurrentIdx((prev) => (prev + 1) % boutiqueValues.length)}
            className="p-1 rounded-md text-warmgray-400 hover:text-warmgray-800 dark:hover:text-white hover:bg-white/60 dark:hover:bg-warmgray-700 transition-colors"
            title="Next"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const ProductFilters = ({
  categories = [],
  selectedCategory,
  onSelectCategory,
  priceRange,
  onPriceChange,
  selectedYarn,
  onSelectYarn,
  selectedDifficulty,
  onSelectDifficulty,
  inStockOnly,
  onToggleInStock,
  onResetFilters
}) => {
  const yarnMaterials = [
    { label: 'All Yarn Types', value: 'all' },
    { label: '100% Milk Cotton', value: 'Milk Cotton' },
    { label: 'Chenille Velvet', value: 'Chenille' },
    { label: 'Organic Cotton', value: 'Organic' },
    { label: 'Merino Wool Blend', value: 'Wool' },
    { label: 'Non-Fraying Beginner Yarn', value: 'Beginner' }
  ];

  const difficulties = [
    { label: 'All Levels', value: 'all' },
    { label: 'Beginner Friendly', value: 'Beginner Friendly' },
    { label: 'Intermediate', value: 'Intermediate' },
    { label: 'Artisan Masterpiece', value: 'Artisan Masterpiece' }
  ];

  return (
    <aside aria-label="Filters" className="bg-white dark:bg-warmgray-900 rounded-3xl p-5 sm:p-6 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft space-y-5">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-warmgray-100 dark:border-warmgray-800">
        <div className="flex items-center gap-2 font-serif font-bold text-base sm:text-lg text-warmgray-900 dark:text-white">
          <Filter className="w-4 h-4 text-bloom-500" />
          <span>Filter Stitches</span>
        </div>
        <button
          onClick={onResetFilters}
          className="text-xs font-semibold text-warmgray-500 hover:text-bloom-600 dark:text-warmgray-400 dark:hover:text-bloom-400 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Handmade Values Benefit Slider */}
      <ValueSlider />

      {/* Category List */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-warmgray-500 dark:text-warmgray-400 mb-2">
          Categories
        </h4>
        <div className="space-y-1">
          <button
            onClick={() => onSelectCategory('all')}
            className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedCategory === 'all'
                ? 'bg-bloom-500 text-white font-bold shadow-cozy'
                : 'text-warmgray-700 dark:text-warmgray-300 hover:bg-warmgray-100 dark:hover:bg-warmgray-800'
            }`}
          >
            <span>✨ All Handcrafted Items</span>
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-bloom-500 text-white font-bold shadow-cozy'
                  : 'text-warmgray-700 dark:text-warmgray-300 hover:bg-warmgray-100 dark:hover:bg-warmgray-800'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Slider in INR */}
      <div className="pt-2 border-t border-warmgray-100 dark:border-warmgray-800">
        <div className="flex items-center justify-between text-sm font-semibold text-warmgray-900 dark:text-white mb-2">
          <span>Max Price</span>
          <span className="text-bloom-600 dark:text-bloom-400 font-bold font-serif text-base">
            ₹{priceRange?.toLocaleString('en-IN')}
          </span>
        </div>
        <input
          type="range"
          min="100"
          max="5000"
          step="100"
          value={priceRange}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          className="w-full accent-bloom-500 cursor-pointer h-2 bg-warmgray-200 dark:bg-warmgray-700 rounded-lg"
        />
        <div className="flex justify-between text-xs text-warmgray-400 mt-1 font-mono">
          <span>₹100</span>
          <span>₹2,500</span>
          <span>₹5,000+</span>
        </div>
      </div>

      {/* Yarn Material */}
      <div className="pt-2 border-t border-warmgray-100 dark:border-warmgray-800">
        <h4 className="font-bold text-xs uppercase tracking-wider text-warmgray-500 dark:text-warmgray-400 mb-2">
          Yarn & Material
        </h4>
        <div className="space-y-2">
          {yarnMaterials.map(yarn => (
            <label
              key={yarn.value}
              className="flex items-center gap-2.5 text-sm text-warmgray-700 dark:text-warmgray-300 cursor-pointer hover:text-bloom-600 transition-colors"
            >
              <input
                type="radio"
                name="yarnMaterial"
                checked={selectedYarn === yarn.value}
                onChange={() => onSelectYarn(yarn.value)}
                className="w-4 h-4 text-bloom-500 focus:ring-bloom-400"
              />
              <span>{yarn.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Difficulty Level */}
      <div className="pt-2 border-t border-warmgray-100 dark:border-warmgray-800">
        <h4 className="font-bold text-xs uppercase tracking-wider text-warmgray-500 dark:text-warmgray-400 mb-2">
          Craft Level
        </h4>
        <div className="space-y-2">
          {difficulties.map(diff => (
            <label
              key={diff.value}
              className="flex items-center gap-2.5 text-sm text-warmgray-700 dark:text-warmgray-300 cursor-pointer hover:text-bloom-600 transition-colors"
            >
              <input
                type="radio"
                name="craftDifficulty"
                checked={selectedDifficulty === diff.value}
                onChange={() => onSelectDifficulty(diff.value)}
                className="w-4 h-4 text-bloom-500 focus:ring-bloom-400"
              />
              <span>{diff.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* In-Stock Only Toggle */}
      <div className="pt-2 border-t border-warmgray-100 dark:border-warmgray-800">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm font-semibold text-warmgray-800 dark:text-warmgray-200">
            In-Stock Ready to Dispatch
          </span>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onToggleInStock(e.target.checked)}
            className="w-4 h-4 text-bloom-500 rounded focus:ring-bloom-400"
          />
        </label>
      </div>

    </aside>
  );
};
