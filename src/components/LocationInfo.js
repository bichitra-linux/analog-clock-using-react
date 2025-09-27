import React from 'react';
import PropTypes from 'prop-types';

const formatCoord = (value, type) =>
  `${Math.abs(value).toFixed(3)}° ${value >= 0 ? (type === 'lat' ? 'N' : 'E') : type === 'lat' ? 'S' : 'W'}`;

const LocationInfo = ({ status, location = null, onRetry }) => {
  const renderContent = () => {
    if (status === 'unsupported') {
      return (
        <p className="card-primary">
          This device does not expose GPS data. You can still enjoy the clock with your local time.
        </p>
      );
    }

    if (status === 'denied') {
      return (
        <>
          <p className="card-primary">
            Location access is blocked. Enable permissions and retry to see your precise position.
          </p>
          <button type="button" className="button" onClick={onRetry}>
            Retry
          </button>
        </>
      );
    }

    if (status === 'error') {
      return (
        <>
          <p className="card-primary">
            We could not determine your location. Check your connection and try again.
          </p>
          <button type="button" className="button" onClick={onRetry}>
            Retry
          </button>
        </>
      );
    }

    if (status === 'ready' && location) {
      const { latitude, longitude, accuracy, timestamp } = location;
      const mapUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
      return (
        <>
          <dl className="meta-grid">
            <div>
              <dt>Latitude</dt>
              <dd>{formatCoord(latitude, 'lat')}</dd>
            </div>
            <div>
              <dt>Longitude</dt>
              <dd>{formatCoord(longitude, 'lng')}</dd>
            </div>
            <div>
              <dt>Accuracy</dt>
              <dd>{Math.round(accuracy)} m</dd>
            </div>
            <div>
              <dt>Updated</dt>
              <dd>{new Date(timestamp).toLocaleTimeString()}</dd>
            </div>
          </dl>
          <a className="button button-link" href={mapUrl} target="_blank" rel="noopener noreferrer">
            Open in Maps
          </a>
        </>
      );
    }

    return (
      <p className="card-primary">Waiting for GPS lock…</p>
    );
  };

  return (
    <section className="card" aria-label="Location information">
      <h2 className="card-title">Your Location</h2>
      {renderContent()}
    </section>
  );
};

LocationInfo.propTypes = {
  status: PropTypes.string.isRequired,
  location: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    accuracy: PropTypes.number,
    timestamp: PropTypes.number,
  }),
  onRetry: PropTypes.func.isRequired,
};

export default LocationInfo;
