import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { listTimeZones } from '../utils/timezone';

const groupTimeZones = (timeZones) => {
  return timeZones.reduce((groups, zone) => {
    const [region, ...rest] = zone.split('/');
    const label = rest.join('/') || region;
    const groupKey = rest.length ? region : 'Other';

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }

    groups[groupKey].push({ value: zone, label: label.replace(/_/g, ' ') });
    return groups;
  }, {});
};

const TimezoneSelector = ({ value, onChange }) => {
  const timeZones = useMemo(() => listTimeZones(), []);
  const grouped = useMemo(() => groupTimeZones(timeZones), [timeZones]);

  return (
    <section className="card timezone-card" aria-label="Timezone selection">
      <h2 className="card-title">Time Zone</h2>
      <p className="card-primary">Select a time zone to preview the clock precisely for that region.</p>
      <label className="timezone-label" htmlFor="timezone-select">
        Time zone menu
      </label>
      <select
        id="timezone-select"
        className="timezone-select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {Object.entries(grouped).map(([group, zones]) => (
          <optgroup key={group} label={group}>
            {zones.map((zone) => (
              <option key={zone.value} value={zone.value}>
                {zone.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <p className="timezone-current">Currently showing: {value}</p>
    </section>
  );
};

TimezoneSelector.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default TimezoneSelector;
