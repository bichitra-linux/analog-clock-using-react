import React, { useCallback, useEffect, useMemo, useState } from 'react';

import './App.css';
import AppHeader from './components/AppHeader';
import BottomNav from './components/BottomNav';
import Dashboard from './components/Dashboard';
import WorldView from './components/WorldView';
import TimezoneDetail from './components/TimezoneDetail';
import LocationDetail from './components/LocationDetail';
import TimezoneModal from './components/TimezoneModal';
import SettingsModal from './components/SettingsModal';
import AlarmsView from './components/AlarmsView';
import RingingAlarm from './components/RingingAlarm';
import StopwatchView from './components/StopwatchView';
import TimerView from './components/TimerView';
import LoadingOverlay from './components/LoadingOverlay';
import StatusBanner from './components/StatusBanner';
import useDeviceTime from './hooks/useDeviceTime';
import useGeolocation from './hooks/useGeolocation';
import useSettings from './hooks/useSettings';
import useFavorites from './hooks/useFavorites';
import useAlarms from './hooks/useAlarms';
import useStopwatch from './hooks/useStopwatch';
import useTimer from './hooks/useTimer';
import tzLookup from 'tz-lookup';

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
  const [pickerIntent, setPickerIntent] = useState('main');
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [tab, setTab] = useState('clocks');
  const [clocksView, setClocksView] = useState('dashboard');
  const [detailZone, setDetailZone] = useState(null);

  const { settings, update } = useSettings();
  const { pins, home, pin, unpin, setAsHome } = useFavorites();
  const alarmsApi = useAlarms(time);
  const stopwatch = useStopwatch();
  const timer = useTimer();

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
      if (pickerIntent === 'pin') {
        pin(zone);
      } else {
        applyManualZone(zone);
      }
      setZoneModalOpen(false);
    },
    [pickerIntent, pin, applyManualZone],
  );

  const handleZoneModalClose = useCallback(() => {
    setZoneModalOpen(false);
  }, []);

  const openPicker = useCallback(() => {
    setPickerIntent('main');
    setZoneModalOpen(true);
  }, []);

  const openPinPicker = useCallback(() => {
    setPickerIntent('pin');
    setZoneModalOpen(true);
  }, []);

  const openDetail = useCallback((zone) => {
    setDetailZone(zone);
    setClocksView('detail');
  }, []);

  const derivedZone = useMemo(() => {
    if (status === 'ready' && location) {
      try {
        return tzLookup(location.latitude, location.longitude);
      } catch (err) {
        return null;
      }
    }
    return null;
  }, [status, location]);

  const clocksViewContent = () => {
    switch (clocksView) {
      case 'world':
        return (
          <WorldView
            time={time}
            pins={pins}
            home={home}
            deviceTimeZone={defaultZone}
            onAddPin={openPinPicker}
            onOpenDetail={openDetail}
            onOpenLocation={() => setClocksView('location')}
            settings={settings}
          />
        );
      case 'detail':
        return detailZone ? (
          <TimezoneDetail
            time={time}
            zone={detailZone}
            deviceTimeZone={defaultZone}
            isHome={home === detailZone}
            isPinned={pins.includes(detailZone)}
            onSetHome={() => setAsHome(detailZone)}
            onRemove={pins.includes(detailZone) ? () => unpin(detailZone) : null}
            onBack={() => setClocksView('world')}
            settings={settings}
          />
        ) : (
          <Dashboard
            time={time}
            timeZone={timeZone}
            deviceTimeZone={defaultZone}
            status={status}
            location={location}
            onRetry={requestLocation}
            onOpenPicker={openPicker}
            onOpenWorld={() => setClocksView('world')}
            onOpenDetail={() => openDetail(timeZone)}
            onOpenLocationDetail={() => setClocksView('location')}
            settings={settings}
          />
        );
      case 'location':
        return (
          <LocationDetail
            status={status}
            location={location}
            deviceTimeZone={defaultZone}
            onRetry={requestLocation}
            onBack={() => setClocksView('dashboard')}
          />
        );
      case 'dashboard':
      default:
        return (
          <Dashboard
            time={time}
            timeZone={timeZone}
            deviceTimeZone={defaultZone}
            status={status}
            location={location}
            onRetry={requestLocation}
            onOpenPicker={openPicker}
            onOpenWorld={() => setClocksView('world')}
            onOpenDetail={() => openDetail(timeZone)}
            onOpenLocationDetail={() => setClocksView('location')}
            settings={settings}
          />
        );
    }
  };

  return (
    <div className="app-shell">
      <AppHeader onOpenSettings={() => setSettingsOpen(true)} />

      <main className="app-content" role="main">
        {tab === 'clocks' && clocksViewContent()}
        {tab === 'alarms' && (
          <AlarmsView
            alarms={alarmsApi.alarms}
            time={time}
            onAdd={alarmsApi.addAlarm}
            onUpdate={alarmsApi.updateAlarm}
            onDelete={alarmsApi.deleteAlarm}
            onToggle={alarmsApi.toggleAlarm}
            settings={settings}
          />
        )}
        {tab === 'stopwatch' && <StopwatchView stopwatch={stopwatch} />}
        {tab === 'timer' && <TimerView timer={timer} time={time} />}
      </main>

      <BottomNav tab={tab} onChange={setTab} />

      <LoadingOverlay
        visible={status === 'loading'}
        message="Grabbing your precise location…"
      />

      <StatusBanner />

      <TimezoneModal
        open={isZoneModalOpen}
        value={timeZone}
        onChange={handleZoneModalChange}
        onClose={handleZoneModalClose}
        title={pickerIntent === 'pin' ? 'Add City' : 'Select Timezone'}
        nearbyZone={derivedZone}
        deviceTimeZone={defaultZone}
      />

      <SettingsModal
        open={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        update={update}
      />

      {alarmsApi.ringingAlarm && (
        <RingingAlarm
          alarm={alarmsApi.ringingAlarm}
          volume={settings.alarmVolume}
          hour12={settings.hour12}
          onDismiss={alarmsApi.dismiss}
          onSnooze={alarmsApi.snooze}
        />
      )}
    </div>
  );
};

export default App;
