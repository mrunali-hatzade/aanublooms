import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import { LocationProvider } from './context/LocationContext';

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
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';
import { AuthModal } from './components/auth/AuthModal';
import { Floating3DBackground } from './components/common/Floating3DBackground';
import { SparkleClickEffect } from './components/common/SparkleClickEffect';
import { ScrollToTopButton } from './components/common/ScrollToTopButton';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [navParams, setNavParams] = useState({});
  const [lastPlacedOrder, setLastPlacedOrder] = useState(null);

  const navigateTo = (page, params = {}) => {
    setCurrentPage(page);
    setNavParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderPlaced = (orderData) => {
    setLastPlacedOrder(orderData);
    navigateTo('order-success', { order: orderData });
  };

  // If in Admin Mode, render the dedicated standalone Admin Application Shell
  if (currentPage === 'admin') {
    return (
      <div className="min-h-screen bg-[#F8F6F3] text-warmgray-900 transition-colors">
        <AdminDashboardPage onNavigate={navigateTo} />
        <AuthModal />
      </div>
    );
  }

  // Customer Storefront Layout
  return (
    <div className="min-h-screen flex flex-col bg-warmgray-50 dark:bg-warmgray-950 text-warmgray-900 dark:text-warmgray-50 transition-colors relative">
      {/* Global 3D Ambient Depth & Floating Elements */}
      <Floating3DBackground />

      {/* Interactive Micro Blossom & Sparkle Click Ripple */}
      <SparkleClickEffect />

      {/* Top Notification Announcement */}
      <Banner />

      {/* Main Artisan Header */}
      <Navbar
        currentPage={currentPage}
        onNavigate={navigateTo}
      />

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

        {currentPage === 'customer-dashboard' && (
          <CustomerDashboardPage onNavigate={navigateTo} />
        )}
      </main>

      {/* Slide-out Cart Drawer */}
      <CartDrawer onNavigate={navigateTo} />

      {/* Global Auth Modal for Login & Signup */}
      <AuthModal />

      {/* Delivery Location & GPS Modal */}
      <LocationModal />

      {/* Floating Go To Top Button */}
      <ScrollToTopButton />

      {/* Artisan Footer */}
      <Footer onNavigate={navigateTo} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <LocationProvider>
            <WishlistProvider>
              <CartProvider>
                <AppContent />
              </CartProvider>
            </WishlistProvider>
          </LocationProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
