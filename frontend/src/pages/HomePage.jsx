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

import { ContactFormSection } from '../components/common/ContactFormSection';

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

    const handleUpdate = () => fetchHomeData();
    window.addEventListener('aanublooms_data_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('aanublooms_data_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const filteredItems = featuredProducts.filter(p => {
    if (activeFilterTab === 'bestsellers') return p.isBestseller;
    if (activeFilterTab === 'new') return p.isNew;
    if (activeFilterTab === 'blooms') return p.category === 'forever-blooms';
    if (activeFilterTab === 'plushies') return p.category === 'flower pots-plushies';
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
      <section id="home-bestsellers" className="py-4 sm:py-6 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 animate-reveal-up delay-200">
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

        {/* 6-Column Compact Product Cards Grid with Staggered Entrance */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 text-xs text-warmgray-500 animate-reveal-up">
            Loading handcrafted creations...
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
            {filteredItems.slice(0, 12).map((product, pIdx) => (
              <div
                key={product.id}
                style={{ animationDelay: `${(pIdx * 50) + 200}ms` }}
                className="animate-reveal-scale"
              >
                <ProductCard
                  product={product}
                  onNavigate={onNavigate}
                  onQuickView={(prod) => setQuickViewProduct(prod)}
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center animate-reveal-up delay-400">
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
      <div id="home-feedback" className="animate-reveal-up delay-250">
        <CustomerFeedbackSection onNavigate={onNavigate} />
      </div>

      {/* 7. Artisan Craft Videos & Reels Gallery (With Add Video Button) */}
      <div id="home-videos" className="animate-reveal-up delay-300">
        <StudioVideoGallery onNavigate={onNavigate} />
      </div>

      {/* 8. Meet the Maker Artisan Section */}
      <div id="home-story" className="animate-reveal-up delay-350">
        <MeetTheMaker onNavigate={onNavigate} />
      </div>

      {/* 9. Instagram CTA Section */}
      <section className="py-6 sm:py-8 bg-gradient-to-r from-bloom-400 via-rosewood-500 to-amber-500 text-white shadow-soft relative overflow-hidden animate-reveal-up delay-400">
        <div className="absolute top-0 right-0 opacity-15 pointer-events-none animate-spin-slow">
          <Flower2 className="w-72 h-72 -translate-y-1/3 translate-x-1/4" />
        </div>
        <div className="absolute -bottom-10 left-10 opacity-10 pointer-events-none animate-float-slow">
          <Sparkles className="w-40 h-40" />
        </div>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2">
            <h3 className="font-serif font-bold text-xl sm:text-2xl flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="w-5 h-5 text-amber-200 animate-spin-slow" />
              <span>Follow Our Studio Journey</span>
            </h3>
            <p className="text-sm text-rose-100 max-w-xl">
              See the latest pipe cleaner creations, studio behind-the-scenes, and upcoming exclusive drops. 
            </p>
          </div>
          <a
            href="https://instagram.com/aanublooms"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-white text-rosewood-600 hover:bg-rosewood-50 rounded-full font-bold text-sm shadow-lg btn-shimmer transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 active:scale-95 inline-flex items-center gap-2 shrink-0 group"
          >
            <span>Follow @aanublooms</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>

      {/* 11. Custom Commission Banner Teaser */}
      <section className="py-4 sm:py-6 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 animate-reveal-up delay-450">
        <div className="bg-gradient-to-r from-bloom-500 via-rosewood-500 to-amber-500 rounded-3xl p-6 sm:p-10 text-white shadow-soft-lg flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
          
          {/* Animated Background Flora */}
          <div className="absolute -bottom-12 -right-12 opacity-15 pointer-events-none animate-spin-slow">
            <Flower2 className="w-64 h-64" />
          </div>
          
          <div className="max-w-xl relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold uppercase tracking-wider mb-2 animate-bounce-subtle">
              <Flower2 className="w-3.5 h-3.5" />
              <span>Custom Orders</span>
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-2 leading-snug">
              Need a personalized floral bouquet or pot?
            </h3>
            <p className="text-rose-100 text-sm sm:text-base leading-relaxed mb-5">
              Pick your favorite flower stems, color palette & personalized ribbon messages.
            </p>
            <button
              onClick={() => onNavigate('custom-order')}
              className="px-7 py-3 bg-white hover:bg-rosewood-50 text-warmgray-900 rounded-full font-bold text-sm shadow-md btn-shimmer transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 active:scale-95 inline-flex items-center gap-2 group"
            >
              <span>Start Custom Order ✨</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="relative shrink-0 card-hover-3d">
            <img
              src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=400&q=80"
              alt="Custom bouquet"
              className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl object-cover border-4 border-white/40 shadow-2xl rotate-1 group-hover:rotate-0 transition-all duration-500"
            />
          </div>
        </div>
      </section>

      {/* 12. Contact Us Form Section */}
      <div id="footer-contact" className="animate-reveal-up delay-500">
        <ContactFormSection />
      </div>

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
