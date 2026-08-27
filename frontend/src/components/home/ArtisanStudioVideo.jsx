import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Sparkles, Heart, Flower2, ArrowRight } from 'lucide-react';

export const ArtisanStudioVideo = ({ onNavigate }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="py-10 sm:py-14 bg-gradient-to-b from-warmgray-50 via-bloom-50/40 to-warmgray-50 dark:from-warmgray-950 dark:via-warmgray-900/80 dark:to-warmgray-950 transition-colors">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bloom-100 dark:bg-bloom-950 text-bloom-700 dark:text-bloom-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-bloom-500" />
            <span>Behind The Creations · Artisan Studio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-warmgray-900 dark:text-white">
            Watch the Craft in Motion
          </h2>
          <p className="text-xs sm:text-sm text-warmgray-600 dark:text-warmgray-400">
            Real artisan moments from our studio — every petal, loop, and ribbon shaped by hand with love.
          </p>
        </div>

        {/* 2-Column Showcase: Real Video Reel on Left, Real Photo Grid on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Video Player Card */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-warmgray-800 bg-black aspect-[9/16] max-h-[500px] sm:max-h-[540px] mx-auto group">
              <video
                ref={videoRef}
                src="/images/artisan-craft-video.mp4"
                poster="/images/aanu-blooms-signature-set.jpeg"
                loop
                playsInline
                muted={isMuted}
                className="w-full h-full object-cover"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* Video Overlay Controls */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 flex flex-col justify-between p-5 pointer-events-none">
                
                {/* Top Badge */}
                <div className="flex justify-between items-center pointer-events-auto">
                  <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    Studio Reel
                  </span>

                  <button
                    onClick={toggleMute}
                    className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>

                {/* Center Play/Pause Trigger */}
                <div className="flex justify-center items-center pointer-events-auto">
                  <button
                    onClick={togglePlay}
                    className={`w-16 h-16 rounded-full bg-bloom-500/90 hover:bg-bloom-600 text-white flex items-center justify-center shadow-xl transform transition-transform hover:scale-110 ${
                      isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100 scale-100'
                    }`}
                  >
                    {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
                  </button>
                </div>

                {/* Bottom Video Captions */}
                <div className="pointer-events-auto">
                  <h3 className="font-serif font-bold text-white text-base">
                    Creating Beautiful Handmade Creations
                  </h3>
                  <p className="text-white/80 text-xs mt-0.5">
                    "Every petal is individually shaped and wired for life."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Real Handcrafted Photo Showcase */}
          <div className="lg:col-span-6 space-y-4">
            <div className="grid grid-cols-2 gap-3.5">
              
              {/* Photo 1: Tulip handheld */}
              <div
                onClick={() => onNavigate('shop')}
                className="group relative rounded-2xl overflow-hidden shadow-soft border-2 border-white dark:border-warmgray-800 cursor-pointer bg-white dark:bg-warmgray-900"
              >
                <img
                  src="/images/pink-tulip-stem.jpeg"
                  alt="Handheld Pink Tulip"
                  className="w-full h-44 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-2.5">
                  <span className="text-[10px] font-bold text-bloom-600 dark:text-bloom-400 uppercase tracking-wider block">Handheld Stem</span>
                  <p className="font-serif font-bold text-xs text-warmgray-900 dark:text-white truncate">Blush Velvet Tulip</p>
                  <span className="text-xs font-bold text-warmgray-700 dark:text-warmgray-300">₹449</span>
                </div>
              </div>

              {/* Photo 2: Sunflower handheld */}
              <div
                onClick={() => onNavigate('shop')}
                className="group relative rounded-2xl overflow-hidden shadow-soft border-2 border-white dark:border-warmgray-800 cursor-pointer bg-white dark:bg-warmgray-900"
              >
                <img
                  src="/images/sunflower-stem-handheld.jpeg"
                  alt="Handheld Sunflower"
                  className="w-full h-44 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-2.5">
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">Artisan Stem</span>
                  <p className="font-serif font-bold text-xs text-warmgray-900 dark:text-white truncate">Golden Sunflower</p>
                  <span className="text-xs font-bold text-warmgray-700 dark:text-warmgray-300">₹499</span>
                </div>
              </div>

              {/* Photo 3: Lavender & Lilac Lily */}
              <div
                onClick={() => onNavigate('shop')}
                className="group relative rounded-2xl overflow-hidden shadow-soft border-2 border-white dark:border-warmgray-800 cursor-pointer bg-white dark:bg-warmgray-900"
              >
                <img
                  src="/images/lavender-lily-stems.jpeg"
                  alt="Lavender and Lily Stems"
                  className="w-full h-44 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-2.5">
                  <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">Pastel Pair</span>
                  <p className="font-serif font-bold text-xs text-warmgray-900 dark:text-white truncate">Lavender & Lilac Lily</p>
                  <span className="text-xs font-bold text-warmgray-700 dark:text-warmgray-300">₹649</span>
                </div>
              </div>

              {/* Photo 4: Blossom Pots Top View */}
              <div
                onClick={() => onNavigate('shop')}
                className="group relative rounded-2xl overflow-hidden shadow-soft border-2 border-white dark:border-warmgray-800 cursor-pointer bg-white dark:bg-warmgray-900"
              >
                <img
                  src="/images/blossom-pots-collection.jpeg"
                  alt="5-Piece Blossom Garden Pots"
                  className="w-full h-44 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-2.5">
                  <span className="text-[10px] font-bold text-bloom-600 dark:text-bloom-400 uppercase tracking-wider block">Complete Set</span>
                  <p className="font-serif font-bold text-xs text-warmgray-900 dark:text-white truncate">5-Piece Garden Pots</p>
                  <span className="text-xs font-bold text-warmgray-700 dark:text-warmgray-300">₹2,499</span>
                </div>
              </div>

            </div>

            {/* Studio Guarantee Banner */}
            <div className="p-4 rounded-2xl bg-white dark:bg-warmgray-900 border border-warmgray-200/80 dark:border-warmgray-800 shadow-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-bloom-100 dark:bg-bloom-950 text-bloom-600 flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5 fill-bloom-500 text-bloom-500" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-warmgray-900 dark:text-white">
                    100% Genuine Artisan Slow-Crafted
                  </h4>
                  <p className="text-[11px] text-warmgray-500">
                    Never wilt, never shed. Arrives pre-arranged in gift box.
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigate('shop')}
                className="px-4 py-2 bg-bloom-500 hover:bg-bloom-600 text-white rounded-xl font-bold text-xs shadow-cozy shrink-0 flex items-center gap-1"
              >
                <span>Shop All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
