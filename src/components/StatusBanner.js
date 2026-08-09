import React, { useEffect, useState } from 'react';

import Icon from './Icon';

const StatusBanner = () => {
  const [online, setOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (online) {
    return null;
  }

  return (
    <div className="status-banner" role="status" aria-live="assertive">
      <Icon name="refresh" size={18} />
      <p>Offline — location and timezone sync unavailable</p>
    </div>
  );
};

export default StatusBanner;
