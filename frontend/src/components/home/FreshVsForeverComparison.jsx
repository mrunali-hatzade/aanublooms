import React from 'react';
import { Sparkles, Check, X, Heart, ShieldCheck } from 'lucide-react';

export const FreshVsForeverComparison = ({ onNavigate }) => {
  return (
    <section className="py-8 sm:py-12 bg-warmgray-50 dark:bg-warmgray-950 border-b border-warmgray-200 dark:border-warmgray-800 transition-colors">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            The Artisan Difference
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-warmgray-900 dark:text-white">
            Why Handmade handmade Blooms Win Every Time
          </h2>
          <p className="text-xs sm:text-sm text-warmgray-500 dark:text-warmgray-400 mt-1">
            Real flowers are sweet for a week. AanuBlooms handcrafted creations last a lifetime.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          
          {/* Fresh Cut Flowers Card (Ordinary) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-warmgray-900 border border-warmgray-200 dark:border-warmgray-800 shadow-xs space-y-4 opacity-85">
            <div className="flex items-center justify-between pb-3 border-b border-warmgray-100 dark:border-warmgray-800">
              <div>
                <span className="text-xs uppercase font-bold text-warmgray-400">Ordinary Alternative</span>
                <h3 className="text-lg font-serif font-bold text-warmgray-700 dark:text-warmgray-300">
                  🥀 Fresh Cut Flowers
                </h3>
              </div>
              <span className="text-2xl">🥀</span>
            </div>

            <div className="space-y-3 text-xs text-warmgray-600 dark:text-warmgray-400">
              <div className="flex items-start gap-2.5">
                <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span><strong>Wilts in 4-7 days</strong> — turns brown and must be thrown in the trash.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span><strong>Requires daily care</strong> — trimming stems, changing dirty vase water.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span><strong>Expensive repeat cost</strong> — spending ₹1,000+ every couple of weeks.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span><strong>Allergy trigger</strong> — pollen can cause sneezing and pet sensitivities.</span>
              </div>
            </div>
          </div>

          {/* AanuBlooms Forever creations (Superior Boutique) */}
          <div className="p-6 rounded-3xl bg-gradient-to-tr from-bloom-50 via-rosewood-50 to-warmgray-50 dark:from-warmgray-800 dark:via-warmgray-800 dark:to-warmgray-900 border-2 border-bloom-400 dark:border-bloom-500 shadow-soft-lg space-y-4 relative">
            <div className="absolute -top-3 right-6 bg-gradient-to-r from-bloom-500 to-rosewood-500 text-white text-[10px] uppercase tracking-widest font-extrabold px-3 py-0.5 rounded-full shadow-xs">
              ✨ 100% Everlasting
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-bloom-200/60 dark:border-warmgray-700">
              <div>
                <span className="text-xs uppercase font-bold text-bloom-700 dark:text-bloom-300">AanuBlooms Boutique</span>
                <h3 className="text-lg font-serif font-bold text-warmgray-900 dark:text-white">
                  🌸 Handcrafted Forever Blooms
                </h3>
              </div>
              <span className="text-2xl">🌸</span>
            </div>

            <div className="space-y-3 text-xs text-warmgray-700 dark:text-warmgray-200">
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 font-bold shrink-0 mt-0.5" />
                <span><strong>Lasts 10+ Years</strong> — handcrafted memory that never wilts or fades.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 font-bold shrink-0 mt-0.5" />
                <span><strong>Zero Maintenance</strong> — no water, no sunlight, no mess. Ever.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 font-bold shrink-0 mt-0.5" />
                <span><strong>Saves Over ₹20,000+</strong> in repeat flower gifts over 2 years.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 font-bold shrink-0 mt-0.5" />
                <span><strong>100% Organic Milk Cotton</strong> — hypoallergenic & safe for pets & children.</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('shop')}
                className="w-full py-2.5 bg-bloom-500 hover:bg-bloom-600 text-white rounded-xl text-xs font-bold shadow-xs transition-all text-center"
              >
                Shop Everlasting creations 🌸
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
