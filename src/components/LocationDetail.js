import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import Icon from './Icon';
import { formatOffset, getTimeZoneOffset, getZoneAbbrev, getZoneLongName, getPrettyZoneName } from '../utils/timezone';

const formatCoord = (value, type) =>
  `${Math.abs(value).toFixed(3)}° ${value >= 0 ? (type === 'lat' ? 'N' : 'E') : type === 'lat' ? 'S' : 'W'}`;

const hasDst = (timeZone) => {
  try {
    const now = getTimeZoneOffset(new Date(), timeZone);
    const january = getTimeZoneOffset(new Date(Date.UTC(new Date().getFullYear(), 0, 15)), timeZone);
    return now !== january;
  } catch (error) {
    return false;
  }
};

const LocationDetail = ({ status, location, deviceTimeZone, onRetry, onBack }) => {
  const offset = useMemo(() => getTimeZoneOffset(new Date(), deviceTimeZone), [deviceTimeZone]);
  const hasFix = status === 'ready' && location;

  return (
    <div className="location-detail">
      <div className="detail-header">
        <button type="button" className="icon-button" onClick={onBack} aria-label="Go back">
          <Icon name="back" size={22} />
        </button>
        <div className="detail-header-text">
          <h1 className="detail-title">Location Intel</h1>
          <span className="glass-card-mono">{hasFix ? '3D Fix' : 'Acquiring Satellite Lock…'}</span>
        </div>
      </div>

      {hasFix ? (
        <>
          <div className="location-coords">
            <span className="mono">LAT {formatCoord(location.latitude, 'lat')}</span>
            <span className="mono">LON {formatCoord(location.longitude, 'lng')}</span>
          </div>

          <div className="detail-tiles">
            <div className="detail-tile">
              <span className="detail-tile-label">PRECISION</span>
              <span className="detail-tile-value">±{Math.round(location.accuracy)} M</span>
            </div>
            <div className="detail-tile">
              <span className="detail-tile-label">UPDATED</span>
              <span className="detail-tile-value">{new Date(location.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>

          <div className="glass-card detail-zone-info">
            <div className="detail-info-row">
              <span className="detail-info-label">Zone Name</span>
              <span className="detail-info-value">{getZoneLongName(new Date(), deviceTimeZone)}</span>
            </div>
            <div className="detail-info-row">
              <span className="detail-info-label">UTC Offset</span>
              <span className="detail-info-value mono">{formatOffset(offset)}</span>
            </div>
            <div className="detail-info-row">
              <span className="detail-info-label">Daylight Saving</span>
              <span className="detail-info-value">{hasDst(deviceTimeZone) ? 'Active' : 'Inactive'}</span>
            </div>
            <div className="detail-info-row">
              <span className="detail-info-label">Identifier</span>
              <span className="detail-info-value mono">{getPrettyZoneName(deviceTimeZone)} ({getZoneAbbrev(new Date(), deviceTimeZone)})</span>
            </div>
          </div>

          <p className="privacy-note">
            <Icon name="lock" size={14} />
            Processed locally — no cloud synchronization
          </p>

          <button type="button" className="button button-primary button-full" onClick={onRetry}>
            <Icon name="refresh" size={18} />
            Update Location
          </button>
        </>
      ) : (
        <div className="empty-state">
          <span className="spinner" />
          <p className="empty-state-title">{status === 'denied' ? 'Location access blocked' : 'Waiting for GPS lock…'}</p>
          <p className="empty-state-subtitle">
            {status === 'denied'
              ? 'Enable permissions and retry'
              : 'Your position will appear here once satellites are acquired'}
          </p>
          <button type="button" className="button button-primary" onClick={onRetry}>
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

LocationDetail.propTypes = {
  status: PropTypes.string.isRequired,
  location: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    accuracy: PropTypes.number,
    timestamp: PropTypes.number,
  }),
  deviceTimeZone: PropTypes.string.isRequired,
  onRetry: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default LocationDetail;
