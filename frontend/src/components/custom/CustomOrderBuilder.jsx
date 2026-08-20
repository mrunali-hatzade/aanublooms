import React, { useState } from 'react';
import { Palette, Sparkles, Check, Heart, Flower2, Gift, Send, ShoppingBag } from 'lucide-react';
import { api } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export const CustomOrderBuilder = ({ onNavigate }) => {
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const [step, setStep] = useState(1);
  const [creationType, setCreationType] = useState('Custom Forever Flower Bouquet');
  const [yarnPreference, setYarnPreference] = useState('100% Combed Milk Cotton');
  const [selectedColors, setSelectedColors] = useState(['#F4B6C2', '#FFFFFF', '#9EB29C']);
  const [selectedFlowers, setSelectedFlowers] = useState(['Pink Tulips', 'White Daisies', 'Eucalyptus Leaves']);
  const [stemCount, setStemCount] = useState('Classic 9 Stems');
  const [ribbonMessage, setRibbonMessage] = useState('Forever In Bloom');
  const [specialNotes, setSpecialNotes] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const creationOptions = [
    {
      id: 'bouquet',
      name: 'Custom Forever Flower Bouquet',
      priceBase: 1499,
      image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=600&q=80',
      desc: 'Handcrafted bouquet with your choice of floral stems, custom color palette & silk ribbon text.'
    },
    {
      id: 'plushie',
      name: 'Custom Amigurumi Plushie Companion',
      priceBase: 1199,
      image: 'https://images.unsplash.com/photo-1558877385-81a1c7e67d72?auto=format&fit=crop&w=600&q=80',
      desc: 'Squishy bunny, bear, or dino with custom accessories (strawberry bag, bowtie, mini hat).'
    },
    {
      id: 'wearable',
      name: 'Custom Hexagon / Granny Square Cardigan',
      priceBase: 3499,
      image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80',
      desc: 'Tailored to your body measurements with your chosen yarn color blocks and balloon sleeves.'
    },
    {
      id: 'bag',
      name: 'Custom Daisy Market Tote / Crossbody',
      priceBase: 1599,
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
      desc: 'Artisan granny square tote in your personalized garden color scheme with inner cotton lining.'
    }
  ];

  const colorPaletteOptions = [
    { name: 'Blush Pink', hex: '#F4B6C2' },
    { name: 'Warm Cream White', hex: '#FAF8F5' },
    { name: 'Sage Green', hex: '#9EB29C' },
    { name: 'Golden Honey Yellow', hex: '#F5B025' },
    { name: 'French Lavender', hex: '#D8BFD8' },
    { name: 'Terracotta Coral', hex: '#E38D6F' },
    { name: 'Sky Blue Pastel', hex: '#A7C7E7' },
    { name: 'Mocha Earth Brown', hex: '#B59E8C' }
  ];

  const flowerOptions = [
    'Pink Tulips',
    'White Chamomile Daisies',
    'Sunflowers',
    'French Lavender Stems',
    'Red & Cream Roses',
    'Eucalyptus Leaves',
    'Baby’s Breath Sprigs',
    'Forget-Me-Nots'
  ];

  const currentTypeObj = creationOptions.find(o => o.name === creationType) || creationOptions[0];
  const estimatedPrice = currentTypeObj.priceBase + (stemCount === 'Deluxe 15 Stems' ? 600 : 0);

  const toggleColor = (hex) => {
    if (selectedColors.includes(hex)) {
      if (selectedColors.length > 1) {
        setSelectedColors(selectedColors.filter(c => c !== hex));
      }
    } else {
      if (selectedColors.length < 4) {
        setSelectedColors([...selectedColors, hex]);
      } else {
        addToast('You can pick up to 4 custom yarn colors', 'info');
      }
    }
  };

  const toggleFlower = (flower) => {
    if (selectedFlowers.includes(flower)) {
      if (selectedFlowers.length > 1) {
        setSelectedFlowers(selectedFlowers.filter(f => f !== flower));
      }
    } else {
      setSelectedFlowers([...selectedFlowers, flower]);
    }
  };

  const handleAddToCart = () => {
    const customProduct = {
      id: `custom-${Date.now()}`,
      name: `Custom Commission: ${creationType}`,
      slug: 'custom-artisan-commission',
      price: estimatedPrice,
      originalPrice: null,
      images: [currentTypeObj.image],
      category: 'custom-commissions',
      craftTimeHours: 10,
      yarnMaterial: yarnPreference,
      colors: selectedColors.map(c => ({ name: c, hex: c })),
      sizes: [stemCount],
      description: `Custom Commission with palette [${selectedColors.join(', ')}], flowers: [${selectedFlowers.join(', ')}], ribbon message: "${ribbonMessage}". Notes: ${specialNotes}`
    };

    addToCart(customProduct, 1, {
      selectedColor: `Palette of ${selectedColors.length} Yarn Tones`,
      selectedSize: stemCount,
      customNotes: `Ribbon: "${ribbonMessage}" | Flowers: ${selectedFlowers.join(', ')} | Yarn: ${yarnPreference} | Notes: ${specialNotes}`
    });

    addToast('🌸 Custom commission added to your yarn basket!', 'success');
    onNavigate('checkout');
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!customerName || !customerEmail) {
      addToast('Please enter your name and email', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.submitCustomRequest({
        customerName,
        customerEmail,
        itemType: creationType,
        colorPalette: selectedColors,
        yarnPreference,
        specialNotes: `Flowers: ${selectedFlowers.join(', ')} | Stems: ${stemCount} | Ribbon: "${ribbonMessage}" | Notes: ${specialNotes}`,
        estimatedBudget: `₹${estimatedPrice.toLocaleString('en-IN')}`
      });

      addToast('🌸 Custom commission inquiry sent to Aanu! She will contact you within 24 hours.', 'success');
      setStep(4);
    } catch (err) {
      addToast(err.message || 'Could not submit inquiry', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rosewood-100 dark:bg-rosewood-950 text-rosewood-800 dark:text-rosewood-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Palette className="w-3.5 h-3.5" />
          Interactive Studio Commission Builder
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-warmgray-900 dark:text-white">
          Design Your Bespoke Crochet Piece
        </h1>
        <p className="text-xs sm:text-sm text-warmgray-600 dark:text-warmgray-400 mt-1.5">
          Personalize yarn colors, flower combinations, sizes, and personalized ribbon messages handcrafted specially for you across India.
        </p>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8 text-xs font-bold">
        {[
          { num: 1, label: '1. Select Piece' },
          { num: 2, label: '2. Palette & Details' },
          { num: 3, label: '3. Preview & Order' }
        ].map(s => (
          <div
            key={s.num}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-2xl border transition-all ${
              step === s.num
                ? 'bg-bloom-500 text-white border-bloom-500 shadow-cozy'
                : step > s.num
                ? 'bg-bloom-50 dark:bg-warmgray-800 text-bloom-700 dark:text-bloom-300 border-bloom-200 dark:border-bloom-800'
                : 'bg-warmgray-100 dark:bg-warmgray-800 text-warmgray-400 border-transparent'
            }`}
          >
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Step 1: Select Piece */}
      {step === 1 && (
        <div className="space-y-5 animate-in fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {creationOptions.map(option => (
              <div
                key={option.id}
                onClick={() => setCreationType(option.name)}
                className={`p-4 rounded-3xl border-2 cursor-pointer transition-all flex gap-3.5 ${
                  creationType === option.name
                    ? 'border-bloom-500 bg-white dark:bg-warmgray-900 shadow-soft-lg ring-2 ring-bloom-300 dark:ring-bloom-800'
                    : 'border-warmgray-200/80 dark:border-warmgray-800 bg-white dark:bg-warmgray-900/60 hover:border-warmgray-300'
                }`}
              >
                <img src={option.image} alt={option.name} className="w-20 h-20 rounded-2xl object-cover shrink-0" />
                <div className="flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-sm sm:text-base text-warmgray-900 dark:text-white leading-snug">
                      {option.name}
                    </h3>
                    <p className="text-[11px] text-warmgray-500 dark:text-warmgray-400 line-clamp-2 mt-0.5">
                      {option.desc}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs sm:text-sm font-serif font-bold text-bloom-600 dark:text-bloom-400">
                      Starting at ₹{option.priceBase.toLocaleString('en-IN')}
                    </span>
                    {creationType === option.name && (
                      <div className="w-5 h-5 rounded-full bg-bloom-500 text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-3">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 bg-bloom-500 hover:bg-bloom-600 text-white rounded-full font-bold text-xs shadow-cozy transition-all"
            >
              Continue to Palette & Stitches →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Palette, Flowers, Yarn */}
      {step === 2 && (
        <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-5 sm:p-7 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft space-y-6 animate-in fade-in">
          
          {/* Color Palette Selector */}
          <div>
            <div className="flex justify-between items-center mb-2.5">
              <label className="font-serif font-bold text-sm sm:text-base text-warmgray-900 dark:text-white">
                Choose Yarn Color Palette (Pick 1 to 4 Colors)
              </label>
              <span className="text-xs text-bloom-600 dark:text-bloom-400 font-semibold">
                {selectedColors.length} selected
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {colorPaletteOptions.map(color => {
                const isSelected = selectedColors.includes(color.hex);
                return (
                  <button
                    key={color.hex}
                    type="button"
                    onClick={() => toggleColor(color.hex)}
                    className={`flex items-center gap-2 p-2.5 rounded-2xl border transition-all text-left ${
                      isSelected
                        ? 'border-bloom-500 bg-bloom-50/50 dark:bg-bloom-950/40 ring-1 ring-bloom-400'
                        : 'border-warmgray-200 dark:border-warmgray-800 hover:bg-warmgray-50 dark:hover:bg-warmgray-800'
                    }`}
                  >
                    <span
                      style={{ backgroundColor: color.hex }}
                      className="w-5 h-5 rounded-full border border-warmgray-300 dark:border-warmgray-600 shrink-0 shadow-xs"
                    />
                    <span className="text-xs font-semibold text-warmgray-800 dark:text-warmgray-200 truncate">
                      {color.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Floral Stems (if bouquet) or accessories */}
          {creationType.includes('Bouquet') && (
            <div>
              <label className="font-serif font-bold text-sm sm:text-base text-warmgray-900 dark:text-white block mb-2.5">
                Include Flower Stem Types
              </label>
              <div className="flex flex-wrap gap-2">
                {flowerOptions.map(flower => {
                  const isSelected = selectedFlowers.includes(flower);
                  return (
                    <button
                      key={flower}
                      type="button"
                      onClick={() => toggleFlower(flower)}
                      className={`px-3 py-1.5 rounded-2xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-rosewood-500 text-white border-rosewood-500 shadow-xs'
                          : 'bg-warmgray-50 dark:bg-warmgray-800 text-warmgray-700 dark:text-warmgray-300 border-warmgray-200 dark:border-warmgray-700'
                      }`}
                    >
                      <Flower2 className="w-3 h-3" />
                      <span>{flower}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Yarn Material Selection */}
          <div>
            <label className="font-serif font-bold text-sm sm:text-base text-warmgray-900 dark:text-white block mb-2.5">
              Yarn Preference
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {['100% Combed Milk Cotton', 'Super-Soft Chenille Velvet', 'Organic Bamboo Cotton'].map(yarn => (
                <button
                  key={yarn}
                  type="button"
                  onClick={() => setYarnPreference(yarn)}
                  className={`p-3 rounded-2xl text-xs font-semibold border text-center transition-all ${
                    yarnPreference === yarn
                      ? 'border-bloom-500 bg-bloom-50 dark:bg-warmgray-800 text-bloom-800 dark:text-bloom-300 shadow-xs font-bold'
                      : 'border-warmgray-200 dark:border-warmgray-800 text-warmgray-700 dark:text-warmgray-300'
                  }`}
                >
                  {yarn}
                </button>
              ))}
            </div>
          </div>

          {/* Ribbon & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-warmgray-800 dark:text-warmgray-200 mb-1">
                Silk Ribbon Custom Inscription (Optional)
              </label>
              <input
                type="text"
                value={ribbonMessage}
                onChange={(e) => setRibbonMessage(e.target.value)}
                placeholder="e.g. Happy Birthday Priya"
                className="w-full text-xs p-3 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-warmgray-800 dark:text-warmgray-200 mb-1">
                Bouquet Size / Stems Count
              </label>
              <select
                value={stemCount}
                onChange={(e) => setStemCount(e.target.value)}
                className="w-full text-xs p-3 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
              >
                <option value="Classic 9 Stems">Classic (9 Stems)</option>
                <option value="Deluxe 15 Stems">Deluxe Luxe (15 Stems) (+₹600)</option>
                <option value="Petite 5 Stems">Petite (5 Stems)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-warmgray-800 dark:text-warmgray-200 mb-1">
              Additional Notes or Special Instructions for Artisan Aanu
            </label>
            <textarea
              rows={2}
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              placeholder="Tell Aanu about any specific color gradient, gift occasion, or stitch styling..."
              className="w-full text-xs p-3 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
            />
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-warmgray-100 dark:border-warmgray-800">
            <button
              onClick={() => setStep(1)}
              className="text-xs font-bold text-warmgray-500 hover:text-warmgray-800 dark:text-warmgray-400"
            >
              ← Back to Selection
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-3 bg-bloom-500 hover:bg-bloom-600 text-white rounded-full font-bold text-xs shadow-cozy transition-all"
            >
              Review Design & Place Order →
            </button>
          </div>

        </div>
      )}

      {/* Step 3: Review & Order Options */}
      {step === 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in">
          
          {/* Summary Box */}
          <div className="lg:col-span-7 bg-white dark:bg-warmgray-900 rounded-3xl p-5 sm:p-7 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft space-y-5">
            <h3 className="font-serif font-bold text-lg text-warmgray-900 dark:text-white">
              Bespoke Commission Summary
            </h3>

            <div className="flex gap-3.5 p-3.5 rounded-2xl bg-warmgray-50 dark:bg-warmgray-800/60 border border-warmgray-100 dark:border-warmgray-700">
              <img src={currentTypeObj.image} alt="preview" className="w-16 h-16 rounded-xl object-cover" />
              <div>
                <h4 className="font-serif font-bold text-sm text-warmgray-900 dark:text-white">
                  {creationType}
                </h4>
                <p className="text-xs text-bloom-600 dark:text-bloom-400 font-semibold mt-0.5">
                  {stemCount} · {yarnPreference}
                </p>
                <p className="text-xs text-warmgray-500 dark:text-warmgray-400 mt-0.5">
                  Ribbon: "{ribbonMessage || 'None'}"
                </p>
              </div>
            </div>

            {/* Selected Color Swatches */}
            <div>
              <p className="text-xs font-bold text-warmgray-700 dark:text-warmgray-300 mb-1.5">
                Custom Yarn Palette:
              </p>
              <div className="flex gap-2">
                {selectedColors.map((c, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-warmgray-100 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-xs">
                    <span style={{ backgroundColor: c }} className="w-3.5 h-3.5 rounded-full border" />
                    <span className="font-mono text-[10px] text-warmgray-600 dark:text-warmgray-300">{c}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Flowers */}
            {selectedFlowers.length > 0 && (
              <div>
                <p className="text-xs font-bold text-warmgray-700 dark:text-warmgray-300 mb-1.5">
                  Flower Varieties:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedFlowers.map(f => (
                    <span key={f} className="text-xs px-2.5 py-1 rounded-lg bg-rosewood-50 dark:bg-rosewood-950 text-rosewood-800 dark:text-rosewood-200 border border-rosewood-200 dark:border-rosewood-800">
                      🌸 {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Estimated Price */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-bloom-50 to-rosewood-50 dark:from-warmgray-800 dark:to-warmgray-800 border border-bloom-200 dark:border-bloom-800/50 flex justify-between items-center">
              <div>
                <span className="text-xs font-semibold text-warmgray-600 dark:text-warmgray-300">
                  Estimated Handcraft Value
                </span>
                <p className="text-xl sm:text-2xl font-serif font-bold text-bloom-600 dark:text-bloom-400">
                  ₹{estimatedPrice.toLocaleString('en-IN')}
                </p>
              </div>
              <span className="text-xs text-warmgray-500 dark:text-warmgray-400">
                ⏱️ ~10-14 hours artisan crafting
              </span>
            </div>

            <div className="space-y-2.5 pt-1">
              <button
                onClick={handleAddToCart}
                className="w-full py-3.5 bg-gradient-to-r from-bloom-500 to-rosewood-500 hover:from-bloom-600 hover:to-rosewood-600 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-cozy flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Basket & Proceed to Checkout (₹{estimatedPrice.toLocaleString('en-IN')})</span>
              </button>

              <p className="text-center text-[11px] text-warmgray-400">
                Or submit an inquiry below to discuss custom details with Aanu first before paying.
              </p>
            </div>
          </div>

          {/* Form for Inquiry */}
          <div className="lg:col-span-5 bg-warmgray-50 dark:bg-warmgray-900/60 rounded-3xl p-5 sm:p-7 border border-warmgray-200/80 dark:border-warmgray-800 space-y-3.5">
            <h4 className="font-serif font-bold text-base text-warmgray-900 dark:text-white">
              Send Commission Inquiry
            </h4>
            <p className="text-xs text-warmgray-500 dark:text-warmgray-400 leading-relaxed">
              Prefer to chat with Aanu first? Fill in your details and she will email you with a personalized sketch and timeline.
            </p>

            <form onSubmit={handleInquirySubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Samantha Reed"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl bg-white dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. samantha@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl bg-white dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-warmgray-900 hover:bg-black text-white dark:bg-warmgray-800 dark:hover:bg-warmgray-700 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Sending to Aanu...' : 'Send Inquiry to Artisan Aanu'}</span>
              </button>
            </form>
          </div>

        </div>
      )}

      {/* Step 4: Success Message */}
      {step === 4 && (
        <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-8 sm:p-10 text-center max-w-lg mx-auto border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft-lg animate-in zoom-in-95 space-y-3">
          <div className="w-14 h-14 bg-rosewood-100 dark:bg-rosewood-950 text-rosewood-500 rounded-full mx-auto flex items-center justify-center shadow-cozy">
            <Heart className="w-7 h-7 fill-rosewood-500" />
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-warmgray-900 dark:text-white">
            Commission Inquiry Received!
          </h2>
          <p className="text-xs sm:text-sm text-warmgray-600 dark:text-warmgray-300 leading-relaxed">
            Thank you, {customerName}! Artisan Aanu has received your palette and stitch specifications and will reach out to <strong>{customerEmail}</strong> within 24 hours.
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="px-5 py-2.5 bg-bloom-500 hover:bg-bloom-600 text-white rounded-full font-bold text-xs shadow-cozy mt-3"
          >
            Return to Storefront
          </button>
        </div>
      )}

    </div>
  );
};
