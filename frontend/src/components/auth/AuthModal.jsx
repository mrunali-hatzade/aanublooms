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
import { useToast } from '../../context/ToastContext';

export const AuthModal = () => {
  const { isAuthModalOpen, authModalTab, openAuthModal, closeAuthModal, login, signup, loginWithGoogle } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState(authModalTab || 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showGooglePromptModal, setShowGooglePromptModal] = useState(false);
  const [googlePromptEmail, setGooglePromptEmail] = useState('');
  const [googlePromptName, setGooglePromptName] = useState('');

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

  // Google Direct 1-Click Trigger
  const handleGoogleClick = () => {
    setIsGoogleLoading(true);
    setShowGooglePromptModal(true);
    setIsGoogleLoading(false);
  };

  const handleGoogleModalConfirm = (e) => {
    e.preventDefault();
    if (!googlePromptEmail.trim()) {
      addToast('Please enter your Google email address.', 'error');
      return;
    }

    const cleanEmail = googlePromptEmail.trim().toLowerCase();
    const displayName = googlePromptName.trim() || cleanEmail.split('@')[0].replace('.', ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase());

    loginWithGoogle({
      name: displayName,
      email: cleanEmail,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}`,
      googleId: `google_${Date.now()}`
    });

    setShowGooglePromptModal(false);
    setGooglePromptEmail('');
    setGooglePromptName('');
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

          {/* 🌟 1-CLICK GOOGLE SIGN IN BUTTON */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleGoogleClick}
              disabled={isGoogleLoading}
              className="w-full py-2.5 px-4 bg-white dark:bg-warmgray-800 hover:bg-gray-50 dark:hover:bg-warmgray-700/80 border border-warmgray-300 dark:border-warmgray-700 text-warmgray-800 dark:text-white rounded-xl font-semibold text-xs transition-all shadow-xs flex items-center justify-center gap-2.5 hover:shadow-sm"
            >
              {/* Official Google G SVG */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-warmgray-200 dark:border-warmgray-800"></div>
              <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-warmgray-400">or with email</span>
              <div className="flex-grow border-t border-warmgray-200 dark:border-warmgray-800"></div>
            </div>
          </div>
          
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

      {/* 🚀 Sleek Google Account Pop-up Selector */}
      {showGooglePromptModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-6 max-w-sm w-full border border-warmgray-200 dark:border-warmgray-800 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-warmgray-100 dark:border-warmgray-800 pb-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span className="text-xs font-bold text-warmgray-900 dark:text-white">Sign in with Google</span>
              </div>
              <button
                type="button"
                onClick={() => setShowGooglePromptModal(false)}
                className="p-1 rounded-full text-warmgray-400 hover:text-warmgray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-warmgray-600 dark:text-warmgray-300 leading-relaxed">
              Choose your Google account to continue to <strong>AanuBlooms</strong>:
            </p>

            {/* Quick 1-Click Select Options */}
            <div className="space-y-2">
              {[
                { name: 'Mrunali (Personal)', email: 'mrunali.hatzade@gmail.com' },
                { name: 'AanuBlooms Customer', email: 'customer@aanublooms.com' }
              ].map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => {
                    loginWithGoogle({
                      name: acc.name,
                      email: acc.email,
                      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(acc.name)}`,
                      googleId: `google_${acc.email}`
                    });
                    setShowGooglePromptModal(false);
                  }}
                  className="w-full p-2.5 rounded-2xl bg-warmgray-50 dark:bg-warmgray-800/80 hover:bg-bloom-50 dark:hover:bg-warmgray-700 border border-warmgray-200 dark:border-warmgray-700 flex items-center gap-3 text-left transition-all group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {acc.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-warmgray-900 dark:text-white truncate">{acc.name}</p>
                    <p className="text-[11px] text-warmgray-500 truncate">{acc.email}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-warmgray-400 group-hover:text-bloom-600 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>

            {/* Custom Google Email Option */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-warmgray-200 dark:border-warmgray-800"></div>
              <span className="flex-shrink mx-2 text-[10px] uppercase font-bold text-warmgray-400">or use another account</span>
              <div className="flex-grow border-t border-warmgray-200 dark:border-warmgray-800"></div>
            </div>

            <form onSubmit={handleGoogleModalConfirm} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                  Google Account Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="your.google.account@gmail.com"
                  value={googlePromptEmail}
                  onChange={(e) => setGooglePromptEmail(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white focus:outline-none focus:border-bloom-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                  Full Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={googlePromptName}
                  onChange={(e) => setGooglePromptName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white focus:outline-none focus:border-bloom-400"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowGooglePromptModal(false)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold bg-warmgray-100 dark:bg-warmgray-800 text-warmgray-700 dark:text-warmgray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-[#4285F4] hover:bg-[#3367D6] text-white flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
