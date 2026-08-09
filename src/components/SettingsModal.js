import React from 'react';
import PropTypes from 'prop-types';

import Icon from './Icon';

const Toggle = ({ checked, onChange, label, description }) => (
  <div className="settings-row">
    <div className="settings-row-text">
      <span className="settings-row-label">{label}</span>
      {description && <span className="settings-row-desc">{description}</span>}
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`switch ${checked ? 'on' : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span className="switch-knob" />
    </button>
  </div>
);

Toggle.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  description: PropTypes.string,
};

const SettingsModal = ({ open, onClose, settings, update }) => {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Settings" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-sheet">
        <div className="modal-header">
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close settings">
            <Icon name="back" size={22} />
          </button>
          <h2 className="modal-title">SETTINGS</h2>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close settings">
            <Icon name="close" size={20} />
          </button>
        </div>

        <div className="modal-content settings-content">
          <section className="settings-section">
            <h3 className="section-title"><Icon name="clock" size={16} /> Time Display</h3>
            <Toggle
              checked={!settings.hour12}
              onChange={(value) => update({ hour12: !value })}
              label="24-Hour Time"
              description="Use military time format"
            />
            <Toggle
              checked={settings.showSeconds}
              onChange={(value) => update({ showSeconds: value })}
              label="Show Seconds"
              description="Display sweeping second hand"
            />
          </section>

          <section className="settings-section">
            <h3 className="section-title"><Icon name="myLocation" size={16} /> GPS & Location</h3>
            <div className="settings-row">
              <div className="settings-row-text">
                <span className="settings-row-label">Accuracy Preference</span>
              </div>
              <div className="segmented">
                {['high', 'balanced', 'battery'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`segmented-item ${settings.accuracy === option ? 'active' : ''}`}
                    onClick={() => update({ accuracy: option })}
                  >
                    {option === 'high' ? 'High' : option === 'balanced' ? 'Balanced' : 'Battery Saver'}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="settings-section">
            <h3 className="section-title"><Icon name="volumeUp" size={16} /> Audio</h3>
            <div className="settings-row">
              <div className="settings-row-text">
                <span className="settings-row-label">Alarm Volume</span>
                <span className="settings-row-desc">{settings.alarmVolume}%</span>
              </div>
              <div className="slider-row">
                <Icon name="volumeDown" size={18} />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.alarmVolume}
                  onChange={(e) => update({ alarmVolume: Number(e.target.value) })}
                  aria-label="Alarm volume"
                />
                <Icon name="volumeUp" size={18} />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

SettingsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  settings: PropTypes.shape({
    hour12: PropTypes.bool,
    showSeconds: PropTypes.bool,
    accuracy: PropTypes.string,
    alarmVolume: PropTypes.number,
  }).isRequired,
  update: PropTypes.func.isRequired,
};

export default SettingsModal;
