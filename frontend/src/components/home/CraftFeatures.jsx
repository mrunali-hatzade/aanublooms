import React from 'react';
import { Flower2, Heart, Clock, Gift } from 'lucide-react';

export const CraftFeatures = () => {
  const features = [
    {
      icon: Clock,
      title: 'Slow Artisan Handcraft',
      desc: '100% hand-crocheted with meticulous stitch care.'
    },
    {
      icon: Flower2,
      title: 'Forever Blooms',
      desc: 'Everlasting floral stems that never wilt or wither.'
    },
    {
      icon: Heart,
      title: 'Premium Eco-Yarn',
      desc: 'Combed organic milk cotton & velvet yarn.'
    },
    {
      icon: Gift,
      title: 'Artisan Gift Packaging',
      desc: 'Includes satin ribbons & custom message cards.'
    }
  ];

  return (
    <section className="py-5 sm:py-6 bg-white dark:bg-warmgray-900 border-b border-warmgray-200 dark:border-warmgray-800 transition-colors">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3.5 p-4 rounded-2xl bg-warmgray-50 dark:bg-warmgray-800/60 border border-warmgray-100 dark:border-warmgray-700/60 shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-bloom-100 to-rosewood-100 dark:from-warmgray-700 dark:to-bloom-950 flex items-center justify-center text-bloom-600 dark:text-bloom-400 shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm sm:text-base text-warmgray-900 dark:text-white">
                    {feat.title}
                  </h4>
                  <p className="text-xs text-warmgray-500 dark:text-warmgray-400 mt-0.5">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
