import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

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

const hasDst = (timeZone) => {
  try {
    const now = getTimeZoneOffset(new Date(), timeZone);
    const january = getTimeZoneOffset(new Date(Date.UTC(new Date().getFullYear(), 0, 15)), timeZone);
    return now !== january;
  } catch (error) {
    return false;
  }
};

const TimezoneDetail = ({ time, zone, deviceTimeZone, isHome, isPinned, onSetHome, onRemove, onBack, settings }) => {
  const deviceOffset = useMemo(() => getTimeZoneOffset(time, deviceTimeZone), [time, deviceTimeZone]);
  const zoneOffset = useMemo(() => getTimeZoneOffset(time, zone), [time, zone]);

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        timeZone: zone,
      }),
    [zone],
  );

  const bigTime = formatClockTime(time, zone, { ...settings, showSeconds: true });

  return (
    <div className="timezone-detail">
      <div className="detail-header">
        <button type="button" className="icon-button" onClick={onBack} aria-label="Go back">
          <Icon name="back" size={22} />
        </button>
        <div className="detail-header-text">
          <h1 className="detail-title">{getPrettyZoneName(zone)}</h1>
          <span className="glass-card-mono">
            {getZoneAbbrev(time, zone)} ({formatOffset(zoneOffset)})
          </span>
        </div>
      </div>

      <div className="detail-time" aria-live="polite">
        {bigTime}
      </div>
      <div className="detail-date">{dateFormatter.format(time)}</div>

      <div className="detail-tiles">
        <div className="detail-tile">
          <span className="detail-tile-label">DIFFERENCE FROM LOCAL</span>
          <span className="detail-tile-value">{formatTimeDifference(zoneOffset, deviceOffset).replace(/\s(?:ahead|behind)$/, '')}</span>
        </div>
        <div className="detail-tile">
          <span className="detail-tile-label">UTC OFFSET</span>
          <span className="detail-tile-value">{formatOffset(zoneOffset)}</span>
        </div>
      </div>

      <div className="glass-card detail-zone-info">
        <div className="detail-info-row">
          <span className="detail-info-label">Zone Name</span>
          <span className="detail-info-value">{getZoneLongName(time, zone)}</span>
        </div>
        <div className="detail-info-row">
          <span className="detail-info-label">Identifier</span>
          <span className="detail-info-value mono">{zone}</span>
        </div>
        <div className="detail-info-row">
          <span className="detail-info-label">Daylight Saving</span>
          <span className="detail-info-value">{hasDst(zone) ? 'Active' : 'Inactive'}</span>
        </div>
      </div>

      <div className="detail-actions">
        <button type="button" className="glass-card glass-card-button detail-action" onClick={onSetHome}>
          <Icon name="home" size={20} />
          {isHome ? 'Home Location' : 'Set as Home'}
        </button>
        {isPinned && (
          <button type="button" className="glass-card glass-card-button detail-action detail-action-danger" onClick={onRemove}>
            <Icon name="trash" size={20} />
            Remove City
          </button>
        )}
      </div>
    </div>
  );
};

TimezoneDetail.propTypes = {
  time: PropTypes.instanceOf(Date).isRequired,
  zone: PropTypes.string.isRequired,
  deviceTimeZone: PropTypes.string.isRequired,
  isHome: PropTypes.bool.isRequired,
  isPinned: PropTypes.bool.isRequired,
  onSetHome: PropTypes.func.isRequired,
  onRemove: PropTypes.func,
  onBack: PropTypes.func.isRequired,
  settings: PropTypes.shape({
    hour12: PropTypes.bool,
    showSeconds: PropTypes.bool,
  }).isRequired,
};

export default TimezoneDetail;
