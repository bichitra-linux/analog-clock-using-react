import { useEffect, useState } from 'react';

const PINS_KEY = 'chrono:pins';
const HOME_KEY = 'chrono:home';

const loadPins = () => {
  try {
    const raw = localStorage.getItem(PINS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

const loadHome = () => {
  try {
    return localStorage.getItem(HOME_KEY);
  } catch (error) {
    return null;
  }
};

const useFavorites = () => {
  const [pins, setPins] = useState(loadPins);
  const [home, setHome] = useState(loadHome);

  useEffect(() => {
    try {
      localStorage.setItem(PINS_KEY, JSON.stringify(pins));
    } catch (error) {
      /* storage unavailable */
    }
  }, [pins]);

  useEffect(() => {
    try {
      if (home) {
        localStorage.setItem(HOME_KEY, home);
      } else {
        localStorage.removeItem(HOME_KEY);
      }
    } catch (error) {
      /* storage unavailable */
    }
  }, [home]);

  const pin = (zone) => setPins((current) => (current.includes(zone) ? current : [...current, zone]));
  const unpin = (zone) => setPins((current) => current.filter((z) => z !== zone));
  const setAsHome = (zone) => {
    setHome(zone);
    setPins((current) => (current.includes(zone) ? current : [...current, zone]));
  };

  return { pins, home, pin, unpin, setAsHome };
};

export default useFavorites;
