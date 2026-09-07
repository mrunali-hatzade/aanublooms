// Safe Storage Utility with Quota Management and Fallbacks

// Defensive interceptor for Storage.prototype.setItem to guarantee QuotaExceededError NEVER crashes React
if (typeof window !== 'undefined' && window.Storage) {
  try {
    const originalSetItem = window.Storage.prototype.setItem;
    window.Storage.prototype.setItem = function (key, value) {
      try {
        return originalSetItem.call(this, key, value);
      } catch (err) {
        if (
          err &&
          (err.name === 'QuotaExceededError' ||
            err.code === 22 ||
            err.code === 1014 ||
            (err.message && (err.message.includes('quota') || err.message.includes('QuotaExceeded') || err.message.includes('Storage'))))
        ) {
          console.warn(`[Storage] Auto-mitigating QuotaExceededError for key "${key}"`);
          try {
            // Prune bulky non-essential cached media & datasets
            const bulkyKeys = [
              'aanublooms_studio_videos_v3',
              'aanublooms_products_v2',
              'aanublooms_categories_v2',
              'stitch_and_love_settings',
              'aanublooms_guest_checkout_data'
            ];
            bulkyKeys.forEach(k => {
              if (k !== key) {
                try { this.removeItem(k); } catch {}
              }
            });
            return originalSetItem.call(this, key, value);
          } catch (retryErr) {
            console.warn(`[Storage] Storage quota exhausted, skipping save for "${key}"`);
            return;
          }
        }
        throw err;
      }
    };
  } catch (patchErr) {
    console.warn('[Storage] Could not attach storage safety patch:', patchErr);
  }
}

export const safeStorage = {
  getItem: (key, fallback = null) => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return fallback;
      const item = window.localStorage.getItem(key);
      return item !== null ? item : fallback;
    } catch (e) {
      console.warn(`[safeStorage] Failed to getItem("${key}"):`, e.message);
      return fallback;
    }
  },

  getJSON: (key, fallback = null) => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return fallback;
      const item = window.localStorage.getItem(key);
      if (!item) return fallback;
      return JSON.parse(item);
    } catch (e) {
      console.warn(`[safeStorage] Failed to parse JSON for "${key}":`, e.message);
      return fallback;
    }
  },

  setItem: (key, value) => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return false;
      const stringVal = typeof value === 'string' ? value : JSON.stringify(value);
      window.localStorage.setItem(key, stringVal);
      return true;
    } catch (e) {
      console.warn(`[safeStorage] Quota or storage error on setItem("${key}"):`, e.message);
      
      // If quota exceeded, clean up non-critical bulky cached datasets
      try {
        const bulkyKeys = [
          'aanublooms_studio_videos_v3',
          'aanublooms_products_v2',
          'aanublooms_categories_v2',
          'stitch_and_love_settings'
        ];
        bulkyKeys.forEach(k => {
          if (k !== key) {
            window.localStorage.removeItem(k);
          }
        });

        // Retry saving after cleanup
        const stringVal = typeof value === 'string' ? value : JSON.stringify(value);
        window.localStorage.setItem(key, stringVal);
        return true;
      } catch (retryErr) {
        console.warn(`[safeStorage] Secondary setItem retry failed for "${key}":`, retryErr.message);
        return false;
      }
    }
  },

  removeItem: (key) => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      window.localStorage.removeItem(key);
    } catch (e) {
      console.warn(`[safeStorage] Failed to removeItem("${key}"):`, e.message);
    }
  },

  clearNonEssential: () => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      const token = window.localStorage.getItem('aanublooms_token');
      const cart = window.localStorage.getItem('aanublooms_cart');
      const wishlist = window.localStorage.getItem('aanublooms_wishlist');
      
      window.localStorage.clear();
      
      if (token) window.localStorage.setItem('aanublooms_token', token);
      if (cart) window.localStorage.setItem('aanublooms_cart', cart);
      if (wishlist) window.localStorage.setItem('aanublooms_wishlist', wishlist);
    } catch (e) {
      console.warn('[safeStorage] clearNonEssential failed:', e.message);
    }
  }
};

export const safeSessionStorage = {
  getItem: (key, fallback = null) => {
    try {
      if (typeof window === 'undefined' || !window.sessionStorage) return fallback;
      const item = window.sessionStorage.getItem(key);
      return item !== null ? item : fallback;
    } catch {
      return fallback;
    }
  },

  getJSON: (key, fallback = null) => {
    try {
      if (typeof window === 'undefined' || !window.sessionStorage) return fallback;
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  },

  setItem: (key, value) => {
    try {
      if (typeof window === 'undefined' || !window.sessionStorage) return false;
      const stringVal = typeof value === 'string' ? value : JSON.stringify(value);
      window.sessionStorage.setItem(key, stringVal);
      return true;
    } catch (e) {
      console.warn(`[safeSessionStorage] Failed to setItem("${key}"):`, e.message);
      try {
        window.sessionStorage.clear();
      } catch {}
      return false;
    }
  },

  removeItem: (key) => {
    try {
      if (typeof window === 'undefined' || !window.sessionStorage) return;
      window.sessionStorage.removeItem(key);
    } catch {}
  }
};
