import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const { addToast } = useToast();

  const [location, setLocation] = useState(() => {
    try {
      const saved = localStorage.getItem('aanublooms_delivery_location');
      return saved ? JSON.parse(saved) : {
        city: 'Pune',
        state: 'Maharashtra',
        zip: '411038',
        country: 'India',
        address: 'Kothrud, Pune',
        estimatedDays: 'Same Day / Next Day',
        isDetected: false
      };
    } catch {
      return {
        city: 'Pune',
        state: 'Maharashtra',
        zip: '411038',
        country: 'India',
        address: 'Kothrud, Pune',
        estimatedDays: 'Same Day / Next Day',
        isDetected: false
      };
    }
  });

  const [isDetecting, setIsDetecting] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('aanublooms_delivery_location', JSON.stringify(location));
  }, [location]);

  // Request Browser GPS Geolocation Permission
  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      addToast('Geolocation is not supported by your browser.', 'error');
      return;
    }

    setIsDetecting(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Free, high-accuracy reverse geocoding via OpenStreetMap Nominatim
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          if (data && data.address) {
            const city = data.address.city || data.address.town || data.address.village || data.address.state_district || 'Bengaluru';
            const state = data.address.state || 'Karnataka';
            const zip = data.address.postcode || '560001';
            const country = data.address.country || 'India';
            const address = data.display_name?.split(',').slice(0, 3).join(',') || `${city}, ${state}`;

            const detectedLocation = {
              city,
              state,
              zip,
              country,
              address,
              latitude,
              longitude,
              estimatedDays: '2 - 4 Days',
              isDetected: true
            };

            setLocation(detectedLocation);
            addToast(`📍 Location detected: ${city}, ${state} (${zip})`, 'success');
            setIsLocationModalOpen(false);
          } else {
            fallbackEstimate(latitude, longitude);
          }
        } catch (err) {
          console.warn('Reverse geocode error, using coordinate estimate:', err);
          fallbackEstimate(latitude, longitude);
        } finally {
          setIsDetecting(false);
        }
      },
      (error) => {
        setIsDetecting(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            addToast('Location access denied. You can manually enter your PIN code.', 'info');
            break;
          case error.POSITION_UNAVAILABLE:
            addToast('Location information unavailable. Please enter PIN code.', 'error');
            break;
          case error.TIMEOUT:
            addToast('Location request timed out. Please try again.', 'error');
            break;
          default:
            addToast('Unable to detect location. Please enter manually.', 'error');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const fallbackEstimate = (lat, lon) => {
    const defaultCity = 'Mumbai';
    const loc = {
      city: defaultCity,
      state: 'Maharashtra',
      zip: '400001',
      country: 'India',
      address: 'Mumbai, Maharashtra',
      estimatedDays: '2 - 3 Days',
      isDetected: true
    };
    setLocation(loc);
    addToast(`📍 Location set to ${defaultCity}, India`, 'success');
    setIsLocationModalOpen(false);
  };

  // Set location manually via Indian PIN code or City
  const setManualLocation = ({ city, state, zip }) => {
    const newLoc = {
      city: city || 'Bengaluru',
      state: state || 'Karnataka',
      zip: zip || '560001',
      country: 'India',
      address: `${city || 'Bengaluru'}, ${state || 'Karnataka'}`,
      estimatedDays: '2 - 3 Days',
      isDetected: false
    };
    setLocation(newLoc);
    addToast(`📍 Delivery location updated to ${newLoc.city} (${newLoc.zip})`, 'success');
    setIsLocationModalOpen(false);
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        isDetecting,
        isLocationModalOpen,
        openLocationModal: () => setIsLocationModalOpen(true),
        closeLocationModal: () => setIsLocationModalOpen(false),
        detectCurrentLocation,
        setManualLocation
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
