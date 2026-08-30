import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Sparkles,
  Flower2,
  Heart,
  CheckCircle2,
  ChevronDown,
  MessageSquare,
  HelpCircle
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export const ContactPage = ({ onNavigate }) => {
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Custom Order Question',
    otherSubject: '',
    orderId: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      q: 'How long does it take to make my order?',
      a: 'Each AanuBlooms creation is handmade with care. Small items usually take 1–2 days, while flower pots, bouquets, and larger/custom orders may take 2–5 days depending on the design and quantity.'
    },
    {
      q: 'Can I choose the colours or customize my order?',
      a: 'Yes! You can request specific flower colours, combinations, sizes, or arrangements. Custom orders are welcome, subject to material availability.'
    },
    {
      q: 'How do I care for my handmade pipe-cleaner flowers?',
      a: "Our flowers don't need water or sunlight. Keep them indoors, away from excessive moisture and dust. Gently clean them with a soft brush or a light blow of air to keep them looking fresh."
    },
    {
      q: 'Are the flowers suitable for gifting?',
      a: "Absolutely! AanuBlooms creations make thoughtful gifts for birthdays, anniversaries, Valentine's Day, housewarmings, and other special occasions. You can also request a customized colour combination or arrangement to make your gift more personal."
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      addToast('Please fill in your name, email, and message', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.sendContactMessage(formData);
      if (res.success) {
        setIsSubmitted(true);
        addToast(res.message, 'success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: 'Custom Commission Question',
          orderId: '',
          message: ''
        });
      }
    } catch (err) {
      addToast(err.message || 'Could not send message', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Page Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 relative">
        {/* Ambient Subtle Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-bloom-100/40 dark:bg-bloom-950/20 rounded-full blur-3xl pointer-events-none animate-blob-drift" />
        
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rosewood-100 dark:bg-rosewood-950 text-rosewood-800 dark:text-rosewood-300 text-xs font-bold uppercase tracking-wider animate-bounce-subtle">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Get In Touch With Artisan Aanu</span>
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-warmgray-900 dark:text-white leading-tight">
          We’d Love to Hear From You
        </h1>
        <p className="text-sm sm:text-base text-warmgray-600 dark:text-warmgray-300 leading-relaxed">
          Have a question about an order, want to collaborate on a bespoke wedding bouquet, or just want to say hi? Reach out to our artisan studio!
        </p>
      </div>

      {/* Main Grid: Form & Studio Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Contact Form */}
        <div className="lg:col-span-7 bg-white dark:bg-warmgray-900 rounded-3xl p-6 sm:p-10 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft card-hover-3d transition-all duration-300">
          {isSubmitted ? (
            <div className="text-center py-12 space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 mx-auto flex items-center justify-center shadow-cozy animate-bounce-subtle">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif font-bold text-2xl text-warmgray-900 dark:text-white">
                Message Sent Successfully!
              </h3>
              <p className="text-xs sm:text-sm text-warmgray-600 dark:text-warmgray-300 max-w-sm mx-auto leading-relaxed">
                Thank you for reaching out! Artisan Aanu has received your inquiry and will respond to your email within <strong>24 hours</strong>.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="px-6 py-2.5 bg-bloom-500 hover:bg-bloom-600 text-white rounded-full font-bold text-xs shadow-cozy mt-4 btn-shimmer transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="font-serif font-bold text-xl text-warmgray-900 dark:text-white mb-2">
                Send a Note to the Studio
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-warmgray-700 dark:text-warmgray-300 mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pooja Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs p-3.5 rounded-2xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-bloom-400 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-warmgray-700 dark:text-warmgray-300 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. pooja@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs p-3.5 rounded-2xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-bloom-400 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-warmgray-700 dark:text-warmgray-300 mb-1.5">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs p-3.5 rounded-2xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-bloom-400 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-warmgray-700 dark:text-warmgray-300 mb-1.5">
                    Subject / Inquiry Type
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full text-xs p-3.5 rounded-2xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-bloom-400 transition-all"
                  >
                    <option value="Custom Order Question">Custom Order Question</option>
                    <option value="Order Status / Tracking Inquiry">Order Status / Tracking Inquiry</option>
                    <option value="Wholesale / Wedding Bulk Orders">Wholesale / Wedding Bulk Orders</option>
                    <option value="Pattern & DIY Kit Help">Pattern & DIY Kit Help</option>
                    <option value="General Maker Question">General Maker Question</option>
                  </select>
                </div>
              </div>

              <div className="w-full">
                <label className="block text-xs font-bold text-warmgray-700 dark:text-warmgray-300 mb-1.5">
                  How can we help? *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Share your custom flower preferences or any other questions here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full text-xs p-3.5 rounded-2xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-bloom-400 resize-y transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-bloom-500 via-bloom-600 to-rosewood-500 hover:from-bloom-600 hover:to-rosewood-600 text-white rounded-2xl font-bold text-sm shadow-cozy btn-shimmer transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                <span>{isSubmitting ? 'Sending to Aanu...' : 'Send Message to Studio'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Right: Studio Details & Guarantees */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Info Card */}
          <div className="bg-gradient-to-br from-bloom-50 via-rosewood-50/50 to-warmgray-50 dark:from-warmgray-900 dark:via-warmgray-900 dark:to-warmgray-850 rounded-3xl p-6 sm:p-8 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft space-y-6 card-hover-3d hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-bloom-500 text-white flex items-center justify-center shadow-cozy">
                <Flower2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-warmgray-900 dark:text-white">
                  AanuBlooms Studio
                </h3>
                <p className="text-[11px] text-bloom-600 dark:text-bloom-400 font-semibold">
                  Handmade Pipe Cleaner & Floral Boutique
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-warmgray-700 dark:text-warmgray-300">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-bloom-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-warmgray-900 dark:text-white block">Email Direct</span>
                  <a href="mailto:aanublooms@gmail.com" className="text-bloom-600 dark:text-bloom-400 hover:underline">
                    aanublooms@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-bloom-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-warmgray-900 dark:text-white block">WhatsApp / Call</span>
                  <a href="https://wa.me/919579162154" target="_blank" rel="noopener noreferrer" className="text-bloom-600 dark:text-bloom-400 hover:underline">
                    +91 95791 62154
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-warmgray-900 dark:text-white block">Location</span>
                  <span>Pune, India</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-warmgray-200 dark:border-warmgray-700/60 flex items-center gap-2 text-xs text-warmgray-500 dark:text-warmgray-400">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>We reply to all maker messages in less than 24 hours.</span>
            </div>
          </div>

          {/* Custom Commission Prompt Card */}
          <div className="p-6 rounded-3xl bg-warmgray-900 text-white shadow-soft space-y-3">
            <h4 className="font-serif font-bold text-base text-rose-100 flex items-center gap-2">
              <Heart className="w-4 h-4 text-rosewood-400 fill-rosewood-400" />
              <span>Looking for Custom Colors?</span>
            </h4>
            <p className="text-xs text-warmgray-300 leading-relaxed">
              Use our interactive commission builder to choose your own custom pipe cleaner color combinations, select flower varieties and stem lengths, and add personalized ribbon text with live pricing.
            </p>
            <button
              onClick={() => onNavigate('custom-order')}
              className="px-5 py-2.5 bg-rosewood-500 hover:bg-rosewood-600 text-white rounded-full font-bold text-xs transition-all shadow-xs"
            >
              Open Custom Design Builder ✨
            </button>
          </div>

        </div>

      </div>

      {/* Frequently Asked Questions Section */}
      <section className="pt-8 border-t border-warmgray-200 dark:border-warmgray-800">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bloom-100 dark:bg-bloom-950 text-bloom-800 dark:text-bloom-300 text-xs font-bold uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            Common Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-warmgray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-warmgray-900 rounded-2xl border border-warmgray-200/80 dark:border-warmgray-800 overflow-hidden shadow-xs"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left font-serif font-bold text-sm sm:text-base text-warmgray-900 dark:text-white transition-colors hover:text-bloom-600 dark:hover:text-bloom-400"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-warmgray-400 transition-transform duration-200 shrink-0 ml-3 ${
                    activeFaq === idx ? 'rotate-180 text-bloom-600' : ''
                  }`}
                />
              </button>
              {activeFaq === idx && (
                <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-warmgray-600 dark:text-warmgray-300 leading-relaxed border-t border-warmgray-100 dark:border-warmgray-800 pt-3 animate-in fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
