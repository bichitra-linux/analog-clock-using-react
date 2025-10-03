import React, { useCallback, useEffect, useMemo, useState } from 'react';

import './App.css';
import Clock from './components/Clock';
import DateInfo from './components/DateInfo';
import LocationInfo from './components/LocationInfo';
import LoadingOverlay from './components/LoadingOverlay';
import useDeviceTime from './hooks/useDeviceTime';
import useGeolocation from './hooks/useGeolocation';
import tzLookup from 'tz-lookup';
import TimezoneModal from './components/TimezoneModal';

const App = () => {
  const { time } = useDeviceTime();
  const { status, location, requestLocation } = useGeolocation();
  const defaultZone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'Etc/UTC',
    [],
  );
  const [timeZone, setTimeZone] = useState(defaultZone);
  const [hasManualZone, setHasManualZone] = useState(false);
  const [isZoneModalOpen, setZoneModalOpen] = useState(false);

  useEffect(() => {
    if (status === 'ready' && location && !hasManualZone) {
      try {
        const derivedZone = tzLookup(location.latitude, location.longitude);
        setTimeZone(derivedZone);
      } catch (err) {
        console.warn('Could not derive timezone from coordinates', err);
      }
    }
  }, [status, location, hasManualZone]);

  const applyManualZone = useCallback((zone) => {
    setHasManualZone(true);
    setTimeZone(zone);
  }, []);

  const handleZoneModalChange = useCallback(
    (zone) => {
      applyManualZone(zone);
      setZoneModalOpen(false);
    },
    [applyManualZone],
  );

  const handleZoneModalClose = useCallback(() => {
    setZoneModalOpen(false);
  }, []);

  const handleZoneRequest = useCallback(() => {
    setZoneModalOpen(true);
  }, []);

  return (
    <div className="app-shell">
      <main className="app-content" role="main">
        

        <div className="clock-layout" aria-live="polite">
          <DateInfo time={time} timeZone={timeZone} deviceTimeZone={defaultZone} />
          <Clock time={time} timeZone={timeZone} onTimezoneRequest={handleZoneRequest} />
          <LocationInfo
            status={status}
            location={location}
            onRetry={requestLocation}
          />
        </div>
      </main>

      <LoadingOverlay
        visible={status === 'loading'}
        message="Grabbing your precise location…"
      />

      <TimezoneModal
        open={isZoneModalOpen}
        value={timeZone}
        onChange={handleZoneModalChange}
        onClose={handleZoneModalClose}
      />
    </div>
  );
};

export default App;
