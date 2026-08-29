import React from 'react';
import { Flower2, Heart, Sparkles, Clock, ShieldCheck, ArrowRight, Quote } from 'lucide-react';

export const AboutMakerPage = ({ onNavigate }) => {
  return (
    <div className="py-10 sm:py-12 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-14">
      
      {/* Hero Header: Left Aligned as in Footer/Image 2 */}
      <div className="text-left max-w-4xl space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rosewood-100 dark:bg-rosewood-950 text-rosewood-800 dark:text-rosewood-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          The Story Behind AanuBlooms
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-warmgray-900 dark:text-white leading-tight">
          Handcrafted with Love, Creativity & Endless Patience
        </h1>
        <p className="text-base text-warmgray-600 dark:text-warmgray-300 leading-relaxed max-w-2xl">
          Welcome to AanuBlooms! We create handmade flowers, bouquets and keepsakes using colorful pipe cleaners bringing creativity and warmth into everyday life.
        </p>
      </div>

      {/* Top Story Section: Photo Aligned Upward + Opening Story */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Story Intro (7 Cols) */}
        <div className="lg:col-span-7 space-y-4 text-sm text-warmgray-700 dark:text-warmgray-300 leading-relaxed">
          <div className="inline-flex items-center gap-2 text-bloom-600 dark:text-bloom-400 font-bold text-xs uppercase tracking-widest">
            <span className="w-6 h-px bg-bloom-400" />
            Meet The Artisan
          </div>
          
          <h2 className="text-2xl font-serif font-bold text-warmgray-900 dark:text-white leading-snug">
            A story that began at home, inspired by a mother and carried forward by her daughter.
          </h2>

          <p>
            AanuBlooms is more than just a handmade brand. It is a small part of a beautiful story that began at home, inspired by a mother and carried forward by her daughter.
          </p>

          <p>
            Aanu's journey with handmade art began at the age of 11, when her mother taught her how to make handcrafted woollen products at home. Watching her mother create beautiful things with patience and creativity, Aanu developed a deep love for handmade art. Her mother always encouraged her to explore her creativity and participate in different activities and competitions. For Aanu, those little moments became beautiful childhood memories.
          </p>
        </div>

        {/* Photo Box: Upward Placed, Elevated Portrait (5 Cols) */}
        <div className="lg:col-span-5 relative">
          <div className="relative mx-auto max-w-md">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-warmgray-800 bg-white dark:bg-warmgray-900 group">
              <div className="relative">
                <img
                  src="/images/founder.jpeg"
                  alt="Artisan Aanu - Founder of AanuBlooms"
                  className="w-full h-80 sm:h-[420px] object-cover object-bottom group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-gradient-to-r from-bloom-600 to-rosewood-600 text-white text-xs font-bold shadow-lg flex items-center gap-1.5">
                  <Heart className="w-3 h-3 fill-white" />
                  <span>Lead Artisan</span>
                </div>
              </div>
              <div className="p-4 sm:p-5 bg-white dark:bg-warmgray-900 border-t border-warmgray-100 dark:border-warmgray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div>
                  <h4 className="font-serif font-bold text-sm sm:text-base text-warmgray-900 dark:text-white">
                    Aanurvi Ghatole (Aanu)
                  </h4>
                  <p className="text-xs text-warmgray-500 dark:text-warmgray-400">
                    Founder & Lead Artisan, AanuBlooms
                  </p>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-bloom-50 dark:bg-warmgray-800 border border-bloom-100 dark:border-warmgray-700">
                  <span className="text-xs font-bold text-bloom-600 dark:text-bloom-400 block font-handwritten">
                    "Made by Hand. Inspired by Love." 🌷
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Spacious Full-Width Continuation of Story Below Photo */}
      <div className="space-y-8 pt-2">
        
        {/* Chapter 1: The Rediscovery */}
        <div className="space-y-3 text-sm text-warmgray-700 dark:text-warmgray-300 leading-relaxed">
          <h3 className="text-xl font-serif font-bold text-warmgray-900 dark:text-white flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-bloom-500 shrink-0" />
            The Rediscovery & The Spark of Pipe Cleaners
          </h3>
          <p>
            As she grew older, studies and life took her in different directions. Yet, the memories of watching her mother create things at home never truly disappeared. Years later, remembering those special moments, Aanu decided to bring handmade creativity back into her life—but with an idea of her own.
          </p>
          <p>
            And so, <strong>AanuBlooms</strong> was born, creating beautiful handmade flowers, flower pots, keychains, photo frames, and bespoke keepsakes using colourful, premium pipe cleaners.
          </p>
        </div>

        {/* Chapter 2: Why "AanuBlooms"? Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-rosewood-50 via-warmgray-50 to-bloom-50 dark:from-warmgray-900 dark:via-warmgray-900 dark:to-warmgray-850 border border-warmgray-200/80 dark:border-warmgray-700 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-rosewood-600 dark:text-rosewood-400 font-bold text-xs uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 fill-current" />
            The Name & Its Meaning
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-warmgray-900 dark:text-white">
            Why "AanuBlooms"?
          </h3>
          <p className="text-sm text-warmgray-700 dark:text-warmgray-300 leading-relaxed">
            The name AanuBlooms has a very special meaning. Aanu's original name is <strong>Aanurvi Ghatole</strong>. Her mother thoughtfully chose the name Aanurvi with love and care, and it also carries a part of her father's name, <strong>Anandrao</strong>. At home, her parents lovingly call her <strong>"Aanu."</strong>
          </p>
          <p className="text-sm text-warmgray-700 dark:text-warmgray-300 leading-relaxed">
            When Aanu decided to start her own handmade brand, she wanted to make this little name grow into something bigger—while carrying with it the love, thought, and identity given to her by her parents. That's why she chose "Aanu" as the heart of her brand. And "Blooms" represents flowers, creativity, growth, and the beautiful journey of turning a childhood inspiration into something of her own.
          </p>
        </div>

        {/* Chapter 3: Slow Craft Promise */}
        <div className="space-y-3 text-sm text-warmgray-700 dark:text-warmgray-300 leading-relaxed">
          <h3 className="text-xl font-serif font-bold text-warmgray-900 dark:text-white flex items-center gap-2.5">
            <Flower2 className="w-4 h-4 text-bloom-500 shrink-0" />
            Every Piece Tells a Story
          </h3>
          <p>
            Every single AanuBlooms creation carries a little piece of Aanu's journey—from watching her mother create handmade products as a child to finding her own creative path years later. What began with a mother's inspiration has now blossomed into AanuBlooms.
          </p>
          <p className="font-bold text-bloom-600 dark:text-bloom-400 text-base">
            Made by Hand. Inspired by Love. 🌷
          </p>
        </div>

      </div>

      {/* Studio Ethos / Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
        <div className="p-6 rounded-3xl bg-white dark:bg-warmgray-900 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-bloom-100 dark:bg-warmgray-800 text-bloom-600 mx-auto flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-base text-warmgray-900 dark:text-white">Slow Craft Devotion</h3>
          <p className="text-xs text-warmgray-500 dark:text-warmgray-400">
            We spend between 2 to 8 hours on each stem and pot to ensure tight, flawless pipe cleaner sculpting.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-warmgray-900 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rosewood-100 dark:bg-warmgray-800 text-rosewood-600 mx-auto flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-base text-warmgray-900 dark:text-white">Eco & Hypoallergenic</h3>
          <p className="text-xs text-warmgray-500 dark:text-warmgray-400">
            Soft chenille pipe cleaners that are gentle to touch, dust-free, and safe for all homes.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-warmgray-900 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-warmgray-800 text-amber-600 mx-auto flex items-center justify-center">
            <Flower2 className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-base text-warmgray-900 dark:text-white">Everlasting Keepsake</h3>
          <p className="text-xs text-warmgray-500 dark:text-warmgray-400">
            Never needs watering or sunlight. Stays vibrant and cherished forever on desks and nightstands.
          </p>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-gradient-to-r from-bloom-500 to-rosewood-500 rounded-3xl p-8 sm:p-12 text-white text-center space-y-4 shadow-cozy">
        <h3 className="text-2xl sm:text-3xl font-serif font-bold">
          Ready to bring a handmade bloom into your home?
        </h3>
        <p className="text-xs sm:text-sm text-rose-100 max-w-md mx-auto">
          Explore our handcrafted flower bouquets, flower pots, photo frames, or commission your own bespoke palette.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('shop')}
            className="px-8 py-3.5 bg-white text-warmgray-900 rounded-full font-bold text-xs shadow-lg hover:bg-rosewood-50 transition-colors"
          >
            Shop Handcrafted Blooms
          </button>
          <button
            onClick={() => onNavigate('custom-order')}
            className="px-7 py-3.5 bg-warmgray-900 hover:bg-black text-white rounded-full font-bold text-xs transition-colors"
          >
            Commission Custom Piece ✨
          </button>
        </div>
      </div>

    </div>
  );
};
