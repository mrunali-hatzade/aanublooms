import React from 'react';
import { Sparkles, ArrowRight, Palette } from 'lucide-react';

export const HeroSection = ({ onNavigate }) => {
  return (
    <section className="relative overflow-hidden pt-4 pb-6 sm:py-8 bg-gradient-to-b from-bloom-50/70 via-rosewood-50/30 to-warmgray-50 dark:from-warmgray-950 dark:via-warmgray-900 dark:to-warmgray-950 transition-colors">
      
      {/* Background Soft Glows */}
      <div className="absolute top-6 left-1/4 w-72 h-72 bg-bloom-200/30 dark:bg-bloom-950/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-6 right-1/4 w-72 h-72 bg-rosewood-200/20 dark:bg-rosewood-950/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Left: Simple, Clear & Elegant Text */}
          <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
            
            {/* Minimal Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-warmgray-800/90 border border-bloom-200 dark:border-bloom-800/60 text-bloom-700 dark:text-bloom-300 text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-bloom-500" />
              <span>Handcrafted Blooms & Creations</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-warmgray-900 dark:text-white leading-tight tracking-tight">
              Handcrafted Blooms & Creations that{' '}
              <span className="text-bloom-600 dark:text-bloom-400 italic">Never Wilt.</span>
            </h1>

            {/* Simple, Short, Easy Subtitle */}
            <p className="text-base sm:text-lg text-warmgray-600 dark:text-warmgray-300 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Beautiful handmade flowers, flower pots, bouquets & unique creations made with love, patience, and care.
            </p>

            {/* Clean Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1">
              <button
                onClick={() => onNavigate('shop')}
                className="w-full sm:w-auto px-7 py-3 bg-bloom-500 hover:bg-bloom-600 text-white rounded-full font-bold text-sm shadow-cozy transition-all flex items-center justify-center gap-2 group"
              >
                <span>Shop Blooms</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('custom-order')}
                className="w-full sm:w-auto px-6 py-3 bg-white dark:bg-warmgray-800 hover:bg-warmgray-100 dark:hover:bg-warmgray-700 text-warmgray-900 dark:text-white rounded-full font-bold text-sm border border-warmgray-200 dark:border-warmgray-700 shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <Palette className="w-4 h-4 text-rosewood-500" />
                <span>Custom Order</span>
              </button>
            </div>

            {/* Simple 1-Line Trust Note */}
            <p className="text-xs text-warmgray-500 dark:text-warmgray-400 pt-1">
              ✨ 100% Handmade · Free Delivery across Pune Region on orders over ₹999
            </p>

          </div>

          {/* Right: Clean, Beautiful Visual Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-sm lg:max-w-none">
              <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white dark:border-warmgray-800 bg-white dark:bg-warmgray-900 group">
                <img
                  src="/images/aanu-blooms-signature-set.jpeg"
                  alt="AanuBlooms Signature 5-Piece Blossom Pots Collection"
                  className="w-full h-72 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="p-4 flex items-center justify-between bg-white dark:bg-warmgray-900">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-bloom-600 dark:text-bloom-400 block">
                      ✨ Official Artisan Flagship Set
                    </span>
                    <h4 className="font-serif font-bold text-base text-warmgray-900 dark:text-white">
                      The 5-Piece Blossom Pots Collection
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-serif font-bold text-bloom-600 dark:text-bloom-400 block">
                      ₹2,499
                    </span>
                    <span className="text-[10px] text-warmgray-400 line-through">₹2,999</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
