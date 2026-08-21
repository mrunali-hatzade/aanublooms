import React, { useState } from 'react';
import { ImageIcon, Upload, Trash2, Link as LinkIcon, Plus, Check } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const MediaLibraryManager = () => {
  const { addToast } = useToast();
  const [mediaItems, setMediaItems] = useState([
    { id: 1, type: 'image', url: '/images/hero-bg-2.jpeg', alt: 'Hero Background 2', category: 'banner' },
    { id: 2, type: 'image', url: '/images/hero-bg-1.jpeg', alt: 'Hero Background 1', category: 'banner' },
    { id: 3, type: 'image', url: '/images/category/1st_category_flower.jpeg', alt: 'Flower', category: 'category' },
    { id: 4, type: 'image', url: '/images/category/2nd_category_keychain.jpeg', alt: 'Keychain', category: 'category' },
    { id: 5, type: 'image', url: '/images/category/3rd_category_flowerpot.jpeg', alt: 'Flowerpot', category: 'category' },
    { id: 6, type: 'image', url: '/images/category/4th_category_bouquet.jpeg', alt: 'Bouquet', category: 'category' },
    { id: 7, type: 'image', url: '/images/category/5th_category_handmadegifts.jpeg', alt: 'Handmadegifts', category: 'category' },
    { id: 8, type: 'image', url: '/images/category/5th_category_homedecor.jpeg', alt: 'Homedecor', category: 'category' }
  ]);
  const [filter, setFilter] = useState('all');

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate upload
    const url = URL.createObjectURL(file);
    const newItem = {
      id: Date.now(),
      type: 'image',
      url,
      alt: file.name,
      category: 'uncategorized'
    };
    
    setMediaItems([newItem, ...mediaItems]);
    addToast('Media uploaded successfully!', 'success');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this media file?')) {
      setMediaItems(mediaItems.filter(item => item.id !== id));
      addToast('Media deleted.', 'info');
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    addToast('URL copied to clipboard!', 'success');
  };

  const filteredItems = filter === 'all' ? mediaItems : mediaItems.filter(item => item.category === filter);

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E9E2DC] shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#3E2B25]">
            Media Library & Website Content
          </h2>
          <p className="text-xs text-[#756A65] mt-0.5">
            Maintain your website by uploading banners, product images, and gallery content here.
          </p>
        </div>
        <label className="cursor-pointer px-4 py-2 bg-[#D96C65] hover:bg-[#C95B55] text-white rounded-xl text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-colors self-start sm:self-auto">
          <Upload className="w-4 h-4" />
          <span>+ Upload File</span>
          <input type="file" className="hidden" accept="image/*,video/*" onChange={handleUpload} />
        </label>
      </div>

      <div className="flex gap-2 pb-2 overflow-x-auto no-scrollbar">
        {['all', 'banner', 'product', 'category', 'uncategorized'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize whitespace-nowrap transition-colors ${
              filter === f ? 'bg-[#3E2B25] text-white' : 'bg-[#F8F6F3] text-[#756A65] hover:bg-[#E9E2DC]'
            }`}
          >
            {f === 'all' ? 'All Media' : f}
          </button>
        ))}
      </div>

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="group relative rounded-xl border border-[#E9E2DC] bg-[#F8F6F3] overflow-hidden aspect-square flex items-center justify-center">
              <img src={item.url} alt={item.alt} className="w-full h-full object-cover" />
              
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <div className="flex justify-end gap-1">
                  <button 
                    onClick={() => copyToClipboard(item.url)}
                    className="p-1.5 bg-white/20 hover:bg-white text-white hover:text-[#3E2B25] rounded transition-colors"
                    title="Copy Link"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 bg-white/20 hover:bg-red-500 text-white rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-[10px] text-white font-mono truncate px-1 bg-black/40 rounded py-0.5">
                  {item.alt}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-xs text-[#756A65] space-y-2 bg-[#F8F6F3] rounded-xl border border-dashed border-[#E9E2DC]">
          <ImageIcon className="w-8 h-8 text-[#756A65]/40 mx-auto" />
          <p>No media files found in this category.</p>
        </div>
      )}
    </div>
  );
};
