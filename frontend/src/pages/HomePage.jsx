import React, { useState, useEffect } from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { CategoryShowcase } from '../components/home/CategoryShowcase';
import { StudioVideoGallery } from '../components/home/StudioVideoGallery';
import { MeetTheMaker } from '../components/home/MeetTheMaker';
import { CustomerFeedbackSection } from '../components/home/CustomerFeedbackSection';
import { ProductCard } from '../components/product/ProductCard';
import { QuickViewModal } from '../components/product/QuickViewModal';
import { Sparkles, ArrowRight, Flower2 } from 'lucide-react';
import { api } from '../services/api';

export const HomePage = ({ onNavigate }) => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [activeFilterTab, setActiveFilterTab] = useState('all');

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [catsRes, prodsRes] = await Promise.all([
          api.getCategories(),
          api.getProducts({ limit: 16 })
        ]);
        setCategories(catsRes.data || []);
        setFeaturedProducts(prodsRes.data || []);
      } catch (err) {
        console.error('Home data load error:', err);
      }
    };
    fetchHomeData();
  }, []);

  const filteredItems = featuredProducts.filter(p => {
    if (activeFilterTab === 'bestsellers') return p.isBestseller;
    if (activeFilterTab === 'new') return p.isNew;
    if (activeFilterTab === 'blooms') return p.category === 'forever-blooms';
    if (activeFilterTab === 'plushies') return p.category === 'amigurumi-plushies';
    return true;
  });

  return (
    <div className="space-y-8 sm:space-y-10">
      
      {/* 1. Hero Section */}
      <div id="home-hero">
        <HeroSection onNavigate={onNavigate} />
      </div>

      {/* 2. Categories Showcase */}
      <div id="home-categories">
        <CategoryShowcase categories={categories} onNavigate={onNavigate} />
      </div>

      {/* 5. Centered "Best Sellers" Section (Matching Reference Design) */}
      <section id="home-bestsellers" className="py-4 sm:py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-md mx-auto mb-6">
          <div className="flex items-center justify-center gap-2 text-[#E07A5F] mb-1">
            <span className="h-px w-10 bg-[#E07A5F]/40"></span>
            <span className="text-xs font-serif">୨୧</span>
            <span className="h-px w-10 bg-[#E07A5F]/40"></span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-warmgray-900 dark:text-white">
            Best Sellers
          </h2>
        </div>

        {/* 6-Column Compact Product Cards Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 text-xs text-warmgray-500">
            Loading handcrafted creations...
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
            {filteredItems.slice(0, 12).map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onNavigate={onNavigate}
                onQuickView={(prod) => setQuickViewProduct(prod)}
              />
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => onNavigate('shop')}
            className="px-7 py-2.5 bg-warmgray-900 hover:bg-black text-white dark:bg-warmgray-800 dark:hover:bg-warmgray-700 rounded-full font-bold text-xs shadow-xs transition-all inline-flex items-center gap-2"
          >
            <span>View All Handcrafted Pieces</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 6. Customer Feedback Section */}
      <div id="home-feedback">
        <CustomerFeedbackSection onNavigate={onNavigate} />
      </div>

      {/* 7. Artisan Craft Videos & Reels Gallery (With Add Video Button) */}
      <div id="home-videos">
        <StudioVideoGallery onNavigate={onNavigate} />
      </div>

      {/* 8. Meet the Maker Artisan Section */}
      <div id="home-story">
        <MeetTheMaker onNavigate={onNavigate} />
      </div>

      {/* 11. Custom Commission Banner Teaser */}
      <section className="py-4 sm:py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-bloom-500 via-rosewood-500 to-amber-500 rounded-3xl p-6 sm:p-10 text-white shadow-soft-lg flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="max-w-xl relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider mb-2">
              <Flower2 className="w-3.5 h-3.5" />
              Custom Orders
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-2">
              Need a personalized floral bouquet or plushie?
            </h3>
            <p className="text-rose-100 text-sm sm:text-base leading-relaxed mb-4">
              Pick your favorite flower stems, color palette & embroidered ribbon messages.
            </p>
            <button
              onClick={() => onNavigate('custom-order')}
              className="px-6 py-3 bg-white hover:bg-rosewood-50 text-warmgray-900 rounded-full font-bold text-sm shadow-md transition-transform hover:scale-105"
            >
              Start Custom Order ✨
            </button>
          </div>

          <div className="relative shrink-0">
            <img
              src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=400&q=80"
              alt="Custom bouquet"
              className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl object-cover border-4 border-white/30 shadow-xl rotate-1 hover:rotate-0 transition-transform duration-300"
            />
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onNavigate={onNavigate}
        />
      )}

    </div>
  );
};
