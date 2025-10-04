import { useCallback, useEffect, useRef, useState } from 'react';

// Start with high accuracy settings
const GEO_OPTIONS_HIGH_ACCURACY = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0,
};

// Fallback to more lenient settings if high accuracy fails
const GEO_OPTIONS_FALLBACK = {
  enableHighAccuracy: false,
  timeout: 5000,
  maximumAge: 30000,
};

const mapErrorToStatus = (code) => {
  switch (code) {
    case 1:
      return 'denied';
    case 2:
      return 'error';
    case 3:
      return 'error';
    default:
      return 'error';
  }
};

const useGeolocation = () => {
  const [status, setStatus] = useState('idle');
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const watchId = useRef(null);
  const locationRef = useRef(null);

  const clearWatch = useCallback(() => {
    if (watchId.current !== null && navigator.geolocation?.clearWatch) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
  }, []);

  const successHandler = useCallback((position) => {
    const { latitude, longitude, accuracy } = position.coords;
    
    // Progressive accuracy: Show first reading immediately, then only update if accuracy improves
    // This provides immediate feedback while GPS gets progressively more accurate
    const currentLocation = locationRef.current;
    
    if (!currentLocation || accuracy < currentLocation.accuracy) {
      const newLocation = {
        latitude,
        longitude,
        accuracy,
        timestamp: position.timestamp,
      };
      locationRef.current = newLocation;
      setLocation(newLocation);
      setStatus('ready');
      setError(null);
    }
  }, []);

  const errorHandler = useCallback(
    (geoError) => {
      const derivedStatus = mapErrorToStatus(geoError.code);
      setStatus(derivedStatus);
      setError(geoError);
      clearWatch();
    },
    [clearWatch],
  );

  const requestLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setStatus('unsupported');
      setError(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    setStatus('loading');
    setError(null);

    // First, try to get a quick position with fallback settings to show something immediately
    navigator.geolocation.getCurrentPosition(
      successHandler,
      () => {
        // If quick position fails, continue anyway with watchPosition
      },
      GEO_OPTIONS_FALLBACK,
    );

    // Then start watching for high accuracy updates
    try {
      const id = navigator.geolocation.watchPosition(
        successHandler,
        errorHandler,
        GEO_OPTIONS_HIGH_ACCURACY,
      );
      watchId.current = id;
    } catch (err) {
      setStatus('error');
      setError(err);
    }
  }, [errorHandler, successHandler]);

  useEffect(() => {
    requestLocation();
    return () => clearWatch();
  }, [clearWatch, requestLocation]);

  return {
    status,
    location,
    error,
    requestLocation,
  };
};

export default useGeolocation;
