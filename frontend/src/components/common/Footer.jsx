import React, { useState } from 'react';
import { Flower2, Heart, Sparkles, Send, Mail, MapPin, ShieldCheck, Globe, MessageCircle, Share2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const Footer = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const { addToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      addToast('🌸 Welcome to the AanuBlooms Yarn Club! Check your inbox for a 15% off welcome treat.', 'success');
      setEmail('');
    }
  };

  return (
    <footer className="bg-warmgray-100 dark:bg-warmgray-900 border-t border-warmgray-200 dark:border-warmgray-800 transition-colors pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Newsletter Card */}
        <div className="bg-gradient-to-r from-bloom-500 via-rosewood-500 to-amber-500 rounded-3xl p-8 sm:p-10 mb-16 text-white shadow-soft-lg relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="max-w-2xl relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold tracking-wider uppercase mb-3 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Join the Cozy Yarn Club
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-2">
              Get 15% off your first handcrafted piece
            </h3>
            <p className="text-rose-100 text-sm mb-6 leading-relaxed">
              Receive secret flash drops, new amigurumi pattern releases, custom commission openings, and maker behind-the-scenes stories.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md">
              <input
                type="email"
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-3 rounded-2xl bg-white/90 dark:bg-warmgray-900/90 text-warmgray-900 dark:text-white placeholder:text-warmgray-400 focus:outline-none focus:ring-2 focus:ring-white text-sm"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-warmgray-900 hover:bg-black text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 group whitespace-nowrap"
              >
                <span>Join Club</span>
                <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
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
                  Artisan Crochet Boutique
                </span>
              </div>
            </button>
            <p className="text-sm text-warmgray-600 dark:text-warmgray-400 leading-relaxed max-w-sm">
              Handcrafting timeless floral bouquets, cuddly amigurumi plushies, and cozy wearables. Each stitch is woven with love, patience, and the highest grade organic cotton & velvet yarn.
            </p>
            <div className="flex items-center gap-3 pt-2 text-warmgray-600 dark:text-warmgray-400">
              <a href="#" className="p-2 rounded-full bg-warmgray-200 dark:bg-warmgray-800 hover:text-bloom-600 dark:hover:text-bloom-400 transition-colors" title="Global Community">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-warmgray-200 dark:bg-warmgray-800 hover:text-bloom-600 dark:hover:text-bloom-400 transition-colors" title="Chat with Maker">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-warmgray-200 dark:bg-warmgray-800 hover:text-bloom-600 dark:hover:text-bloom-400 transition-colors" title="Share">
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <h4 className="font-serif font-bold text-warmgray-900 dark:text-white text-base mb-4">
              Handmade Catalog
            </h4>
            <ul className="space-y-2.5 text-sm text-warmgray-600 dark:text-warmgray-400">
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
            <h4 className="font-serif font-bold text-warmgray-900 dark:text-white text-base mb-4">
              Maker & Customer Care
            </h4>
            <ul className="space-y-2.5 text-sm text-warmgray-600 dark:text-warmgray-400">
              <li>
                <button onClick={() => onNavigate('track-order')} className="hover:text-bloom-600 dark:hover:text-bloom-400 transition-colors flex items-center gap-1.5">
                  <span>Track Order Timeline</span>
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
                <button onClick={() => onNavigate('wishlist')} className="hover:text-bloom-600 dark:hover:text-bloom-400 transition-colors">
                  Saved Wishlist
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-bloom-600 dark:hover:text-bloom-400 transition-colors">
                  Contact Artisan Studio
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
            <h4 className="font-serif font-bold text-warmgray-900 dark:text-white text-base mb-4">
              Artisan Promise
            </h4>
            <div className="space-y-3 text-xs text-warmgray-600 dark:text-warmgray-400">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-bloom-500 shrink-0 mt-0.5" />
                <span>100% Handcrafted — zero factory machinery used.</span>
              </div>
              <div className="flex items-start gap-2">
                <Heart className="w-4 h-4 text-rosewood-500 shrink-0 mt-0.5" />
                <span>Safe hypoallergenic stuffing & premium OEKO-TEX certified yarn.</span>
              </div>
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Never wilts. Everlasting blooms made to be cherished for years.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-warmgray-200 dark:border-warmgray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-warmgray-500 dark:text-warmgray-400">
          <p>© {new Date().getFullYear()} AanuBlooms Studio. All stitches handcrafted with love & yarn.</p>
          <div className="flex items-center gap-6">
            <span>Yarn Sourced Sustainably</span>
            <span>Worldwide Craft Shipping</span>
            <span>Secure Checkout</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
