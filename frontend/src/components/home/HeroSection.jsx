import React from 'react';
import { Sparkles, Flower2, Heart, ArrowRight, Palette, Clock, ShieldCheck } from 'lucide-react';

export const HeroSection = ({ onNavigate }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 bg-gradient-to-b from-bloom-50/70 via-rosewood-50/40 to-warmgray-50 dark:from-warmgray-950 dark:via-warmgray-900 dark:to-warmgray-950 transition-colors">
      
      {/* Aesthetic Background Glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-bloom-200/40 dark:bg-bloom-950/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-rosewood-200/30 dark:bg-rosewood-950/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 dark:bg-warmgray-800/90 border border-bloom-200 dark:border-bloom-800 text-bloom-800 dark:text-bloom-300 shadow-xs backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-bloom-500 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="text-xs font-bold tracking-wide uppercase">
                Boutique Artisan Crochet & Forever Flowers
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-warmgray-900 dark:text-white leading-[1.15] tracking-tight">
              Handcrafted Blooms & Plushies that{' '}
              <span className="relative inline-block text-bloom-600 dark:text-bloom-400 italic">
                Never Wilt.
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M1 5.5C50 1.5 150 1.5 199 5.5" stroke="#D96B43" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-warmgray-600 dark:text-warmgray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Every petal, amigurumi friend, and granny square cardigan is meticulously hand-stitched by artisan maker <strong className="text-warmgray-900 dark:text-white">Aanu</strong> using organic combed milk cotton and ultra-soft chenille velvet yarn.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={() => onNavigate('shop')}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-bloom-500 via-bloom-600 to-rosewood-500 hover:from-bloom-600 hover:to-rosewood-600 text-white rounded-full font-bold text-sm shadow-cozy transition-all transform hover:scale-105 flex items-center justify-center gap-2 group"
              >
                <span>Shop Handcrafted Blooms</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('custom-order')}
                className="w-full sm:w-auto px-7 py-4 bg-white dark:bg-warmgray-800 hover:bg-warmgray-100 dark:hover:bg-warmgray-700 text-warmgray-900 dark:text-white rounded-full font-bold text-sm border border-warmgray-200 dark:border-warmgray-700 shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Palette className="w-4 h-4 text-rosewood-500" />
                <span>Custom Bouquet Commission</span>
              </button>
            </div>

            {/* Social Trust Metrics */}
            <div className="pt-6 border-t border-warmgray-200/80 dark:border-warmgray-800 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
              <div>
                <p className="text-2xl font-serif font-bold text-warmgray-900 dark:text-white">4.97 ★</p>
                <p className="text-xs text-warmgray-500 dark:text-warmgray-400">1,200+ Happy Fans</p>
              </div>
              <div>
                <p className="text-2xl font-serif font-bold text-warmgray-900 dark:text-white">100%</p>
                <p className="text-xs text-warmgray-500 dark:text-warmgray-400">Zero Factory Stitch</p>
              </div>
              <div>
                <p className="text-2xl font-serif font-bold text-warmgray-900 dark:text-white">5-12 hrs</p>
                <p className="text-xs text-warmgray-500 dark:text-warmgray-400">Craft Time / Piece</p>
              </div>
            </div>

          </div>

          {/* Right Collage Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Feature Card */}
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-warmgray-800 bg-white dark:bg-warmgray-900 transform hover:rotate-1 transition-transform duration-500">
                <img
                  src="https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=800&q=80"
                  alt="AanuBlooms Handcrafted Bouquet"
                  className="w-full h-96 object-cover"
                />
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-bloom-600 dark:text-bloom-400">
                        Artisan Signature
                      </span>
                      <h4 className="font-serif font-bold text-base text-warmgray-900 dark:text-white">
                        Everlasting Pink Tulip & Daisy Bouquet
                      </h4>
                    </div>
                    <span className="text-lg font-serif font-bold text-bloom-600 dark:text-bloom-400">
                      $44.99
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Floating Plushie Badge */}
              <div className="absolute -top-6 -left-6 sm:-left-8 bg-white dark:bg-warmgray-800 p-3.5 rounded-2xl shadow-xl border border-warmgray-200/80 dark:border-warmgray-700 flex items-center gap-3 animate-float">
                <img
                  src="https://images.unsplash.com/photo-1558877385-81a1c7e67d72?auto=format&fit=crop&w=120&q=80"
                  alt="Plushie"
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <span className="text-[10px] font-bold text-rosewood-500 uppercase">Squishy Velvet</span>
                  <p className="text-xs font-bold text-warmgray-900 dark:text-white">Strawberry Bunny</p>
                  <span className="text-[11px] text-amber-500 font-bold">5.0 ★ (167)</span>
                </div>
              </div>

              {/* Floating Craft Guarantee Badge */}
              <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-gradient-to-r from-warmgray-900 to-warmgray-800 text-white p-3.5 rounded-2xl shadow-xl border border-warmgray-700 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-bloom-500 text-white">
                  <Heart className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <p className="text-xs font-bold">Never Wilts Guarantee</p>
                  <p className="text-[10px] text-warmgray-400">Cherished for a lifetime</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
