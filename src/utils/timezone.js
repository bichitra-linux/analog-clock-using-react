const dtfCache = new Map();

const getDateTimeFormat = (timeZone) => {
  if (!dtfCache.has(timeZone)) {
    dtfCache.set(
      timeZone,
      new Intl.DateTimeFormat('en-US', {
        timeZone,
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    );
  }

  return dtfCache.get(timeZone);
};

export const listTimeZones = () => {
  if (typeof Intl.supportedValuesOf === 'function') {
    return Intl.supportedValuesOf('timeZone');
  }

  return [
    'Etc/UTC',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Europe/Madrid',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Kolkata',
    'Asia/Dubai',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Sao_Paulo',
    'Australia/Sydney',
    'Africa/Johannesburg',
  ];
};

export const getTimeZoneOffset = (date, timeZone) => {
  const dtf = getDateTimeFormat(timeZone);
  const parts = dtf.formatToParts(date);
  const data = {};

  parts.forEach((part) => {
    if (part.type !== 'literal') {
      data[part.type] = part.value;
    }
  });

  const asUTC = Date.UTC(
    Number(data.year),
    Number(data.month) - 1,
    Number(data.day),
    Number(data.hour),
    Number(data.minute),
    Number(data.second),
  );

  return Math.round((asUTC - date.getTime()) / 60000);
};

export const getZonedDate = (date, timeZone) => {
  const offsetMinutes = getTimeZoneOffset(date, timeZone);
  return new Date(date.getTime() + offsetMinutes * 60000);
};

export const formatOffset = (offsetMinutes) => {
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const absolute = Math.round(Math.abs(offsetMinutes));
  const hours = Math.floor(absolute / 60)
    .toString()
    .padStart(2, '0');
  const minutes = (absolute % 60).toString().padStart(2, '0');
  return `UTC${sign}${hours}:${minutes}`;
};
