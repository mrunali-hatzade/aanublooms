import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll back to top"
      title="Go to top"
      className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-bloom-500 hover:bg-bloom-600 active:scale-95 text-white shadow-soft-lg border-2 border-white/80 dark:border-warmgray-800/80 backdrop-blur-xs transition-all duration-300 transform hover:-translate-y-1 group flex items-center justify-center animate-in fade-in zoom-in-75"
    >
      <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
      <span className="sr-only">Go to top</span>
    </button>
  );
};
