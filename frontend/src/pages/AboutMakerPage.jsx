import React from 'react';
import { Flower2, Heart, Sparkles, Clock, ShieldCheck, ArrowRight, Mail, Globe } from 'lucide-react';

export const AboutMakerPage = ({ onNavigate }) => {
  return (
    <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rosewood-100 dark:bg-rosewood-950 text-rosewood-800 dark:text-rosewood-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          The Story Behind The Stitches
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-warmgray-900 dark:text-white leading-tight">
          Handcrafted with Love, Cotton & Endless Patience
        </h1>
        <p className="text-base text-warmgray-600 dark:text-warmgray-300 leading-relaxed">
          Welcome to AanuBlooms! We create everlasting floral bouquets, cuddly amigurumi plushies, and cozy wearables that bring warmth into everyday life.
        </p>
      </div>

      {/* Story Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4 text-sm text-warmgray-700 dark:text-warmgray-300 leading-relaxed">
          <h2 className="font-serif font-bold text-2xl text-warmgray-900 dark:text-white">
            From Childhood Skeins to an Artisan Studio
          </h2>
          <p>
            Aanu learned to crochet at age eight from her grandmother, who taught her that each stitch carries intention and love. What began as gifting small floral coasters to friends blossomed into an obsession with creating forever botanicals that never wither.
          </p>
          <p>
            Every tulip petal, chamomile center, and amigurumi cheek you see in our shop is shaped entirely by hand with ergonomic crochet hooks and premium combed milk cotton yarn.
          </p>
          <p>
            Unlike mass-produced factory decor, each creation is unique, imbued with personality, and finished with satin ribbon packaging and fragrant French lavender sachets.
          </p>
        </div>

        <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-warmgray-800">
          <img
            src="/images/founder.jpeg"
            alt="Artisan Aanu"
            className="w-full h-96 object-cover"
          />
        </div>
      </div>

      {/* Studio Ethos / Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-warmgray-900 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-bloom-100 dark:bg-warmgray-800 text-bloom-600 mx-auto flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-base text-warmgray-900 dark:text-white">Slow Craft Fashion</h3>
          <p className="text-xs text-warmgray-500 dark:text-warmgray-400">
            We spend between 4 to 24 hours on each piece to guarantee tight, flawless stitches.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-warmgray-900 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rosewood-100 dark:bg-warmgray-800 text-rosewood-600 mx-auto flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-base text-warmgray-900 dark:text-white">Eco & Hypoallergenic</h3>
          <p className="text-xs text-warmgray-500 dark:text-warmgray-400">
            OEKO-TEX certified combed cotton and super-soft chenille velvet yarns.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-warmgray-900 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-warmgray-800 text-amber-600 mx-auto flex items-center justify-center">
            <Flower2 className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-base text-warmgray-900 dark:text-white">Everlasting Beauty</h3>
          <p className="text-xs text-warmgray-500 dark:text-warmgray-400">
            Never needs water or sunlight. Stays vibrant and cherished for years to come.
          </p>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-gradient-to-r from-bloom-500 to-rosewood-500 rounded-3xl p-8 sm:p-12 text-white text-center space-y-4 shadow-cozy">
        <h3 className="text-2xl sm:text-3xl font-serif font-bold">
          Ready to bring a handmade bloom into your home?
        </h3>
        <p className="text-xs sm:text-sm text-rose-100 max-w-md mx-auto">
          Explore our signature flower bouquets, cuddly plushies, or commission your own bespoke palette.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('shop')}
            className="px-8 py-3.5 bg-white text-warmgray-900 rounded-full font-bold text-xs shadow-lg hover:bg-rosewood-50"
          >
            Shop Handcrafted Blooms
          </button>
          <button
            onClick={() => onNavigate('custom-order')}
            className="px-7 py-3.5 bg-warmgray-900 hover:bg-black text-white rounded-full font-bold text-xs"
          >
            Commission Custom Piece ✨
          </button>
        </div>
      </div>

    </div>
  );
};
