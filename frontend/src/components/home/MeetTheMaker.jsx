import React from 'react';
import { Heart, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export const MeetTheMaker = ({ onNavigate }) => {
  return (
    <section className="py-8 sm:py-10 bg-warmgray-100/70 dark:bg-warmgray-900/60 border-y border-warmgray-200 dark:border-warmgray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Photos Side */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm">
              <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-white dark:border-warmgray-800 rotate-1 transform hover:rotate-0 transition-transform duration-300">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80"
                  alt="Maker Aanu in Studio"
                  className="w-full h-64 sm:h-80 object-cover"
                />
              </div>

              {/* Behind Stitches Badge */}
              <div className="absolute -bottom-4 -left-3 sm:-left-4 bg-white dark:bg-warmgray-800 p-3 rounded-2xl shadow-lg border border-warmgray-200/80 dark:border-warmgray-700 max-w-[220px]">
                <p className="font-handwritten text-xl text-bloom-600 dark:text-bloom-400 font-bold mb-0.5">
                  "Every loop has a story"
                </p>
                <p className="text-xs text-warmgray-500">
                  — Aanu, Founder & Lead Artisan
                </p>
              </div>

              <div className="absolute -top-3 -right-3 w-10 h-10 rounded-xl bg-gradient-to-tr from-bloom-500 to-amber-400 text-white flex items-center justify-center shadow-md">
                <Heart className="w-5 h-5 fill-white" />
              </div>
            </div>
          </div>

          {/* Story Text Side */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rosewood-100 dark:bg-rosewood-950 text-rosewood-800 dark:text-rosewood-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Meet The Artisan
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-warmgray-900 dark:text-white leading-tight">
              Crafting forever memories, one loop & petal at a time
            </h2>

            <p className="text-base sm:text-lg text-warmgray-600 dark:text-warmgray-300 leading-relaxed">
              Every AanuBlooms piece is slow-crafted by hand with pure organic cotton and velvet yarn — creating timeless, heartfelt gifts made to last forever.
            </p>

            {/* Maker Pillars */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-warmgray-800 border border-warmgray-200/80 dark:border-warmgray-700 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-sm font-semibold text-warmgray-800 dark:text-warmgray-200">100% Handcrafted</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-warmgray-800 border border-warmgray-200/80 dark:border-warmgray-700 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-sm font-semibold text-warmgray-800 dark:text-warmgray-200">Custom Ribbon Cards</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-warmgray-800 border border-warmgray-200/80 dark:border-warmgray-700 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-sm font-semibold text-warmgray-800 dark:text-warmgray-200">Eco-Cotton Yarn</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-warmgray-800 border border-warmgray-200/80 dark:border-warmgray-700 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-sm font-semibold text-warmgray-800 dark:text-warmgray-200">Pan-India Delivery</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('about')}
                className="px-6 py-3 bg-warmgray-900 hover:bg-black text-white dark:bg-warmgray-800 dark:hover:bg-warmgray-700 rounded-full font-bold text-sm shadow-sm transition-all inline-flex items-center gap-2"
              >
                <span>Read Studio Story</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
