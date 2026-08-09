import { useEffect, useState } from 'react';

const STORAGE_KEY = 'chrono:settings';

export const DEFAULT_SETTINGS = {
  hour12: true,
  showSeconds: true,
  accuracy: 'high',
  alarmVolume: 85,
};

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch (error) {
    return DEFAULT_SETTINGS;
  }
};

const useSettings = () => {
  const [settings, setSettings] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      /* storage unavailable */
    }
  }, [settings]);

  const update = (patch) => setSettings((current) => ({ ...current, ...patch }));

  return { settings, update };
};

export default useSettings;
