import React, { useState } from 'react';
import { Sparkles, Heart, ShoppingBag, Check, Gift } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export const InteractiveBouquetStudio = ({ onNavigate }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [selectedFlowers, setSelectedFlowers] = useState([
    { id: 'tulip', name: 'Pastel Tulip', icon: '🌷', count: 3, price: 180 },
    { id: 'rose', name: 'Velvet Rose', icon: '🌹', count: 2, price: 220 },
    { id: 'daisy', name: 'White Daisy', icon: '🌼', count: 2, price: 140 }
  ]);

  const [wrapping, setWrapping] = useState('Blush Pink Kraft');
  const [ribbon, setRibbon] = useState('Champagne Gold Satin');
  const [customNote, setCustomNote] = useState('With endless love & forever blooms ✨');
  const [isAdded, setIsAdded] = useState(false);

  const flowerOptions = [
    { id: 'tulip', name: 'Pastel Tulip', icon: '🌷', price: 180 },
    { id: 'rose', name: 'Velvet Rose', icon: '🌹', price: 220 },
    { id: 'sunflower', name: 'Bright Sunflower', icon: '🌻', price: 240 },
    { id: 'daisy', name: 'White Daisy', icon: '🌼', price: 140 },
    { id: 'lavender', name: 'Calm Lavender', icon: '🪻', price: 160 },
    { id: 'lily', name: 'Lily of Valley', icon: '🔔', price: 190 }
  ];

  const wrappingOptions = [
    { name: 'Blush Pink Kraft', color: '#fbcfe8' },
    { name: 'Warm Cream Parchment', color: '#fef3c7' },
    { name: 'Sage Green Linen', color: '#d1fae5' },
    { name: 'Lavender Cloud', color: '#e9d5ff' }
  ];

  const ribbonOptions = [
    'Champagne Gold Satin',
    'Rosewood Velvet',
    'Dusty Pink Silk',
    'Ivory Organza'
  ];

  const updateFlowerCount = (id, delta) => {
    setSelectedFlowers(prev => {
      const exists = prev.find(f => f.id === id);
      if (!exists && delta > 0) {
        const item = flowerOptions.find(f => f.id === id);
        return [...prev, { ...item, count: 1 }];
      }
      return prev
        .map(f => f.id === id ? { ...f, count: Math.max(0, f.count + delta) } : f)
        .filter(f => f.count > 0);
    });
  };

  const totalStems = selectedFlowers.reduce((acc, f) => acc + f.count, 0);
  const baseCost = selectedFlowers.reduce((acc, f) => acc + (f.count * f.price), 0);
  const packagingCost = 150; // Artisan gift box & satin wrap
  const totalCost = Math.max(499, baseCost + packagingCost);

  const handleAddBespokeToCart = () => {
    if (totalStems === 0) {
      showToast('Please add at least 1 flower stem to your bouquet!', 'info');
      return;
    }

    const bespokeItem = {
      id: `custom-bouquet-${Date.now()}`,
      name: `Bespoke Bouquet (${totalStems} Handcrafted Stems)`,
      price: totalCost,
      material: 'premium colourful pipe cleaners',
      rating: 5.0,
      image: '/images/pink-tulip-stem.jpeg',
      customDetails: {
        stems: selectedFlowers.map(f => `${f.count}x ${f.name}`).join(', '),
        wrapping,
        ribbon,
        customNote
      }
    };

    addToCart(bespokeItem, 1, {
      selectedColor: wrapping,
      selectedSize: `${totalStems} Stems Assortment`
    });

    setIsAdded(true);
    showToast('Custom Bouquet added to your Basket! 🌸', 'success');
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <section className="py-8 sm:py-12 bg-white dark:bg-warmgray-900 border-b border-warmgray-200 dark:border-warmgray-800 transition-colors">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bloom-100 dark:bg-bloom-950 text-bloom-800 dark:text-bloom-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Unique Artisan Feature
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-warmgray-900 dark:text-white">
            Build Your Forever Bouquet Live
          </h2>
          <p className="text-xs sm:text-sm text-warmgray-500 dark:text-warmgray-400 mt-1">
            Pick your flower assortment, paper & ribbon. We will handmade and hand-wrap it in our studio!
          </p>
        </div>

        {/* Interactive Studio Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Side */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Pick Stems */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-warmgray-700 dark:text-warmgray-300 mb-3">
                1. Select Flower Stems ({totalStems} added)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {flowerOptions.map(flower => {
                  const current = selectedFlowers.find(f => f.id === flower.id);
                  const count = current ? current.count : 0;
                  return (
                    <div
                      key={flower.id}
                      className={`p-2.5 rounded-2xl border transition-all flex items-center justify-between ${
                        count > 0
                          ? 'border-bloom-400 bg-bloom-50/50 dark:bg-bloom-950/30 shadow-xs'
                          : 'border-warmgray-200 dark:border-warmgray-700 bg-warmgray-50 dark:bg-warmgray-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{flower.icon}</span>
                        <div>
                          <p className="text-xs font-bold text-warmgray-900 dark:text-white">{flower.name}</p>
                          <p className="text-[10px] text-warmgray-500">₹{flower.price}/stem</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 bg-white dark:bg-warmgray-900 rounded-lg p-0.5 border border-warmgray-200 dark:border-warmgray-700">
                        <button
                          onClick={() => updateFlowerCount(flower.id, -1)}
                          className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold hover:bg-warmgray-100 dark:hover:bg-warmgray-800"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{count}</span>
                        <button
                          onClick={() => updateFlowerCount(flower.id, 1)}
                          className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold hover:bg-bloom-100 dark:hover:bg-bloom-950 text-bloom-600"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Wrapping Paper */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-warmgray-700 dark:text-warmgray-300 mb-2">
                2. Artisan Wrapping Style: <strong className="text-bloom-600 dark:text-bloom-400">{wrapping}</strong>
              </label>
              <div className="flex flex-wrap gap-2">
                {wrappingOptions.map(wrap => (
                  <button
                    key={wrap.name}
                    onClick={() => setWrapping(wrap.name)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all ${
                      wrapping === wrap.name
                        ? 'border-bloom-500 bg-bloom-50 dark:bg-bloom-950 text-bloom-700 dark:text-bloom-300 ring-2 ring-bloom-400/30'
                        : 'border-warmgray-200 dark:border-warmgray-700 text-warmgray-700 dark:text-warmgray-300 bg-white dark:bg-warmgray-800'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: wrap.color }} />
                    <span>{wrap.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Ribbon Style */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-warmgray-700 dark:text-warmgray-300 mb-2">
                3. Satin Ribbon: <strong className="text-bloom-600 dark:text-bloom-400">{ribbon}</strong>
              </label>
              <div className="flex flex-wrap gap-2">
                {ribbonOptions.map(rib => (
                  <button
                    key={rib}
                    onClick={() => setRibbon(rib)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      ribbon === rib
                        ? 'border-rosewood-500 bg-rosewood-50 dark:bg-rosewood-950 text-rosewood-700 dark:text-rosewood-300 ring-2 ring-rosewood-400/30'
                        : 'border-warmgray-200 dark:border-warmgray-700 text-warmgray-700 dark:text-warmgray-300 bg-white dark:bg-warmgray-800'
                    }`}
                  >
                    🎗️ {rib}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Handwritten Calligraphy Card Note */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-warmgray-700 dark:text-warmgray-300 mb-1.5">
                4. Free Handwritten Greeting Card
              </label>
              <input
                type="text"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="e.g. Happy Birthday to the sweetest soul! Love Priya ✨"
                className="w-full text-xs p-3 rounded-2xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-bloom-400"
              />
            </div>

          </div>

          {/* Live Preview Card Side */}
          <div className="lg:col-span-5 bg-gradient-to-b from-bloom-50/70 to-rosewood-50/40 dark:from-warmgray-800/70 dark:to-warmgray-900 rounded-3xl p-5 sm:p-6 border border-bloom-100 dark:border-warmgray-700 shadow-soft">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-bloom-700 dark:text-bloom-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Live Studio Summary
              </span>
              <span className="text-xs font-mono font-bold bg-white dark:bg-warmgray-800 px-2 py-0.5 rounded-full shadow-xs">
                {totalStems} Total Stems
              </span>
            </div>

            {/* Bouquet Preview Visual */}
            <div className="relative rounded-2xl overflow-hidden mb-4 border border-white/60 dark:border-warmgray-700 shadow-md aspect-[4/3] bg-white dark:bg-warmgray-800 flex items-center justify-center p-4">
              <img
                src="/images/pink-tulip-stem.jpeg"
                alt="Bouquet Preview"
                className="w-full h-full object-cover rounded-xl"
              />
              <div className="absolute inset-x-2 bottom-2 p-2.5 rounded-xl bg-white/90 dark:bg-warmgray-900/90 backdrop-blur-md text-xs space-y-1 shadow-md">
                <p className="font-handwritten text-base text-bloom-600 dark:text-bloom-400 font-bold leading-none">
                  "{customNote || 'No message'}"
                </p>
                <p className="text-[10px] text-warmgray-500">
                  Wrapped in {wrapping} · {ribbon}
                </p>
              </div>
            </div>

            {/* Selected Stems Pill list */}
            <div className="space-y-1.5 mb-4 text-xs">
              <div className="flex justify-between text-warmgray-600 dark:text-warmgray-300">
                <span>Selected Stems:</span>
                <span className="font-semibold text-warmgray-900 dark:text-white">
                  {selectedFlowers.filter(f => f.count > 0).map(f => `${f.count}x ${f.name}`).join(', ') || 'No stems yet'}
                </span>
              </div>
              <div className="flex justify-between text-warmgray-600 dark:text-warmgray-300">
                <span>Studio Gift Box & Ribbon:</span>
                <span className="text-emerald-600 font-semibold">Included (₹150)</span>
              </div>
              <div className="flex justify-between text-warmgray-600 dark:text-warmgray-300">
                <span>Pune Region Delivery:</span>
                <span className="text-warmgray-700 dark:text-warmgray-200 font-semibold">Standard Delivery</span>
              </div>
            </div>

            {/* Grand Total & Action */}
            <div className="pt-3 border-t border-warmgray-200 dark:border-warmgray-700 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-warmgray-400 block">Total Price</span>
                <span className="text-2xl font-serif font-bold text-bloom-600 dark:text-bloom-400">
                  ₹{totalCost.toLocaleString('en-IN')}
                </span>
              </div>

              <button
                onClick={handleAddBespokeToCart}
                className={`px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all shadow-cozy ${
                  isAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-bloom-500 hover:bg-bloom-600 text-white'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Basket!</span>
                  </>
                ) : (
                  <>
                    <Gift className="w-4 h-4" />
                    <span>Order Custom Box</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
