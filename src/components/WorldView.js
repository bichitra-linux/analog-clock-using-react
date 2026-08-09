import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import Icon from './Icon';
import {
  formatClockTime,
  formatDayDifference,
  formatOffsetChip,
  getTimeZoneOffset,
  getZoneAbbrev,
  getPrettyZoneName,
} from '../utils/timezone';

const POPULAR = ['America/New_York', 'Europe/London', 'Asia/Tokyo', 'Asia/Dubai'];

const WorldView = ({ time, pins, home, deviceTimeZone, onAddPin, onOpenDetail, onOpenLocation, settings }) => {
  const deviceOffset = useMemo(() => getTimeZoneOffset(time, deviceTimeZone), [time, deviceTimeZone]);

  const dayChip = (zone) => {
    if (zone === deviceTimeZone) return 'Current Location';
    const dayDiff = formatDayDifference(time, zone, deviceTimeZone);
    const prefix = dayDiff > 0 ? 'Tomorrow' : dayDiff < 0 ? 'Yesterday' : 'Today';
    return `${prefix}, ${formatOffsetChip(getTimeZoneOffset(time, zone), deviceOffset)}`;
  };

  const timeLabel = (zone) => formatClockTime(time, zone, { ...settings, showSeconds: false });

  return (
    <div className="world-view">
      <button type="button" className="search-pill search-pill-full" onClick={onAddPin}>
        <Icon name="search" size={18} />
        <span>Search timezones</span>
        <Icon name="mic" size={16} className="search-pill-icon" />
      </button>

      <div className="world-popular">
        <h2 className="section-title">Popular Destinations</h2>
        <div className="popular-row">
          {POPULAR.map((zone) => (
            <button
              key={zone}
              type="button"
              className="popular-card"
              onClick={() => onOpenDetail(zone)}
              aria-label={`Open ${getPrettyZoneName(zone)}`}
            >
              <span className="popular-city">{getPrettyZoneName(zone)}</span>
              <span className="popular-time">{timeLabel(zone)}</span>
              <span className="chip chip-offset">{formatOffsetChip(getTimeZoneOffset(time, zone), deviceOffset)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="world-pinned-header">
        <h2 className="section-title">Pinned Locations</h2>
        <button type="button" className="chip chip-action" onClick={onAddPin}>
          <Icon name="add" size={16} />
          ADD
        </button>
      </div>

      {pins.length === 0 ? (
        <div className="empty-state">
          <Icon name="globe" size={40} className="empty-state-icon" />
          <p className="empty-state-title">No pinned locations</p>
          <p className="empty-state-subtitle">Add cities to build your world view</p>
        </div>
      ) : (
        <div className="pinned-list">
          {pins.map((zone) => (
            <button
              key={zone}
              type="button"
              className="glass-card glass-card-button pinned-card"
              onClick={() => onOpenDetail(zone)}
              aria-label={`Open ${getPrettyZoneName(zone)}`}
            >
              <div className="pinned-card-main">
                <span className="pinned-card-name">
                  {getPrettyZoneName(zone)}
                  {zone === home && <span className="chip chip-home"><Icon name="home" size={12} /> HOME</span>}
                </span>
                <span className={`chip ${zone === deviceTimeZone ? 'chip-active' : 'chip-offset'}`}>
                  {dayChip(zone)}
                </span>
              </div>
              <div className="pinned-card-time">
                <span className="pinned-time">{timeLabel(zone).split(' ')[0]}</span>
                <span className="pinned-ampm">{timeLabel(zone).split(' ')[1] ?? ''}</span>
              </div>
              <span className="glass-card-mono">{getZoneAbbrev(time, zone)}</span>
            </button>
          ))}
        </div>
      )}

      <button type="button" className="chip chip-action world-location" onClick={onOpenLocation}>
        <Icon name="myLocation" size={16} />
        Use my current location
      </button>
    </div>
  );
};

WorldView.propTypes = {
  time: PropTypes.instanceOf(Date).isRequired,
  pins: PropTypes.arrayOf(PropTypes.string).isRequired,
  home: PropTypes.string,
  deviceTimeZone: PropTypes.string.isRequired,
  onAddPin: PropTypes.func.isRequired,
  onOpenDetail: PropTypes.func.isRequired,
  onOpenLocation: PropTypes.func.isRequired,
  settings: PropTypes.shape({
    hour12: PropTypes.bool,
  }).isRequired,
};

export default WorldView;
