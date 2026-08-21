import React, { useState, useEffect, useRef } from 'react';
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  Sparkles,
  Palette,
  Flower2,
  Package,
  MapPin,
  Truck
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useLocation } from '../../context/LocationContext';
import { api } from '../../services/api';

export const Navbar = ({ onNavigate, currentPage }) => {
  const { totalItemCount, openCart } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { location, openLocationModal } = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const searchRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search auto-suggestions
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await api.getProducts({ search: searchQuery.trim(), limit: 5 });
        setSearchResults(data.data || []);
        setShowSearchDropdown(true);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchDropdown(false);
      onNavigate('shop', { search: searchQuery.trim() });
    }
  };

  const navLinks = [
    { label: 'Home', page: 'home' },
    { label: 'Shop All', page: 'shop' },
    { label: 'Custom Orders', page: 'custom-order' },
    { label: 'Our Story', page: 'about' },
    { label: 'Feedback', page: 'feedback' },
    { label: 'Contact Us', page: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-warmgray-900/95 backdrop-blur-md border-b border-warmgray-200/80 dark:border-warmgray-800 transition-colors shadow-xs">
      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Mobile menu toggle */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-warmgray-600 dark:text-warmgray-300 hover:bg-warmgray-100 dark:hover:bg-warmgray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex items-center">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 group text-left"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-bloom-500 via-rosewood-400 to-amber-300 flex items-center justify-center text-white shadow-cozy group-hover:scale-105 transition-transform duration-300">
                <Flower2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-bold font-serif tracking-tight text-warmgray-900 dark:text-white flex items-center gap-1">
                  AanuBlooms
                  <Sparkles className="w-3.5 h-3.5 text-bloom-500 fill-bloom-300" />
                </span>
                <span className="block text-[9px] uppercase font-semibold tracking-widest text-bloom-600 dark:text-bloom-400">
                  Handcrafted Blooms & Creations
                </span>
              </div>
            </button>

            {/* GPS Delivery Location Pill */}
            <button
              onClick={openLocationModal}
              className="hidden sm:flex items-center gap-1.5 ml-4 px-3 py-1.5 rounded-full bg-warmgray-50 hover:bg-warmgray-100 dark:bg-warmgray-800 dark:hover:bg-warmgray-700 text-warmgray-800 dark:text-warmgray-200 border border-warmgray-200 dark:border-warmgray-700 text-xs transition-colors group shrink-0"
              title="Click to detect GPS location or change PIN code"
            >
              <MapPin className="w-3.5 h-3.5 text-bloom-600 dark:text-bloom-400 shrink-0 group-hover:animate-bounce" />
              <div className="text-left text-[11px] leading-tight">
                <span className="text-[9px] text-warmgray-400 block font-semibold">Deliver to</span>
                <span className="font-bold text-warmgray-900 dark:text-white truncate max-w-[100px] block">
                  {location.city} {location.zip ? `(${location.zip})` : ''}
                </span>
              </div>
            </button>
          </div>

          {/* Live Search Bar */}
          <div ref={searchRef} className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                type="text"
                placeholder="Search bouquets, plushies, cardigans, kits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim() && setShowSearchDropdown(true)}
                className="w-full bg-warmgray-50 dark:bg-warmgray-800/90 border border-warmgray-200 dark:border-warmgray-700 rounded-full py-2 pl-10 pr-9 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-bloom-400 focus:border-transparent transition-all placeholder:text-warmgray-400 text-warmgray-800 dark:text-warmgray-100"
              />
              <Search className="w-4 h-4 text-warmgray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-warmgray-400 hover:text-warmgray-600 dark:hover:text-warmgray-200 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Search Dropdown Results */}
            {showSearchDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-warmgray-800 rounded-2xl shadow-2xl border border-warmgray-200 dark:border-warmgray-700 overflow-hidden z-50 animate-in fade-in">
                {isSearching ? (
                  <div className="p-4 text-center text-xs text-warmgray-500">Searching handmade stitches...</div>
                ) : searchResults.length > 0 ? (
                  <div>
                    <div className="px-4 py-2 bg-warmgray-50 dark:bg-warmgray-700/50 text-xs font-semibold uppercase tracking-wider text-warmgray-500 dark:text-warmgray-400 border-b border-warmgray-100 dark:border-warmgray-700">
                      Handcrafted Matches
                    </div>
                    {searchResults.map(item => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setShowSearchDropdown(false);
                          setSearchQuery('');
                          onNavigate('product-detail', { id: item.id });
                        }}
                        className="w-full flex items-center gap-3 p-2.5 hover:bg-bloom-50 dark:hover:bg-warmgray-700 transition-colors text-left border-b border-warmgray-100 dark:border-warmgray-700/50 last:border-0"
                      >
                        <img
                          src={item.images?.[0]}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover border border-warmgray-200 dark:border-warmgray-600"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-warmgray-900 dark:text-warmgray-100 truncate">{item.name}</p>
                          <p className="text-[11px] text-bloom-600 dark:text-bloom-400 font-semibold">₹{item.price?.toLocaleString('en-IN')} · <span className="text-warmgray-400 font-normal">{item.yarnMaterial}</span></p>
                        </div>
                      </button>
                    ))}
                    <button
                      onClick={handleSearchSubmit}
                      className="w-full py-2 text-center text-xs font-bold text-bloom-600 dark:text-bloom-400 bg-bloom-50/50 dark:bg-warmgray-700/30 hover:bg-bloom-100/50 transition-colors"
                    >
                      View all matching creations →
                    </button>
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-warmgray-500">
                    No crochet items found for "{searchQuery}". Try searching for 'tulip', 'bunny', or 'cardigan'!
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2.5">
            {/* Custom Commission Button */}
            <button
              onClick={() => onNavigate('custom-order')}
              className="hidden xl:flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-rosewood-100/80 hover:bg-rosewood-200/80 text-rosewood-800 dark:bg-rosewood-950/60 dark:text-rosewood-200 dark:hover:bg-rosewood-900/60 transition-colors border border-rosewood-200 dark:border-rosewood-800"
            >
              <Palette className="w-3.5 h-3.5 text-rosewood-600 dark:text-rosewood-400" />
              <span>Custom Commission</span>
            </button>

            {/* Track Order Quick Button */}
            <button
              onClick={() => onNavigate('track-order')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-warmgray-100 dark:bg-warmgray-800 hover:bg-warmgray-200 dark:hover:bg-warmgray-700 text-warmgray-800 dark:text-warmgray-200 transition-colors border border-warmgray-200 dark:border-warmgray-700"
              title="Track Your Order"
            >
              <Package className="w-3.5 h-3.5 text-bloom-600 dark:text-bloom-400" />
              <span>Track Order</span>
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => onNavigate('wishlist')}
              className="p-2 rounded-full text-warmgray-600 dark:text-warmgray-300 hover:bg-warmgray-100 dark:hover:bg-warmgray-800 transition-colors relative"
              title="View Wishlist"
              aria-label="Wishlist"
            >
              <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'text-rosewood-500 fill-rosewood-500' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-rosewood-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart / Basket Button */}
            <button
              onClick={openCart}
              className="flex items-center gap-1.5 p-2 sm:px-3.5 sm:py-2 rounded-full bg-bloom-500 hover:bg-bloom-600 text-white shadow-cozy transition-all duration-200 transform hover:scale-[1.02]"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {totalItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-3.5 h-3.5 bg-white text-bloom-600 text-[9px] font-extrabold rounded-full flex items-center justify-center shadow">
                    {totalItemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-bold tracking-wide">
                Basket {totalItemCount > 0 ? `(${totalItemCount})` : ''}
              </span>
            </button>

          </div>
        </div>

        {/* Desktop Category Bar */}
        <nav className="hidden lg:flex items-center justify-between py-1.5 border-t border-warmgray-100 dark:border-warmgray-800/80 text-xs font-medium">
          <div className="flex items-center gap-5">
            {navLinks.map((link, idx) => (
              <button
                key={idx}
                onClick={() => onNavigate(link.page, link.params)}
                className={`hover:text-bloom-600 dark:hover:text-bloom-400 transition-colors py-0.5 relative ${
                  currentPage === link.page && (!link.params || JSON.stringify(link.params) === '{}')
                    ? 'text-bloom-600 dark:text-bloom-400 font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-bloom-500 after:rounded-full'
                    : 'text-warmgray-700 dark:text-warmgray-300'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs font-medium text-warmgray-500 dark:text-warmgray-400">
            <button
              onClick={() => onNavigate('track-order')}
              className="text-warmgray-600 dark:text-warmgray-300 font-semibold hover:text-bloom-600 flex items-center gap-1.5 transition-colors"
            >
              <Truck className="w-3.5 h-3.5 text-bloom-500" />
              <span>Track Dispatch</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-warmgray-900 border-b border-warmgray-200 dark:border-warmgray-800 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search handmade creations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-bloom-400 text-warmgray-900 dark:text-warmgray-100"
            />
            <Search className="w-4 h-4 text-warmgray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          {/* Navigation Links */}
          <div className="flex flex-col space-y-1 text-xs">
            {navLinks.map((link, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate(link.page, link.params);
                }}
                className="text-left px-3 py-2 rounded-xl text-warmgray-800 dark:text-warmgray-200 hover:bg-warmgray-50 dark:hover:bg-warmgray-800 font-medium transition-colors"
              >
                {link.label}
              </button>
            ))}

            <div className="pt-2 border-t border-warmgray-100 dark:border-warmgray-800 flex flex-col gap-1">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('track-order');
                }}
                className="text-left px-3 py-2.5 rounded-xl text-bloom-600 dark:text-bloom-400 bg-bloom-50/70 dark:bg-warmgray-800 font-bold transition-colors flex items-center gap-2"
              >
                <Package className="w-4 h-4" />
                <span>Track Your Order</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('wishlist');
                }}
                className="text-left px-3 py-2 rounded-xl text-warmgray-700 dark:text-warmgray-300 hover:bg-warmgray-50 dark:hover:bg-warmgray-800 font-medium transition-colors flex items-center gap-2"
              >
                <Heart className="w-4 h-4 text-rosewood-500" />
                <span>Wishlist ({wishlistCount})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
