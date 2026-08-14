import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Icon from './Icon';
import { RINGTONES, playTone } from '../utils/sound';
import { hourTo12, isPM, stepHour, stepMinute, toHour24 } from '../utils/timeMath';
import { useBackPress } from '../hooks/useBackPress';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const newAlarmState = {
  hour: 7,
  minute: 0,
  label: '',
  days: [false, false, false, false, false, false, false],
  sound: 'Cosmic Chime',
  vibrate: true,
  enabled: true,
};

const AlarmEditor = ({ alarm, onSave, onDelete, onClose, settings }) => {
  useBackPress(() => {
    onClose();
    return true;
  });
  const [draft, setDraft] = useState(alarm ? { ...alarm } : { ...newAlarmState });
  const [showRingtones, setShowRingtones] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [daysError, setDaysError] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const hour12 = hourTo12(draft.hour);
  const pm = isPM(draft.hour);

  const setHour12 = (value) =>
    setDraft((current) => ({ ...current, hour: toHour24(((value - 1) % 12 + 12) % 12 + 1, isPM(current.hour)) }));

  const setMinute = (value) => setDraft((current) => ({ ...current, minute: stepMinute(value, 0) }));

  const toggleDay = (index) =>
    setDraft((current) => {
      const days = [...current.days];
      days[index] = !days[index];
      if (days.some(Boolean)) setDaysError(false);
      return { ...current, days };
    });

  const save = () => {
    if (!draft.days.some(Boolean)) {
      setDaysError(true);
      return;
    }
    onSave({ ...draft });
    onClose();
  };

  const is24 = !settings.hour12;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Edit alarm" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-sheet">
        <div className="modal-header">
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close editor">
            <Icon name="close" size={20} />
          </button>
          <h2 className="modal-title">{alarm ? 'Edit Alarm' : 'New Alarm'}</h2>
          <button type="button" className="icon-button" onClick={save} aria-label="Save alarm">
            <Icon name="check" size={22} />
          </button>
        </div>

        <div className="modal-content">
          <div className="time-wheel" aria-label="Alarm time">
            <div className="wheel-column">
              <button type="button" className="wheel-arrow" onClick={() => setHour12(hour12 + 1)} aria-label="Increase hour">▲</button>
              <span className="wheel-value">{is24 ? String(draft.hour).padStart(2, '0') : hour12}</span>
              <button type="button" className="wheel-arrow" onClick={() => setHour12(hour12 - 1)} aria-label="Decrease hour">▼</button>
            </div>
            <span className="wheel-colon">:</span>
            <div className="wheel-column">
              <button type="button" className="wheel-arrow" onClick={() => setMinute(draft.minute + 1)} aria-label="Increase minute">▲</button>
              <span className="wheel-value">{String(draft.minute).padStart(2, '0')}</span>
              <button type="button" className="wheel-arrow" onClick={() => setMinute(draft.minute - 1)} aria-label="Decrease minute">▼</button>
            </div>
            <div className="wheel-column wheel-ampm">
              <button
                type="button"
                className={`wheel-value wheel-ampm-value ${!pm ? 'active' : ''}`}
                onClick={() => setDraft((current) => ({ ...current, hour: isPM(current.hour) ? current.hour - 12 : current.hour }))}
              >
                AM
              </button>
              <button
                type="button"
                className={`wheel-value wheel-ampm-value ${pm ? 'active' : ''}`}
                onClick={() => setDraft((current) => ({ ...current, hour: isPM(current.hour) ? current.hour : current.hour + 12 }))}
              >
                PM
              </button>
            </div>
          </div>

          <div className="editor-section">
            <h3 className="section-title">Repeat</h3>
            <div className="day-chips">
              {DAYS.map((day, index) => (
                <button
                  key={day}
                  type="button"
                  className={`day-chip ${draft.days[index] ? 'active' : ''}`}
                  onClick={() => toggleDay(index)}
                  aria-label={`Toggle ${day}`}
                >
                  {day}
                </button>
              ))}
            </div>
            {daysError && <p className="editor-error">Pick at least one repeat day.</p>}
          </div>

          <div className="editor-section">
            <h3 className="section-title">Label</h3>
            <input
              type="text"
              className="search-input editor-input"
              placeholder="Alarm label"
              value={draft.label}
              onChange={(e) => setDraft((current) => ({ ...current, label: e.target.value }))}
            />
          </div>

          <div className="editor-section">
            <button type="button" className="settings-row settings-row-button" onClick={() => setShowRingtones(true)}>
              <div className="settings-row-text">
                <span className="settings-row-label">Sound</span>
                <span className="settings-row-desc"><Icon name="notifications" size={14} /> {draft.sound}</span>
              </div>
              <Icon name="chevronRight" size={20} />
            </button>
            <Toggle
              checked={draft.vibrate}
              onChange={(value) => setDraft((current) => ({ ...current, vibrate: value }))}
              label="Vibrate"
            />
          </div>

          {alarm && (
            <div className="editor-delete">
              <button type="button" className="button button-danger" onClick={() => setConfirmDelete(true)}>
                <Icon name="trash" size={16} />
                Delete Alarm
              </button>
            </div>
          )}
        </div>
      </div>

      {showRingtones && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Select ringtone" onClick={(e) => { if (e.target === e.currentTarget) setShowRingtones(false); }}>
          <div className="modal-sheet modal-sheet-small">
            <div className="modal-header">
              <button type="button" className="icon-button" onClick={() => setShowRingtones(false)} aria-label="Close ringtone picker">
                <Icon name="back" size={22} />
              </button>
              <h2 className="modal-title">Ringtone</h2>
            </div>
            <div className="modal-content">
              {RINGTONES.map((ringtone) => (
                <button
                  key={ringtone.name}
                  type="button"
                  className={`timezone-row ${draft.sound === ringtone.name ? 'selected' : ''}`}
                  onClick={() => {
                    setDraft((current) => ({ ...current, sound: ringtone.name }));
                    setShowRingtones(false);
                  }}
                  onMouseEnter={() => playTone({ ...ringtone, volume: 0.15 })}
                  onFocus={() => playTone({ ...ringtone, volume: 0.15 })}
                >
                  <span className="timezone-row-city">{ringtone.name}</span>
                  {draft.sound === ringtone.name && (
                    <span className="timezone-row-check"><Icon name="check" size={16} /></span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="modal-backdrop" role="alertdialog" aria-modal="true" aria-label="Delete alarm" onClick={(e) => { if (e.target === e.currentTarget) setConfirmDelete(false); }}>
          <div className="confirm-card">
            <h3 className="confirm-title">Delete this alarm?</h3>
            <p className="confirm-text">This action cannot be undone.</p>
            <div className="confirm-actions">
              <button type="button" className="button button-ghost" onClick={() => setConfirmDelete(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="button button-danger"
                onClick={() => {
                  onDelete(alarm.id);
                  onClose();
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Toggle = ({ checked, onChange, label }) => (
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
);

Toggle.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

AlarmEditor.propTypes = {
  alarm: PropTypes.shape({
    id: PropTypes.string,
    hour: PropTypes.number,
    minute: PropTypes.number,
    label: PropTypes.string,
    days: PropTypes.arrayOf(PropTypes.bool),
    sound: PropTypes.string,
    vibrate: PropTypes.bool,
    enabled: PropTypes.bool,
  }),
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  settings: PropTypes.shape({ hour12: PropTypes.bool }).isRequired,
};

export default AlarmEditor;
