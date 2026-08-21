import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  Flower2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthModal = () => {
  const { isAuthModalOpen, authModalTab, openAuthModal, closeAuthModal, login, signup } = useAuth();

  const [activeTab, setActiveTab] = useState(authModalTab || 'login');
  const [showPassword, setShowPassword] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign up form state
  const [signUpForm, setSignUpForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    city: '',
    state: 'Maharashtra',
    zip: ''
  });

  const indianStates = [
    'Andhra Pradesh', 'Assam', 'Bihar', 'Delhi NCR', 'Goa', 'Gujarat',
    'Haryana', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
    'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'
  ];

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginEmail && loginPassword) {
      login(loginEmail, loginPassword);
    }
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    if (signUpForm.name && signUpForm.email && signUpForm.password) {
      signup(signUpForm);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={closeAuthModal}
      />

      {/* Modal Container */}
      <div className="relative bg-white dark:bg-warmgray-900 rounded-3xl max-w-md w-full border border-warmgray-200 dark:border-warmgray-800 shadow-2xl z-10 overflow-hidden animate-in zoom-in-95 my-6 max-h-[92vh] flex flex-col">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-bloom-500 via-bloom-600 to-rosewood-500 p-5 text-white relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Flower2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-100">
              AanuBlooms Boutique
            </span>
          </div>

          <h3 className="font-serif font-bold text-xl text-white">
            {activeTab === 'login' ? 'Welcome Back' : 'Create Your Boutique Account'}
          </h3>
          <p className="text-xs text-rose-100 mt-0.5">
            {activeTab === 'login'
              ? 'Sign in to track orders, manage saved addresses & wishlist.'
              : 'Join our cozy handmade community & enjoy quick checkout.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-warmgray-100 dark:border-warmgray-800 bg-warmgray-50 dark:bg-warmgray-800/50 p-1.5">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'login'
                ? 'bg-white dark:bg-warmgray-900 text-bloom-600 dark:text-bloom-400 shadow-xs'
                : 'text-warmgray-500 hover:text-warmgray-900 dark:hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'signup'
                ? 'bg-white dark:bg-warmgray-900 text-bloom-600 dark:text-bloom-400 shadow-xs'
                : 'text-warmgray-500 hover:text-warmgray-900 dark:hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          
          {/* TAB 1: LOGIN */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-warmgray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full text-xs py-2.5 pl-9 pr-3 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-bloom-400"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300">
                    Password *
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-warmgray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full text-xs py-2.5 pl-9 pr-9 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-bloom-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-warmgray-400 hover:text-warmgray-600"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-bloom-500 to-rosewood-500 hover:from-bloom-600 hover:to-rosewood-600 text-white rounded-xl font-bold text-xs shadow-cozy transition-all flex items-center justify-center gap-1.5"
              >
                <span>Sign In to Boutique</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <p className="text-center text-xs text-warmgray-500 pt-1">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('signup')}
                  className="font-bold text-bloom-600 hover:underline"
                >
                  Create one now
                </button>
              </p>
            </form>
          )}

          {/* TAB 2: SIGN UP */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignUpSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-warmgray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={signUpForm.name}
                    onChange={(e) => setSignUpForm({ ...signUpForm, name: e.target.value })}
                    className="w-full text-xs py-2.5 pl-9 pr-3 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-bloom-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="your.email@gmail.com"
                    value={signUpForm.email}
                    onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="98765 43210"
                    value={signUpForm.phone}
                    onChange={(e) => setSignUpForm({ ...signUpForm, phone: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                  Delivery Address (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Flat No, Building, Street Name"
                  value={signUpForm.address}
                  onChange={(e) => setSignUpForm({ ...signUpForm, address: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pune"
                    value={signUpForm.city}
                    onChange={(e) => setSignUpForm({ ...signUpForm, city: e.target.value })}
                    className="w-full text-xs p-2 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                    State
                  </label>
                  <select
                    value={signUpForm.state}
                    onChange={(e) => setSignUpForm({ ...signUpForm, state: e.target.value })}
                    className="w-full text-xs p-2 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
                  >
                    {indianStates.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="411001"
                    value={signUpForm.zip}
                    onChange={(e) => setSignUpForm({ ...signUpForm, zip: e.target.value })}
                    className="w-full text-xs p-2 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                  Create Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={signUpForm.password}
                  onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-bloom-500 to-rosewood-500 hover:from-bloom-600 hover:to-rosewood-600 text-white rounded-xl font-bold text-xs shadow-cozy transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>Create Account & Start Shopping</span>
              </button>

              <p className="text-center text-xs text-warmgray-500 pt-1">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="font-bold text-bloom-600 hover:underline"
                >
                  Sign in here
                </button>
              </p>
            </form>
          )}

        </div>

        {/* Security Footer */}
        <div className="p-3 bg-warmgray-50 dark:bg-warmgray-800/60 border-t border-warmgray-100 dark:border-warmgray-800 text-center text-[10px] text-warmgray-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Your personal information & orders are safely encrypted.</span>
        </div>

      </div>
    </div>
  );
};
