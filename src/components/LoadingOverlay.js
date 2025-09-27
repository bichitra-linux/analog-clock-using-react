import React from 'react';
import PropTypes from 'prop-types';

import useDelayedVisibility from '../hooks/useDelayedVisibility';

const LoadingOverlay = ({ visible = false, message = 'Loading…' }) => {
  const shouldRender = useDelayedVisibility(visible);

  if (!shouldRender) {
    return null;
  }

  return (
    <div className="loading-overlay" role="status" aria-live="assertive">
      <div className="loading-card">
        <span className="spinner" aria-hidden="true" />
        <p>{message}</p>
      </div>
    </div>
  );
};

LoadingOverlay.propTypes = {
  visible: PropTypes.bool,
  message: PropTypes.string,
};

export default LoadingOverlay;
