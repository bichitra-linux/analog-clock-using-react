import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

const DeviceClock = ({ time }) => {
  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    [],
  );

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat([], {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }),
    [],
  );

  const deviceZone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    [],
  );

  return (
    <section className="card device-clock" aria-label="Device time">
      <h2 className="card-title">Device Time</h2>
      <p className="device-clock-time" aria-live="polite">
        {formatter.format(time)}
      </p>
      <p className="device-clock-date">{dateFormatter.format(time)}</p>
      <p className="device-clock-zone">{deviceZone}</p>
    </section>
  );
};

DeviceClock.propTypes = {
  time: PropTypes.instanceOf(Date).isRequired,
};

export default DeviceClock;
