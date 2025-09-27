import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { formatOffset, getTimeZoneOffset } from '../utils/timezone';

const DateInfo = ({ time, timeZone, deviceTimeZone }) => {
  const dayFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        timeZone,
      }),
    [timeZone],
  );

  const offsetMinutes = useMemo(() => getTimeZoneOffset(time, timeZone), [time, timeZone]);
  const deviceOffsetMinutes = useMemo(
    () => getTimeZoneOffset(time, deviceTimeZone),
    [time, deviceTimeZone],
  );
  const offsetDifferenceMinutes = offsetMinutes - deviceOffsetMinutes;

  const differenceLabel = useMemo(() => {
    if (offsetDifferenceMinutes === 0) {
      return 'Matches device time';
    }

    const direction = offsetDifferenceMinutes > 0 ? 'ahead' : 'behind';
    const formatted = formatOffset(offsetDifferenceMinutes).replace('UTC', '').trim();
    return `${formatted} ${direction}`;
  }, [offsetDifferenceMinutes]);

  const longZoneName = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(undefined, {
      timeZone,
      timeZoneName: 'long',
    });
    const parts = formatter.formatToParts(time);
    const zonePart = parts.find((part) => part.type === 'timeZoneName');
    return zonePart?.value ?? timeZone.replace(/_/g, ' ');
  }, [time, timeZone]);

  return (
    <section className="card" aria-label="Date information">
      <h2 className="card-title">Today</h2>
      <p className="card-primary">{dayFormatter.format(time)}</p>
      <dl className="meta-grid">
        <div>
          <dt>Region</dt>
          <dd title={longZoneName}>{longZoneName}</dd>
        </div>
        <div>
          <dt>Identifier</dt>
          <dd title={timeZone}>{timeZone}</dd>
        </div>
        <div>
          <dt>UTC Offset</dt>
          <dd title={formatOffset(offsetMinutes)}>{formatOffset(offsetMinutes)}</dd>
        </div>
        <div>
          <dt>Time Difference</dt>
          <dd title={differenceLabel}>{differenceLabel}</dd>
        </div>
      </dl>
    </section>
  );
};

DateInfo.propTypes = {
  time: PropTypes.instanceOf(Date).isRequired,
  timeZone: PropTypes.string.isRequired,
  deviceTimeZone: PropTypes.string.isRequired,
};

export default DateInfo;
