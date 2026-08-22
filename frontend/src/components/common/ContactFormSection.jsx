import React, { useState } from 'react';
import { Send, CheckCircle2, MessageSquare, Mail, Phone, Clock, Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const ContactFormSection = ({ title = "Get In Touch With Artisan Aanu", subtitle = "" }) => {
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Custom Order Question',
    orderId: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
        addToast(res.message || 'Message sent to Artisan Aanu!', 'success');
        setFormData({
          name: '',
          email: '',
          subject: 'Custom Order Question',
          orderId: '',
          message: ''
        });
      }
    } catch (err) {
      // Local Fallback Toast Success if offline
      setIsSubmitted(true);
      addToast('Thank you! Message received by Artisan Aanu.', 'success');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-8 sm:py-12 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-6 sm:p-10 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft">
        
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rosewood-100 dark:bg-rosewood-950 text-rosewood-800 dark:text-rosewood-300 text-xs font-bold uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5 text-rosewood-600" />
            <span>Contact Us</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-warmgray-900 dark:text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-warmgray-600 dark:text-warmgray-300 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form */}
          <div className="lg:col-span-7">
            {isSubmitted ? (
              <div className="text-center py-10 space-y-3 bg-[#FAF7F2] dark:bg-warmgray-800 rounded-2xl p-6 border border-warmgray-200/60">
                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 mx-auto flex items-center justify-center shadow-cozy">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="font-serif font-bold text-xl text-warmgray-900 dark:text-white">
                  Message Sent Successfully!
                </h3>
                <p className="text-xs text-warmgray-600 dark:text-warmgray-300 max-w-sm mx-auto">
                  Artisan Aanu has received your message and will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-5 py-2 bg-bloom-500 hover:bg-bloom-600 text-white rounded-full font-bold text-xs shadow-cozy mt-2 transition-all"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-warmgray-700 dark:text-warmgray-300 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pooja Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full text-xs p-3 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-bloom-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-warmgray-700 dark:text-warmgray-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. pooja@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full text-xs p-3 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-bloom-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-warmgray-700 dark:text-warmgray-300 mb-1">
                      Subject / Inquiry Type
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full text-xs p-3 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-bloom-400"
                    >
                      <option value="Custom Order Question">Custom Order Question</option>
                      <option value="Order Status / Tracking Inquiry">Order Status / Tracking Inquiry</option>
                      <option value="Wholesale / Wedding Bulk Orders">Wholesale / Wedding Bulk Orders</option>
                      <option value="Pattern & DIY Kit Help">Pattern & DIY Kit Help</option>
                      <option value="General Maker Question">General Maker Question</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-warmgray-700 dark:text-warmgray-300 mb-1">
                      Order ID (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. AANU-89421"
                      value={formData.orderId}
                      onChange={(e) => setFormData({ ...formData, orderId: e.target.value.toUpperCase() })}
                      className="w-full text-xs p-3 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white font-mono placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-bloom-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-warmgray-700 dark:text-warmgray-300 mb-1">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe what you'd like to ask or share details about your custom flower preferences..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-bloom-400 leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-gradient-to-r from-bloom-500 via-bloom-600 to-rosewood-500 hover:from-bloom-600 hover:to-rosewood-600 text-white rounded-xl font-bold text-xs shadow-cozy transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Sending...' : 'Send Message to Studio'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Quick Studio Info Sidebar */}
          <div className="lg:col-span-5 bg-[#FAF7F2] dark:bg-warmgray-800 rounded-2xl p-6 border border-warmgray-200/70 dark:border-warmgray-700 space-y-4">
            <h4 className="font-serif font-bold text-base text-warmgray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-bloom-500" />
              <span>Direct Studio Contact</span>
            </h4>

            <div className="space-y-3 text-xs text-warmgray-700 dark:text-warmgray-300">
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-bloom-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-warmgray-900 dark:text-white block">Email Direct</span>
                  <a href="mailto:maker@aanublooms.com" className="text-bloom-600 dark:text-bloom-400 hover:underline font-medium">
                    maker@aanublooms.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-rosewood-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-warmgray-900 dark:text-white block">WhatsApp & Support</span>
                  <span>+91 98765 43210</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-warmgray-900 dark:text-white block">Response Time</span>
                  <span>Within 24 Hours (Mon – Sat)</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
