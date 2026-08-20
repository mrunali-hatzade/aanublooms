import React, { useState } from 'react';
import { Sparkles, X, Heart } from 'lucide-react';

export const Banner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <aside aria-label="Announcement" className="bg-gradient-to-r from-bloom-600 via-rosewood-500 to-bloom-500 text-white text-xs sm:text-sm py-2 px-4 relative shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center font-medium">
        <Sparkles className="w-4 h-4 animate-spin text-amber-200 hidden sm:inline" style={{ animationDuration: '6s' }} />
        <span>
          🌸 Free Craft Shipping on orders over $50 | Use code <strong className="underline underline-offset-2 tracking-wider bg-white/20 px-1.5 py-0.5 rounded font-bold">AANU15</strong> for 15% off handmade creations!
        </span>
        <Heart className="w-3.5 h-3.5 fill-rose-200 text-rose-200 hidden md:inline ml-1" />
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-1"
        aria-label="Dismiss banner"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
};
