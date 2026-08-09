import React from 'react';
import PropTypes from 'prop-types';

import Icon from './Icon';

const AppHeader = ({ onOpenSettings }) => (
  <header className="app-header">
    <div className="app-brand">
      <Icon name="globe" size={20} />
      <span className="app-brand-name">CHRONO WATCH</span>
    </div>
    <button
      type="button"
      className="icon-button"
      onClick={onOpenSettings}
      aria-label="Open settings"
    >
      <Icon name="settings" size={22} />
    </button>
  </header>
);

AppHeader.propTypes = {
  onOpenSettings: PropTypes.func.isRequired,
};

export default AppHeader;
