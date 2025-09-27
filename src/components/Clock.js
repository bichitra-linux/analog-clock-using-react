import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import './Clock.css';
import { getZonedDate } from '../utils/timezone';

const getTimeParts = (date, timeZone) => {
  const zoned = getZonedDate(date, timeZone);
  const milliseconds = zoned.getUTCMilliseconds();
  const rawSeconds = zoned.getUTCSeconds() + milliseconds / 1000;
  const rawMinutes = zoned.getUTCMinutes() + rawSeconds / 60;
  const rawHours = (zoned.getUTCHours() % 12) + rawMinutes / 60;

  return {
    seconds: rawSeconds,
    minutes: rawMinutes,
    hours: rawHours,
    isoDevice: date.toISOString(),
    isoZoned: zoned.toISOString(),
  };
};

const Clock = ({ time, timeZone, onTimezoneRequest }) => {
  const timeParts = useMemo(() => getTimeParts(time, timeZone), [time, timeZone]);

  const rotationAdjustment = 90;
  const appliedOffset = -90 + rotationAdjustment;

  const secondAngle = timeParts.seconds * 6 + appliedOffset;
  const minuteAngle = timeParts.minutes * 6 + appliedOffset;
  const hourAngle = timeParts.hours * 30 + appliedOffset;

  const timeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone,
      }),
    [timeZone],
  );

  const deviceFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    [],
  );

  const deviceZone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    [],
  );

  const displayTime = timeFormatter.format(time);
  const deviceDisplayTime = deviceFormatter.format(time);
  const handleTimezoneClick = () => {
    if (onTimezoneRequest) {
      onTimezoneRequest();
    }
  };

  return (
    <section className="clock" aria-label={`Analog clock for ${timeZone}`}>
      <div className="clock-face" role="presentation">
        <div className="clock-digital clock-digital-top clock-digital-static" aria-live="polite">
          <span className="clock-digital-label">Device Time</span>
          <time
            className="clock-digital-time"
            dateTime={timeParts.isoDevice}
            aria-label="Device time"
          >
            {deviceDisplayTime}
          </time>
          <span className="clock-digital-zone">{deviceZone}</span>
        </div>

        <button
          type="button"
          className="clock-digital clock-digital-bottom clock-digital-action"
          onClick={handleTimezoneClick}
          aria-label={`Change timezone (currently ${timeZone})`}
        >
          <span className="clock-digital-label">Selected Zone</span>
          <time
            className="clock-digital-time"
            dateTime={timeParts.isoZoned}
            aria-label={`Digital time for ${timeZone}`}
          >
            {displayTime}
          </time>
          <span className="clock-digital-zone">{timeZone}</span>
          <span className="clock-digital-hint">Tap to change</span>
        </button>

        {Array.from({ length: 60 }).map((_, index) => {
          const isHour = index % 5 === 0;
          return (
            <span
              key={index}
              className={`clock-marker ${isHour ? 'clock-marker-hour' : 'clock-marker-minute'}`}
              style={{ '--marker-angle': `${index * 6 + rotationAdjustment}deg` }}
            />
          );
        })}

        <span className="hand hour-hand" style={{ '--hand-angle': `${hourAngle}deg` }} />
        <span className="hand minute-hand" style={{ '--hand-angle': `${minuteAngle}deg` }} />
        <span className="hand second-hand" style={{ '--hand-angle': `${secondAngle}deg` }} />

        <span className="center-dot" />
      </div>

    </section>
  );
};

Clock.propTypes = {
  time: PropTypes.instanceOf(Date).isRequired,
  timeZone: PropTypes.string.isRequired,
  onTimezoneRequest: PropTypes.func,
};

export default Clock;
