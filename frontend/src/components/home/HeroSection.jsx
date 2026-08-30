import React from 'react';
import { Sparkles, ArrowRight, Palette, Flower2, Heart } from 'lucide-react';

export const HeroSection = ({ onNavigate }) => {
  return (
    <section className="relative overflow-hidden pt-4 pb-6 sm:py-8 bg-gradient-to-b from-bloom-50/70 via-rosewood-50/30 to-warmgray-50 dark:from-warmgray-950 dark:via-warmgray-900 dark:to-warmgray-950 transition-colors">
      
      {/* Background Animated Floating Soft Glow Orbs */}
      <div className="absolute top-2 left-1/4 w-80 h-80 bg-bloom-300/25 dark:bg-bloom-950/20 rounded-full blur-3xl pointer-events-none animate-blob-drift" />
      <div className="absolute bottom-4 right-1/4 w-80 h-80 bg-rosewood-300/20 dark:bg-rosewood-950/20 rounded-full blur-3xl pointer-events-none animate-float-slow" />
      <div className="absolute top-1/2 left-10 w-48 h-48 bg-amber-200/20 dark:bg-amber-950/15 rounded-full blur-2xl pointer-events-none animate-float-reverse" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Left: Simple, Clear & Elegant Text */}
          <div className="lg:col-span-6 space-y-4 text-center lg:text-left">
            
            {/* Animated Minimal Badge with on-refresh pop */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-warmgray-800/90 backdrop-blur-xs border border-bloom-200 dark:border-bloom-800/60 text-bloom-700 dark:text-bloom-300 text-xs font-bold shadow-xs animate-pop-badge delay-100">
              <Sparkles className="w-3.5 h-3.5 text-bloom-500 animate-spin-slow" />
              <span>Handcrafted Blooms & Keepsakes</span>
            </div>

            {/* Main Headline with smooth rise */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-warmgray-900 dark:text-white leading-tight tracking-tight animate-reveal-up delay-200">
              Handcrafted Blooms & Creations that{' '}
              <span className="text-bloom-600 dark:text-bloom-400 italic underline decoration-bloom-200 dark:decoration-bloom-800 underline-offset-4">
                Never Wilt.
              </span>
            </h1>

            {/* Simple, Short, Easy Subtitle */}
            <p className="text-base sm:text-lg text-warmgray-600 dark:text-warmgray-300 max-w-lg mx-auto lg:mx-0 leading-relaxed animate-reveal-up delay-300">
              Beautiful handmade flowers, flower pots, bouquets & unique creations made with love, patience, and care.
            </p>

            {/* Clean Action Buttons with Shimmer, Hover Lift, and entrance reveal */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1 animate-reveal-up delay-400">
              <button
                onClick={() => onNavigate('shop')}
                className="w-full sm:w-auto px-7 py-3.5 bg-bloom-500 hover:bg-bloom-600 text-white rounded-full font-bold text-sm shadow-cozy btn-shimmer transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 group"
              >
                <span>Shop Blooms</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
              </button>

              <button
                onClick={() => onNavigate('custom-order')}
                className="w-full sm:w-auto px-6 py-3.5 bg-white/90 dark:bg-warmgray-800 hover:bg-warmgray-100 dark:hover:bg-warmgray-700 text-warmgray-900 dark:text-white rounded-full font-bold text-sm border border-warmgray-200 dark:border-warmgray-700 shadow-xs transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
              >
                <Palette className="w-4 h-4 text-rosewood-500 animate-wiggle" />
                <span>Custom Order</span>
              </button>
            </div>

            {/* Simple 1-Line Trust Note */}
            <p className="text-xs text-warmgray-500 dark:text-warmgray-400 pt-1 flex items-center justify-center lg:justify-start gap-1.5 animate-reveal-up delay-500">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>100% Handmade · Delivered with Care across Pune Region</span>
            </p>

          </div>

          {/* Right: Clean, Beautiful Visual Card with Blossom Entrance & Floating Accents */}
          <div className="lg:col-span-6 animate-blossom-in delay-250">
            <div className="relative mx-auto max-w-sm lg:max-w-md">
              
              {/* Floating Decorative Accent 1 */}
              <div className="absolute -top-3 -left-3 z-20 px-3 py-1.5 rounded-2xl bg-white/95 dark:bg-warmgray-800/95 backdrop-blur-xs border border-bloom-100 dark:border-warmgray-700 shadow-lg text-[11px] font-bold text-bloom-600 dark:text-bloom-400 flex items-center gap-1.5 animate-pop-badge delay-450 pointer-events-none">
                <Flower2 className="w-3.5 h-3.5 text-bloom-500 animate-spin-slow" />
                <span>Everlasting Petals</span>
              </div>

              {/* Floating Decorative Accent 2 */}
              <div className="absolute -bottom-3 -right-3 z-20 px-3 py-1.5 rounded-2xl bg-white/95 dark:bg-warmgray-800/95 backdrop-blur-xs border border-rosewood-100 dark:border-warmgray-700 shadow-lg text-[11px] font-bold text-rosewood-600 dark:text-rosewood-400 flex items-center gap-1.5 animate-pop-badge delay-500 pointer-events-none">
                <Heart className="w-3.5 h-3.5 fill-rosewood-500 text-rosewood-500" />
                <span>Handcrafted with Care</span>
              </div>

              {/* Main Visual Card */}
              <div
                onClick={() => onNavigate('shop')}
                className="cursor-pointer rounded-3xl overflow-hidden shadow-xl border-4 border-white dark:border-warmgray-800 bg-white dark:bg-warmgray-900 group card-hover-3d"
              >
                <div className="relative overflow-hidden aspect-[4/3] bg-warmgray-50 dark:bg-warmgray-800">
                  <img
                    src="/images/aanu-blooms-signature-set.jpeg"
                    alt="AanuBlooms Signature 5-Piece Blossom Pots Collection"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-4 flex items-center justify-between bg-white dark:bg-warmgray-900 transition-colors">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-bloom-600 dark:text-bloom-400 block">
                      ✨ Official Artisan Flagship Set
                    </span>
                    <h4 className="font-serif font-bold text-base text-warmgray-900 dark:text-white group-hover:text-bloom-600 dark:group-hover:text-bloom-400 transition-colors">
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
