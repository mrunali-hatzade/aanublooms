import React, { useState } from 'react';
import { FolderPlus, Edit2, Trash2, Plus, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const CollectionsManager = () => {
  const { addToast } = useToast();
  
  const [collections, setCollections] = useState([
    { id: 1, name: 'Summer Vibes', slug: 'summer-vibes', itemsCount: 12, status: 'Active' },
    { id: 2, name: 'Valentine Specials', slug: 'valentine-specials', itemsCount: 5, status: 'Draft' }
  ]);
  
  const [showModal, setShowModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [formData, setFormData] = useState({ name: '', slug: '', status: 'Active' });

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingCollection) {
      setCollections(collections.map(c => 
        c.id === editingCollection.id ? { ...c, ...formData } : c
      ));
      addToast('Collection updated!', 'success');
    } else {
      setCollections([...collections, { id: Date.now(), itemsCount: 0, ...formData }]);
      addToast('Collection created!', 'success');
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this collection?')) {
      setCollections(collections.filter(c => c.id !== id));
      addToast('Collection deleted.', 'info');
    }
  };

  const openEdit = (col) => {
    setEditingCollection(col);
    setFormData({ name: col.name, slug: col.slug, status: col.status });
    setShowModal(true);
  };

  const openNew = () => {
    setEditingCollection(null);
    setFormData({ name: '', slug: '', status: 'Active' });
    setShowModal(true);
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E9E2DC] shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#3E2B25]">
            Curated Collections
          </h2>
          <p className="text-xs text-[#756A65] mt-0.5">
            Manage themed collections for the website.
          </p>
        </div>
        <button
          onClick={openNew}
          className="px-4 py-2 bg-[#D96C65] hover:bg-[#C95B55] text-white rounded-xl text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Collection</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
        {collections.map(col => (
          <div key={col.id} className="p-4 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] space-y-3 relative group">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-[#3E2B25]">{col.name}</h3>
                <p className="text-[10px] text-[#756A65] font-mono">/{col.slug}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${col.status === 'Active' ? 'bg-[#4F9D69]/10 text-[#4F9D69]' : 'bg-gray-200 text-gray-600'}`}>
                {col.status}
              </span>
            </div>
            <div className="text-xs text-[#756A65]">
              {col.itemsCount} products included
            </div>
            
            <div className="absolute top-3 right-3 flex opacity-0 group-hover:opacity-100 transition-opacity gap-1">
              <button onClick={() => openEdit(col)} className="p-1 rounded hover:bg-[#E9E2DC] text-[#756A65]"><Edit2 className="w-3.5 h-3.5" /></button>
              <button onClick={() => handleDelete(col.id)} className="p-1 rounded hover:bg-red-50 text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl max-w-md w-full border border-[#E9E2DC] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9E2DC]">
              <h3 className="font-serif font-bold text-lg text-[#3E2B25]">
                {editingCollection ? 'Edit Collection' : 'Create Collection'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-[#756A65] hover:text-[#3E2B25]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#3E2B25] mb-1">Collection Name *</label>
                <input
                  type="text" required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })}
                  className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC]"
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-[#3E2B25] mb-1">URL Slug</label>
                <input
                  type="text" required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC] font-mono"
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-[#3E2B25] mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl bg-[#F8F6F3] border border-[#E9E2DC]"
                >
                  <option value="Active">Active (Visible)</option>
                  <option value="Draft">Draft (Hidden)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E9E2DC]">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs font-semibold text-[#756A65]">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#D96C65] hover:bg-[#C95B55] text-white rounded-xl text-xs font-bold shadow-xs">
                  {editingCollection ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
