import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const AuthContext = createContext();

const INITIAL_ACCOUNTS = [
  {
    id: 'cust-1',
    name: 'Pooja Sharma',
    email: 'pooja.sharma@example.com',
    password: 'password123',
    phone: '+91 98765 43210',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    city: 'Bengaluru',
    state: 'Karnataka',
    zip: '560038',
    address: 'Flat 402, Lotus Residency, 14th Main Road, Indiranagar',
    savedAddresses: [
      {
        id: 'addr-1',
        title: 'Home',
        name: 'Pooja Sharma',
        phone: '+91 98765 43210',
        address: 'Flat 402, Lotus Residency, 14th Main Road, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        zip: '560038',
        country: 'India',
        isDefault: true
      },
      {
        id: 'addr-2',
        title: 'Office / Studio',
        name: 'Pooja Sharma',
        phone: '+91 98765 43210',
        address: 'WeWork Galaxy, 43 Residency Rd, Shanthala Nagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        zip: '560025',
        country: 'India',
        isDefault: false
      }
    ]
  },
  {
    id: 'admin-1',
    name: 'Aanu (Artisan Founder)',
    email: 'maker@aanublooms.com',
    password: 'adminpassword',
    phone: '+91 99887 76655',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    city: 'Mumbai',
    state: 'Maharashtra',
    zip: '400050',
    address: 'AanuBlooms Craft Studio, Bandra West',
    savedAddresses: []
  }
];

export const AuthProvider = ({ children }) => {
  // Registered users repository
  const [usersDb, setUsersDb] = useState(() => {
    try {
      const saved = localStorage.getItem('aanublooms_users_db');
      return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
    } catch {
      return INITIAL_ACCOUNTS;
    }
  });

  // Current logged in session
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('aanublooms_user');
      return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS[0]; // Logged in as Pooja Sharma by default
    } catch {
      return null;
    }
  });

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

  // Sign in
  const login = (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const existing = usersDb.find(u => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      if (password && existing.password && existing.password !== password && password !== 'demo') {
        addToast('Incorrect password. (Tip: Use "password123" or click demo login)', 'error');
        return { success: false, message: 'Invalid credentials' };
      }
      setUser(existing);
      addToast(`Welcome back, ${existing.name}! 🌸`, 'success');
      closeAuthModal();
      return { success: true, user: existing };
    }

    // Auto-create on demand for quick testing
    const isMakerAdmin = cleanEmail.includes('admin') || cleanEmail.includes('aanu');
    const newUser = {
      id: isMakerAdmin ? 'admin-1' : `cust-${Date.now()}`,
      name: cleanEmail.split('@')[0].replace('.', ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase()),
      email: cleanEmail,
      password: password || 'password123',
      phone: '+91 98765 00000',
      role: isMakerAdmin ? 'admin' : 'customer',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
      city: 'Bengaluru',
      state: 'Karnataka',
      zip: '560001',
      address: 'Main Street',
      savedAddresses: [
        {
          id: `addr-${Date.now()}`,
          title: 'Home',
          name: cleanEmail.split('@')[0],
          phone: '+91 98765 00000',
          address: 'Main Street',
          city: 'Bengaluru',
          state: 'Karnataka',
          zip: '560001',
          country: 'India',
          isDefault: true
        }
      ]
    };

    setUsersDb(prev => [...prev, newUser]);
    setUser(newUser);
    addToast(`Account ready! Welcome, ${newUser.name}! 🌸`, 'success');
    closeAuthModal();
    return { success: true, user: newUser };
  };

  // Sign up
  const signup = ({ name, email, password, phone, city, state, zip, address }) => {
    const cleanEmail = email.trim().toLowerCase();
    const existing = usersDb.find(u => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      addToast('An account with this email already exists. Logging you in...', 'info');
      setUser(existing);
      closeAuthModal();
      return { success: true, user: existing };
    }

    const newUser = {
      id: `cust-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      password: password || 'password123',
      phone: phone || '+91 98765 43210',
      role: 'customer',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
      city: city || 'Bengaluru',
      state: state || 'Karnataka',
      zip: zip || '560038',
      address: address || '',
      savedAddresses: address ? [
        {
          id: `addr-${Date.now()}`,
          title: 'Primary Delivery Address',
          name: name.trim(),
          phone: phone || '+91 98765 43210',
          address: address.trim(),
          city: city || 'Bengaluru',
          state: state || 'Karnataka',
          zip: zip || '560038',
          country: 'India',
          isDefault: true
        }
      ] : []
    };

    setUsersDb(prev => [...prev, newUser]);
    setUser(newUser);
    addToast(`🌸 Welcome to AanuBlooms, ${newUser.name}! Your account is active.`, 'success');
    closeAuthModal();
    return { success: true, user: newUser };
  };

  // Sign out
  const logout = () => {
    setUser(null);
    addToast('Signed out of AanuBlooms', 'info');
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

  const switchToAdmin = () => {
    const adminAccount = usersDb.find(u => u.role === 'admin') || INITIAL_ACCOUNTS[1];
    setUser(adminAccount);
    addToast('Switched to Artisan Maker Studio Admin Mode 🧶', 'info');
  };

  const switchToCustomer = () => {
    const customerAccount = usersDb.find(u => u.role === 'customer') || INITIAL_ACCOUNTS[0];
    setUser(customerAccount);
    addToast('Switched to Customer Shopper Mode 🛍️', 'info');
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
        switchToAdmin,
        switchToCustomer,
        registeredUsers: usersDb
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
