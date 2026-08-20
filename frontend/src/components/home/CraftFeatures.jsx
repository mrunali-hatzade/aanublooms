import React from 'react';
import { Flower2, Heart, Sparkles, Clock, ShieldCheck, Gift, Truck } from 'lucide-react';

export const CraftFeatures = () => {
  const features = [
    {
      icon: Clock,
      title: 'Slow Artisan Handcraft',
      desc: 'Each petal, plushie, and loop is hand-crocheted over 4-24 hours with meticulous stitch tension.'
    },
    {
      icon: Flower2,
      title: 'Forever Blooms',
      desc: 'Our floral bouquets and potted flowers will never wilt or wither — a lifelong treasured gift.'
    },
    {
      icon: Heart,
      title: 'Hypoallergenic Eco-Yarn',
      desc: 'Crafted with premium OEKO-TEX certified combed milk cotton and ultra-soft chenille velvet.'
    },
    {
      icon: Gift,
      title: 'Artisan Gift Packaging',
      desc: 'Includes satin ribbons, protective kraft wrapping, and optional handwritten card messages.'
    }
  ];

  return (
    <section className="py-6 sm:py-8 bg-white dark:bg-warmgray-900 border-b border-warmgray-200 dark:border-warmgray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-4 p-5 rounded-3xl bg-warmgray-50 dark:bg-warmgray-800/60 border border-warmgray-100 dark:border-warmgray-700/60 shadow-xs"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-bloom-100 to-rosewood-100 dark:from-warmgray-700 dark:to-bloom-950 flex items-center justify-center text-bloom-600 dark:text-bloom-400 shrink-0 shadow-xs">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-warmgray-900 dark:text-white mb-1">
                    {feat.title}
                  </h4>
                  <p className="text-xs text-warmgray-600 dark:text-warmgray-400 leading-relaxed">
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
