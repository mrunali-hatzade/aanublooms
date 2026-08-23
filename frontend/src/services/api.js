const rawApi = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' ? 'https://aanublooms.onrender.com/api' : 'http://localhost:5000/api');
const API_BASE_URL = rawApi.replace(/\/+$/, '');

// Auth token helpers
const getToken = () => {
  try { return localStorage.getItem('aanublooms_token'); } catch { return null; }
};

const authHeaders = () => {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const publicHeaders = () => ({ 'Content-Type': 'application/json' });

export const api = {
  // ==================== AUTHENTICATION ====================
  async register(userData) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST', headers: publicHeaders(), body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  async login(email, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST', headers: publicHeaders(), body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  async googleLogin(googleUserData) {
    const res = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST', headers: publicHeaders(), body: JSON.stringify(googleUserData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Google sign-in failed');
    return data;
  },

  async getMe(token) {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Session invalid');
    return data;
  },

  async updateProfile(profileData) {
    const res = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT', headers: authHeaders(), body: JSON.stringify(profileData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update profile');
    return data;
  },

  // ==================== STORE SETTINGS ====================
  async getSettings() {
    const res = await fetch(`${API_BASE_URL}/settings`);
    if (!res.ok) throw new Error('Failed to fetch store settings');
    return res.json();
  },

  async updateSettings(settingsData) {
    const res = await fetch(`${API_BASE_URL}/settings`, {
      method: 'PUT', headers: authHeaders(), body: JSON.stringify(settingsData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update settings');
    return data;
  },

  async testPayment(keyId) {
    const res = await fetch(`${API_BASE_URL}/settings/test-payment`, {
      method: 'POST', headers: authHeaders(), body: JSON.stringify({ keyId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Payment test failed');
    return data;
  },

  // ==================== PRODUCTS (Storefront) ====================
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') query.set(k, v); });
    const res = await fetch(`${API_BASE_URL}/products?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  async getCategories() {
    const res = await fetch(`${API_BASE_URL}/products/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  async getProductById(idOrSlug) {
    const res = await fetch(`${API_BASE_URL}/products/${idOrSlug}`);
    if (!res.ok) throw new Error('Product not found');
    return res.json();
  },

  // ==================== PRODUCTS (Admin) ====================
  async getAdminProducts(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') query.set(k, v); });
    const res = await fetch(`${API_BASE_URL}/products/admin?${query.toString()}`, {
      headers: authHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch admin products');
    return res.json();
  },

  async createProduct(productData) {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST', headers: authHeaders(), body: JSON.stringify(productData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create product');
    return data;
  },

  async updateProduct(id, productData) {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT', headers: authHeaders(), body: JSON.stringify(productData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update product');
    return data;
  },

  async updateProductStatus(id, status) {
    const res = await fetch(`${API_BASE_URL}/products/${id}/status`, {
      method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update product status');
    return data;
  },

  async archiveProduct(id) {
    return this.updateProductStatus(id, 'archived');
  },

  async restoreProduct(id) {
    return this.updateProductStatus(id, 'active');
  },

  async deleteProduct(id) {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE', headers: authHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete product');
    return data;
  },

  async adjustProductStock(id, delta) {
    const res = await fetch(`${API_BASE_URL}/products/${id}/stock`, {
      method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ delta })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update stock');
    return data;
  },

  async addReview(productId, reviewData) {
    const res = await fetch(`${API_BASE_URL}/products/${productId}/reviews`, {
      method: 'POST', headers: publicHeaders(), body: JSON.stringify(reviewData)
    });
    if (!res.ok) throw new Error('Failed to submit review');
    return res.json();
  },

  // ==================== CATEGORIES (Admin) ====================
  async addCategory(categoryData) {
    const res = await fetch(`${API_BASE_URL}/products/categories`, {
      method: 'POST', headers: authHeaders(), body: JSON.stringify(categoryData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to add category');
    return data;
  },

  async updateCategory(id, categoryData) {
    const res = await fetch(`${API_BASE_URL}/products/categories/${id}`, {
      method: 'PUT', headers: authHeaders(), body: JSON.stringify(categoryData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update category');
    return data;
  },

  async archiveCategory(id) {
    const res = await fetch(`${API_BASE_URL}/products/categories/${id}/status`, {
      method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ status: 'archived' })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to archive category');
    return data;
  },

  async deleteCategory(id) {
    const res = await fetch(`${API_BASE_URL}/products/categories/${id}`, {
      method: 'DELETE', headers: authHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete category');
    return res.json();
  },

  // ==================== ORDERS ====================
  async createOrder(orderData) {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST', headers: publicHeaders(), body: JSON.stringify(orderData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to place order');
    return data;
  },

  async getOrders(params = {}) {
    const query = new URLSearchParams(params);
    const res = await fetch(`${API_BASE_URL}/orders?${query.toString()}`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  },

  async getOrderById(orderId) {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch order');
    return res.json();
  },

  async trackOrder(orderId, phone) {
    const res = await fetch(`${API_BASE_URL}/orders/track`, {
      method: 'POST', headers: publicHeaders(), body: JSON.stringify({ orderId, phone })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Unable to track order');
    return data;
  },

  async updateOrderStatus(orderId, status, note) {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ status, note })
    });
    if (!res.ok) throw new Error('Failed to update order status');
    return res.json();
  },

  async deleteOrder(id) {
    const res = await fetch(`${API_BASE_URL}/orders/${id}`, { method: 'DELETE', headers: authHeaders() });
    if (!res.ok) { console.warn('Delete order failed'); }
    return { success: true };
  },

  // ==================== COUPONS ====================
  async validateCoupon(code, cartSubtotal) {
    const res = await fetch(`${API_BASE_URL}/coupons/validate`, {
      method: 'POST', headers: publicHeaders(), body: JSON.stringify({ code, cartSubtotal })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Invalid coupon');
    return data;
  },

  async getCoupons() {
    const res = await fetch(`${API_BASE_URL}/coupons`);
    if (!res.ok) throw new Error('Failed to fetch coupons');
    return res.json();
  },

  async getAdminCoupons() {
    const res = await fetch(`${API_BASE_URL}/coupons/admin`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch coupons');
    return res.json();
  },

  async createCoupon(couponData) {
    const res = await fetch(`${API_BASE_URL}/coupons`, {
      method: 'POST', headers: authHeaders(), body: JSON.stringify(couponData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create coupon');
    return data;
  },

  async updateCoupon(id, couponData) {
    const res = await fetch(`${API_BASE_URL}/coupons/${id}`, {
      method: 'PUT', headers: authHeaders(), body: JSON.stringify(couponData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update coupon');
    return data;
  },

  async toggleCoupon(id, isActive) {
    const res = await fetch(`${API_BASE_URL}/coupons/${id}/status`, {
      method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ isActive })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update coupon');
    return data;
  },

  async deleteCoupon(id) {
    const res = await fetch(`${API_BASE_URL}/coupons/${id}`, { method: 'DELETE', headers: authHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete coupon');
    return data;
  },

  // ==================== CUSTOM ORDERS ====================
  async submitCustomRequest(requestData) {
    const res = await fetch(`${API_BASE_URL}/custom-requests`, {
      method: 'POST', headers: publicHeaders(), body: JSON.stringify(requestData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to submit request');
    return data;
  },

  async getCustomRequests() {
    const res = await fetch(`${API_BASE_URL}/custom-requests`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch custom requests');
    return res.json();
  },

  async updateCustomRequestStatus(id, status, note, adminNotes, quotedPrice) {
    const res = await fetch(`${API_BASE_URL}/custom-requests/${id}/status`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ status, note, adminNotes, quotedPrice })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update status');
    return data;
  },

  async deleteCustomRequest(id) {
    const res = await fetch(`${API_BASE_URL}/custom-requests/${id}`, { method: 'DELETE', headers: authHeaders() });
    if (!res.ok) { console.warn('Delete custom request failed'); }
    return { success: true };
  },

  // ==================== ANALYTICS ====================
  async getAnalytics(timeframe = '30d') {
    const res = await fetch(`${API_BASE_URL}/analytics?timeframe=${timeframe}`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  },

  // ==================== NOTIFICATIONS ====================
  async getNotifications() {
    const res = await fetch(`${API_BASE_URL}/notifications`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
  },

  async markNotificationRead(id) {
    const res = await fetch(`${API_BASE_URL}/notifications/${id}/read`, { method: 'PATCH', headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to mark notification read');
    return res.json();
  },

  async markAllNotificationsRead() {
    const res = await fetch(`${API_BASE_URL}/notifications/read-all`, { method: 'PATCH', headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to mark all read');
    return res.json();
  },

  async deleteNotification(id) {
    const res = await fetch(`${API_BASE_URL}/notifications/${id}`, { method: 'DELETE', headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to delete notification');
    return res.json();
  },

  // ==================== BANNERS ====================
  async getBanners() {
    const res = await fetch(`${API_BASE_URL}/banners`);
    if (!res.ok) throw new Error('Failed to fetch banners');
    return res.json();
  },

  async getAdminBanners() {
    const res = await fetch(`${API_BASE_URL}/banners/admin`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch banners');
    return res.json();
  },

  async createBanner(bannerData) {
    const res = await fetch(`${API_BASE_URL}/banners`, {
      method: 'POST', headers: authHeaders(), body: JSON.stringify(bannerData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create banner');
    return data;
  },

  async updateBanner(id, bannerData) {
    const res = await fetch(`${API_BASE_URL}/banners/${id}`, {
      method: 'PUT', headers: authHeaders(), body: JSON.stringify(bannerData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update banner');
    return data;
  },

  async deleteBanner(id) {
    const res = await fetch(`${API_BASE_URL}/banners/${id}`, { method: 'DELETE', headers: authHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete banner');
    return data;
  },

  // ==================== CONTACT ====================
  async sendContactMessage(contactData) {
    const res = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST', headers: publicHeaders(), body: JSON.stringify(contactData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to send message');
    return data;
  },

  async getContactMessages() {
    const res = await fetch(`${API_BASE_URL}/contact`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to fetch messages');
    return res.json();
  },

  async deleteContactMessage(id) {
    const res = await fetch(`${API_BASE_URL}/contact/${id}`, { method: 'DELETE', headers: authHeaders() });
    if (!res.ok) { console.warn('Delete message failed'); }
    return { success: true };
  },

  // ==================== FEEDBACK ====================
  async getFeedbacks() {
    const res = await fetch(`${API_BASE_URL}/feedback`);
    if (!res.ok) throw new Error('Failed to fetch feedback');
    return res.json();
  },

  async sendFeedback(feedbackData) {
    const authorName = feedbackData.author || feedbackData.name || 'Valued Customer';
    const commentText = feedbackData.comment || feedbackData.message || '';
    const payload = {
      ...feedbackData,
      author: authorName,
      name: authorName,
      comment: commentText,
      message: commentText
    };
    const res = await fetch(`${API_BASE_URL}/feedback`, {
      method: 'POST', headers: publicHeaders(), body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to submit feedback');
    return data;
  },

  async deleteFeedback(id) {
    const res = await fetch(`${API_BASE_URL}/feedback/${id}`, { method: 'DELETE', headers: authHeaders() });
    if (!res.ok) { console.warn('Delete feedback failed'); }
    return { success: true };
  },

  // ==================== PAYMENT ====================
  async createPaymentOrder(amount, currency = 'INR') {
    const res = await fetch(`${API_BASE_URL}/payment/create-order`, {
      method: 'POST', headers: publicHeaders(), body: JSON.stringify({ amount, currency })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create payment order');
    return data;
  },

  async verifyPayment(paymentData) {
    const res = await fetch(`${API_BASE_URL}/payment/verify-payment`, {
      method: 'POST', headers: publicHeaders(), body: JSON.stringify(paymentData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Payment verification failed');
    return data;
  }
};
