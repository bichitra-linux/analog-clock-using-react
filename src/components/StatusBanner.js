import React from 'react';
import PropTypes from 'prop-types';

const STATUS_MESSAGES = {
  idle: 'Retrieving the essentials…',
  loading: 'Locating you securely…',
  ready: 'Synced with your device time and location.',
  denied: 'Location permission is blocked. Enable it to see local data.',
  unsupported: 'GPS is not available on this device.',
  error: 'Something went wrong while getting your location.',
};

const StatusBanner = ({ status, error = null, onRetry }) => {
  const message = error?.message || STATUS_MESSAGES[status] || STATUS_MESSAGES.idle;
  const isActionable = ['denied', 'error'].includes(status);

  return (
    <section
      className={`status-banner status-${status}`}
      role="status"
      aria-live={status === 'ready' ? 'polite' : 'assertive'}
    >
      <p>{message}</p>
      {isActionable && (
        <button type="button" className="button button-ghost" onClick={onRetry}>
          Try Again
        </button>
      )}
    </section>
  );
};

StatusBanner.propTypes = {
  status: PropTypes.string.isRequired,
  error: PropTypes.instanceOf(Error),
  onRetry: PropTypes.func.isRequired,
};

export default StatusBanner;
