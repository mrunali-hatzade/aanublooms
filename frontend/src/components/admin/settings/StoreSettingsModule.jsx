import React, { useState, useEffect } from 'react';
import {
  Store,
  Building2,
  Palette,
  Share2,
  ShoppingBag,
  Truck,
  CreditCard,
  Receipt,
  Bell,
  Users,
  Globe,
  FileText,
  ShieldAlert,
  Sparkles,
  Save,
  Check,
  RotateCcw,
  AlertTriangle,
  Upload,
  Camera,
  Trash2,
  ExternalLink,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Layers,
  ChevronRight,
  ShieldCheck,
  Edit3
} from 'lucide-react';
import { useSettings } from '../../../context/SettingsContext';
import { useToast } from '../../../context/ToastContext';
import { api } from '../../../services/api';

export const StoreSettingsModule = () => {
  const { settings, saveSettings, isLoading } = useSettings();
  const { addToast } = useToast();

  // Active Navigation Tab
  const [activeSection, setActiveSection] = useState('general');

  // Local working copy of settings
  const [formData, setFormData] = useState(settings);
  const [isDirty, setIsDirty] = useState(false);

  // Modals & Sub-states
  const [maintenanceConfirmOpen, setMaintenanceConfirmOpen] = useState(false);
  const [showSecretInput, setShowSecretInput] = useState(false);
  const [newSecretKey, setNewSecretKey] = useState('');
  const [paymentTesting, setPaymentTesting] = useState(false);
  const [paymentTestResult, setPaymentTestResult] = useState(null);
  const [editingLegalPolicy, setEditingLegalPolicy] = useState(null);
  const [legalPolicyContent, setLegalPolicyContent] = useState('');

  // Sync formData when settings load from context/API
  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  // Deep update helper
  const handleFieldChange = (section, field, value) => {
    setFormData(prev => {
      const updatedSection = { ...prev[section], [field]: value };
      return { ...prev, [section]: updatedSection };
    });
    setIsDirty(true);
  };

  const handleNestedFieldChange = (section, subSection, field, value) => {
    setFormData(prev => {
      const updatedSub = { ...prev[section]?.[subSection], [field]: value };
      const updatedSection = { ...prev[section], [subSection]: updatedSub };
      return { ...prev, [section]: updatedSection };
    });
    setIsDirty(true);
  };

  // Image uploader helper (Logo / Favicon / OG Image)
  const handleImageUpload = (section, field, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      handleFieldChange(section, field, dataUrl);
      addToast(`Image uploaded for ${field}!`, 'success');
    };
    reader.readAsDataURL(file);
  };

  // Reset/Discard changes
  const handleDiscard = () => {
    setFormData(settings);
    setIsDirty(false);
    setShowSecretInput(false);
    setNewSecretKey('');
    addToast('Unsaved changes discarded.', 'info');
  };

  // Save changes handler with validation
  const handleSave = async (e) => {
    if (e) e.preventDefault();

    // Basic Validation
    if (!formData.general?.storeName?.trim()) {
      addToast('Store name cannot be empty.', 'error');
      return;
    }

    if (formData.contact?.whatsappNumber && !/^\+?[0-9\s-]{10,15}$/.test(formData.contact.whatsappNumber.replace(/\s+/g, ''))) {
      addToast('Please enter a valid WhatsApp number (e.g. +91 98765 43210).', 'error');
      return;
    }

    if (formData.contact?.businessEmail && !/\S+@\S+\.\S+/.test(formData.contact.businessEmail)) {
      addToast('Please enter a valid business email address.', 'error');
      return;
    }

    const payload = { ...formData };
    if (showSecretInput && newSecretKey) {
      payload.payments = {
        ...payload.payments,
        razorpay: {
          ...payload.payments.razorpay,
          keySecretMasked: '••••••••••••••••'
        }
      };
    }

    const res = await saveSettings(payload);
    if (res?.success) {
      setIsDirty(false);
      setShowSecretInput(false);
      setNewSecretKey('');
    }
  };

  // Payment Test Handler
  const handleTestPayment = async () => {
    const keyId = formData.payments?.razorpay?.keyId;
    if (!keyId) {
      addToast('Please enter a Razorpay Key ID first.', 'error');
      return;
    }

    setPaymentTesting(true);
    setPaymentTestResult(null);

    try {
      const res = await api.testPayment(keyId);
      setPaymentTestResult({ success: true, message: res.message });
      addToast('Razorpay Gateway is connected and active! 💳', 'success');
    } catch (err) {
      setPaymentTestResult({ success: false, message: err.message });
      addToast(err.message || 'Payment test connection failed.', 'error');
    } finally {
      setPaymentTesting(false);
    }
  };

  // Navigation Groups
  const navGroups = [
    {
      group: 'GENERAL',
      items: [
        { id: 'general', label: 'General', icon: Store },
        { id: 'business', label: 'Business Profile', icon: Building2 }
      ]
    },
    {
      group: 'BRAND',
      items: [
        { id: 'branding', label: 'Branding', icon: Palette },
        { id: 'contact', label: 'Contact & Social', icon: Share2 }
      ]
    },
    {
      group: 'STORE',
      items: [
        { id: 'orders', label: 'Orders & Custom Orders', icon: ShoppingBag },
        { id: 'shipping', label: 'Shipping', icon: Truck },
        { id: 'payments', label: 'Payments', icon: CreditCard },
        { id: 'taxes', label: 'Taxes', icon: Receipt }
      ]
    },
    {
      group: 'COMMUNICATION',
      items: [
        { id: 'notifications', label: 'Notifications', icon: Bell }
      ]
    },
    {
      group: 'CUSTOMERS',
      items: [
        { id: 'customers', label: 'Customer Accounts', icon: Users }
      ]
    },
    {
      group: 'DISCOVERABILITY',
      items: [
        { id: 'seo', label: 'SEO', icon: Globe }
      ]
    },
    {
      group: 'LEGAL',
      items: [
        { id: 'legal', label: 'Legal Pages', icon: FileText }
      ]
    },
    {
      group: 'SYSTEM',
      items: [
        { id: 'maintenance', label: 'Maintenance', icon: ShieldAlert }
      ]
    },
    {
      group: 'CRAFTING',
      items: [
        { id: 'crafting', label: 'Crafting & Production', icon: Sparkles }
      ]
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in pb-16">
      
      {/* 1. MODULE TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl p-6 border border-[#E9E2DC] shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#D96C65] bg-[#D96C65]/10 px-2 py-0.5 rounded-md">
              ADMIN STUDIO
            </span>
            {isDirty && (
              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Unsaved changes
              </span>
            )}
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#3E2B25] mt-1">
            Store Settings
          </h1>
          <p className="text-xs text-[#756A65] mt-0.5">
            Manage your store, orders, payments, shipping and business preferences.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2.5">
          {isDirty && (
            <button
              type="button"
              onClick={handleDiscard}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#756A65] hover:bg-[#F8F6F3] border border-[#E9E2DC] transition-colors"
            >
              Discard
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={isLoading || !isDirty}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-sm ${
              isDirty
                ? 'bg-[#D96C65] hover:bg-[#C95B55] text-white shadow-[#D96C65]/20 hover:scale-[1.01]'
                : 'bg-[#E9E2DC] text-[#756A65] cursor-not-allowed'
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN TWO-COLUMN SETTINGS LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: SETTINGS NAVIGATION (Col span 3) */}
        <div className="lg:col-span-3">
          
          {/* Mobile Select Dropdown */}
          <div className="lg:hidden bg-white p-3 rounded-2xl border border-[#E9E2DC] mb-4">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#756A65] mb-1">
              Select Settings Section
            </label>
            <select
              value={activeSection}
              onChange={(e) => setActiveSection(e.target.value)}
              className="w-full text-xs font-semibold p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25] focus:outline-none focus:border-[#D96C65]"
            >
              {navGroups.map(g => (
                <optgroup key={g.group} label={g.group}>
                  {g.items.map(item => (
                    <option key={item.id} value={item.id}>{item.label}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Desktop Navigation Menu */}
          <div className="hidden lg:block bg-white rounded-2xl p-3 border border-[#E9E2DC] shadow-sm sticky top-20 space-y-4">
            {navGroups.map((grp) => (
              <div key={grp.group} className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#756A65]/70 px-3 block">
                  {grp.group}
                </span>
                <div className="space-y-0.5">
                  {grp.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left ${
                          isActive
                            ? 'bg-[#D96C65] text-white shadow-xs'
                            : 'text-[#3E2B25] hover:bg-[#F8F6F3] hover:text-[#D96C65]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#756A65]'}`} />
                          <span>{item.label}</span>
                        </div>
                        {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE SETTING CONTENT PANEL (Col span 9) */}
        <div className="lg:col-span-9 space-y-6">

          {/* ========================================================================= */}
          {/* 1. GENERAL SETTINGS */}
          {/* ========================================================================= */}
          {activeSection === 'general' && (
            <div className="space-y-6">
              
              {/* Store Information */}
              <div className="bg-white rounded-2xl p-6 border border-[#E9E2DC] shadow-sm space-y-4">
                <div className="border-b border-[#E9E2DC] pb-3">
                  <h3 className="font-serif font-bold text-base text-[#3E2B25]">Store Information</h3>
                  <p className="text-xs text-[#756A65]">Basic identity displayed to customers across the boutique.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3E2B25] mb-1">
                      Store Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.general?.storeName || ''}
                      onChange={(e) => handleFieldChange('general', 'storeName', e.target.value)}
                      placeholder="e.g. Stitch & Love"
                      className="w-full text-xs p-3 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25] focus:outline-none focus:border-[#D96C65]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3E2B25] mb-1">
                      Store Tagline
                    </label>
                    <input
                      type="text"
                      value={formData.general?.tagline || ''}
                      onChange={(e) => handleFieldChange('general', 'tagline', e.target.value)}
                      placeholder="e.g. Handmade with Love, One Stitch at a Time."
                      className="w-full text-xs p-3 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25] focus:outline-none focus:border-[#D96C65]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3E2B25] mb-1">
                      Store Description
                    </label>
                    <textarea
                      rows={3}
                      value={formData.general?.description || ''}
                      onChange={(e) => handleFieldChange('general', 'description', e.target.value)}
                      placeholder="Describe your handmade boutique..."
                      className="w-full text-xs p-3 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25] focus:outline-none focus:border-[#D96C65]"
                    />
                  </div>
                </div>
              </div>

              {/* Store Status (Open / Closed) */}
              <div className="bg-white rounded-2xl p-6 border border-[#E9E2DC] shadow-sm space-y-4">
                <div className="border-b border-[#E9E2DC] pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#3E2B25]">Store Status</h3>
                    <p className="text-xs text-[#756A65]">Open or temporarily close the storefront for orders.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.general?.storeOpen ?? true}
                      onChange={(e) => handleFieldChange('general', 'storeOpen', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4F9D69]"></div>
                  </label>
                </div>

                {!formData.general?.storeOpen && (
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-3">
                    <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Store is currently closed to customer orders</span>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-amber-900 mb-1">
                        Closed Store Message for Customers:
                      </label>
                      <input
                        type="text"
                        value={formData.general?.closedMessage || ''}
                        onChange={(e) => handleFieldChange('general', 'closedMessage', e.target.value)}
                        placeholder="We're taking a short break and will be back soon."
                        className="w-full text-xs p-2.5 rounded-lg bg-white border border-amber-300 text-[#3E2B25] focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Store Configuration */}
              <div className="bg-white rounded-2xl p-6 border border-[#E9E2DC] shadow-sm space-y-4">
                <div className="border-b border-[#E9E2DC] pb-3">
                  <h3 className="font-serif font-bold text-base text-[#3E2B25]">Store Configuration</h3>
                  <p className="text-xs text-[#756A65]">Currency, timezone, and regional settings.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3E2B25] mb-1">Currency</label>
                    <select
                      value={formData.general?.currency || 'INR'}
                      onChange={(e) => handleFieldChange('general', 'currency', e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25]"
                    >
                      <option value="INR">INR (₹ Indian Rupee)</option>
                      <option value="USD">USD ($ US Dollar)</option>
                      <option value="EUR">EUR (€ Euro)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3E2B25] mb-1">Timezone</label>
                    <input
                      type="text"
                      value={formData.general?.timezone || 'Asia/Kolkata'}
                      onChange={(e) => handleFieldChange('general', 'timezone', e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3E2B25] mb-1">Country</label>
                    <input
                      type="text"
                      value={formData.general?.country || 'India'}
                      onChange={(e) => handleFieldChange('general', 'country', e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25]"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. BUSINESS PROFILE */}
          {/* ========================================================================= */}
          {activeSection === 'business' && (
            <div className="bg-white rounded-2xl p-6 border border-[#E9E2DC] shadow-sm space-y-6">
              <div className="border-b border-[#E9E2DC] pb-3">
                <h3 className="font-serif font-bold text-base text-[#3E2B25]">Business Profile & Legal Entity</h3>
                <p className="text-xs text-[#756A65]">Official business registration and studio details for invoicing.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#3E2B25] mb-1">Business Name</label>
                  <input
                    type="text"
                    value={formData.business?.businessName || ''}
                    onChange={(e) => handleFieldChange('business', 'businessName', e.target.value)}
                    placeholder="Stitch & Love Handcrafted Studio"
                    className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3E2B25] mb-1">Owner / Founder Name</label>
                  <input
                    type="text"
                    value={formData.business?.ownerName || ''}
                    onChange={(e) => handleFieldChange('business', 'ownerName', e.target.value)}
                    placeholder="Priya Sharma"
                    className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3E2B25] mb-1">Business Type</label>
                  <input
                    type="text"
                    value={formData.business?.businessType || 'Sole Proprietorship / Handmade Studio'}
                    onChange={(e) => handleFieldChange('business', 'businessType', e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3E2B25] mb-1">Year Started</label>
                  <input
                    type="text"
                    value={formData.business?.yearStarted || '2026'}
                    onChange={(e) => handleFieldChange('business', 'yearStarted', e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25]"
                  />
                </div>
              </div>

              {/* Physical Studio Address */}
              <div className="pt-2 border-t border-[#E9E2DC] space-y-3">
                <h4 className="text-xs font-bold text-[#3E2B25] uppercase tracking-wider">Studio / Dispatch Address</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-3">
                    <label className="block text-[11px] font-bold text-[#3E2B25] mb-1">Address Line</label>
                    <input
                      type="text"
                      value={formData.business?.address || ''}
                      onChange={(e) => handleFieldChange('business', 'address', e.target.value)}
                      placeholder="402, Lotus Residency, Indiranagar"
                      className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#3E2B25] mb-1">City</label>
                    <input
                      type="text"
                      value={formData.business?.city || ''}
                      onChange={(e) => handleFieldChange('business', 'city', e.target.value)}
                      placeholder="Bengaluru"
                      className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#3E2B25] mb-1">State</label>
                    <input
                      type="text"
                      value={formData.business?.state || ''}
                      onChange={(e) => handleFieldChange('business', 'state', e.target.value)}
                      placeholder="Karnataka"
                      className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#3E2B25] mb-1">PIN Code</label>
                    <input
                      type="text"
                      value={formData.business?.zip || ''}
                      onChange={(e) => handleFieldChange('business', 'zip', e.target.value)}
                      placeholder="560038"
                      className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25]"
                    />
                  </div>
                </div>
              </div>

              {/* Optional Tax Identifiers */}
              <div className="pt-2 border-t border-[#E9E2DC] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#3E2B25] uppercase tracking-wider">Tax Details (GSTIN & PAN)</h4>
                  <span className="text-[10px] text-[#756A65]">Optional — add these details if applicable to your business.</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3E2B25] mb-1">GSTIN Number</label>
                    <input
                      type="text"
                      value={formData.business?.gstin || ''}
                      onChange={(e) => handleFieldChange('business', 'gstin', e.target.value.toUpperCase())}
                      placeholder="e.g. 29AAAAA0000A1Z5"
                      className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25] font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#3E2B25] mb-1">PAN Number</label>
                    <input
                      type="text"
                      value={formData.business?.pan || ''}
                      onChange={(e) => handleFieldChange('business', 'pan', e.target.value.toUpperCase())}
                      placeholder="e.g. ABCDE1234F"
                      className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25] font-mono"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. BRANDING & COLORS */}
          {/* ========================================================================= */}
          {activeSection === 'branding' && (
            <div className="space-y-6">
              
              {/* Logo Assets */}
              <div className="bg-white rounded-2xl p-6 border border-[#E9E2DC] shadow-sm space-y-6">
                <div className="border-b border-[#E9E2DC] pb-3">
                  <h3 className="font-serif font-bold text-base text-[#3E2B25]">Logo & Favicon</h3>
                  <p className="text-xs text-[#756A65]">Upload your official studio marks for desktop, mobile and browser tabs.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Main Logo */}
                  <div className="p-4 bg-[#F8F6F3] rounded-2xl border border-[#E9E2DC] space-y-3 text-center">
                    <span className="text-xs font-bold text-[#3E2B25] block">Main Logo (Desktop)</span>
                    <div className="h-20 flex items-center justify-center bg-white rounded-xl border border-[#E9E2DC] p-2">
                      <img
                        src={formData.branding?.mainLogo || '/logo.svg'}
                        alt="Main Logo"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <label className="cursor-pointer inline-flex items-center justify-center gap-1.5 w-full py-2 bg-white hover:bg-gray-50 border border-[#E9E2DC] text-[#3E2B25] rounded-xl text-xs font-semibold transition-colors">
                      <Upload className="w-3.5 h-3.5 text-[#D96C65]" />
                      <span>Upload / Replace</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload('branding', 'mainLogo', e)}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Mobile Logo */}
                  <div className="p-4 bg-[#F8F6F3] rounded-2xl border border-[#E9E2DC] space-y-3 text-center">
                    <span className="text-xs font-bold text-[#3E2B25] block">Mobile Logo</span>
                    <div className="h-20 flex items-center justify-center bg-white rounded-xl border border-[#E9E2DC] p-2">
                      <img
                        src={formData.branding?.mobileLogo || '/logo.svg'}
                        alt="Mobile Logo"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <label className="cursor-pointer inline-flex items-center justify-center gap-1.5 w-full py-2 bg-white hover:bg-gray-50 border border-[#E9E2DC] text-[#3E2B25] rounded-xl text-xs font-semibold transition-colors">
                      <Upload className="w-3.5 h-3.5 text-[#D96C65]" />
                      <span>Upload / Replace</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload('branding', 'mobileLogo', e)}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Favicon */}
                  <div className="p-4 bg-[#F8F6F3] rounded-2xl border border-[#E9E2DC] space-y-3 text-center">
                    <span className="text-xs font-bold text-[#3E2B25] block">Favicon (Tab Icon)</span>
                    <div className="h-20 flex items-center justify-center bg-white rounded-xl border border-[#E9E2DC] p-2">
                      <img
                        src={formData.branding?.favicon || '/favicon.ico'}
                        alt="Favicon"
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                    <label className="cursor-pointer inline-flex items-center justify-center gap-1.5 w-full py-2 bg-white hover:bg-gray-50 border border-[#E9E2DC] text-[#3E2B25] rounded-xl text-xs font-semibold transition-colors">
                      <Upload className="w-3.5 h-3.5 text-[#D96C65]" />
                      <span>Upload / Replace</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload('branding', 'favicon', e)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Brand Palette */}
              <div className="bg-white rounded-2xl p-6 border border-[#E9E2DC] shadow-sm space-y-4">
                <div className="border-b border-[#E9E2DC] pb-3">
                  <h3 className="font-serif font-bold text-base text-[#3E2B25]">Brand Colors</h3>
                  <p className="text-xs text-[#756A65]">Customize the primary palette across buttons, badges and storefront cards.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Primary Color */}
                  <div className="p-3.5 bg-[#F8F6F3] rounded-xl border border-[#E9E2DC] space-y-2">
                    <span className="text-xs font-bold text-[#3E2B25] block">Primary Accent</span>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.branding?.primaryColor || '#D96C65'}
                        onChange={(e) => handleFieldChange('branding', 'primaryColor', e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer border border-[#E9E2DC] bg-white p-0.5"
                      />
                      <input
                        type="text"
                        value={formData.branding?.primaryColor || '#D96C65'}
                        onChange={(e) => handleFieldChange('branding', 'primaryColor', e.target.value)}
                        className="w-full text-xs font-mono p-2 rounded-lg bg-white border border-[#E9E2DC]"
                      />
                    </div>
                  </div>

                  {/* Secondary Color */}
                  <div className="p-3.5 bg-[#F8F6F3] rounded-xl border border-[#E9E2DC] space-y-2">
                    <span className="text-xs font-bold text-[#3E2B25] block">Secondary Dark Cocoa</span>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.branding?.secondaryColor || '#3E2B25'}
                        onChange={(e) => handleFieldChange('branding', 'secondaryColor', e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer border border-[#E9E2DC] bg-white p-0.5"
                      />
                      <input
                        type="text"
                        value={formData.branding?.secondaryColor || '#3E2B25'}
                        onChange={(e) => handleFieldChange('branding', 'secondaryColor', e.target.value)}
                        className="w-full text-xs font-mono p-2 rounded-lg bg-white border border-[#E9E2DC]"
                      />
                    </div>
                  </div>

                  {/* Accent Color */}
                  <div className="p-3.5 bg-[#F8F6F3] rounded-xl border border-[#E9E2DC] space-y-2">
                    <span className="text-xs font-bold text-[#3E2B25] block">Light Cream Accent</span>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.branding?.accentColor || '#FAF7F2'}
                        onChange={(e) => handleFieldChange('branding', 'accentColor', e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer border border-[#E9E2DC] bg-white p-0.5"
                      />
                      <input
                        type="text"
                        value={formData.branding?.accentColor || '#FAF7F2'}
                        onChange={(e) => handleFieldChange('branding', 'accentColor', e.target.value)}
                        className="w-full text-xs font-mono p-2 rounded-lg bg-white border border-[#E9E2DC]"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. CONTACT & SOCIAL */}
          {/* ========================================================================= */}
          {activeSection === 'contact' && (
            <div className="space-y-6">
              
              {/* Contact Details */}
              <div className="bg-white rounded-2xl p-6 border border-[#E9E2DC] shadow-sm space-y-4">
                <div className="border-b border-[#E9E2DC] pb-3">
                  <h3 className="font-serif font-bold text-base text-[#3E2B25]">Contact Information</h3>
                  <p className="text-xs text-[#756A65]">Used by customer inquiries, order updates and floating WhatsApp triggers.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3E2B25] mb-1">
                      WhatsApp Number (with country code) *
                    </label>
                    <input
                      type="text"
                      value={formData.contact?.whatsappNumber || ''}
                      onChange={(e) => handleFieldChange('contact', 'whatsappNumber', e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3E2B25] mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={formData.contact?.phoneNumber || ''}
                      onChange={(e) => handleFieldChange('contact', 'phoneNumber', e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3E2B25] mb-1">Business Email</label>
                    <input
                      type="email"
                      value={formData.contact?.businessEmail || ''}
                      onChange={(e) => handleFieldChange('contact', 'businessEmail', e.target.value)}
                      placeholder="hello@stitchandlove.com"
                      className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3E2B25] mb-1">Support Email</label>
                    <input
                      type="email"
                      value={formData.contact?.supportEmail || ''}
                      onChange={(e) => handleFieldChange('contact', 'supportEmail', e.target.value)}
                      placeholder="support@stitchandlove.com"
                      className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25]"
                    />
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="bg-white rounded-2xl p-6 border border-[#E9E2DC] shadow-sm space-y-4">
                <div className="border-b border-[#E9E2DC] pb-3">
                  <h3 className="font-serif font-bold text-base text-[#3E2B25]">Social Media Profiles</h3>
                  <p className="text-xs text-[#756A65]">Linked directly from the customer storefront footer.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3E2B25] mb-1">Instagram URL</label>
                    <input
                      type="url"
                      value={formData.contact?.instagramUrl || ''}
                      onChange={(e) => handleFieldChange('contact', 'instagramUrl', e.target.value)}
                      placeholder="https://instagram.com/yourhandle"
                      className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3E2B25] mb-1">Facebook URL</label>
                    <input
                      type="url"
                      value={formData.contact?.facebookUrl || ''}
                      onChange={(e) => handleFieldChange('contact', 'facebookUrl', e.target.value)}
                      placeholder="https://facebook.com/yourpage"
                      className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3E2B25] mb-1">Pinterest URL</label>
                    <input
                      type="url"
                      value={formData.contact?.pinterestUrl || ''}
                      onChange={(e) => handleFieldChange('contact', 'pinterestUrl', e.target.value)}
                      placeholder="https://pinterest.com/yourboard"
                      className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3E2B25] mb-1">YouTube Channel URL</label>
                    <input
                      type="url"
                      value={formData.contact?.youtubeUrl || ''}
                      onChange={(e) => handleFieldChange('contact', 'youtubeUrl', e.target.value)}
                      placeholder="https://youtube.com/@yourchannel"
                      className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25]"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* 5. ORDERS & CUSTOM ORDERS */}
          {/* ========================================================================= */}
          {activeSection === 'orders' && (
            <div className="space-y-6">
              
              {/* Order Settings */}
              <div className="bg-white rounded-2xl p-6 border border-[#E9E2DC] shadow-sm space-y-4">
                <div className="border-b border-[#E9E2DC] pb-3">
                  <h3 className="font-serif font-bold text-base text-[#3E2B25]">General Order Settings</h3>
                  <p className="text-xs text-[#756A65]">Order prefix sequence, processing windows, and cancellation rules.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3E2B25] mb-1">Order ID Prefix</label>
                    <input
                      type="text"
                      value={formData.orders?.orderIdPrefix || 'SL-'}
                      onChange={(e) => handleFieldChange('orders', 'orderIdPrefix', e.target.value)}
                      className="w-full text-xs font-mono p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3E2B25] mb-1">Starting Order Number</label>
                    <input
                      type="number"
                      value={formData.orders?.startingOrderNumber || 1001}
                      onChange={(e) => handleFieldChange('orders', 'startingOrderNumber', parseInt(e.target.value))}
                      className="w-full text-xs font-mono p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3E2B25] mb-1">Default Processing Time</label>
                    <input
                      type="text"
                      value={formData.orders?.defaultProcessingTime || '3–5 business days'}
                      onChange={(e) => handleFieldChange('orders', 'defaultProcessingTime', e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-[#E9E2DC]">
                  <div className="flex items-center justify-between p-3 bg-[#F8F6F3] rounded-xl border border-[#E9E2DC]">
                    <div>
                      <span className="text-xs font-bold text-[#3E2B25] block">Allow Guest Checkout</span>
                      <span className="text-[10px] text-[#756A65]">Customers can order without signing in</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.orders?.allowGuestCheckout ?? true}
                      onChange={(e) => handleFieldChange('orders', 'allowGuestCheckout', e.target.checked)}
                      className="w-4 h-4 accent-[#D96C65] rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-[#F8F6F3] rounded-xl border border-[#E9E2DC]">
                    <div>
                      <span className="text-xs font-bold text-[#3E2B25] block">Allow Order Cancellation</span>
                      <span className="text-[10px] text-[#756A65]">Window: {formData.orders?.cancellationWindowHours || 24}h after placement</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.orders?.allowOrderCancellation ?? true}
                      onChange={(e) => handleFieldChange('orders', 'allowOrderCancellation', e.target.checked)}
                      className="w-4 h-4 accent-[#D96C65] rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Custom Order Settings */}
              <div className="bg-white rounded-2xl p-6 border border-[#E9E2DC] shadow-sm space-y-4">
                <div className="border-b border-[#E9E2DC] pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#3E2B25]">Custom Commission Settings</h3>
                    <p className="text-xs text-[#756A65]">Configure bespoke inquiry workflow, processing time and required customer fields.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.customOrders?.enableCustomOrders ?? true}
                      onChange={(e) => handleFieldChange('customOrders', 'enableCustomOrders', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4F9D69]"></div>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3E2B25] mb-1">
                      Default Custom Order Processing Time
                    </label>
                    <input
                      type="text"
                      value={formData.customOrders?.defaultProcessingTime || '7–10 days'}
                      onChange={(e) => handleFieldChange('customOrders', 'defaultProcessingTime', e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3E2B25] mb-1">
                      Minimum Custom Order Value (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.customOrders?.minimumOrderValue || 0}
                      onChange={(e) => handleFieldChange('customOrders', 'minimumOrderValue', parseFloat(e.target.value))}
                      className="w-full text-xs font-mono p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC]"
                    />
                  </div>
                </div>

                {/* Required Fields Checkboxes */}
                <div className="space-y-2 pt-2 border-t border-[#E9E2DC]">
                  <span className="text-xs font-bold text-[#3E2B25] block">
                    Required Custom Order Form Fields:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { key: 'referenceImage', label: 'Reference Image' },
                      { key: 'preferredColor', label: 'Preferred Color' },
                      { key: 'size', label: 'Size Dimensions' },
                      { key: 'quantity', label: 'Quantity' },
                      { key: 'requiredDate', label: 'Required Date' },
                      { key: 'budget', label: 'Target Budget' },
                      { key: 'specialInstructions', label: 'Special Notes' }
                    ].map(fld => (
                      <label key={fld.key} className="flex items-center gap-2 p-2 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-xs cursor-pointer hover:border-[#D96C65]">
                        <input
                          type="checkbox"
                          checked={formData.customOrders?.requiredFields?.[fld.key] ?? true}
                          onChange={(e) => handleNestedFieldChange('customOrders', 'requiredFields', fld.key, e.target.checked)}
                          className="w-3.5 h-3.5 accent-[#D96C65] rounded"
                        />
                        <span className="text-[#3E2B25] font-medium">{fld.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* 6. SHIPPING SETTINGS */}
          {/* ========================================================================= */}
          {activeSection === 'shipping' && (
            <div className="space-y-6">
              
              <div className="bg-white rounded-2xl p-6 border border-[#E9E2DC] shadow-sm space-y-6">
                <div className="border-b border-[#E9E2DC] pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#3E2B25]">Shipping Rates & Tiers (India)</h3>
                    <p className="text-xs text-[#756A65]">Configure standard dispatch, free delivery thresholds and express shipping.</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#4F9D69] bg-[#4F9D69]/10 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Shipping Enabled</span>
                  </div>
                </div>

                {/* Free Shipping Tier */}
                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-emerald-900 block">✨ Free Delivery Threshold</span>
                      <p className="text-[11px] text-emerald-700">Orders above this subtotal qualify for 100% free delivery across India.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.shipping?.enableFreeShipping ?? true}
                        onChange={(e) => handleFieldChange('shipping', 'enableFreeShipping', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4F9D69]"></div>
                    </label>
                  </div>

                  {formData.shipping?.enableFreeShipping && (
                    <div className="w-48">
                      <label className="block text-[11px] font-bold text-emerald-900 mb-1">Free Shipping on Orders Above (₹)</label>
                      <input
                        type="number"
                        value={formData.shipping?.freeShippingThreshold || 999}
                        onChange={(e) => handleFieldChange('shipping', 'freeShippingThreshold', parseFloat(e.target.value))}
                        className="w-full text-xs font-mono font-bold p-2 rounded-xl bg-white border border-emerald-300 text-emerald-900"
                      />
                    </div>
                  )}
                </div>

                {/* Standard Shipping */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#F8F6F3] rounded-2xl border border-[#E9E2DC]">
                  <div>
                    <label className="block text-xs font-bold text-[#3E2B25] mb-1">Standard Shipping Charge (₹)</label>
                    <input
                      type="number"
                      value={formData.shipping?.standardCharge || 80}
                      onChange={(e) => handleFieldChange('shipping', 'standardCharge', parseFloat(e.target.value))}
                      className="w-full text-xs font-mono p-2.5 rounded-xl bg-white border border-[#E9E2DC]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#3E2B25] mb-1">Standard Estimated Delivery</label>
                    <input
                      type="text"
                      value={formData.shipping?.standardEstimatedDelivery || '3–7 business days'}
                      onChange={(e) => handleFieldChange('shipping', 'standardEstimatedDelivery', e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl bg-white border border-[#E9E2DC]"
                    />
                  </div>
                </div>

                {/* Express Shipping */}
                <div className="p-4 bg-[#F8F6F3] rounded-2xl border border-[#E9E2DC] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#3E2B25]">⚡ Express Delivery</span>
                    <input
                      type="checkbox"
                      checked={formData.shipping?.enableExpressShipping ?? true}
                      onChange={(e) => handleFieldChange('shipping', 'enableExpressShipping', e.target.checked)}
                      className="w-4 h-4 accent-[#D96C65] rounded"
                    />
                  </div>
                  {formData.shipping?.enableExpressShipping && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-[#3E2B25] mb-1">Express Charge (₹)</label>
                        <input
                          type="number"
                          value={formData.shipping?.expressCharge || 150}
                          onChange={(e) => handleFieldChange('shipping', 'expressCharge', parseFloat(e.target.value))}
                          className="w-full text-xs font-mono p-2 rounded-xl bg-white border border-[#E9E2DC]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#3E2B25] mb-1">Express Estimated Days</label>
                        <input
                          type="text"
                          value={formData.shipping?.expressEstimatedDelivery || '1–3 business days'}
                          onChange={(e) => handleFieldChange('shipping', 'expressEstimatedDelivery', e.target.value)}
                          className="w-full text-xs p-2 rounded-xl bg-white border border-[#E9E2DC]"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Cash on Delivery (COD) */}
                <div className="p-4 bg-[#F8F6F3] rounded-2xl border border-[#E9E2DC] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#3E2B25]">💵 Cash on Delivery (COD) Rules</span>
                    <input
                      type="checkbox"
                      checked={formData.shipping?.enableCOD ?? true}
                      onChange={(e) => handleFieldChange('shipping', 'enableCOD', e.target.checked)}
                      className="w-4 h-4 accent-[#D96C65] rounded"
                    />
                  </div>
                  {formData.shipping?.enableCOD && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-[#3E2B25] mb-1">Max COD Order Value (₹)</label>
                        <input
                          type="number"
                          value={formData.shipping?.maxCODValue || 3000}
                          onChange={(e) => handleFieldChange('shipping', 'maxCODValue', parseFloat(e.target.value))}
                          className="w-full text-xs font-mono p-2 rounded-xl bg-white border border-[#E9E2DC]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#3E2B25] mb-1">Additional COD Handling Charge (₹)</label>
                        <input
                          type="number"
                          value={formData.shipping?.codCharge || 0}
                          onChange={(e) => handleFieldChange('shipping', 'codCharge', parseFloat(e.target.value))}
                          className="w-full text-xs font-mono p-2 rounded-xl bg-white border border-[#E9E2DC]"
                        />
                      </div>
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* 7. PAYMENT SETTINGS */}
          {/* ========================================================================= */}
          {activeSection === 'payments' && (
            <div className="space-y-6">
              
              <div className="bg-white rounded-2xl p-6 border border-[#E9E2DC] shadow-sm space-y-6">
                <div className="border-b border-[#E9E2DC] pb-3">
                  <h3 className="font-serif font-bold text-base text-[#3E2B25]">Payment Gateway & Methods</h3>
                  <p className="text-xs text-[#756A65]">Configure Razorpay, UPI QR, COD, and bank transfer credentials securely.</p>
                </div>

                {/* Enabled Methods Checkboxes */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#3E2B25] block">Accepted Payment Methods:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { key: 'razorpay', label: '💳 Razorpay (Cards/NetBanking)' },
                      { key: 'upi', label: '⚡ UPI / QR Instant' },
                      { key: 'cod', label: '💵 Cash on Delivery' },
                      { key: 'bankTransfer', label: '🏦 Manual Bank Transfer' }
                    ].map(meth => (
                      <label key={meth.key} className="flex items-center gap-2 p-3 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-xs cursor-pointer hover:border-[#D96C65]">
                        <input
                          type="checkbox"
                          checked={formData.payments?.enabledMethods?.[meth.key] ?? true}
                          onChange={(e) => handleNestedFieldChange('payments', 'enabledMethods', meth.key, e.target.checked)}
                          className="w-4 h-4 accent-[#D96C65] rounded"
                        />
                        <span className="font-medium text-[#3E2B25]">{meth.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Razorpay Credentials Card */}
                <div className="p-5 bg-[#F8F6F3] rounded-2xl border border-[#E9E2DC] space-y-4">
                  <div className="flex items-center justify-between border-b border-[#E9E2DC] pb-3">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-[#D96C65]" />
                      <div>
                        <h4 className="text-xs font-bold text-[#3E2B25]">Razorpay Configuration</h4>
                        <span className="text-[10px] text-[#756A65]">Production API keys for secure customer payments</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#4F9D69]/10 text-[#4F9D69]">
                      <span className="w-2 h-2 rounded-full bg-[#4F9D69]" />
                      <span>Ready</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#3E2B25] mb-1">Razorpay Key ID</label>
                      <input
                        type="text"
                        value={formData.payments?.razorpay?.keyId || ''}
                        onChange={(e) => handleNestedFieldChange('payments', 'razorpay', 'keyId', e.target.value)}
                        placeholder="rzp_live_..."
                        className="w-full text-xs font-mono p-2.5 rounded-xl bg-white border border-[#E9E2DC]"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-[#3E2B25]">Razorpay Key Secret</label>
                        <button
                          type="button"
                          onClick={() => setShowSecretInput(!showSecretInput)}
                          className="text-[10px] font-bold text-[#D96C65] hover:underline"
                        >
                          {showSecretInput ? 'Cancel' : 'Update Secret'}
                        </button>
                      </div>

                      {showSecretInput ? (
                        <input
                          type="password"
                          value={newSecretKey}
                          onChange={(e) => setNewSecretKey(e.target.value)}
                          placeholder="Enter new secret key"
                          className="w-full text-xs font-mono p-2.5 rounded-xl bg-white border border-[#D96C65] focus:outline-none"
                        />
                      ) : (
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E9E2DC] text-xs font-mono text-[#756A65]">
                          <span>••••••••••••••••</span>
                          <Lock className="w-3.5 h-3.5 text-[#756A65]" />
                        </div>
                      )}
                    </div>
                  </div>

                  {paymentTestResult && (
                    <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                      paymentTestResult.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      {paymentTestResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-rose-600" />}
                      <span>{paymentTestResult.message}</span>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleTestPayment}
                      disabled={paymentTesting}
                      className="px-4 py-2 bg-white hover:bg-gray-50 border border-[#E9E2DC] text-[#3E2B25] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-[#4F9D69]" />
                      <span>{paymentTesting ? 'Testing connection...' : 'Test Connection'}</span>
                    </button>
                  </div>
                </div>

                {/* UPI VPA */}
                <div className="p-4 bg-[#F8F6F3] rounded-2xl border border-[#E9E2DC] space-y-2">
                  <span className="text-xs font-bold text-[#3E2B25] block">Direct UPI VPA ID</span>
                  <input
                    type="text"
                    value={formData.payments?.upi?.vpa || 'stitchandlove@upi'}
                    onChange={(e) => handleNestedFieldChange('payments', 'upi', 'vpa', e.target.value)}
                    placeholder="e.g. yourstore@okaxis"
                    className="w-full text-xs font-mono p-2.5 rounded-xl bg-white border border-[#E9E2DC]"
                  />
                </div>

              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* 8. TAX SETTINGS */}
          {/* ========================================================================= */}
          {activeSection === 'taxes' && (
            <div className="bg-white rounded-2xl p-6 border border-[#E9E2DC] shadow-sm space-y-6">
              <div className="border-b border-[#E9E2DC] pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-base text-[#3E2B25]">Tax & GST Settings</h3>
                  <p className="text-xs text-[#756A65]">Configure automated GST calculations on domestic Indian orders.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.taxes?.enableTaxes ?? false}
                    onChange={(e) => handleFieldChange('taxes', 'enableTaxes', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4F9D69]"></div>
                </label>
              </div>

              {formData.taxes?.enableTaxes ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#3E2B25] mb-1">Tax Type</label>
                      <input
                        type="text"
                        value={formData.taxes?.taxType || 'GST'}
                        onChange={(e) => handleFieldChange('taxes', 'taxType', e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#3E2B25] mb-1">Default Tax Rate (%)</label>
                      <input
                        type="number"
                        value={formData.taxes?.defaultTaxRate || 5}
                        onChange={(e) => handleFieldChange('taxes', 'defaultTaxRate', parseFloat(e.target.value))}
                        className="w-full text-xs font-mono p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#3E2B25] mb-1">Business GSTIN</label>
                      <input
                        type="text"
                        value={formData.taxes?.businessGstin || ''}
                        onChange={(e) => handleFieldChange('taxes', 'businessGstin', e.target.value.toUpperCase())}
                        placeholder="29AAAAA0000A1Z5"
                        className="w-full text-xs font-mono p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-[#F8F6F3] rounded-xl border border-[#E9E2DC]">
                    <input
                      type="checkbox"
                      checked={formData.taxes?.productOverride ?? false}
                      onChange={(e) => handleFieldChange('taxes', 'productOverride', e.target.checked)}
                      className="w-4 h-4 accent-[#D96C65] rounded"
                    />
                    <span className="text-xs text-[#3E2B25] font-medium">Allow individual products to override the default tax rate</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-[#F8F6F3] rounded-xl text-xs text-[#756A65] flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#756A65]" />
                  <span>Taxes are currently turned off. Prices shown to customers will be all-inclusive.</span>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 9. NOTIFICATIONS */}
          {/* ========================================================================= */}
          {activeSection === 'notifications' && (
            <div className="bg-white rounded-2xl p-6 border border-[#E9E2DC] shadow-sm space-y-6">
              <div className="border-b border-[#E9E2DC] pb-3">
                <h3 className="font-serif font-bold text-base text-[#3E2B25]">Admin Notification Preferences</h3>
                <p className="text-xs text-[#756A65]">Control which store events trigger dashboard bells, emails, or WhatsApp alerts.</p>
              </div>

              {/* Event Toggles */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#3E2B25] block">Notify me on:</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { key: 'newOrder', label: '🛍️ New Order Placed' },
                    { key: 'newCustomOrder', label: '🎨 New Custom Commission Request' },
                    { key: 'newEnquiry', label: '💬 New Contact / Message' },
                    { key: 'lowStock', label: '⚠️ Inventory Low Stock Alert' },
                    { key: 'paymentReceived', label: '💳 Payment Successfully Received' },
                    { key: 'paymentFailed', label: '❌ Payment Failed / Abandoned' },
                    { key: 'orderCancelled', label: '🚫 Order Cancelled by Customer' },
                    { key: 'newCustomer', label: '👤 New Customer Account Registered' }
                  ].map(evt => (
                    <label key={evt.key} className="flex items-center justify-between p-3 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-xs cursor-pointer hover:border-[#D96C65]">
                      <span className="font-medium text-[#3E2B25]">{evt.label}</span>
                      <input
                        type="checkbox"
                        checked={formData.notifications?.events?.[evt.key] ?? true}
                        onChange={(e) => handleNestedFieldChange('notifications', 'events', evt.key, e.target.checked)}
                        className="w-4 h-4 accent-[#D96C65] rounded"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Channels & Low Stock Threshold */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#E9E2DC]">
                <div className="p-4 bg-[#F8F6F3] rounded-xl border border-[#E9E2DC] space-y-2">
                  <span className="text-xs font-bold text-[#3E2B25] block">Notification Channels:</span>
                  <div className="space-y-2">
                    {['email', 'whatsapp', 'inDashboard'].map(ch => (
                      <label key={ch} className="flex items-center gap-2 text-xs text-[#3E2B25] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.notifications?.channels?.[ch] ?? true}
                          onChange={(e) => handleNestedFieldChange('notifications', 'channels', ch, e.target.checked)}
                          className="w-3.5 h-3.5 accent-[#D96C65] rounded"
                        />
                        <span className="capitalize">{ch.replace('inDashboard', 'In-Dashboard Feed')}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-[#F8F6F3] rounded-xl border border-[#E9E2DC] space-y-2">
                  <span className="text-xs font-bold text-[#3E2B25] block">Low Stock Alert Threshold</span>
                  <p className="text-[11px] text-[#756A65]">Alert triggered when product units drop to or below:</p>
                  <input
                    type="number"
                    value={formData.notifications?.lowStockThreshold || 3}
                    onChange={(e) => handleFieldChange('notifications', 'lowStockThreshold', parseInt(e.target.value))}
                    className="w-24 text-xs font-mono font-bold p-2 rounded-xl bg-white border border-[#E9E2DC]"
                  />
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* 10. CUSTOMER ACCOUNTS */}
          {/* ========================================================================= */}
          {activeSection === 'customers' && (
            <div className="bg-white rounded-2xl p-6 border border-[#E9E2DC] shadow-sm space-y-6">
              <div className="border-b border-[#E9E2DC] pb-3">
                <h3 className="font-serif font-bold text-base text-[#3E2B25]">Customer Account Preferences</h3>
                <p className="text-xs text-[#756A65]">Control authentication methods, guest checkout permissions and customer profiles.</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#F8F6F3] rounded-2xl border border-[#E9E2DC]">
                  <div>
                    <span className="text-xs font-bold text-[#3E2B25] block">Enable Customer Accounts</span>
                    <span className="text-[11px] text-[#756A65]">Allow shoppers to register and save delivery addresses</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.customers?.enableAccounts ?? true}
                    onChange={(e) => handleFieldChange('customers', 'enableAccounts', e.target.checked)}
                    className="w-4 h-4 accent-[#D96C65] rounded"
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-[#3E2B25] block">Allowed Login Methods:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { key: 'emailPassword', label: '✉️ Email + Password' },
                      { key: 'phoneOtp', label: '📱 Mobile Phone + OTP' },
                      { key: 'google', label: '🌐 Google 1-Click' }
                    ].map(m => (
                      <label key={m.key} className="flex items-center gap-2 p-3 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-xs cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.customers?.loginMethods?.[m.key] ?? true}
                          onChange={(e) => handleNestedFieldChange('customers', 'loginMethods', m.key, e.target.checked)}
                          className="w-4 h-4 accent-[#D96C65] rounded"
                        />
                        <span className="font-medium text-[#3E2B25]">{m.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* 11. SEO & SEARCH ENGINE */}
          {/* ========================================================================= */}
          {activeSection === 'seo' && (
            <div className="bg-white rounded-2xl p-6 border border-[#E9E2DC] shadow-sm space-y-6">
              <div className="border-b border-[#E9E2DC] pb-3">
                <h3 className="font-serif font-bold text-base text-[#3E2B25]">Search Engine Optimization (SEO)</h3>
                <p className="text-xs text-[#756A65]">Configure meta titles, OpenGraph social sharing previews, and Google indexing.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#3E2B25] mb-1">
                    Default Meta Title
                  </label>
                  <input
                    type="text"
                    value={formData.seo?.metaTitle || ''}
                    onChange={(e) => handleFieldChange('seo', 'metaTitle', e.target.value)}
                    placeholder="Stitch & Love | Handmade Crochet Creations & Forever Blooms"
                    className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3E2B25] mb-1">
                    Default Meta Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.seo?.metaDescription || ''}
                    onChange={(e) => handleFieldChange('seo', 'metaDescription', e.target.value)}
                    placeholder="Discover beautiful handmade crochet flowers, bags, and gifts..."
                    className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3E2B25] mb-1">
                    Meta Keywords (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.seo?.keywords || ''}
                    onChange={(e) => handleFieldChange('seo', 'keywords', e.target.value)}
                    placeholder="crochet flowers, handmade bouquet, amigurumi plushies, gifts india"
                    className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC]"
                  />
                </div>

                {/* Social Card Preview */}
                <div className="p-4 bg-[#F8F6F3] rounded-2xl border border-[#E9E2DC] space-y-3">
                  <span className="text-xs font-bold text-[#3E2B25] block">Social Media Share Preview (OpenGraph Card)</span>
                  <div className="max-w-md bg-white rounded-xl border border-[#E9E2DC] overflow-hidden shadow-xs">
                    <img
                      src={formData.seo?.ogImage || '/images/blossom-pots-collection.jpeg'}
                      alt="OG Preview"
                      className="w-full h-36 object-cover"
                    />
                    <div className="p-3">
                      <span className="text-[10px] uppercase font-bold text-[#756A65] block">stitchandlove.com</span>
                      <h4 className="text-xs font-bold text-[#3E2B25] mt-0.5 line-clamp-1">{formData.seo?.metaTitle}</h4>
                      <p className="text-[11px] text-[#756A65] line-clamp-2 mt-0.5">{formData.seo?.metaDescription}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#F8F6F3] rounded-xl border border-[#E9E2DC]">
                  <div>
                    <span className="text-xs font-bold text-[#3E2B25] block">Search Engine Indexing</span>
                    <span className="text-[10px] text-[#756A65]">Allow Google and search bots to index the store</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.seo?.allowIndexing ?? true}
                    onChange={(e) => handleFieldChange('seo', 'allowIndexing', e.target.checked)}
                    className="w-4 h-4 accent-[#D96C65] rounded"
                  />
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* 12. LEGAL PAGES */}
          {/* ========================================================================= */}
          {activeSection === 'legal' && (
            <div className="bg-white rounded-2xl p-6 border border-[#E9E2DC] shadow-sm space-y-6">
              <div className="border-b border-[#E9E2DC] pb-3">
                <h3 className="font-serif font-bold text-base text-[#3E2B25]">Store Legal & Compliance Policies</h3>
                <p className="text-xs text-[#756A65]">Manage customer legal documents required for Indian e-commerce transparency.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'privacyPolicy', title: 'Privacy Policy', desc: 'Customer data protection & cookie usage' },
                  { key: 'termsAndConditions', title: 'Terms & Conditions', desc: 'Studio order terms and user agreement' },
                  { key: 'shippingPolicy', title: 'Shipping & Delivery Policy', desc: 'Dispatch timelines across India' },
                  { key: 'refundPolicy', title: 'Return & Refund Policy', desc: 'Custom crafted item returns criteria' },
                  { key: 'cancellationPolicy', title: 'Cancellation Policy', desc: '24-hour pre-crafting cancellation rules' },
                  { key: 'customOrderPolicy', title: 'Custom Commission Policy', desc: 'Bespoke design revisions and deposit terms' }
                ].map(p => {
                  const policyStatus = formData.legal?.[p.key]?.status || 'Published';
                  return (
                    <div key={p.key} className="p-4 rounded-2xl bg-[#F8F6F3] border border-[#E9E2DC] flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-[#3E2B25]">{p.title}</h4>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            {policyStatus}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#756A65] mt-0.5">{p.desc}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingLegalPolicy(p.title);
                          setLegalPolicyContent(`Official ${p.title} for Stitch & Love Handmade Studio.\n\nAll pieces are slow-stitched and shipped with care across India.`);
                        }}
                        className="p-2 rounded-xl bg-white hover:bg-gray-100 border border-[#E9E2DC] text-[#3E2B25] text-xs font-semibold flex items-center gap-1 shadow-2xs"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#D96C65]" />
                        <span>Edit</span>
                      </button>
                    </div>
                  );
                })}
              </div>

              {editingLegalPolicy && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                  <div className="bg-white rounded-2xl p-6 max-w-xl w-full space-y-4 border border-[#E9E2DC] shadow-2xl animate-in zoom-in-95">
                    <div className="flex items-center justify-between border-b border-[#E9E2DC] pb-3">
                      <h3 className="font-serif font-bold text-base text-[#3E2B25]">Edit {editingLegalPolicy}</h3>
                      <button
                        type="button"
                        onClick={() => setEditingLegalPolicy(null)}
                        className="p-1 rounded-lg hover:bg-gray-100 text-[#756A65]"
                      >
                        ✕
                      </button>
                    </div>

                    <textarea
                      rows={8}
                      value={legalPolicyContent}
                      onChange={(e) => setLegalPolicyContent(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] text-[#3E2B25] font-sans focus:outline-none"
                    />

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingLegalPolicy(null)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#F8F6F3] text-[#3E2B25]"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          addToast(`${editingLegalPolicy} content updated!`, 'success');
                          setEditingLegalPolicy(null);
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#D96C65] text-white"
                      >
                        Save Policy
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ========================================================================= */}
          {/* 13. MAINTENANCE MODE */}
          {/* ========================================================================= */}
          {activeSection === 'maintenance' && (
            <div className="bg-white rounded-2xl p-6 border border-[#E9E2DC] shadow-sm space-y-6">
              <div className="border-b border-[#E9E2DC] pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-base text-[#3E2B25]">Store Maintenance Mode</h3>
                  <p className="text-xs text-[#756A65]">Temporarily disable customer storefront for maintenance or inventory updates.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!formData.maintenance?.enabled) {
                      setMaintenanceConfirmOpen(true);
                    } else {
                      handleFieldChange('maintenance', 'enabled', false);
                      addToast('Maintenance mode disabled. Storefront is live! 🌸', 'success');
                    }
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                    formData.maintenance?.enabled
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-[#F8F6F3] hover:bg-amber-100 text-amber-900 border border-amber-300'
                  }`}
                >
                  {formData.maintenance?.enabled ? 'Turn OFF Maintenance' : 'Turn ON Maintenance'}
                </button>
              </div>

              {formData.maintenance?.enabled && (
                <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 space-y-3">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>Storefront is currently in Maintenance Mode for non-admin visitors</span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-rose-900 mb-1">
                      Customer Maintenance Notice:
                    </label>
                    <textarea
                      rows={3}
                      value={formData.maintenance?.message || ''}
                      onChange={(e) => handleFieldChange('maintenance', 'message', e.target.value)}
                      placeholder="We're preparing something beautiful. Please check back soon."
                      className="w-full text-xs p-2.5 rounded-xl bg-white border border-rose-300 text-[#3E2B25]"
                    />
                  </div>
                </div>
              )}

              {/* Maintenance Confirmation Dialog */}
              {maintenanceConfirmOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                  <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 border border-[#E9E2DC] shadow-2xl text-center animate-in zoom-in-95">
                    <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-serif font-bold text-[#3E2B25]">
                      Enable Maintenance Mode?
                    </h3>
                    <p className="text-xs text-[#756A65] leading-relaxed">
                      Turning on maintenance mode will make the storefront unavailable to customers while you update your catalog.
                    </p>
                    <div className="flex gap-2.5 pt-2">
                      <button
                        type="button"
                        onClick={() => setMaintenanceConfirmOpen(false)}
                        className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-[#F8F6F3] text-[#3E2B25] border border-[#E9E2DC]"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleFieldChange('maintenance', 'enabled', true);
                          setMaintenanceConfirmOpen(false);
                          addToast('Maintenance mode enabled.', 'info');
                        }}
                        className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white"
                      >
                        Enable Maintenance
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ========================================================================= */}
          {/* 14. CRAFTING & PRODUCTION DEFAULTS */}
          {/* ========================================================================= */}
          {activeSection === 'crafting' && (
            <div className="bg-white rounded-2xl p-6 border border-[#E9E2DC] shadow-sm space-y-6">
              <div className="border-b border-[#E9E2DC] pb-3">
                <h3 className="font-serif font-bold text-base text-[#3E2B25]">Crochet Crafting & Production Defaults</h3>
                <p className="text-xs text-[#756A65]">Slow-fashion production times, raw material tracking, and replenishment triggers.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#3E2B25] mb-1">
                    Default Crafting Time (Hours)
                  </label>
                  <input
                    type="number"
                    value={formData.crafting?.defaultCraftingTimeHours || 4}
                    onChange={(e) => handleFieldChange('crafting', 'defaultCraftingTimeHours', parseInt(e.target.value))}
                    className="w-full text-xs font-mono p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3E2B25] mb-1">
                    Default Processing Time (Days)
                  </label>
                  <input
                    type="text"
                    value={formData.crafting?.defaultProcessingDays || '3–5 days'}
                    onChange={(e) => handleFieldChange('crafting', 'defaultProcessingDays', e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3E2B25] mb-1">
                    Custom Order Production Time
                  </label>
                  <input
                    type="text"
                    value={formData.crafting?.defaultCustomOrderDays || '7–10 days'}
                    onChange={(e) => handleFieldChange('crafting', 'defaultCustomOrderDays', e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-[#E9E2DC]">
                <div className="flex items-center justify-between p-3.5 bg-[#F8F6F3] rounded-xl border border-[#E9E2DC]">
                  <div>
                    <span className="text-xs font-bold text-[#3E2B25] block">Raw Material Inventory Tracking</span>
                    <span className="text-[10px] text-[#756A65]">Track yarn skeins, stuffing, eyes and packaging</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.crafting?.trackRawMaterialInventory ?? true}
                    onChange={(e) => handleFieldChange('crafting', 'trackRawMaterialInventory', e.target.checked)}
                    className="w-4 h-4 accent-[#D96C65] rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-[#F8F6F3] rounded-xl border border-[#E9E2DC]">
                  <div>
                    <span className="text-xs font-bold text-[#3E2B25] block">Finished Product Stock Alerts</span>
                    <span className="text-[10px] text-[#756A65]">Trigger restock badge when stock &le; 3 units</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.crafting?.trackFinishedProductInventory ?? true}
                    onChange={(e) => handleFieldChange('crafting', 'trackFinishedProductInventory', e.target.checked)}
                    className="w-4 h-4 accent-[#D96C65] rounded"
                  />
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
