import React, { useState } from 'react';
import { MapPin, Navigation, X, Check, Truck, Sparkles, Loader2 } from 'lucide-react';
import { useLocation } from '../../context/LocationContext';

export const LocationModal = () => {
  const {
    location,
    isDetecting,
    isLocationModalOpen,
    closeLocationModal,
    detectCurrentLocation,
    setManualLocation
  } = useLocation();

  const [pincode, setPincode] = useState('');
  const [cityInput, setCityInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isLocationModalOpen) return null;

  // Common Indian PIN Code / Metro Lookup Table
  const pinDatabase = {
    '560': { city: 'Bengaluru', state: 'Karnataka', days: '1 - 2 Days' },
    '400': { city: 'Mumbai', state: 'Maharashtra', days: '2 - 3 Days' },
    '110': { city: 'New Delhi', state: 'Delhi NCR', days: '2 - 3 Days' },
    '500': { city: 'Hyderabad', state: 'Telangana', days: '2 - 3 Days' },
    '600': { city: 'Chennai', state: 'Tamil Nadu', days: '2 - 3 Days' },
    '700': { city: 'Kolkata', state: 'West Bengal', days: '3 - 4 Days' },
    '411': { city: 'Pune', state: 'Maharashtra', days: '2 - 3 Days' },
    '380': { city: 'Ahmedabad', state: 'Gujarat', days: '2 - 3 Days' },
    '302': { city: 'Jaipur', state: 'Rajasthan', days: '2 - 4 Days' },
    '226': { city: 'Lucknow', state: 'Uttar Pradesh', days: '3 - 4 Days' }
  };

  const handleApplyPin = (e) => {
    e.preventDefault();
    if (pincode.length !== 6 || !/^\d+$/.test(pincode)) {
      setErrorMsg('Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    const prefix = pincode.substring(0, 3);
    const match = pinDatabase[prefix] || { city: cityInput || 'India Metro', state: 'India', days: '2 - 4 Days' };

    setManualLocation({
      city: cityInput || match.city,
      state: match.state,
      zip: pincode
    });
    setPincode('');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative bg-white dark:bg-warmgray-900 rounded-3xl p-6 max-w-md w-full border border-warmgray-200 dark:border-warmgray-800 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-bloom-100 dark:bg-bloom-950 text-bloom-600 dark:text-bloom-400 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-warmgray-900 dark:text-white">
                Choose Delivery Location
              </h3>
              <p className="text-xs text-warmgray-500">
                Select your area to see accurate delivery speed & craft times.
              </p>
            </div>
          </div>

          <button
            onClick={closeLocationModal}
            className="p-1.5 text-warmgray-400 hover:text-warmgray-700 dark:hover:text-warmgray-200 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click GPS Permission Button */}
        <button
          onClick={detectCurrentLocation}
          disabled={isDetecting}
          className="w-full p-4 rounded-2xl bg-gradient-to-r from-bloom-500 to-rosewood-500 hover:from-bloom-600 hover:to-rosewood-600 text-white font-bold text-xs shadow-cozy flex items-center justify-center gap-2 transition-all transform active:scale-98 disabled:opacity-75"
        >
          {isDetecting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Detecting Your GPS Location...</span>
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4" />
              <span>Use My Current Location (GPS) ⚡</span>
            </>
          )}
        </button>

        {/* Current Active Location Pill */}
        <div className="p-3.5 rounded-2xl bg-warmgray-50 dark:bg-warmgray-800/60 border border-warmgray-200 dark:border-warmgray-700 flex items-center justify-between">
          <div className="text-xs">
            <span className="text-[10px] uppercase font-bold text-warmgray-400 block">
              Currently Delivering To:
            </span>
            <strong className="text-warmgray-900 dark:text-white block font-medium">
              📍 {location.city}, {location.state} ({location.zip})
            </strong>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <Truck className="w-3 h-3" />
              {location.estimatedDays}
            </span>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-warmgray-200 dark:border-warmgray-800 w-full" />
          <span className="bg-white dark:bg-warmgray-900 px-3 text-[11px] font-bold text-warmgray-400 uppercase tracking-wider absolute">
            or enter PIN code
          </span>
        </div>

        {/* Manual PIN Code Form */}
        <form onSubmit={handleApplyPin} className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="block text-[11px] font-semibold text-warmgray-700 dark:text-warmgray-300 mb-1">
                Indian 6-Digit PIN Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => {
                  setPincode(e.target.value.replace(/\D/g, ''));
                  setErrorMsg('');
                }}
                placeholder="e.g. 560038, 400050"
                className="w-full text-xs p-2.5 rounded-xl bg-warmgray-50 dark:bg-warmgray-800 border border-warmgray-200 dark:border-warmgray-700 text-warmgray-900 dark:text-white font-mono"
              />
            </div>

            <div className="col-span-1 flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 bg-warmgray-900 hover:bg-black dark:bg-warmgray-800 dark:hover:bg-warmgray-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                Apply
              </button>
            </div>
          </div>

          {errorMsg && (
            <p className="text-[11px] text-red-500 font-medium">{errorMsg}</p>
          )}

          {/* Quick Popular Cities */}
          <div className="pt-2">
            <span className="text-[10px] uppercase font-bold text-warmgray-400 block mb-1.5">
              Popular Cities
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { city: 'Bengaluru', pin: '560038', state: 'Karnataka' },
                { city: 'Mumbai', pin: '400050', state: 'Maharashtra' },
                { city: 'Delhi NCR', pin: '110001', state: 'Delhi' },
                { city: 'Hyderabad', pin: '500081', state: 'Telangana' },
                { city: 'Pune', pin: '411001', state: 'Maharashtra' }
              ].map((c) => (
                <button
                  key={c.pin}
                  type="button"
                  onClick={() => setManualLocation({ city: c.city, state: c.state, zip: c.pin })}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-warmgray-100 dark:bg-warmgray-800 hover:bg-bloom-50 dark:hover:bg-bloom-950 text-warmgray-700 dark:text-warmgray-300 hover:text-bloom-600 transition-colors border border-warmgray-200 dark:border-warmgray-700"
                >
                  {c.city}
                </button>
              ))}
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
