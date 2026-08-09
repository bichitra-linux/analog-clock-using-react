import React from 'react';
import PropTypes from 'prop-types';

import Icon from './Icon';

const TABS = [
  { id: 'clocks', label: 'Clocks', icon: 'clock' },
  { id: 'alarms', label: 'Alarms', icon: 'alarm' },
  { id: 'stopwatch', label: 'Stopwatch', icon: 'stopwatch' },
  { id: 'timer', label: 'Timer', icon: 'timer' },
];

const BottomNav = ({ tab, onChange }) => (
  <nav className="bottom-nav" aria-label="App sections">
    {TABS.map(({ id, label, icon }) => (
      <button
        key={id}
        type="button"
        className={`bottom-nav-item ${tab === id ? 'active' : ''}`}
        onClick={() => onChange(id)}
        aria-current={tab === id ? 'page' : undefined}
      >
        <Icon name={icon} size={22} />
        <span>{label}</span>
      </button>
    ))}
  </nav>
);

BottomNav.propTypes = {
  tab: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default BottomNav;
