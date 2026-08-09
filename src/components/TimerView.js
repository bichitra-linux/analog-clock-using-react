import React from 'react';
import PropTypes from 'prop-types';

import Icon from './Icon';
import { PRESETS_MS } from '../hooks/useTimer';

const formatMs = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const mm = String(minutes % 60).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
};

const TimerView = ({ timer, time }) => {
  const { durationMs, remainingMs, running, endsAt, finished, setDuration, start, pause, reset } = timer;

  const endsLabel = endsAt
    ? new Date(endsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const progress = durationMs > 0 ? Math.min(1, Math.max(0, 1 - remainingMs / durationMs)) : 0;

  return (
    <div className="timer-view">
      <div className="timer-ring" style={{ '--progress': `${progress * 360}deg` }}>
        <div className="timer-face">
          <span className="timer-time" aria-live="polite">{formatMs(remainingMs)}</span>
          <span className="timer-ends">Ends {endsLabel}</span>
        </div>
      </div>

      <div className="quick-presets">
        {PRESETS_MS.map((ms) => (
          <button
            key={ms}
            type="button"
            className={`chip chip-action ${durationMs === ms ? 'chip-active' : ''}`}
            onClick={() => setDuration(ms)}
          >
            {ms / 60000}m
          </button>
        ))}
      </div>

      <div className="timer-controls">
        {running ? (
          <button type="button" className="button button-ghost button-round" onClick={pause} aria-label="Pause timer">
            <Icon name="pause" size={24} />
          </button>
        ) : (
          <button
            type="button"
            className="button button-primary button-round"
            onClick={start}
            disabled={remainingMs === 0}
            aria-label="Start timer"
          >
            <Icon name="play" size={24} />
          </button>
        )}
        <button type="button" className="button button-ghost button-round" onClick={reset} aria-label="Reset timer">
          <Icon name="close" size={24} />
        </button>
      </div>

      {finished && (
        <div className="ringing-overlay" role="alertdialog" aria-modal="true" aria-label="Timer finished">
          <div className="ringing-glow" />
          <div className="ringing-content">
            <span className="ringing-time">00:00</span>
            <span className="ringing-label">Time is up!</span>
          </div>
          <div className="ringing-actions">
            <button type="button" className="button button-primary button-large" onClick={reset}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

TimerView.propTypes = {
  timer: PropTypes.shape({
    durationMs: PropTypes.number,
    remainingMs: PropTypes.number,
    running: PropTypes.bool,
    endsAt: PropTypes.number,
    finished: PropTypes.bool,
    setDuration: PropTypes.func,
    start: PropTypes.func,
    pause: PropTypes.func,
    reset: PropTypes.func,
  }).isRequired,
  time: PropTypes.instanceOf(Date).isRequired,
};

export default TimerView;
