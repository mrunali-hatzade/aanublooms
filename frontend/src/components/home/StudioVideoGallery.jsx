import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Plus, Upload, Trash2, Video, Sparkles, X, Check } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

const defaultVideos = [
  {
    id: 'vid-1',
    title: 'Slow-Crafted Velvet Flowers & Pots',
    caption: 'Watch the artisan stitching of our 5-piece cupcake blossom garden set.',
    url: '/images/whatsapp-craft-video.mp4',
    poster: '/images/aanu-blooms-signature-set.jpeg',
    tag: '🌸 Studio Reel'
  },
  {
    id: 'vid-2',
    title: 'Sunflower & Daisy Stems Assembly',
    caption: 'Handcrafted floral wire framing with combed milk cotton yarn.',
    url: '/images/artisan-craft-video.mp4',
    poster: '/images/sunflower-stem-handheld.jpeg',
    tag: '✨ Flower Assembly'
  },
  {
    id: 'vid-3',
    title: 'Pastel Garden Cupcake Blossom Pots',
    caption: 'Everlasting desk blooms made with love in our Pune craft workshop.',
    url: '/images/whatsapp-craft-video.mp4',
    poster: '/images/blossom-pots-collection.jpeg',
    tag: '🧶 Behind The Stitches'
  }
];

const VideoCard = ({ vid, isPlaying, onTogglePlay, isMuted, onToggleMute, isAdmin, onDelete }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Video playback error:', err);
        });
      }
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  return (
    <div
      onClick={onTogglePlay}
      className="group relative rounded-3xl overflow-hidden bg-black aspect-[9/14] sm:aspect-[9/13] max-h-[480px] shadow-lg border border-warmgray-200/80 dark:border-warmgray-800 flex flex-col justify-between p-4 cursor-pointer select-none"
    >
      {/* Background Video */}
      <video
        ref={videoRef}
        src={vid.url}
        poster={vid.poster}
        loop
        playsInline
        preload="metadata"
        muted={isMuted}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 pointer-events-none transition-opacity duration-300 ${isPlaying ? 'opacity-40 hover:opacity-75' : 'opacity-80'}`} />

      {/* Top Bar: Tag & Audio / Delete */}
      <div className="relative z-10 flex items-center justify-between pointer-events-auto">
        <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold">
          {vid.tag}
        </span>

        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={onToggleMute}
            className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-xs text-white flex items-center justify-center hover:bg-black/90 transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {isAdmin && (
            <button
              onClick={(e) => onDelete(vid.id, e)}
              className="w-8 h-8 rounded-full bg-red-600/80 backdrop-blur-xs text-white flex items-center justify-center hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100"
              title="Remove video"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Center Play / Pause Button */}
      <div className="relative z-10 flex justify-center items-center pointer-events-none my-auto">
        <div
          className={`w-14 h-14 rounded-full bg-bloom-500 hover:bg-bloom-600 text-white flex items-center justify-center shadow-xl transform transition-all ${
            isPlaying ? 'opacity-0 group-hover:opacity-100 scale-90' : 'opacity-100 scale-100'
          }`}
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
        </div>
      </div>

      {/* Bottom Title & Caption */}
      <div className="relative z-10 text-white space-y-1">
        <h3 className="font-serif font-bold text-sm sm:text-base leading-tight drop-shadow">
          {vid.title}
        </h3>
        <p className="text-[11px] text-white/80 line-clamp-2 leading-relaxed">
          {vid.caption}
        </p>
      </div>
    </div>
  );
};

export const StudioVideoGallery = ({ onNavigate }) => {
  const { addToast } = useToast();
  const { user } = useAuth();
  const isAdmin = user && (user.role === 'admin' || user.email === 'aanu@aanublooms.com' || user.name?.toLowerCase().includes('aanu') || user.name?.toLowerCase().includes('admin'));

  const [videos, setVideos] = useState(() => {
    try {
      const saved = localStorage.getItem('aanublooms_studio_videos');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultVideos;
    } catch {
      return defaultVideos;
    }
  });

  const [activePlayingId, setActivePlayingId] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [videoForm, setVideoForm] = useState({
    title: '',
    caption: '',
    url: '',
    tag: '🧶 Behind The Stitches'
  });

  useEffect(() => {
    localStorage.setItem('aanublooms_studio_videos', JSON.stringify(videos));
  }, [videos]);

  const handleTogglePlay = (vidId) => {
    setActivePlayingId((prev) => (prev === vidId ? null : vidId));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      addToast('Please select a valid video file (MP4, WEBM, MOV)', 'error');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      addToast('Video file should be under 50MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setVideoForm(prev => ({
        ...prev,
        url: event.target.result,
        title: prev.title || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
      }));
      addToast('🎥 Video selected from your device!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleAddVideo = (e) => {
    e.preventDefault();
    if (!videoForm.url) {
      addToast('Please upload a video or enter a video URL', 'error');
      return;
    }

    const newVideo = {
      id: `vid-${Date.now()}`,
      title: videoForm.title || 'Handcrafted Artisan Reel',
      caption: videoForm.caption || 'Slow stitches & crochet behind-the-scenes.',
      url: videoForm.url,
      poster: '/images/aanu-blooms-signature-set.jpeg',
      tag: videoForm.tag || '🌸 Studio Reel'
    };

    setVideos(prev => [newVideo, ...prev]);
    setShowAddModal(false);
    setVideoForm({ title: '', caption: '', url: '', tag: '🧶 Behind The Stitches' });
    addToast('Video added to the website studio gallery! 🎥', 'success');
  };

  const handleDeleteVideo = (id, e) => {
    e.stopPropagation();
    if (!isAdmin) {
      addToast('Admin access required to delete videos', 'error');
      return;
    }
    if (window.confirm('Remove this video from the website?')) {
      setVideos(prev => prev.filter(v => v.id !== id));
      addToast('Video removed', 'info');
    }
  };

  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header & Add Video Button (Admin Only) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-bloom-600 dark:text-bloom-400 block mb-0.5">
              Behind The Stitches
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-warmgray-900 dark:text-white">
              Artisan Craft Videos & Reels
            </h2>
            <p className="text-xs text-warmgray-500 dark:text-warmgray-400 mt-0.5">
              Watch authentic handmade crochet tutorials, flower assembly, and studio stories.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 bg-warmgray-900 hover:bg-black text-white dark:bg-white dark:text-warmgray-900 rounded-2xl font-bold text-xs shadow-cozy flex items-center gap-2 self-start sm:self-auto transform hover:scale-102 transition-transform"
            >
              <Plus className="w-4 h-4 text-bloom-400" />
              <span>+ Add Video from PC / Phone</span>
            </button>
          )}
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {videos.map((vid) => (
            <VideoCard
              key={vid.id}
              vid={vid}
              isPlaying={activePlayingId === vid.id}
              onTogglePlay={() => handleTogglePlay(vid.id)}
              isMuted={isMuted}
              onToggleMute={() => setIsMuted(!isMuted)}
              isAdmin={isAdmin}
              onDelete={handleDeleteVideo}
            />
          ))}
        </div>

      </div>

      {/* Add Video Modal Pop-up */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddModal(false);
          }}
        >
          <div className="relative bg-white dark:bg-warmgray-900 rounded-3xl max-w-lg w-full border border-warmgray-200 dark:border-warmgray-800 shadow-2xl p-6 sm:p-7 z-10 animate-in zoom-in-95">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-warmgray-100 dark:border-warmgray-800 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-bloom-600 dark:text-bloom-400 block">
                  Studio Video Manager
                </span>
                <h3 className="font-serif font-bold text-lg text-warmgray-900 dark:text-white">
                  Add Craft Video or Reel
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-full bg-warmgray-100 hover:bg-warmgray-200 text-warmgray-600 dark:bg-warmgray-800 dark:text-warmgray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddVideo} className="space-y-4">
              
              {/* File Uploader */}
              <div className="p-4 rounded-2xl border-2 border-dashed border-bloom-300 dark:border-warmgray-700 bg-bloom-50/50 dark:bg-warmgray-800/50 space-y-2">
                <span className="text-xs font-bold text-warmgray-900 dark:text-white flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-bloom-600" />
                  <span>Choose Video from PC / Phone</span>
                </span>
                <p className="text-[11px] text-warmgray-500">
                  Select any MP4, WEBM, or MOV video clip from your device.
                </p>

                <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 bg-bloom-500 hover:bg-bloom-600 text-white rounded-xl text-xs font-bold shadow-cozy mt-1">
                  <Video className="w-3.5 h-3.5" />
                  <span>Browse Device Files</span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {videoForm.url && (
                  <div className="mt-2 p-2 bg-white dark:bg-warmgray-900 rounded-xl border border-warmgray-200 dark:border-warmgray-700 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-semibold text-warmgray-800 dark:text-warmgray-200 truncate">
                      Video file ready to publish!
                    </span>
                  </div>
                )}
              </div>

              {/* Or Video URL */}
              <div>
                <label className="block text-xs font-bold text-warmgray-700 dark:text-warmgray-300 mb-1">
                  Or Paste Video URL (MP4 / Web Link)
                </label>
                <input
                  type="text"
                  value={videoForm.url}
                  onChange={(e) => setVideoForm({ ...videoForm, url: e.target.value })}
                  placeholder="e.g. /images/artisan-craft-video.mp4 or https://..."
                  className="w-full text-xs p-2.5 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white font-mono"
                />
              </div>

              {/* Video Title */}
              <div>
                <label className="block text-xs font-bold text-warmgray-700 dark:text-warmgray-300 mb-1">
                  Video Title *
                </label>
                <input
                  type="text"
                  required
                  value={videoForm.title}
                  onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                  placeholder="e.g. Crocheting Pink Velvet Tulip Petals"
                  className="w-full text-xs p-2.5 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
                />
              </div>

              {/* Caption */}
              <div>
                <label className="block text-xs font-bold text-warmgray-700 dark:text-warmgray-300 mb-1">
                  Short Caption
                </label>
                <input
                  type="text"
                  value={videoForm.caption}
                  onChange={(e) => setVideoForm({ ...videoForm, caption: e.target.value })}
                  placeholder="e.g. Step-by-step slow crochet loop stitch."
                  className="w-full text-xs p-2.5 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
                />
              </div>

              {/* Tag */}
              <div>
                <label className="block text-xs font-bold text-warmgray-700 dark:text-warmgray-300 mb-1">
                  Video Badge Tag
                </label>
                <select
                  value={videoForm.tag}
                  onChange={(e) => setVideoForm({ ...videoForm, tag: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
                >
                  <option value="🌸 Studio Reel">🌸 Studio Reel</option>
                  <option value="🧶 Behind The Stitches">🧶 Behind The Stitches</option>
                  <option value="🎀 Gift Packaging">🎀 Gift Packaging</option>
                  <option value="✨ Flower Assembly">✨ Flower Assembly</option>
                </select>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-warmgray-100 dark:border-warmgray-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-warmgray-500 hover:text-warmgray-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-bloom-500 hover:bg-bloom-600 text-white rounded-full font-bold text-xs shadow-cozy"
                >
                  Publish Video 🎥
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </section>
  );
};
