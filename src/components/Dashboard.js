import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import Clock from './Clock';
import Icon from './Icon';
import {
  formatClockTime,
  formatOffset,
  formatTimeDifference,
  getTimeZoneOffset,
  getZoneAbbrev,
  getZoneLongName,
  getPrettyZoneName,
} from '../utils/timezone';

const Dashboard = ({
  time,
  timeZone,
  deviceTimeZone,
  status,
  location,
  onRetry,
  onOpenPicker,
  onOpenWorld,
  onOpenDetail,
  onOpenLocationDetail,
  settings,
}) => {
  const deviceOffset = useMemo(() => getTimeZoneOffset(time, deviceTimeZone), [time, deviceTimeZone]);
  const zoneOffset = useMemo(() => getTimeZoneOffset(time, timeZone), [time, timeZone]);
  const deviceTime = formatClockTime(time, deviceTimeZone, settings);
  const zoneTime = formatClockTime(time, timeZone, settings);

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        timeZone,
      }),
    [timeZone],
  );

  const hasFix = status === 'ready' && location;

  return (
    <div className="dashboard">
      <div className="status-line" aria-live="polite">
        <span className="status-dot" />
        <span className="status-text">Synchronized</span>
        <span className="status-sub">Precision Horology</span>
      </div>

      <Clock time={time} timeZone={timeZone} onTimezoneRequest={onOpenPicker} />

      <div className="dashboard-date">{dateFormatter.format(time)}</div>

      <div className="dashboard-tools">
        <button type="button" className="search-pill" onClick={onOpenPicker}>
          <Icon name="search" size={18} />
          <span>Search timezones</span>
        </button>
        <button type="button" className="chip chip-action" onClick={onOpenWorld}>
          <Icon name="globe" size={16} />
          World View
        </button>
      </div>

      <div className="cards-grid">
        <section className="glass-card" aria-label="Device time">
          <div className="glass-card-top">
            <span className="glass-card-icon"><Icon name="smartphone" size={18} /></span>
            <span className="glass-card-label">Device Time</span>
          </div>
          <time className="glass-card-time">{deviceTime}</time>
          <span className="chip">Local Network</span>
        </section>

        <button type="button" className="glass-card glass-card-button" onClick={onOpenDetail} aria-label={`Open details for ${getPrettyZoneName(timeZone)}`}>
          <div className="glass-card-top">
            <span className="glass-card-icon"><Icon name="globe" size={18} /></span>
            <span className="glass-card-label">Selected Zone</span>
          </div>
          <time className="glass-card-time">{zoneTime}</time>
          <span className="chip chip-offset">{formatTimeDifference(zoneOffset, deviceOffset)}</span>
          <span className="glass-card-mono">
            {getZoneAbbrev(time, timeZone)} ({formatOffset(zoneOffset)})
          </span>
        </button>

        <button type="button" className="glass-card glass-card-button" onClick={onOpenLocationDetail} aria-label="Open location details">
          <div className="glass-card-top">
            <span className="glass-card-icon"><Icon name="myLocation" size={18} /></span>
            <span className="glass-card-label">Current Position</span>
          </div>
          <div className="glass-card-title">{hasFix ? getPrettyZoneName(deviceTimeZone) : 'No GPS fix yet'}</div>
          <span className="glass-card-mono">
            {hasFix ? getZoneLongName(time, deviceTimeZone) : 'Tap to retry'}
          </span>
        </button>

        <section className="glass-card" aria-label="Satellite fix">
          <div className="glass-card-top">
            <span className="glass-card-icon"><Icon name="satellite" size={18} /></span>
            <span className="glass-card-label">{hasFix ? '3D Fix' : 'No Fix'}</span>
          </div>
          <div className="glass-card-title">
            {hasFix ? `Acc: ${location.accuracy.toFixed(1)}m` : 'Waiting for lock…'}
          </div>
          <button type="button" className="icon-button glass-card-refresh" onClick={onRetry} aria-label="Refresh location">
            <Icon name="refresh" size={18} />
          </button>
        </section>
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  time: PropTypes.instanceOf(Date).isRequired,
  timeZone: PropTypes.string.isRequired,
  deviceTimeZone: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  location: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    accuracy: PropTypes.number,
    timestamp: PropTypes.number,
  }),
  onRetry: PropTypes.func.isRequired,
  onOpenPicker: PropTypes.func.isRequired,
  onOpenWorld: PropTypes.func.isRequired,
  onOpenDetail: PropTypes.func.isRequired,
  onOpenLocationDetail: PropTypes.func.isRequired,
  settings: PropTypes.shape({
    hour12: PropTypes.bool,
    showSeconds: PropTypes.bool,
  }).isRequired,
};

export default Dashboard;
