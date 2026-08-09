import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Icon from './Icon';

const formatMs = (ms) => {
  const totalCs = Math.floor(ms / 10);
  const centiseconds = totalCs % 100;
  const totalSeconds = Math.floor(totalCs / 100);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const base = `${String(minutes % 60).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  return `${hours > 0 ? `${hours}:` : ''}${base}.${String(centiseconds).padStart(2, '0')}`;
};

const StopwatchView = ({ stopwatch }) => {
  const { running, elapsedMs, laps, start, stop, reset, lap } = stopwatch;
  const [mode, setMode] = useState('lap');

  const formatLap = (ms) => {
    const parts = formatMs(ms).split('.');
    return parts;
  };

  return (
    <div className="stopwatch-view">
      <div className="stopwatch-display">
        <span className="stopwatch-time" aria-live="polite">
          {formatMs(elapsedMs).split('.')[0]}
          <span className="stopwatch-cs">.{formatMs(elapsedMs).split('.')[1]}</span>
        </span>
      </div>

      {laps.length > 0 && <div className="stopwatch-last-lap">Lap {laps.length} — {formatMs(laps[0].lapMs)}</div>}

      <div className="stopwatch-controls">
        <button type="button" className="button button-ghost button-round" onClick={lap} disabled={!running} aria-label="Lap">
          Lap
        </button>
        {running ? (
          <button type="button" className="button button-danger button-round" onClick={stop}>
            Stop
          </button>
        ) : (
          <button type="button" className="button button-primary button-round" onClick={start}>
            Start
          </button>
        )}
        <button type="button" className="button button-ghost button-round" onClick={reset} disabled={elapsedMs === 0}>
          Reset
        </button>
      </div>

      {laps.length > 0 ? (
        <>
          <div className="segmented lap-mode-toggle">
            <button type="button" className={`segmented-item ${mode === 'lap' ? 'active' : ''}`} onClick={() => setMode('lap')}>
              Lap Times
            </button>
            <button type="button" className={`segmented-item ${mode === 'overall' ? 'active' : ''}`} onClick={() => setMode('overall')}>
              Overall Time
            </button>
          </div>
          <div className="lap-list">
            <div className="lap-list-header">
              <span>Lap</span>
              <span>{mode === 'lap' ? 'Lap Time' : 'Overall Time'}</span>
            </div>
            {laps.map((entry, index) => (
              <div key={`${entry.totalMs}-${index}`} className={`lap-row ${index === 0 ? 'current' : ''}`}>
                <span>{String(laps.length - index).padStart(2, '0')}</span>
                <span>{formatLap(mode === 'lap' ? entry.lapMs : entry.totalMs)[0]}<span className="lap-cs">.{formatLap(mode === 'lap' ? entry.lapMs : entry.totalMs)[1]}</span></span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <Icon name="stopwatch" size={40} className="empty-state-icon" />
          <p className="empty-state-title">No laps yet</p>
          <p className="empty-state-subtitle">Start the stopwatch and tap Lap to record splits</p>
        </div>
      )}
    </div>
  );
};

StopwatchView.propTypes = {
  stopwatch: PropTypes.shape({
    running: PropTypes.bool,
    elapsedMs: PropTypes.number,
    laps: PropTypes.arrayOf(PropTypes.shape({
      lapMs: PropTypes.number,
      totalMs: PropTypes.number,
    })),
    start: PropTypes.func,
    stop: PropTypes.func,
    reset: PropTypes.func,
    lap: PropTypes.func,
  }).isRequired,
};

export default StopwatchView;
