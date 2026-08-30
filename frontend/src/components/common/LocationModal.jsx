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
  const [isSearchingPin, setIsSearchingPin] = useState(false);

  React.useEffect(() => {
    if (!isLocationModalOpen) return;

    window.history.pushState({ modal: 'location' }, '');
    const handlePop = () => {
      closeLocationModal();
    };

    window.addEventListener('popstate', handlePop);
    return () => {
      window.removeEventListener('popstate', handlePop);
    };
  }, [isLocationModalOpen]);

  if (!isLocationModalOpen) return null;

  const handleApplyPin = async (e) => {
    e.preventDefault();
    const cleanPin = pincode.trim();
    if (cleanPin.length !== 6 || !/^\d{6}$/.test(cleanPin)) {
      setErrorMsg('Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    setIsSearchingPin(true);
    setErrorMsg('');

    try {
      // 1. Fetch exact post office & district from Postal PIN Code API
      const res = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`);
      const data = await res.json();

      if (data && Array.isArray(data) && data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
        const poList = data[0].PostOffice;
        const firstPo = poList[0];
        const district = firstPo.District || firstPo.Division || firstPo.Block || '';
        const state = firstPo.State || 'India';
        const poName = firstPo.Name || '';

        // Generate precise city / locality name
        const city = poName && district && poName !== district
          ? `${poName}, ${district}`
          : (district || poName || 'India');

        setManualLocation({
          city,
          state,
          zip: cleanPin
        });
        setPincode('');
        setErrorMsg('');
      } else {
        // 2. Fallback to OpenStreetMap Nominatim for Indian postal code search
        const osmRes = await fetch(`https://nominatim.openstreetmap.org/search?postalcode=${cleanPin}&country=India&format=json&addressdetails=1`);
        const osmData = await osmRes.json();

        if (osmData && osmData.length > 0) {
          const addr = osmData[0].address || {};
          const city = addr.city || addr.town || addr.village || addr.county || addr.state_district || 'India';
          const state = addr.state || 'India';

          setManualLocation({
            city,
            state,
            zip: cleanPin
          });
          setPincode('');
          setErrorMsg('');
        } else {
          setErrorMsg(`Could not find real location for PIN "${cleanPin}". Please check and try again.`);
        }
      }
    } catch (err) {
      console.error('PIN lookup error:', err);
      setErrorMsg('Network error while checking PIN code. Please try again.');
    } finally {
      setIsSearchingPin(false);
    }
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
                disabled={isSearchingPin || pincode.length !== 6}
                className="w-full py-2.5 bg-warmgray-900 hover:bg-black dark:bg-warmgray-800 dark:hover:bg-warmgray-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isSearchingPin ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Checking...</span>
                  </>
                ) : (
                  <span>Apply</span>
                )}
              </button>
            </div>
          </div>

          {errorMsg && (
            <p className="text-[11px] text-red-500 font-medium">{errorMsg}</p>
          )}

          {/* Quick Pune Localities */}
          <div className="pt-2">
            <span className="text-[10px] uppercase font-bold text-warmgray-400 block mb-1.5">
              🌸 Select Pune Neighborhood
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { name: 'Kothrud', pin: '411038' },
                { name: 'Baner / Balewadi', pin: '411045' },
                { name: 'Hinjawadi / Wakad', pin: '411057' },
                { name: 'Viman Nagar', pin: '411014' },
                { name: 'Koregaon Park', pin: '411001' },
                { name: 'Hadapsar / Magarpatta', pin: '411028' },
                { name: 'PCMC / Pimpri', pin: '411018' },
                { name: 'Aundh / Shivaji Nagar', pin: '411007' }
              ].map((c) => (
                <button
                  key={c.pin}
                  type="button"
                  onClick={() => setManualLocation({ city: `Pune (${c.name})`, state: 'Maharashtra', zip: c.pin })}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-warmgray-100 dark:bg-warmgray-800 hover:bg-bloom-50 dark:hover:bg-bloom-950 text-warmgray-700 dark:text-warmgray-300 hover:text-bloom-600 transition-colors border border-warmgray-200 dark:border-warmgray-700"
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
