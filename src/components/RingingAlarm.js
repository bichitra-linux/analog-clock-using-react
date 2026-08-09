import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { RINGTONES, playTone, stopTone } from '../utils/sound';

const formatTime = (alarm, hour12) => {
  const h = alarm.hour % 12 === 0 ? 12 : alarm.hour % 12;
  const time = hour12 ? `${h}:${String(alarm.minute).padStart(2, '0')}` : `${String(alarm.hour).padStart(2, '0')}:${String(alarm.minute).padStart(2, '0')}`;
  return hour12 ? { time, ampm: alarm.hour >= 12 ? 'PM' : 'AM' } : { time, ampm: '' };
};

const RingingAlarm = ({ alarm, volume, hour12, onDismiss, onSnooze }) => {
  const intervalRef = useRef();
  const vibrateRef = useRef();

  useEffect(() => {
    const ringtone = RINGTONES.find((r) => r.name === alarm.sound) ?? RINGTONES[0];
    const pattern = () => playTone({ ...ringtone, volume: volume / 100 });

    pattern();
    intervalRef.current = setInterval(pattern, 1800);
    if (alarm.vibrate && navigator.vibrate) {
      vibrateRef.current = setInterval(() => navigator.vibrate([300, 150, 300]), 1800);
    }

    return () => {
      clearInterval(intervalRef.current);
      if (vibrateRef.current) clearInterval(vibrateRef.current);
      if (navigator.vibrate) navigator.vibrate(0);
      stopTone();
    };
  }, [alarm.sound, alarm.vibrate, volume]);

  const display = formatTime(alarm, hour12);

  return (
    <div className="ringing-overlay" role="alertdialog" aria-modal="true" aria-label="Alarm ringing">
      <div className="ringing-glow" />
      <div className="ringing-content">
        <span className="ringing-time">
          {display.time}
          {display.ampm && <span className="ringing-ampm">{display.ampm}</span>}
        </span>
        <span className="ringing-label">{alarm.label || 'Alarm'}</span>
      </div>
      <div className="ringing-actions">
        <button type="button" className="button button-ghost button-large" onClick={onSnooze}>
          Snooze
        </button>
        <button type="button" className="button button-primary button-large" onClick={onDismiss}>
          Dismiss
        </button>
      </div>
    </div>
  );
};

RingingAlarm.propTypes = {
  alarm: PropTypes.shape({
    hour: PropTypes.number,
    minute: PropTypes.number,
    label: PropTypes.string,
    sound: PropTypes.string,
    vibrate: PropTypes.bool,
  }).isRequired,
  volume: PropTypes.number.isRequired,
  hour12: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  onSnooze: PropTypes.func.isRequired,
};

export default RingingAlarm;
