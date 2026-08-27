import React, { useState } from 'react';
import { Palette, Sparkles, Check, Heart, Flower2, Gift, Send, ShoppingBag, Upload, X, Image as ImageIcon } from 'lucide-react';
import { api } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export const CustomOrderBuilder = ({ onNavigate }) => {
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const [step, setStep] = useState(1);
  const [creationType, setCreationType] = useState('Custom Forever Flower Bouquet');
  const [pipe cleanersPreference, setpipe cleanersPreference] = useState('100% Combed Milk Cotton');
  const [selectedColors, setSelectedColors] = useState(['#F4B6C2', '#FFFFFF', '#9EB29C']);
  const [selectedFlowers, setSelectedFlowers] = useState(['Pink Tulips', 'White Daisies', 'Eucalyptus Leaves']);
  const [stemCount, setStemCount] = useState('Classic 9 Stems');
  const [ribbonMessage, setRibbonMessage] = useState('Forever In Bloom');
  const [specialNotes, setSpecialNotes] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoName, setPhotoName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const creationOptions = [
    {
      id: 'bouquet',
      name: 'Custom Forever Flower Bouquet',
      priceBase: 1499,
      image: '/images/category/4th_category_bouquet.jpeg',
      desc: 'Handcrafted bouquet with your choice of floral stems, custom color palette & silk ribbon text.'
    },

    {
      id: 'pot',
      name: 'Custom Handmade Flower Pot',
      priceBase: 899,
      image: '/images/category/3rd_category_flowerpot.jpeg',
      desc: 'Beautiful pipe cleaner flowers planted in a miniature rustic pot for your desk or home.'
    },
    {
      id: 'keychain',
      name: 'Custom Floral Keychain',
      priceBase: 399,
      image: '/images/category/1st_category_flower.jpeg',
      desc: 'Miniature forever flower keychain to carry your favorite blooms everywhere you go.'
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

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      addToast('Please upload an image under 8MB', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result);
      setPhotoName(file.name);
      addToast('Reference photo attached! 📷', 'success');
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    setPhotoName('');
  };

  const toggleColor = (hex) => {
    if (selectedColors.includes(hex)) {
      if (selectedColors.length > 1) {
        setSelectedColors(selectedColors.filter(c => c !== hex));
      }
    } else {
      if (selectedColors.length < 4) {
        setSelectedColors([...selectedColors, hex]);
      } else {
        addToast('You can pick up to 4 custom pipe cleaners colors', 'info');
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
      name: `Custom Order: ${creationType}`,
      slug: 'custom-artisan-order',
      price: estimatedPrice,
      originalPrice: null,
      images: photoPreview ? [photoPreview, currentTypeObj.image] : [currentTypeObj.image],
      category: 'custom-orders',
      craftTimeHours: 10,
      pipe cleanersMaterial: pipe cleanersPreference,
      colors: selectedColors.map(c => ({ name: c, hex: c })),
      sizes: [stemCount],
      referenceImage: photoPreview || null,
      description: `Custom Order with palette [${selectedColors.join(', ')}], flowers: [${selectedFlowers.join(', ')}], ribbon message: "${ribbonMessage}".${photoPreview ? ' [Reference Photo Attached]' : ''} Notes: ${specialNotes}`
    };

    addToCart(customProduct, 1, {
      selectedColor: `Palette of ${selectedColors.length} pipe cleaners Tones`,
      selectedSize: stemCount,
      customNotes: `Ribbon: "${ribbonMessage}" | Flowers: ${selectedFlowers.join(', ')} | pipe cleaners: ${pipe cleanersPreference}${photoPreview ? ' | [Reference Photo Attached]' : ''} | Notes: ${specialNotes}`
    });

    addToast('🌸 Custom order added to your basket!', 'success');
    onNavigate('checkout');
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone) {
      addToast('Please enter your name, email and phone number', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.submitCustomRequest({
        customerName,
        customerEmail,
        customerPhone,
        itemType: creationType,
        colorPalette: selectedColors,
        pipe cleanersPreference,
        specialNotes: `Flowers: ${selectedFlowers.join(', ')} | Stems: ${stemCount} | Ribbon: "${ribbonMessage}" | Notes: ${specialNotes}`,
        estimatedBudget: `₹${estimatedPrice.toLocaleString('en-IN')}`,
        referenceImage: photoPreview || null
      });

      addToast('🌸 Custom order inquiry sent to Aanu! She will contact you within 24 hours.', 'success');
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
          Custom Order Builder
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-warmgray-900 dark:text-white">
          Create Your Custom Order
        </h1>
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
              Continue to Palette & creations →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Palette, Flowers, pipe cleaners */}
      {step === 2 && (
        <div className="bg-white dark:bg-warmgray-900 rounded-3xl p-5 sm:p-7 border border-warmgray-200/80 dark:border-warmgray-800 shadow-soft space-y-6 animate-in fade-in">
          
          {/* Color Palette Selector */}
          <div>
            <div className="flex justify-between items-center mb-2.5">
              <label className="font-serif font-bold text-sm sm:text-base text-warmgray-900 dark:text-white">
                Choose pipe cleaners Color Palette (Pick 1 to 4 Colors)
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

          {/* material Selection */}
          <div>
            <label className="font-serif font-bold text-sm sm:text-base text-warmgray-900 dark:text-white block mb-2.5">
              pipe cleaners Preference
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {['100% Combed Milk Cotton', 'Super-Soft Chenille Velvet', 'Organic Bamboo Cotton'].map(pipe cleaners => (
                <button
                  key={pipe cleaners}
                  type="button"
                  onClick={() => setpipe cleanersPreference(pipe cleaners)}
                  className={`p-3 rounded-2xl text-xs font-semibold border text-center transition-all ${
                    pipe cleanersPreference === pipe cleaners
                      ? 'border-bloom-500 bg-bloom-50 dark:bg-warmgray-800 text-bloom-800 dark:text-bloom-300 shadow-xs font-bold'
                      : 'border-warmgray-200 dark:border-warmgray-800 text-warmgray-700 dark:text-warmgray-300'
                  }`}
                >
                  {pipe cleaners}
                </button>
              ))}
            </div>
          </div>

          {/* Reference Photo / Design Image Upload */}
          <div className="p-4 sm:p-5 rounded-2xl bg-warmgray-50/80 dark:bg-warmgray-800/60 border border-warmgray-200 dark:border-warmgray-700 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-serif font-bold text-sm sm:text-base text-warmgray-900 dark:text-white flex items-center gap-2">
                  <Upload className="w-4 h-4 text-bloom-600 dark:text-bloom-400" />
                  <span>Upload Reference Photo / Design Inspiration</span>
                </label>
                <p className="text-xs text-warmgray-500 dark:text-warmgray-400 mt-0.5">
                  Have a Pinterest photo, color reference, or sketch of what you want to make? Upload it here for artisan Aanu!
                </p>
              </div>
            </div>

            {photoPreview ? (
              <div className="relative inline-block mt-2">
                <img
                  src={photoPreview}
                  alt="Reference preview"
                  className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl object-cover border-2 border-bloom-500 shadow-md"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute -top-2 -right-2 p-1.5 bg-rose-600 text-white rounded-full shadow-lg hover:bg-rose-700 transition-colors"
                  title="Remove photo"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <span className="block text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1.5">
                  ✓ Photo Attached ({photoName || 'Custom Photo'})
                </span>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-warmgray-300 dark:border-warmgray-600 hover:border-bloom-500 dark:hover:border-bloom-400 rounded-2xl cursor-pointer bg-white dark:bg-warmgray-800 transition-all group">
                <div className="w-12 h-12 rounded-full bg-bloom-50 dark:bg-warmgray-700 flex items-center justify-center text-bloom-600 dark:text-bloom-400 group-hover:scale-110 transition-transform mb-2">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="text-sm font-bold text-warmgray-800 dark:text-warmgray-200">
                  Click or drag photo here to upload
                </span>
                <span className="text-xs text-warmgray-400 mt-0.5">
                  Supports JPG, PNG, WEBP (Up to 8MB)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            )}
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
              Custom Order Summary
            </h3>

            <div className="flex gap-3.5 p-3.5 rounded-2xl bg-warmgray-50 dark:bg-warmgray-800/60 border border-warmgray-100 dark:border-warmgray-700">
              <img src={photoPreview || currentTypeObj.image} alt="preview" className="w-16 h-16 rounded-xl object-cover" />
              <div>
                <h4 className="font-serif font-bold text-sm text-warmgray-900 dark:text-white">
                  {creationType}
                </h4>
                <p className="text-xs text-bloom-600 dark:text-bloom-400 font-semibold mt-0.5">
                  {stemCount} · {pipe cleanersPreference}
                </p>
                <p className="text-xs text-warmgray-500 dark:text-warmgray-400 mt-0.5">
                  Ribbon: "{ribbonMessage || 'None'}"
                </p>
                {photoPreview && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md mt-1 border border-emerald-200 dark:border-emerald-800">
                    📷 Custom Reference Photo Attached
                  </span>
                )}
              </div>
            </div>

            {/* Selected Color Swatches */}
            <div>
              <p className="text-xs font-bold text-warmgray-700 dark:text-warmgray-300 mb-1.5">
                Custom color palette:
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
              Send Custom Order Inquiry
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

              <div>
                <label className="block text-xs font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 9876543210"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
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
