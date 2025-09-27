import { useCallback, useEffect, useRef, useState } from 'react';

const GEO_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 60000,
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

  const clearWatch = useCallback(() => {
    if (watchId.current !== null && navigator.geolocation?.clearWatch) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
  }, []);

  const successHandler = useCallback((position) => {
    const { latitude, longitude, accuracy } = position.coords;
    setLocation({
      latitude,
      longitude,
      accuracy,
      timestamp: position.timestamp,
    });
    setStatus('ready');
    setError(null);
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

    try {
      const id = navigator.geolocation.watchPosition(
        successHandler,
        errorHandler,
        GEO_OPTIONS,
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
