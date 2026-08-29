import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export const Banner = () => {
  return (
    <aside aria-label="Announcement" className="bg-gradient-to-r from-bloom-600 via-pink-500 to-rosewood-500 text-white text-xs sm:text-sm py-2 px-4 relative shadow-sm">
      <div className="w-full flex items-center justify-center gap-2 text-center font-medium">
        <Sparkles className="w-4 h-4 animate-spin text-amber-200 hidden sm:inline" style={{ animationDuration: '6s' }} />
        <span>
          🌸 Handcrafted & Delivered Exclusively Across <strong>Pune Region</strong> | Use code <strong className="underline underline-offset-2 tracking-wider bg-white/20 px-1.5 py-0.5 rounded font-bold">AANU15</strong> for 15% off!
        </span>
        <Heart className="w-3.5 h-3.5 fill-rose-200 text-rose-200 hidden md:inline ml-1" />
      </div>
    </aside>
  );
};
