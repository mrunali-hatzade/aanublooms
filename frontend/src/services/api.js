const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  // Authentication
  async register(userData) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  async login(email, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  async googleLogin(googleUserData) {
    const res = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(googleUserData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Google sign-in failed');
    return data;
  },

  async getMe(token) {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Authentication session invalid');
    return data;
  },

  async updateProfile(profileData) {
    const res = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update profile');
    return data;
  },

  // Store Settings
  async getSettings() {
    const res = await fetch(`${API_BASE_URL}/settings`);
    if (!res.ok) throw new Error('Failed to fetch store settings');
    return res.json();
  },

  async updateSettings(settingsData) {
    const res = await fetch(`${API_BASE_URL}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settingsData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update settings');
    return data;
  },

  async testPayment(keyId) {
    const res = await fetch(`${API_BASE_URL}/settings/test-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Payment test failed');
    return data;
  },
  // Products
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
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
    if (!res.ok) throw new Error('Failed to fetch product details');
    return res.json();
  },

  async createProduct(productData) {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    if (!res.ok) throw new Error('Failed to create product');
    return res.json();
  },

  async updateProduct(id, productData) {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    if (!res.ok) throw new Error('Failed to update product');
    return res.json();
  },

  async deleteProduct(id) {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete product');
    return res.json();
  },

  async addReview(productId, reviewData) {
    const res = await fetch(`${API_BASE_URL}/products/${productId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData),
    });
    if (!res.ok) throw new Error('Failed to submit review');
    return res.json();
  },

  // Orders
  async createOrder(orderData) {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!res.ok) throw new Error('Failed to place order');
    return res.json();
  },

  async getOrders(params = {}) {
    const query = new URLSearchParams(params);
    const res = await fetch(`${API_BASE_URL}/orders?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  },

  async getOrderById(orderId) {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}`);
    if (!res.ok) throw new Error('Failed to fetch order');
    return res.json();
  },

  async updateOrderStatus(orderId, status, note) {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, note }),
    });
    if (!res.ok) throw new Error('Failed to update order status');
    return res.json();
  },

  // Coupons
  async validateCoupon(code, cartSubtotal) {
    const res = await fetch(`${API_BASE_URL}/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, cartSubtotal }),
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

  // Custom Commissions
  async submitCustomRequest(requestData) {
    const res = await fetch(`${API_BASE_URL}/custom-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to submit request');
    return data;
  },

  async getCustomRequests() {
    const res = await fetch(`${API_BASE_URL}/custom-requests`);
    if (!res.ok) throw new Error('Failed to fetch custom requests');
    return res.json();
  },

  // Analytics
  async getAnalytics() {
    const res = await fetch(`${API_BASE_URL}/analytics`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  },

  // Contact Us
  async sendContactMessage(contactData) {
    const res = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to send message');
    return data;
  },

  async getContactMessages() {
    const res = await fetch(`${API_BASE_URL}/contact`);
    if (!res.ok) throw new Error('Failed to fetch messages');
    return res.json();
  },

  // Feedback
  async getFeedbacks() {
    const res = await fetch(`${API_BASE_URL}/feedback`);
    if (!res.ok) throw new Error('Failed to fetch feedbacks');
    return res.json();
  },

  async sendFeedback(feedbackData) {
    const res = await fetch(`${API_BASE_URL}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedbackData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to submit feedback');
    return data;
  }
};
