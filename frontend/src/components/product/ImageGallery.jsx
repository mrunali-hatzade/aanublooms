import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Sparkles, X } from 'lucide-react';

export const ImageGallery = ({ images = [], productName = 'Crochet Piece' }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomMode, setIsZoomMode] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const activeImage = images[selectedIndex] || 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=800&q=80';

  const handleMouseMove = (e) => {
    if (!isZoomMode) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const toggleZoom = () => {
    setIsZoomMode(!isZoomMode);
  };

  return (
    <div className="space-y-4">
      
      {/* Main Image Frame (Full uncropped view by default) */}
      <div
        onClick={toggleZoom}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isZoomMode && setIsZoomMode(false)}
        className={`relative aspect-square w-full rounded-3xl overflow-hidden bg-[#FAF7F2] dark:bg-warmgray-900 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft-lg transition-all ${
          isZoomMode ? 'cursor-zoom-out' : 'cursor-zoom-in'
        } flex items-center justify-center p-2 sm:p-4 group`}
      >
        <img
          src={activeImage}
          alt={productName}
          className={`w-full h-full object-contain transition-transform duration-200 ease-out`}
          style={
            isZoomMode
              ? {
                  transform: 'scale(2.2)',
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`
                }
              : { transform: 'scale(1)' }
          }
        />
        
        {/* Floating Manual Zoom Toggle Button (Click to Zoom) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleZoom();
          }}
          className="absolute bottom-4 right-4 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-warmgray-900/90 text-warmgray-900 dark:text-white backdrop-blur-md text-xs font-bold shadow-md flex items-center gap-1.5 hover:bg-white transition-all transform hover:scale-105"
        >
          {isZoomMode ? (
            <>
              <ZoomOut className="w-3.5 h-3.5 text-bloom-600" />
              <span>Reset View</span>
            </>
          ) : (
            <>
              <ZoomIn className="w-3.5 h-3.5 text-bloom-600" />
              <span>Click to Zoom</span>
            </>
          )}
        </button>

        {isZoomMode && (
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium pointer-events-none animate-in fade-in">
            Move mouse to inspect yarn stitches · Click to exit
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedIndex(idx);
                setIsZoomMode(false);
              }}
              className={`relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 bg-[#FAF7F2] dark:bg-warmgray-800 transition-all p-1 ${
                selectedIndex === idx
                  ? 'border-bloom-500 ring-2 ring-bloom-300 dark:ring-bloom-800 scale-105 shadow-sm'
                  : 'border-warmgray-200 dark:border-warmgray-700 opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`${productName} thumbnail ${idx + 1}`} className="w-full h-full object-contain" />
            </button>
          ))}
        </div>
      )}

    </div>
  );
};
