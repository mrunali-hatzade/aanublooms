import React, { useState } from 'react';
import { Sparkles, Maximize2 } from 'lucide-react';

export const ImageGallery = ({ images = [], productName = 'Crochet Piece' }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const activeImage = images[selectedIndex] || 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=800&q=80';

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="space-y-4">
      {/* Main Image Frame with Zoom */}
      <div
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
        className="relative aspect-square w-full rounded-3xl overflow-hidden bg-warmgray-100 dark:bg-warmgray-800 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft-lg cursor-crosshair group"
      >
        <img
          src={activeImage}
          alt={productName}
          className="w-full h-full object-cover transition-transform duration-200 ease-out"
          style={
            isZoomed
              ? {
                  transform: 'scale(1.8)',
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`
                }
              : { transform: 'scale(1)' }
          }
        />
        
        {/* Floating Zoom Hint */}
        <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-white text-[11px] font-medium pointer-events-none flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Hover to inspect stitches</span>
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 transition-all ${
                selectedIndex === idx
                  ? 'border-bloom-500 ring-2 ring-bloom-300 dark:ring-bloom-800 scale-105 shadow-sm'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`${productName} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
