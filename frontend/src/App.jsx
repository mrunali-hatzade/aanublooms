import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import { LocationProvider } from './context/LocationContext';
import { SettingsProvider, useSettings } from './context/SettingsContext';

import { Banner } from './components/common/Banner';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { LocationModal } from './components/common/LocationModal';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CustomOrderPage } from './pages/CustomOrderPage';
import { WishlistPage } from './pages/WishlistPage';
import { CheckoutFlow } from './components/checkout/CheckoutFlow';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { AboutMakerPage } from './pages/AboutMakerPage';
import { ContactPage } from './pages/ContactPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { Floating3DBackground } from './components/common/Floating3DBackground';
import { SparkleClickEffect } from './components/common/SparkleClickEffect';
import { ScrollToTopButton } from './components/common/ScrollToTopButton';
import { FloatingWhatsAppButton } from './components/common/FloatingWhatsAppButton';
import { safeStorage, safeSessionStorage } from './utils/storage';
import { updateSEO, removeProductSchema } from './utils/seo';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App ErrorBoundary caught error:', error, errorInfo);
    // If quota exceeded error, automatically clear bulky storage caches
    if (error && (error.name === 'QuotaExceededError' || error.message?.includes('QuotaExceeded') || error.message?.includes('quota'))) {
      try {
        safeStorage.clearNonEssential();
        safeSessionStorage.removeItem('aanublooms_active_page');
      } catch {}
    }
  }

  handleRecoverAndReload = () => {
    try {
      safeStorage.clearNonEssential();
      try {
        window.localStorage.removeItem('aanublooms_studio_videos_v3');
        window.localStorage.removeItem('aanublooms_products_v2');
        window.localStorage.removeItem('aanublooms_categories_v2');
        window.localStorage.removeItem('stitch_and_love_settings');
        window.localStorage.removeItem('aanublooms_guest_checkout_data');
        window.sessionStorage.clear();
      } catch {}
    } catch {}
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md bg-white rounded-3xl p-8 border border-[#E9E2DC] shadow-xl space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#D96C65]/15 text-[#D96C65] mx-auto flex items-center justify-center font-serif text-3xl font-bold">
              🌸
            </div>
            <h1 className="text-2xl font-serif font-bold text-[#3E2B25]">
              AanuBlooms Studio
            </h1>
            <p className="text-xs text-[#756A65] leading-relaxed">
              We encountered a temporary cache/display issue. Click below to clear cache and reload cleanly.
            </p>
            {this.state.error && (
              <pre className="text-[10px] text-red-500 bg-red-50 p-2 rounded-xl text-left overflow-auto max-h-28 font-mono">
                {this.state.error.toString()}
              </pre>
            )}
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={this.handleRecoverAndReload}
                className="w-full py-3 px-4 bg-[#D96C65] hover:bg-[#C95B55] text-white rounded-xl font-bold text-xs shadow-sm transition-all"
              >
                Clear Cache &amp; Reload Home Page 🌸
              </button>
              <button
                type="button"
                onClick={() => {
                  window.location.href = '/admin';
                }}
                className="w-full py-2.5 px-4 bg-[#F8F6F3] hover:bg-[#E9E2DC] text-[#3E2B25] rounded-xl font-bold text-xs transition-all"
              >
                Open Admin
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const parseRouteFromLocation = () => {
  try {
    const pathname = window.location.pathname.replace(/^\/|\/$/g, '');
    const searchParams = new URLSearchParams(window.location.search);

    if (!pathname || pathname === '') {
      return { page: 'home', params: {} };
    }

    if (pathname === 'shop') {
      return {
        page: 'shop',
        params: {
          category: searchParams.get('category') || 'all',
          search: searchParams.get('search') || ''
        }
      };
    }

    if (pathname.startsWith('product/')) {
      const id = pathname.substring('product/'.length);
      return { page: 'product-detail', params: { id } };
    }
    if (pathname === 'product') {
      return { page: 'product-detail', params: { id: searchParams.get('id') } };
    }

    if (pathname === 'custom-order' || pathname === 'custom') return { page: 'custom-order', params: {} };
    if (pathname === 'wishlist') return { page: 'wishlist', params: {} };
    if (pathname === 'checkout') return { page: 'checkout', params: {} };
    if (pathname === 'order-success') return { page: 'order-success', params: {} };
    if (pathname === 'track-order' || pathname === 'track') {
      return { page: 'track-order', params: { id: searchParams.get('id') || '' } };
    }
    if (pathname === 'about' || pathname === 'our-story') return { page: 'about', params: {} };
    if (pathname === 'contact') return { page: 'contact', params: {} };
    if (pathname === 'feedback' || pathname === 'reviews') return { page: 'feedback', params: {} };
    if (pathname === 'admin') {
      return { page: 'admin', params: { tab: searchParams.get('tab') || 'dashboard' } };
    }

    return { page: 'home', params: {} };
  } catch {
    return { page: 'home', params: {} };
  }
};

function AppContent() {
  const initialRoute = parseRouteFromLocation();
  const [currentPage, setCurrentPage] = useState(initialRoute.page);
  const [navParams, setNavParams] = useState(initialRoute.params);
  const [lastPlacedOrder, setLastPlacedOrder] = useState(null);

  const navigateTo = (page, params = {}, replace = false) => {
    setCurrentPage(page);
    setNavParams(params);

    try {
      safeSessionStorage.setItem('aanublooms_active_page', { page, params });

      let path = '/';
      if (page === 'shop') {
        const sp = new URLSearchParams();
        if (params.category && params.category !== 'all') sp.set('category', params.category);
        if (params.search) sp.set('search', params.search);
        const q = sp.toString();
        path = q ? `/shop?${q}` : '/shop';
      } else if (page === 'product-detail' && params.id) {
        path = `/product/${params.id}`;
      } else if (page === 'track-order') {
        path = params.id ? `/track-order?id=${params.id}` : '/track-order';
      } else if (page === 'admin') {
        path = params.tab && params.tab !== 'dashboard' ? `/admin?tab=${params.tab}` : '/admin';
      } else if (page !== 'home') {
        path = `/${page}`;
      }

      if (replace) {
        window.history.replaceState({ page, params }, '', path);
      } else {
        window.history.pushState({ page, params }, '', path);
      }
    } catch (e) {
      console.warn('Navigation state sync failed:', e);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const initial = parseRouteFromLocation();
    if (!window.history.state || !window.history.state.page) {
      window.history.replaceState(
        { page: initial.page, params: initial.params },
        '',
        window.location.pathname + window.location.search
      );
    }
  }, []);

  useEffect(() => {
    const handlePopState = (e) => {
      if (e.state?.modal) return;
      const route = parseRouteFromLocation();
      setCurrentPage(route.page);
      setNavParams(route.params);
      safeSessionStorage.setItem('aanublooms_active_page', route);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Dynamic Route-Aware SEO
  useEffect(() => {
    if (currentPage === 'product-detail') {
      // ProductDetailPage manages its own product SEO and JSON-LD schema
      return;
    }

    removeProductSchema();

    const seoMap = {
      home: {
        title: 'Handcrafted Blooms & Everlasting Floral Creations · Pune',
        description: 'Discover boutique handcrafted forever flower bouquets, blossom cupcake pots, floral charms, and bespoke keepsakes crafted with love by Aanu in Pune, India.',
        path: '/'
      },
      shop: {
        title: 'Shop Handcrafted Floral Bouquets & Blossom Pots',
        description: 'Explore the full AanuBlooms catalog: everlasting flower bouquets, mini potted blossoms, and bespoke floral gifts handcrafted in Pune.',
        path: '/shop'
      },
      'custom-order': {
        title: 'Custom Floral Order Builder & Personalized Keepsakes',
        description: 'Design your own custom handcrafted floral bouquet or photo frame with your choice of color palette, stem counts, and custom ribbon message.',
        path: '/custom-order'
      },
      about: {
        title: 'Meet Artisan Aanu | Our Story & Handcrafted Floral Studio',
        description: 'Learn the story of AanuBlooms Studio in Pune, founded by Artisan Aanu, inspired by her mother to craft everlasting floral creations with patience and love.',
        path: '/about'
      },
      contact: {
        title: 'Contact AanuBlooms Studio | Pune & WhatsApp Support',
        description: 'Have a question or custom floral inquiry? Reach Artisan Aanu on WhatsApp at +91 95791 62154 or send a message to our Pune studio.',
        path: '/contact'
      },
      feedback: {
        title: 'Customer Stories & Reviews',
        description: 'Read reviews and heartfelt stories from customers who received AanuBlooms handcrafted forever flowers and bespoke gifts.',
        path: '/feedback'
      },
      'track-order': {
        title: 'Track Your Handcrafted Order Live',
        description: 'Track the delivery and dispatch status of your AanuBlooms handcrafted flowers and bespoke gift orders.',
        path: '/track-order'
      },
      wishlist: {
        title: 'My Floral Wishlist',
        description: 'View your saved handcrafted blooms and favorite floral creations on AanuBlooms.',
        path: '/wishlist'
      },
      checkout: {
        title: 'Express Checkout',
        description: 'Complete your order for handcrafted blooms from AanuBlooms with safe online payment or Cash on Delivery.',
        path: '/checkout'
      }
    };

    const currentSeo = seoMap[currentPage] || seoMap.home;
    updateSEO(currentSeo);
  }, [currentPage]);

  const handleOrderPlaced = (orderData) => {
    setLastPlacedOrder(orderData);
    navigateTo('order-success', { order: orderData });
  };

  const { settings } = useSettings();
  const { isAdmin } = useAuth();

  // If in Admin Mode, render the dedicated standalone Admin Application Shell
  if (currentPage === 'admin') {
    return (
      <div className="min-h-screen bg-[#F8F6F3] text-warmgray-900 transition-colors">
        <AdminDashboardPage onNavigate={navigateTo} navParams={navParams} />
      </div>
    );
  }

  // Customer Maintenance Mode Gate
  if (settings?.maintenance?.enabled && !isAdmin) {
    return (
      <div className="min-h-screen bg-[#F8F6F3] flex items-center justify-center p-6 text-center font-sans antialiased">
        <div className="max-w-md bg-white rounded-3xl p-8 border border-[#E9E2DC] shadow-xl space-y-4 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-2xl bg-[#D96C65]/15 text-[#D96C65] mx-auto flex items-center justify-center">
            <Sparkles className="w-8 h-8" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#D96C65]">
            {settings?.general?.storeName || 'Stitch & Love'}
          </span>
          <h1 className="text-2xl font-serif font-bold text-[#3E2B25]">
            Under Studio Maintenance
          </h1>
          <p className="text-xs text-[#756A65] leading-relaxed">
            {settings?.maintenance?.message || "We're preparing something beautiful. Please check back soon."}
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => navigateTo('admin')}
              className="text-[11px] font-semibold text-[#756A65] hover:text-[#D96C65] underline transition-colors"
            >
              Artisan Admin Access →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Customer Storefront Layout
  return (
    <div className="min-h-screen flex flex-col max-w-[1536px] mx-auto bg-warmgray-50 dark:bg-warmgray-950 text-warmgray-900 dark:text-warmgray-50 transition-colors relative">
      {/* Global 3D Ambient Depth & Floating Elements */}
      <Floating3DBackground />

      {/* Interactive Micro Blossom & Sparkle Click Ripple */}
      <SparkleClickEffect />

      {/* Sticky Header Wrapper */}
      <div className="sticky top-0 z-50 w-full flex flex-col">
        {/* Top Notification Announcement */}
        <Banner />

        {/* Main Artisan Header */}
        <Navbar
          currentPage={currentPage}
          onNavigate={navigateTo}
        />
      </div>

      {/* Page View Body */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage onNavigate={navigateTo} />
        )}

        {currentPage === 'shop' && (
          <ShopPage
            onNavigate={navigateTo}
            initialCategory={navParams.category || 'all'}
            searchQuery={navParams.search || ''}
          />
        )}

        {currentPage === 'product-detail' && (
          <ProductDetailPage
            productId={navParams.id}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'custom-order' && (
          <CustomOrderPage onNavigate={navigateTo} />
        )}

        {currentPage === 'wishlist' && (
          <WishlistPage onNavigate={navigateTo} />
        )}

        {currentPage === 'checkout' && (
          <CheckoutFlow
            onNavigate={navigateTo}
            onOrderPlaced={handleOrderPlaced}
          />
        )}

        {currentPage === 'order-success' && (
          <OrderSuccessPage
            order={navParams.order || lastPlacedOrder}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'track-order' && (
          <OrderTrackingPage
            orderId={navParams.id}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'about' && (
          <AboutMakerPage onNavigate={navigateTo} />
        )}

        {currentPage === 'contact' && (
          <ContactPage onNavigate={navigateTo} />
        )}

        {currentPage === 'feedback' && (
          <FeedbackPage onNavigate={navigateTo} />
        )}
      </main>

      {/* Slide-out Cart Drawer */}
      <CartDrawer onNavigate={navigateTo} />

      {/* Delivery Location & GPS Modal */}
      <LocationModal />

      {/* Floating Support & Navigation Buttons */}
      <FloatingWhatsAppButton />
      <ScrollToTopButton />

      {/* Artisan Footer */}
      <Footer onNavigate={navigateTo} />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <SettingsProvider>
            <AuthProvider>
              <LocationProvider>
                <WishlistProvider>
                  <CartProvider>
                    <AppContent />
                  </CartProvider>
                </WishlistProvider>
              </LocationProvider>
            </AuthProvider>
          </SettingsProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
