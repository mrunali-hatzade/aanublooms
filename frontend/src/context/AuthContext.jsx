import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('aanublooms_user');
      return saved ? JSON.parse(saved) : {
        id: 'cust-1',
        name: 'Sophie Martin',
        email: 'sophie.m@example.com',
        role: 'customer',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        savedAddresses: [
          {
            id: 'addr-1',
            name: 'Sophie Martin',
            address: '124 Blossom Lane, Apt 3B',
            city: 'Portland',
            state: 'OR',
            zip: '97201',
            country: 'United States',
            isDefault: true
          }
        ]
      };
    } catch {
      return null;
    }
  });

  const { addToast } = useToast();

  useEffect(() => {
    if (user) {
      localStorage.setItem('aanublooms_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('aanublooms_user');
    }
  }, [user]);

  const login = (email, password, role = 'customer') => {
    const isMakerAdmin = email.toLowerCase().includes('admin') || email.toLowerCase().includes('aanu') || role === 'admin';
    const loggedUser = {
      id: isMakerAdmin ? 'admin-1' : `cust-${Date.now()}`,
      name: isMakerAdmin ? 'Aanu (Studio Founder)' : email.split('@')[0],
      email,
      role: isMakerAdmin ? 'admin' : 'customer',
      avatar: isMakerAdmin
        ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80'
        : `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
      savedAddresses: []
    };
    setUser(loggedUser);
    addToast(`Welcome back, ${loggedUser.name}! 🌸`, 'success');
    return loggedUser;
  };

  const switchToAdmin = () => {
    setUser({
      id: 'admin-1',
      name: 'Aanu (Artisan Founder)',
      email: 'aanu@aanublooms.com',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80'
    });
    addToast('Switched to Maker Studio Admin Mode 🧶', 'info');
  };

  const switchToCustomer = () => {
    setUser({
      id: 'cust-1',
      name: 'Sophie Martin',
      email: 'sophie.m@example.com',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
    });
    addToast('Switched to Customer Mode 🛍️', 'info');
  };

  const logout = () => {
    setUser(null);
    addToast('Signed out successfully', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isAdmin: user?.role === 'admin',
        login,
        logout,
        switchToAdmin,
        switchToCustomer
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
