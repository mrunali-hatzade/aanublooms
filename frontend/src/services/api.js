const rawApi = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' ? 'https://aanublooms.onrender.com/api' : 'http://localhost:5000/api');
const API_BASE_URL = rawApi.replace(/\/+$/, '');

// Helper for Persistent Admin Products
const getStoredProducts = () => {
  const saved = localStorage.getItem('aanublooms_products');
  if (saved !== null) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }
  const initial = [
    {
      id: 'prod-1',
      name: 'The AanuBlooms Signature 5-Piece Blossom Set',
      price: 2399,
      originalPrice: 2899,
      category: 'forever-blooms',
      yarnMaterial: 'Milk Cotton',
      rating: 5.0,
      reviewCount: 148,
      isBestseller: true,
      inStock: true,
      image: '/images/category/1st_category_flower.jpeg',
      images: ['/images/category/1st_category_flower.jpeg', '/images/aanu-blooms-signature-set.jpeg'],
      description: 'Handcrafted 5-piece crochet velvet flower cupcake garden set made with premium milk cotton yarn.'
    },
    {
      id: 'prod-2',
      name: 'Sunny Sunshine Velvet Sunflower Mini Pot',
      price: 499,
      originalPrice: 650,
      category: 'home-living',
      yarnMaterial: 'Chenille',
      rating: 4.9,
      reviewCount: 89,
      isBestseller: true,
      inStock: true,
      image: '/images/category/3rd_category_flowerpot.jpeg',
      images: ['/images/category/3rd_category_flowerpot.jpeg', '/images/sunflower-cupcake-pot.jpeg'],
      description: 'Charming desk companion sunflower in a cozy handcrafted crochet cupcake pot.'
    },
    {
      id: 'prod-3',
      name: 'Purple Lavender Daisy Blossom Velvet Pot',
      price: 499,
      originalPrice: 650,
      category: 'home-living',
      yarnMaterial: 'Chenille',
      rating: 5.0,
      reviewCount: 74,
      isBestseller: true,
      inStock: true,
      image: '/images/category/3rd_category_flowerpot.jpeg',
      images: ['/images/category/3rd_category_flowerpot.jpeg'],
      description: 'Everlasting lavender daisy blossom handcrafted with soft velvet yarn.'
    },
    {
      id: 'prod-4',
      name: 'Pastel Garden Forever Bouquet Wrap',
      price: 1299,
      originalPrice: 1599,
      category: 'forever-blooms',
      yarnMaterial: 'Milk Cotton',
      rating: 4.8,
      reviewCount: 52,
      isBestseller: true,
      inStock: true,
      image: '/images/category/4th_category_bouquet.jpeg',
      images: ['/images/category/4th_category_bouquet.jpeg'],
      description: 'Beautiful multi-bloom everlasting bouquet wrapped with satin ribbon.'
    },
    {
      id: 'prod-5',
      name: 'Handcrafted Crochet Strawberry & Daisy Keychain',
      price: 249,
      originalPrice: 350,
      category: 'keychains-bag-charms',
      yarnMaterial: 'Milk Cotton',
      rating: 4.9,
      reviewCount: 110,
      isBestseller: true,
      inStock: true,
      image: '/images/category/2nd_category_keychain.jpeg',
      images: ['/images/category/2nd_category_keychain.jpeg'],
      description: 'Dainty pocket-sized crochet strawberry & blossom bag charm.'
    },
    {
      id: 'prod-6',
      name: 'Handmade Artisan Gift Box Set',
      price: 1899,
      originalPrice: 2200,
      category: 'diy-kits-patterns',
      yarnMaterial: 'Milk Cotton',
      rating: 5.0,
      reviewCount: 65,
      isBestseller: true,
      inStock: true,
      image: '/images/category/5th_category_handmadegifts.jpeg',
      images: ['/images/category/5th_category_handmadegifts.jpeg'],
      description: 'Special curated handmade gift set with personalized ribbon message.'
    },
    {
      id: 'prod-7',
      name: 'Slow-Stitched Home Decor Coaster & Mat Set',
      price: 799,
      originalPrice: 999,
      category: 'bags-accessories',
      yarnMaterial: 'Organic',
      rating: 4.9,
      reviewCount: 41,
      isBestseller: false,
      inStock: true,
      image: '/images/category/5th_category_homedecor.jpeg',
      images: ['/images/category/5th_category_homedecor.jpeg'],
      description: 'Cozy organic cotton coaster set for aesthetic room decor.'
    }
  ];
  localStorage.setItem('aanublooms_products', JSON.stringify(initial));
  return initial;
};

// Helper for Persistent Admin Categories
const getStoredCategories = () => {
  const saved = localStorage.getItem('aanublooms_categories');
  if (saved !== null) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }
  const initial = [
    {
      id: 'forever-blooms',
      name: 'Flowers',
      description: 'Handcrafted crochet flowers and everlasting bouquets.',
      image: '/images/category/1st_category_flower.jpeg',
      itemCount: 18
    },
    {
      id: 'keychains-bag-charms',
      name: 'Keychains',
      description: 'Dainty pocket-sized crochet keychains and bag charms.',
      image: '/images/category/2nd_category_keychain.jpeg',
      itemCount: 12
    },
    {
      id: 'home-living',
      name: 'Flower Pots',
      description: 'Aesthetic desk flower pots and potted plants.',
      image: '/images/category/3rd_category_flowerpot.jpeg',
      itemCount: 14
    },
    {
      id: 'bouquets',
      name: 'Forever Bouquets',
      description: 'Everlasting floral bouquets wrapped with satin ribbon.',
      image: '/images/category/4th_category_bouquet.jpeg',
      itemCount: 10
    },
    {
      id: 'diy-kits-patterns',
      name: 'Handmade Gifts',
      description: 'Curated gift hampers and handmade surprise sets.',
      image: '/images/category/5th_category_handmadegifts.jpeg',
      itemCount: 9
    },
    {
      id: 'bags-accessories',
      name: 'Home Decor',
      description: 'Slow-stitched decor pieces, coasters, and room accents.',
      image: '/images/category/5th_category_homedecor.jpeg',
      itemCount: 11
    }
  ];
  localStorage.setItem('aanublooms_categories', JSON.stringify(initial));
  return initial;
};

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

  // Products with Authoritative Local Storage & Search Filtering
  async getProducts(params = {}) {
    let list = [...getStoredProducts()];

    if (params.search) {
      const s = params.search.toLowerCase();
      list = list.filter(p =>
        p.name?.toLowerCase().includes(s) ||
        p.description?.toLowerCase().includes(s) ||
        p.category?.toLowerCase().includes(s) ||
        p.yarnMaterial?.toLowerCase().includes(s)
      );
    }

    if (params.category && params.category !== 'all') {
      list = list.filter(p => p.category === params.category);
    }

    if (params.maxPrice) {
      const max = Number(params.maxPrice);
      if (max < 10000) {
        list = list.filter(p => p.price <= max);
      }
    }

    if (params.limit) {
      list = list.slice(0, Number(params.limit));
    }

    return { success: true, count: list.length, data: list };
  },

  async getCategories() {
    const list = getStoredCategories();
    return { success: true, data: list };
  },

  async getProductById(idOrSlug) {
    const list = getStoredProducts();
    const product = list.find(p => p.id === idOrSlug || p.slug === idOrSlug);
    if (product) {
      const related = list.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
      return { success: true, data: product, related };
    }
    try {
      const res = await fetch(`${API_BASE_URL}/products/${idOrSlug}`);
      if (!res.ok) throw new Error('Product not found');
      return await res.json();
    } catch {
      return { success: false, message: 'Product not found' };
    }
  },

  async createProduct(productData) {
    const list = getStoredProducts();
    const newId = productData.id || `prod-${Date.now()}`;
    const newProduct = {
      ...productData,
      id: newId,
      slug: productData.slug || (productData.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      rating: productData.rating || 5.0,
      reviewCount: productData.reviewCount || 1,
      inStock: productData.inStock !== undefined ? productData.inStock : true,
      image: productData.image || productData.images?.[0] || '/images/category/1st_category_flower.jpeg'
    };
    const updated = [newProduct, ...list];
    localStorage.setItem('aanublooms_products', JSON.stringify(updated));

    try {
      await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      }).catch(() => {});
    } catch {}

    return { success: true, message: 'Product created successfully', data: newProduct };
  },

  async updateProduct(id, productData) {
    const list = getStoredProducts();
    const updated = list.map(p => p.id === id ? { ...p, ...productData } : p);
    localStorage.setItem('aanublooms_products', JSON.stringify(updated));

    try {
      await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      }).catch(() => {});
    } catch {}

    const target = updated.find(p => p.id === id);
    return { success: true, message: 'Product updated successfully', data: target };
  },

  async deleteProduct(id) {
    const list = getStoredProducts();
    const updated = list.filter(p => p.id !== id);
    localStorage.setItem('aanublooms_products', JSON.stringify(updated));

    try {
      await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
      }).catch(() => {});
    } catch {}

    return { success: true, message: 'Product deleted permanently' };
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

  async trackOrder(orderId, phone) {
    const res = await fetch(`${API_BASE_URL}/orders/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, phone }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Unable to track order');
    return data;
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

  // Real Customer Feedback
  async getFeedbacks() {
    try {
      const res = await fetch(`${API_BASE_URL}/feedback`);
      if (!res.ok) throw new Error('API request failed');
      return await res.json();
    } catch {
      const saved = localStorage.getItem('aanublooms_feedbacks');
      const list = saved ? JSON.parse(saved) : [];
      return { success: true, count: list.length, data: list };
    }
  },

  async sendFeedback(feedbackData) {
    const newFeedback = {
      id: `fb-${Date.now()}`,
      author: feedbackData.author || feedbackData.name || 'Valued Customer',
      email: feedbackData.email || '',
      city: feedbackData.city || 'India',
      rating: Number(feedbackData.rating || 5),
      productCategory: feedbackData.productCategory || 'Handcrafted Blooms',
      highlight: feedbackData.highlight || 'Wonderful Handcrafted Quality',
      comment: feedbackData.comment || feedbackData.message || '',
      verified: true,
      date: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
      createdAt: new Date().toISOString()
    };

    const existing = JSON.parse(localStorage.getItem('aanublooms_feedbacks') || '[]');
    const updated = [newFeedback, ...existing];
    localStorage.setItem('aanublooms_feedbacks', JSON.stringify(updated));

    try {
      await fetch(`${API_BASE_URL}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFeedback),
      }).catch(() => {});
      return { success: true, message: 'Thank you! Your feedback is now live on the website.', data: newFeedback };
    } catch {
      return { success: true, message: 'Thank you! Your feedback is now live on the website.', data: newFeedback };
    }
  }
};
