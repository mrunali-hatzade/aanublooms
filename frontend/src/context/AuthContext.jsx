import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');

  const { addToast } = useToast();

  // On mount: validate stored token
  useEffect(() => {
    const validateStoredSession = async () => {
      try {
        const token = localStorage.getItem('aanublooms_token');
        if (token) {
          const res = await api.getMe(token);
          if (res.success && res.user) {
            setUser(res.user);
          } else {
            localStorage.removeItem('aanublooms_token');
          }
        }
      } catch {
        localStorage.removeItem('aanublooms_token');
      } finally {
        setIsLoadingAuth(false);
      }
    };
    validateStoredSession();
  }, []);

  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  // Real User Sign In
  const login = async (email, password) => {
    setIsLoadingAuth(true);
    try {
      const res = await api.login(email.trim().toLowerCase(), password);
      if (res.success && res.user) {
        setUser(res.user);
        if (res.token) localStorage.setItem('aanublooms_token', res.token);
        addToast(`Welcome back, ${res.user.name}! 🌸`, 'success');
        closeAuthModal();
        setIsLoadingAuth(false);
        return { success: true, user: res.user };
      }
    } catch (err) {
      addToast(err.message || 'Login failed. Please check your credentials.', 'error');
      setIsLoadingAuth(false);
      return { success: false, message: err.message };
    }
    setIsLoadingAuth(false);
    return { success: false, message: 'Login failed' };
  };

  // Real User Sign Up
  const signup = async ({ name, email, password, phone, city, state, zip, address }) => {
    setIsLoadingAuth(true);
    try {
      const res = await api.register({ name: name.trim(), email: email.trim().toLowerCase(), password, phone, city, state, zip, address });
      if (res.success && res.user) {
        setUser(res.user);
        if (res.token) localStorage.setItem('aanublooms_token', res.token);
        addToast(`🌸 Welcome to AanuBlooms, ${res.user.name}!`, 'success');
        closeAuthModal();
        setIsLoadingAuth(false);
        return { success: true, user: res.user };
      }
    } catch (err) {
      addToast(err.message || 'Registration failed.', 'error');
      setIsLoadingAuth(false);
      return { success: false, message: err.message };
    }
    setIsLoadingAuth(false);
    return { success: false, message: 'Registration failed' };
  };

  // Google Sign In
  const loginWithGoogle = async (googleProfile) => {
    setIsLoadingAuth(true);
    try {
      const res = await api.googleLogin({
        name: googleProfile.name,
        email: googleProfile.email,
        avatar: googleProfile.avatar || googleProfile.picture,
        googleId: googleProfile.sub || googleProfile.googleId || `g_${Date.now()}`
      });
      if (res.success && res.user) {
        setUser(res.user);
        if (res.token) localStorage.setItem('aanublooms_token', res.token);
        addToast(`🌸 Welcome, ${res.user.name}!`, 'success');
        closeAuthModal();
        setIsLoadingAuth(false);
        return { success: true, user: res.user };
      }
    } catch (err) {
      addToast(err.message || 'Google sign-in failed.', 'error');
      setIsLoadingAuth(false);
      return { success: false, message: err.message };
    }
    setIsLoadingAuth(false);
    return { success: false };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aanublooms_token');
    addToast('Signed out successfully', 'info');
  };

  const updateProfile = async (updatedFields) => {
    if (!user) return;
    try {
      const res = await api.updateProfile(updatedFields);
      if (res.success && res.user) {
        setUser(res.user);
        addToast('Profile updated! 🌸', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to update profile', 'error');
    }
  };

  // Address management (local state, synced on next login)
  const addAddress = (newAddr) => {
    if (!user) return;
    const addrObj = { id: `addr-${Date.now()}`, ...newAddr, isDefault: (user.savedAddresses || []).length === 0 || newAddr.isDefault };
    let updatedList = [...(user.savedAddresses || [])];
    if (addrObj.isDefault) updatedList = updatedList.map(a => ({ ...a, isDefault: false }));
    updatedList.push(addrObj);
    setUser({ ...user, savedAddresses: updatedList });
    addToast('New delivery address saved! 📦', 'success');
  };

  const deleteAddress = (addressId) => {
    if (!user) return;
    const updatedList = (user.savedAddresses || []).filter(a => a.id !== addressId);
    if (updatedList.length > 0 && !updatedList.some(a => a.isDefault)) updatedList[0].isDefault = true;
    setUser({ ...user, savedAddresses: updatedList });
    addToast('Address removed', 'info');
  };

  const setDefaultAddress = (addressId) => {
    if (!user) return;
    const updatedList = (user.savedAddresses || []).map(a => ({ ...a, isDefault: a.id === addressId }));
    setUser({ ...user, savedAddresses: updatedList });
    addToast('Default address updated!', 'success');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isAdmin: user?.role === 'admin',
        isLoadingAuth,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        login,
        signup,
        loginWithGoogle,
        logout,
        updateProfile,
        addAddress,
        deleteAddress,
        setDefaultAddress,
        registeredUsers: [] // Kept for compatibility, no longer used
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
