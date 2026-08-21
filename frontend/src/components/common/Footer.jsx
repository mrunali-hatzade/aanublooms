import React, { useState } from 'react';
import { Flower2, Heart, Sparkles, Send, ShieldCheck, Globe, MessageCircle, Share2, MessageSquareHeart } from 'lucide-react';
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Newsletter Card */}
        <div className="bg-gradient-to-r from-bloom-500 via-rosewood-500 to-amber-500 rounded-3xl p-6 sm:p-8 mb-10 text-white shadow-soft-lg relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="max-w-2xl relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold tracking-wider uppercase mb-2 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Join the Cozy Yarn Club
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold mb-1.5">
              Get ₹150 off your first handcrafted piece
            </h3>
            <p className="text-rose-100 text-sm sm:text-base mb-4 leading-relaxed">
              Get flash drops, new pattern releases & maker behind-the-scenes stories.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5 max-w-md">
              <input
                type="email"
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-warmgray-900/90 text-warmgray-900 dark:text-white placeholder:text-warmgray-400 focus:outline-none focus:ring-2 focus:ring-white text-sm"
              />
              <button
                type="submit"
                className="px-6 py-2.5 rounded-2xl bg-warmgray-900 hover:bg-black text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-1.5 group whitespace-nowrap"
              >
                <span>Join Club</span>
                <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-3">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 group text-left"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-bloom-500 to-rosewood-400 flex items-center justify-center text-white shadow-cozy">
                <Flower2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold font-serif tracking-tight text-warmgray-900 dark:text-white">
                  AanuBlooms
                </span>
                <span className="block text-[10px] uppercase font-semibold tracking-widest text-bloom-600 dark:text-bloom-400">
                  Handcrafted Blooms & Creations
                </span>
              </div>
            </button>
            <p className="text-xs sm:text-sm text-warmgray-600 dark:text-warmgray-300 leading-relaxed max-w-sm">
              At AanuBlooms, we create beautiful handmade flowers, charming flower pots, bouquets, decorative pieces, and unique gifts. Every creation is carefully handcrafted with love, patience, and creativity to add a little beauty and happiness to your everyday spaces.
            </p>
            <div className="flex items-center gap-2.5 pt-1 text-warmgray-600 dark:text-warmgray-400">
              <a href="#" className="p-2.5 rounded-full bg-warmgray-200 dark:bg-warmgray-800 hover:text-bloom-600 dark:hover:text-bloom-400 transition-colors" title="Global Community">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 rounded-full bg-warmgray-200 dark:bg-warmgray-800 hover:text-bloom-600 dark:hover:text-bloom-400 transition-colors" title="Chat with Maker">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 rounded-full bg-warmgray-200 dark:bg-warmgray-800 hover:text-bloom-600 dark:hover:text-bloom-400 transition-colors" title="Share">
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <h4 className="font-serif font-bold text-warmgray-900 dark:text-white text-base mb-3">
              Our Collections
            </h4>
            <ul className="space-y-2 text-sm text-warmgray-600 dark:text-warmgray-300">
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
                  ✨ Decorative Creations
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('custom-order')} className="hover:text-bloom-600 dark:hover:text-bloom-400 transition-colors">
                  💖 Custom Creations
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-serif font-bold text-warmgray-900 dark:text-white text-base mb-3">
              Customer Care
            </h4>
            <ul className="space-y-2 text-sm text-warmgray-600 dark:text-warmgray-300">
              <li>
                <button onClick={() => onNavigate('track-order')} className="hover:text-bloom-600 dark:text-bloom-400 font-semibold text-bloom-700 transition-colors flex items-center gap-1.5">
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
                  <MessageSquareHeart className="w-4 h-4 text-bloom-500" />
                  <span>Customer Reviews</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Our Handmade Promise */}
          <div>
            <h4 className="font-serif font-bold text-warmgray-900 dark:text-white text-base mb-3">
              Our Handmade Promise
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm text-warmgray-600 dark:text-warmgray-300 leading-relaxed">
              <div className="flex items-start gap-2">
                <span className="shrink-0">🌸</span>
                <span><strong>100% Handcrafted</strong> — Every bloom is carefully made by hand.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="shrink-0">💖</span>
                <span><strong>Made with Love</strong> — Each creation is thoughtfully designed and assembled with care.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="shrink-0">✨</span>
                <span><strong>Made to Last</strong> — Our forever flowers are designed to stay beautiful without watering or maintenance.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="shrink-0">🎁</span>
                <span><strong>Perfect for Gifting</strong> — A thoughtful handmade gift for birthdays, celebrations, or to make someone smile.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-warmgray-200 dark:border-warmgray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-warmgray-500 dark:text-warmgray-400">
          <p>© {new Date().getFullYear()} AanuBlooms Studio. All creations handcrafted with love & care.</p>
          <div className="flex items-center gap-4 sm:gap-6">
            <span>Pune & PCMC Delivery</span>
            <span>UPI & Card Secure Checkout</span>
            <button
              onClick={() => onNavigate('admin')}
              className="text-warmgray-400 hover:text-warmgray-600 dark:hover:text-warmgray-200 transition-colors text-[11px] underline"
            >
              Artisan Admin
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
