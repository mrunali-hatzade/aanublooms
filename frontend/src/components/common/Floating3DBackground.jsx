import React from 'react';

export const Floating3DBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      
      {/* 1. Ambient 3D Depth Glow Orbs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-tr from-pink-300/25 to-purple-300/20 dark:from-pink-900/15 dark:to-purple-900/10 rounded-full blur-3xl animate-float opacity-70" style={{ animationDuration: '9s' }} />
      <div className="absolute top-1/3 -right-24 w-96 h-96 bg-gradient-to-bl from-rose-300/20 to-amber-200/20 dark:from-rose-950/15 dark:to-amber-950/10 rounded-full blur-3xl animate-float opacity-60" style={{ animationDuration: '14s', animationDelay: '-3s' }} />
      <div className="absolute -bottom-24 left-1/3 w-[30rem] h-[30rem] bg-gradient-to-tr from-purple-200/20 to-pink-200/20 dark:from-purple-950/15 dark:to-pink-950/10 rounded-full blur-3xl animate-float opacity-50" style={{ animationDuration: '12s', animationDelay: '-6s' }} />

      {/* 2. Floating 3D Elements with Depth of Field */}
      
      {/* Top Left: 3D Floating Tulip with Soft Drop Shadow */}
      <div
        className="absolute top-28 left-6 sm:left-14 animate-float opacity-60 dark:opacity-40 filter drop-shadow-[0_12px_20px_rgba(225,70,112,0.25)] transition-transform duration-700"
        style={{ animationDuration: '7s' }}
      >
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/40 dark:bg-warmgray-800/40 backdrop-blur-md border border-white/60 dark:border-warmgray-700/50 flex items-center justify-center text-2xl sm:text-3xl rotate-[-12deg] shadow-lg">
          🌷
        </div>
      </div>

      {/* Top Right: 3D Floating Yarn Ball */}
      <div
        className="absolute top-36 right-8 sm:right-16 animate-float opacity-65 dark:opacity-45 filter drop-shadow-[0_15px_25px_rgba(168,85,247,0.25)]"
        style={{ animationDuration: '10s', animationDelay: '-2s' }}
      >
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-purple-100/60 to-pink-100/60 dark:from-purple-900/30 dark:to-pink-900/30 backdrop-blur-md border border-purple-200/50 dark:border-purple-800/40 flex items-center justify-center text-3xl sm:text-4xl rotate-[15deg] shadow-xl">
          🧶
        </div>
      </div>

      {/* Mid Left: 3D Floating Chamomile Daisy */}
      <div
        className="absolute top-[52%] left-4 sm:left-10 animate-float opacity-50 dark:opacity-30 filter drop-shadow-[0_10px_18px_rgba(251,191,36,0.2)]"
        style={{ animationDuration: '11s', animationDelay: '-4s' }}
      >
        <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-white/50 dark:bg-warmgray-800/40 backdrop-blur-md border border-amber-200/40 flex items-center justify-center text-2xl sm:text-3xl rotate-[20deg] shadow-md">
          🌼
        </div>
      </div>

      {/* Mid Right: 3D Floating Ribbon Bow */}
      <div
        className="absolute top-[65%] right-6 sm:right-12 animate-float opacity-60 dark:opacity-40 filter drop-shadow-[0_12px_22px_rgba(244,63,94,0.25)]"
        style={{ animationDuration: '8.5s', animationDelay: '-5s' }}
      >
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-pink-50/70 to-rose-100/70 dark:from-pink-950/40 dark:to-rose-900/40 backdrop-blur-md border border-pink-200/60 dark:border-pink-800/40 flex items-center justify-center text-2xl sm:text-3xl rotate-[-15deg] shadow-lg">
          🎀
        </div>
      </div>

      {/* Bottom Left: 3D Floating Sparkle Gem */}
      <div
        className="absolute bottom-28 left-8 sm:left-20 animate-float opacity-70 dark:opacity-50 filter drop-shadow-[0_10px_20px_rgba(234,179,8,0.3)]"
        style={{ animationDuration: '9.5s', animationDelay: '-1.5s' }}
      >
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/60 dark:bg-warmgray-800/60 backdrop-blur-md border border-yellow-200/60 flex items-center justify-center text-xl sm:text-2xl shadow-md">
          ✨
        </div>
      </div>

      {/* Bottom Right: 3D Floating Cherry Blossom */}
      <div
        className="absolute bottom-36 right-10 sm:right-24 animate-float opacity-60 dark:opacity-40 filter drop-shadow-[0_14px_24px_rgba(225,70,112,0.22)]"
        style={{ animationDuration: '12s', animationDelay: '-7s' }}
      >
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-rose-100/60 to-purple-100/60 dark:from-rose-950/40 dark:to-purple-950/40 backdrop-blur-md border border-rose-200/50 flex items-center justify-center text-2xl sm:text-3xl rotate-[8deg] shadow-lg">
          🌸
        </div>
      </div>

      {/* Soft Ethereal Stitches Texture Grid (Subtle Luxury Depth) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-100/20 via-transparent to-transparent dark:from-pink-950/10 pointer-events-none" />

    </div>
  );
};
