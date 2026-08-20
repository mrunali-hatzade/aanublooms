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
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-xs font-bold tracking-wider uppercase mb-2 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Join the Cozy Yarn Club
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold mb-1.5">
              Get ₹150 off your first handcrafted piece
            </h3>
            <p className="text-rose-100 text-xs sm:text-sm mb-4 leading-relaxed">
              Receive secret flash drops, new amigurumi pattern releases, custom commission openings, and maker behind-the-scenes stories.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5 max-w-md">
              <input
                type="email"
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-3.5 py-2.5 rounded-2xl bg-white/90 dark:bg-warmgray-900/90 text-warmgray-900 dark:text-white placeholder:text-warmgray-400 focus:outline-none focus:ring-2 focus:ring-white text-xs"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-2xl bg-warmgray-900 hover:bg-black text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5 group whitespace-nowrap"
              >
                <span>Join Club</span>
                <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
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
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-bloom-500 to-rosewood-400 flex items-center justify-center text-white shadow-cozy">
                <Flower2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-bold font-serif tracking-tight text-warmgray-900 dark:text-white">
                  AanuBlooms
                </span>
                <span className="block text-[9px] uppercase font-semibold tracking-widest text-bloom-600 dark:text-bloom-400">
                  Artisan Crochet Boutique (India)
                </span>
              </div>
            </button>
            <p className="text-xs text-warmgray-600 dark:text-warmgray-400 leading-relaxed max-w-sm">
              Handcrafting timeless floral bouquets, cuddly amigurumi plushies, and cozy wearables. Each stitch is woven with love, patience, and the highest grade organic cotton & velvet yarn.
            </p>
            <div className="flex items-center gap-2.5 pt-1 text-warmgray-600 dark:text-warmgray-400">
              <a href="#" className="p-2 rounded-full bg-warmgray-200 dark:bg-warmgray-800 hover:text-bloom-600 dark:hover:text-bloom-400 transition-colors" title="Global Community">
                <Globe className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-warmgray-200 dark:bg-warmgray-800 hover:text-bloom-600 dark:hover:text-bloom-400 transition-colors" title="Chat with Maker">
                <MessageCircle className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-warmgray-200 dark:bg-warmgray-800 hover:text-bloom-600 dark:hover:text-bloom-400 transition-colors" title="Share">
                <Share2 className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <h4 className="font-serif font-bold text-warmgray-900 dark:text-white text-sm mb-3">
              Handmade Catalog
            </h4>
            <ul className="space-y-2 text-xs text-warmgray-600 dark:text-warmgray-400">
              <li>
                <button onClick={() => onNavigate('shop', { category: 'forever-blooms' })} className="hover:text-bloom-600 dark:hover:text-bloom-400 transition-colors">
                  Forever Blooms & Pots
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { category: 'amigurumi-plushies' })} className="hover:text-bloom-600 dark:hover:text-bloom-400 transition-colors">
                  Amigurumi Plushies
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { category: 'bags-accessories' })} className="hover:text-bloom-600 dark:hover:text-bloom-400 transition-colors">
                  Daisy Bags & Totes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { category: 'wearables-apparel' })} className="hover:text-bloom-600 dark:hover:text-bloom-400 transition-colors">
                  Hexagon Cardigans & Hats
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { category: 'diy-kits-patterns' })} className="hover:text-bloom-600 dark:hover:text-bloom-400 transition-colors">
                  DIY Starter Kits & Patterns
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-serif font-bold text-warmgray-900 dark:text-white text-sm mb-3">
              Maker & Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-warmgray-600 dark:text-warmgray-400">
              <li>
                <button onClick={() => onNavigate('feedback')} className="hover:text-bloom-600 dark:hover:text-bloom-400 font-semibold text-bloom-700 dark:text-bloom-300 transition-colors flex items-center gap-1">
                  <MessageSquareHeart className="w-3.5 h-3.5 text-bloom-500" />
                  <span>Customer Feedback & Reviews</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('track-order')} className="hover:text-bloom-600 dark:hover:text-bloom-400 transition-colors">
                  Track Order Timeline
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('custom-order')} className="hover:text-bloom-600 dark:hover:text-bloom-400 transition-colors">
                  Custom Bouquet Commission
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-bloom-600 dark:hover:text-bloom-400 transition-colors">
                  Meet Maker Aanu
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-bloom-600 dark:hover:text-bloom-400 transition-colors">
                  Contact Studio
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="text-bloom-600 dark:text-bloom-400 font-semibold hover:underline">
                  Artisan Studio Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Artisan Guarantee */}
          <div>
            <h4 className="font-serif font-bold text-warmgray-900 dark:text-white text-sm mb-3">
              Artisan Promise
            </h4>
            <div className="space-y-2.5 text-xs text-warmgray-600 dark:text-warmgray-400">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-bloom-500 shrink-0 mt-0.5" />
                <span>100% Handcrafted — zero factory machinery used.</span>
              </div>
              <div className="flex items-start gap-2">
                <Heart className="w-4 h-4 text-rosewood-500 shrink-0 mt-0.5" />
                <span>Safe hypoallergenic stuffing & premium certified milk cotton yarn.</span>
              </div>
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Never wilts. Everlasting blooms made to be cherished for years.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-warmgray-200 dark:border-warmgray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-warmgray-500 dark:text-warmgray-400">
          <p>© {new Date().getFullYear()} AanuBlooms Studio. All stitches handcrafted with love & yarn.</p>
          <div className="flex items-center gap-4 sm:gap-6">
            <span>Yarn Sourced Sustainably</span>
            <span>Pan-India Delivery</span>
            <span>UPI & Card Secure Checkout</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
