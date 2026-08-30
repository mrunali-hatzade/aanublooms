import React from 'react';
import { Heart, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export const MeetTheMaker = ({ onNavigate }) => {
  return (
    <section className="py-8 sm:py-10 bg-warmgray-100/70 dark:bg-warmgray-900/60 border-y border-warmgray-200 dark:border-warmgray-800 transition-colors">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Photos Side */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-warmgray-800 rotate-1 transform hover:rotate-0 hover:scale-[1.02] transition-all duration-500 group">
                <img
                  src="/images/founder.jpeg"
                  alt="Maker Aanu in Studio"
                  className="w-full h-72 sm:h-88 object-cover object-bottom group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Behind creations Floating Badge */}
              <div className="absolute -bottom-4 -left-3 sm:-left-4 bg-white/95 dark:bg-warmgray-800/95 backdrop-blur-xs p-3.5 rounded-2xl shadow-xl border border-warmgray-200/80 dark:border-warmgray-700 max-w-[220px] animate-float-slow">
                <p className="font-handwritten text-xl text-bloom-600 dark:text-bloom-400 font-bold mb-0.5">
                  "Made by Hand. Inspired by Love."
                </p>
                <p className="text-xs text-warmgray-500 dark:text-warmgray-400 font-medium">
                  — Aanu, Founder & Lead Artisan
                </p>
              </div>

              <div className="absolute -top-3 -right-3 w-10 h-10 rounded-xl bg-gradient-to-tr from-bloom-500 to-amber-400 text-white flex items-center justify-center shadow-lg animate-bounce-subtle">
                <Heart className="w-5 h-5 fill-white" />
              </div>
            </div>
          </div>

          {/* Story Text Side */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rosewood-100 dark:bg-rosewood-950 text-rosewood-800 dark:text-rosewood-300 text-xs font-bold uppercase tracking-wider animate-pulse-subtle">
              <Sparkles className="w-3.5 h-3.5 text-rosewood-600 animate-spin-slow" />
              <span>Meet The Artisan</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-warmgray-900 dark:text-white leading-tight">
              A story that began at home, inspired by a mother
            </h2>

            <p className="text-base sm:text-lg text-warmgray-600 dark:text-warmgray-300 leading-relaxed">
              What began with a mother's inspiration has blossomed into AanuBlooms. Every creation carries a little piece of Aanu's journey, carefully handmade with colourful pipe cleaners to bring creativity into your life.
            </p>

            {/* Maker Pillars with Hover Depth */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white dark:bg-warmgray-800 border border-warmgray-200/80 dark:border-warmgray-700 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-sm font-semibold text-warmgray-800 dark:text-warmgray-200">100% Handcrafted</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white dark:bg-warmgray-800 border border-warmgray-200/80 dark:border-warmgray-700 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-sm font-semibold text-warmgray-800 dark:text-warmgray-200">Cute, Long lasting & Eco-friendly</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white dark:bg-warmgray-800 border border-warmgray-200/80 dark:border-warmgray-700 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-sm font-semibold text-warmgray-800 dark:text-warmgray-200">Made with Quality Material</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white dark:bg-warmgray-800 border border-warmgray-200/80 dark:border-warmgray-700 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-sm font-semibold text-warmgray-800 dark:text-warmgray-200">Pune Region Delivery</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('about')}
                className="px-6 py-3 bg-warmgray-900 hover:bg-black text-white dark:bg-warmgray-800 dark:hover:bg-warmgray-700 rounded-full font-bold text-sm shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 inline-flex items-center gap-2 group"
              >
                <span>Read Studio Story</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
