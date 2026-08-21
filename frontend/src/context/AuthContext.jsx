import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { api } from '../services/api';

const AuthContext = createContext();

// Default Administrator Seed Account (Owner Admin)
const DEFAULT_ADMIN = {
  id: 'admin-primary',
  name: 'Aanu (Artisan Founder)',
  email: 'admin@aanublooms.com',
  password: 'adminpassword123',
  phone: '+91 98765 43210',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
  city: 'Mumbai',
  state: 'Maharashtra',
  zip: '400050',
  address: 'Artisan Studio',
  savedAddresses: []
};

export const AuthProvider = ({ children }) => {
  // Registered users repository
  const [usersDb, setUsersDb] = useState(() => {
    try {
      const saved = localStorage.getItem('aanublooms_users_db');
      return saved ? JSON.parse(saved) : [DEFAULT_ADMIN];
    } catch {
      return [DEFAULT_ADMIN];
    }
  });

  // Current logged in session — Starts as null (Fresh real user is logged out until they sign in)
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('aanublooms_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  // Auth modal global toggle
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'signup'

  const { addToast } = useToast();

  useEffect(() => {
    localStorage.setItem('aanublooms_users_db', JSON.stringify(usersDb));
  }, [usersDb]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('aanublooms_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('aanublooms_user');
    }
  }, [user]);

  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Real User Sign In
  const login = async (email, password) => {
    setIsLoadingAuth(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      // 1. Try Backend API login
      const res = await api.login(cleanEmail, password);
      if (res.success && res.user) {
        setUser(res.user);
        if (res.token) localStorage.setItem('aanublooms_token', res.token);
        addToast(`Welcome back, ${res.user.name}! 🌸`, 'success');
        closeAuthModal();
        setIsLoadingAuth(false);
        return { success: true, user: res.user };
      }
    } catch (apiErr) {
      // 2. Fallback to local users DB
      const existing = usersDb.find(u => u.email.toLowerCase() === cleanEmail);
      if (existing) {
        if (existing.password && existing.password !== password) {
          addToast('Incorrect password. Please try again.', 'error');
          setIsLoadingAuth(false);
          return { success: false, message: 'Invalid credentials' };
        }
        setUser(existing);
        addToast(`Welcome back, ${existing.name}! 🌸`, 'success');
        closeAuthModal();
        setIsLoadingAuth(false);
        return { success: true, user: existing };
      }

      addToast(apiErr.message || 'Incorrect email or password. Please verify.', 'error');
      setIsLoadingAuth(false);
      return { success: false, message: apiErr.message };
    }
  };

  // Real User Sign Up
  const signup = async ({ name, email, password, phone, city, state, zip, address }) => {
    setIsLoadingAuth(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      // 1. Try Backend API register
      const res = await api.register({
        name: name.trim(),
        email: cleanEmail,
        password,
        phone,
        city,
        state,
        zip,
        address
      });

      if (res.success && res.user) {
        setUser(res.user);
        if (res.token) localStorage.setItem('aanublooms_token', res.token);
        setUsersDb(prev => [...prev.filter(u => u.email !== cleanEmail), res.user]);
        addToast(`🌸 Welcome to AanuBlooms, ${res.user.name}! Account created.`, 'success');
        closeAuthModal();
        setIsLoadingAuth(false);
        return { success: true, user: res.user };
      }
    } catch (apiErr) {
      // 2. Local fallback registration
      const existing = usersDb.find(u => u.email.toLowerCase() === cleanEmail);
      if (existing) {
        addToast('An account with this email already exists. Please sign in.', 'error');
        setAuthModalTab('login');
        setIsLoadingAuth(false);
        return { success: false, message: 'User already exists' };
      }

      const isMakerAdmin = cleanEmail.includes('admin@') || cleanEmail.includes('maker@');
      const newUser = {
        id: `usr-${Date.now()}`,
        name: name.trim(),
        email: cleanEmail,
        password: password,
        phone: phone || '',
        role: isMakerAdmin ? 'admin' : 'customer',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
        city: city || '',
        state: state || 'Maharashtra',
        zip: zip || '',
        address: address || '',
        savedAddresses: address ? [
          {
            id: `addr-${Date.now()}`,
            title: 'Primary Delivery Address',
            name: name.trim(),
            phone: phone || '',
            address: address.trim(),
            city: city || '',
            state: state || 'Maharashtra',
            zip: zip || '',
            country: 'India',
            isDefault: true
          }
        ] : []
      };

      setUsersDb(prev => [...prev, newUser]);
      setUser(newUser);
      addToast(`🌸 Welcome to AanuBlooms, ${newUser.name}! Your account is active.`, 'success');
      closeAuthModal();
      setIsLoadingAuth(false);
      return { success: true, user: newUser };
    }
  };

  // Sign out
  const logout = () => {
    setUser(null);
    addToast('Signed out of store', 'info');
  };

  // Update profile
  const updateProfile = (updatedFields) => {
    if (!user) return;
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    setUsersDb(prev => prev.map(u => (u.id === user.id ? updated : u)));
    addToast('Profile details updated successfully! 🌸', 'success');
  };

  // Add saved delivery address
  const addAddress = (newAddr) => {
    if (!user) return;
    const addrObj = {
      id: `addr-${Date.now()}`,
      ...newAddr,
      isDefault: (user.savedAddresses || []).length === 0 || newAddr.isDefault
    };

    let updatedList = [...(user.savedAddresses || [])];
    if (addrObj.isDefault) {
      updatedList = updatedList.map(a => ({ ...a, isDefault: false }));
    }
    updatedList.push(addrObj);

    const updatedUser = { ...user, savedAddresses: updatedList };
    setUser(updatedUser);
    setUsersDb(prev => prev.map(u => (u.id === user.id ? updatedUser : u)));
    addToast('New delivery address saved! 📦', 'success');
  };

  // Delete address
  const deleteAddress = (addressId) => {
    if (!user) return;
    const updatedList = (user.savedAddresses || []).filter(a => a.id !== addressId);
    if (updatedList.length > 0 && !updatedList.some(a => a.isDefault)) {
      updatedList[0].isDefault = true;
    }
    const updatedUser = { ...user, savedAddresses: updatedList };
    setUser(updatedUser);
    setUsersDb(prev => prev.map(u => (u.id === user.id ? updatedUser : u)));
    addToast('Address removed', 'info');
  };

  // Set default address
  const setDefaultAddress = (addressId) => {
    if (!user) return;
    const updatedList = (user.savedAddresses || []).map(a => ({
      ...a,
      isDefault: a.id === addressId
    }));
    const updatedUser = { ...user, savedAddresses: updatedList };
    setUser(updatedUser);
    setUsersDb(prev => prev.map(u => (u.id === user.id ? updatedUser : u)));
    addToast('Default delivery address updated! ✨', 'success');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isAdmin: user?.role === 'admin',
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        login,
        signup,
        logout,
        updateProfile,
        addAddress,
        deleteAddress,
        setDefaultAddress,
        registeredUsers: usersDb
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
