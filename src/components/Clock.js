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
  };
};

const Clock = ({ time, timeZone, onTimezoneRequest }) => {
  const timeParts = useMemo(() => getTimeParts(time, timeZone), [time, timeZone]);

  const rotationAdjustment = 90;
  const appliedOffset = -90 + rotationAdjustment;

  const secondAngle = timeParts.seconds * 6 + appliedOffset;
  const minuteAngle = timeParts.minutes * 6 + appliedOffset;
  const hourAngle = timeParts.hours * 30 + appliedOffset;

  const handleTimezoneClick = () => {
    if (onTimezoneRequest) {
      onTimezoneRequest();
    }
  };

  return (
    <section className="clock" aria-label={`Analog clock for ${timeZone}`}>
      <button
        type="button"
        className="clock-face"
        onClick={handleTimezoneClick}
        aria-label={`Change timezone (currently ${timeZone})`}
      >
        {Array.from({ length: 12 }).map((_, index) => (
          <span
            key={index}
            className="clock-marker"
            style={{ '--marker-angle': `${index * 30 + rotationAdjustment}deg` }}
          />
        ))}

        <span className="hand hour-hand" style={{ '--hand-angle': `${hourAngle}deg` }} />
        <span className="hand minute-hand" style={{ '--hand-angle': `${minuteAngle}deg` }} />
        <span className="hand second-hand" style={{ '--hand-angle': `${secondAngle}deg` }} />

        <span className="center-dot" />
      </button>
    </section>
  );
};

Clock.propTypes = {
  time: PropTypes.instanceOf(Date).isRequired,
  timeZone: PropTypes.string.isRequired,
  onTimezoneRequest: PropTypes.func,
};

export default Clock;
