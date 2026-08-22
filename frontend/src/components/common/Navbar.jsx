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
  Truck,
  Shield
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

  const [activeSection, setActiveSection] = useState('home');

  // Scrollspy for Homepage Sections
  useEffect(() => {
    if (currentPage !== 'home') {
      setActiveSection(currentPage);
      return;
    }

    const sectionMap = [
      { id: 'home-hero', page: 'home' },
      { id: 'home-categories', page: 'shop' },
      { id: 'home-bestsellers', page: 'shop' },
      { id: 'home-feedback', page: 'feedback' },
      { id: 'home-videos', page: 'custom-order' },
      { id: 'home-story', page: 'about' }
    ];

    const handleScroll = () => {
      const scrollPos = window.scrollY + 180;
      for (let i = sectionMap.length - 1; i >= 0; i--) {
        const elem = document.getElementById(sectionMap[i].id);
        if (elem) {
          const top = elem.offsetTop;
          if (scrollPos >= top) {
            setActiveSection(sectionMap[i].page);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  const isLinkActive = (linkPage) => {
    if (currentPage === 'home') {
      return activeSection === linkPage;
    }
    return currentPage === linkPage;
  };

  const navLinks = [
    { label: 'Home', page: 'home' },
    { label: 'Shop All', page: 'shop' },
    { label: 'Custom Orders', page: 'custom-order' },
    { label: 'Our Story', page: 'about' },
    { label: 'Feedback', page: 'feedback' },
    { label: 'Contact Us', page: 'contact' },
  ];

  const handleNavClick = (link) => {
    if (currentPage === 'home') {
      const targetMap = {
        'home': 'home-hero',
        'shop': 'home-categories',
        'custom-order': 'home-videos',
        'about': 'home-story',
        'feedback': 'home-feedback',
        'contact': 'home-story'
      };
      const targetId = targetMap[link.page];
      const elem = targetId ? document.getElementById(targetId) : null;
      if (elem) {
        const top = elem.offsetTop - 80;
        window.scrollTo({ top, behavior: 'smooth' });
        return;
      }
    }
    onNavigate(link.page, link.params);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-warmgray-900/95 backdrop-blur-md border-b border-warmgray-200/80 dark:border-warmgray-800 transition-colors shadow-xs">
      {/* Main Bar */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
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
              <img
                src="/images/logo.png"
                alt="AanuBlooms Logo"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl object-cover shadow-cozy group-hover:scale-105 transition-transform duration-300 border border-bloom-100 dark:border-warmgray-700 bg-white"
              />
              <div>
                <span className="text-xl sm:text-2xl font-bold font-serif tracking-tight text-warmgray-900 dark:text-white flex items-center gap-1">
                  AanuBlooms
                  <Sparkles className="w-3.5 h-3.5 text-bloom-500 fill-bloom-300" />
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
          <div ref={searchRef} className="hidden md:flex flex-1 max-w-xs lg:max-w-sm mx-4 relative">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                type="text"
                placeholder="Search bouquets, plushies, cardigans..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim() && setShowSearchDropdown(true)}
                className="w-full bg-warmgray-100/80 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 rounded-full py-2 pl-10 pr-9 text-xs focus:outline-none focus:ring-2 focus:ring-bloom-400 focus:bg-white dark:focus:bg-warmgray-900 text-warmgray-900 dark:text-warmgray-100 transition-all"
              />
              <Search className="w-4 h-4 text-warmgray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setShowSearchDropdown(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-warmgray-400 hover:text-warmgray-700 dark:hover:text-warmgray-200 rounded-full transition-colors"
                  aria-label="Clear search"
                  title="Clear text"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Dropdown Results */}
            {showSearchDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-warmgray-900 rounded-2xl shadow-xl border border-warmgray-200 dark:border-warmgray-800 overflow-hidden z-50 animate-in fade-in zoom-in-95">
                <div className="p-2 space-y-1">
                  {searchResults.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setShowSearchDropdown(false);
                        onNavigate('product-detail', { id: item.id });
                      }}
                      className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-warmgray-50 dark:hover:bg-warmgray-800 text-left transition-colors"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover bg-warmgray-100"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-warmgray-900 dark:text-white truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-bloom-600 font-semibold font-serif">
                          ₹{item.price?.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Custom Commission Action Pill */}
            <button
              onClick={() => onNavigate('custom-order')}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-bloom-50 hover:bg-bloom-100 dark:bg-warmgray-800 dark:hover:bg-warmgray-700 text-bloom-700 dark:text-bloom-300 border border-bloom-200 dark:border-warmgray-700 font-semibold text-xs transition-all shadow-2xs hover:scale-102"
            >
              <Palette className="w-3.5 h-3.5 text-bloom-600 dark:text-bloom-400" />
              <span>Custom Order</span>
            </button>

            {/* Track Order Utility Button */}
            <button
              onClick={() => onNavigate('track-order')}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warmgray-100 hover:bg-warmgray-200 dark:bg-warmgray-800 dark:hover:bg-warmgray-700 text-warmgray-700 dark:text-warmgray-300 font-semibold text-xs transition-all"
            >
              <Package className="w-3.5 h-3.5 text-bloom-600" />
              <span>Track Order</span>
            </button>

            {/* Direct Admin Link Button */}
            <button
              onClick={() => onNavigate('admin')}
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rosewood-600 hover:bg-rosewood-700 text-white font-bold text-xs transition-all shadow-2xs transform hover:scale-102"
              title="Open Admin"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => onNavigate('wishlist')}
              className="p-2 rounded-xl text-warmgray-600 dark:text-warmgray-300 hover:bg-warmgray-100 dark:hover:bg-warmgray-800 transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-bloom-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Pill */}
            <button
              onClick={openCart}
              className="px-4 py-2 rounded-full bg-bloom-500 hover:bg-bloom-600 text-white font-bold text-xs transition-all shadow-cozy flex items-center gap-2 transform active:scale-95"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4.5 h-4.5" />
                {totalItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-white text-bloom-600 text-[10px] font-extrabold rounded-full flex items-center justify-center shadow">
                    {totalItemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-sm font-bold tracking-wide">
                Basket {totalItemCount > 0 ? `(${totalItemCount})` : ''}
              </span>
            </button>
          </div>
        </div>

        {/* Desktop Category Bar with Scrollspy Highlighting */}
        <nav className="hidden lg:flex items-center justify-start py-2.5 border-t border-warmgray-100 dark:border-warmgray-800/80 text-sm font-semibold">
          <div className="flex items-center gap-7">
            {navLinks.map((link, idx) => {
              const active = isLinkActive(link.page);
              return (
                <button
                  key={idx}
                  onClick={() => handleNavClick(link)}
                  className={`hover:text-bloom-600 dark:hover:text-bloom-400 transition-all py-1 relative text-sm ${
                    active
                      ? 'text-bloom-600 dark:text-bloom-400 font-extrabold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-bloom-500 after:rounded-full'
                      : 'text-warmgray-700 dark:text-warmgray-300 font-semibold'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
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
              className="w-full bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 rounded-xl py-2 pl-9 pr-8 text-xs focus:outline-none focus:ring-2 focus:ring-bloom-400 text-warmgray-900 dark:text-warmgray-100"
            />
            <Search className="w-4 h-4 text-warmgray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-warmgray-400 hover:text-warmgray-700 dark:hover:text-warmgray-200 rounded-full transition-colors"
                aria-label="Clear search"
                title="Clear text"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
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
                  onNavigate('admin');
                }}
                className="text-left px-3 py-2.5 rounded-xl text-white bg-rosewood-600 font-bold transition-colors flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </button>

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
