import React, { useState } from 'react';
import { Flower2, Heart, Sparkles, Send, ShieldCheck, Globe, MessageCircle, Share2, MessageSquare } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const Footer = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const { addToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      addToast('🌸 Welcome to the AanuBlooms Yarn Club! Check your inbox for your ₹150 discount code.', 'success');
      setEmail('');
    }
  };

  return (
    <footer className="bg-warmgray-100 dark:bg-warmgray-900 border-t border-warmgray-200 dark:border-warmgray-800 transition-colors pt-10 pb-8">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
          
          {/* Brand Col (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 group text-left"
            >
              <img
                src="/images/logo.png"
                alt="AanuBlooms Logo"
                className="w-12 h-12 rounded-2xl object-cover shadow-cozy border border-bloom-100 dark:border-warmgray-700 bg-white"
              />
              <div>
                <span className="text-2xl font-bold font-serif tracking-tight text-warmgray-900 dark:text-white">
                  AanuBlooms
                </span>
              </div>
            </button>
            <p className="text-sm text-warmgray-600 dark:text-warmgray-300 leading-relaxed max-w-sm">
              Handcrafted forever flowers, charming flower pots, bouquets, and unique artisan gifts made with love in Pune.
            </p>
            <div className="flex items-center gap-3 pt-2 text-warmgray-600 dark:text-warmgray-400">
              <a href="#" className="p-3 rounded-full bg-warmgray-200/70 dark:bg-warmgray-800 hover:text-bloom-600 dark:hover:text-bloom-400 hover:bg-white transition-all shadow-xs" title="Global Community">
                <Globe className="w-4 h-4" />
              </a>
              <a href="https://www.instagram.com/aanublooms" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-warmgray-200/70 dark:bg-warmgray-800 hover:text-bloom-600 dark:hover:text-bloom-400 hover:bg-white transition-all shadow-xs" title="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="https://wa.me/919579162154" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-warmgray-200/70 dark:bg-warmgray-800 hover:text-bloom-600 dark:hover:text-bloom-400 hover:bg-white transition-all shadow-xs" title="Chat with Maker">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" className="p-3 rounded-full bg-warmgray-200/70 dark:bg-warmgray-800 hover:text-bloom-600 dark:hover:text-bloom-400 hover:bg-white transition-all shadow-xs" title="Share">
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop Collections (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif font-bold text-warmgray-900 dark:text-white text-base">
              Our Collections
            </h4>
            <ul className="space-y-2.5 text-sm text-warmgray-600 dark:text-warmgray-300">
              <li>
                <button onClick={() => onNavigate('shop', { category: 'forever-blooms' })} className="hover:text-bloom-600 dark:hover:text-bloom-400 transition-colors">
                  🌸 Handmade Flowers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { category: 'home-living' })} className="hover:text-bloom-600 dark:hover:text-bloom-400 transition-colors">
                  🪴 Flower Pots
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { category: 'forever-blooms' })} className="hover:text-bloom-600 dark:hover:text-bloom-400 transition-colors">
                  💐 Forever Bouquets
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { category: 'diy-kits-patterns' })} className="hover:text-bloom-600 dark:hover:text-bloom-400 transition-colors">
                  🎁 Handmade Gifts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { category: 'bags-accessories' })} className="hover:text-bloom-600 dark:hover:text-bloom-400 transition-colors">
                  ✨ Decorative Pieces
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('custom-order')} className="hover:text-bloom-600 dark:hover:text-bloom-400 font-semibold text-bloom-600 transition-colors">
                  💖 Custom Orders
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif font-bold text-warmgray-900 dark:text-white text-base">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-sm text-warmgray-600 dark:text-warmgray-300">
              <li>
                <button onClick={() => onNavigate('track-order')} className="hover:text-bloom-600 dark:text-bloom-400 font-bold text-bloom-700 dark:text-bloom-300 transition-colors flex items-center gap-1.5">
                  <span>📦 Track Your Order</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('custom-order')} className="hover:text-bloom-600 dark:hover:text-bloom-400 transition-colors">
                  Custom Orders
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-bloom-600 dark:hover:text-bloom-400 transition-colors">
                  Meet the Maker
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('wishlist')} className="hover:text-bloom-600 dark:hover:text-bloom-400 transition-colors">
                  My Wishlist
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-bloom-600 dark:hover:text-bloom-400 transition-colors">
                  Contact AanuBlooms
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('feedback')} className="hover:text-bloom-600 dark:hover:text-bloom-400 font-semibold text-bloom-700 dark:text-bloom-300 transition-colors flex items-center gap-1">
                  <MessageSquare className="w-4 h-4 text-bloom-500" />
                  <span>Customer Reviews</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Our Handmade Promise (4 cols) */}
          <div className="lg:col-span-4 space-y-3.5">
            <h4 className="font-serif font-bold text-warmgray-900 dark:text-white text-base">
              Our Handmade Promise
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-warmgray-600 dark:text-warmgray-300">
              <div className="p-3 rounded-2xl bg-white/70 dark:bg-warmgray-800/70 border border-warmgray-200/60 dark:border-warmgray-700/60 shadow-xs flex items-start gap-2.5">
                <span className="text-base shrink-0">🌸</span>
                <p className="leading-snug">
                  <strong className="text-warmgray-900 dark:text-white">100% Handcrafted</strong>
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-white/70 dark:bg-warmgray-800/70 border border-warmgray-200/60 dark:border-warmgray-700/60 shadow-xs flex items-start gap-2.5">
                <span className="text-base shrink-0">🌱</span>
                <p className="leading-snug">
                  <strong className="text-warmgray-900 dark:text-white">Cute, Long lasting & Eco-friendly</strong>
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-white/70 dark:bg-warmgray-800/70 border border-warmgray-200/60 dark:border-warmgray-700/60 shadow-xs flex items-start gap-2.5">
                <span className="text-base shrink-0">✨</span>
                <p className="leading-snug">
                  <strong className="text-warmgray-900 dark:text-white">Made with Quality Material</strong>
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-white/70 dark:bg-warmgray-800/70 border border-warmgray-200/60 dark:border-warmgray-700/60 shadow-xs flex items-start gap-2.5">
                <span className="text-base shrink-0">🚚</span>
                <p className="leading-snug">
                  <strong className="text-warmgray-900 dark:text-white">Pune Region Delivery</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-warmgray-200 dark:border-warmgray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-warmgray-500 dark:text-warmgray-400">
          <div>
            <p>
              © {new Date().getFullYear()} AanuBlooms Studio. All creations handcrafted with love & care. | <span className="text-[#E07A5F] font-medium">Designed by Simplified Works-9767355347</span>
            </p>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <span>Pune & PCMC Delivery</span>
            <span>UPI & Card Secure Checkout</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
