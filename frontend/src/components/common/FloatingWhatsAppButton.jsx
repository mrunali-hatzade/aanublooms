import React from 'react';
import { MessageCircle } from 'lucide-react';

export const FloatingWhatsAppButton = () => {
  const whatsappUrl = 'https://wa.me/919579162154?text=' + encodeURIComponent('🌸 Hi Aanu, I am visiting aanublooms.in and would love to know more about your handcrafted floral pieces!');

  return (
    <aside
      aria-label="WhatsApp Support"
      className="fixed bottom-6 left-6 z-40 group flex items-center"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp +91 95791 62154"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-lg shadow-[#25D366]/30 border-2 border-white dark:border-warmgray-800 transition-all duration-300 transform hover:scale-110 active:scale-95"
      >
        {/* Pulse effect */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none" />

        {/* WhatsApp Icon */}
        <MessageCircle className="w-7 h-7 fill-white/20 text-white relative z-10" />

        {/* Online Indicator */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-300 border-2 border-white dark:border-warmgray-800 rounded-full" />
      </a>

      {/* Floating Hover Badge */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden sm:flex items-center gap-2 ml-3 px-3.5 py-2 rounded-full bg-white dark:bg-warmgray-900 text-warmgray-800 dark:text-warmgray-100 text-xs font-bold border border-warmgray-200/80 dark:border-warmgray-700 shadow-md opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap"
      >
        <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
        <span>Chat on WhatsApp: +91 95791 62154</span>
      </a>
    </aside>
  );
};
