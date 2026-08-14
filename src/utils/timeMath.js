// 12h/24h alarm time-wheel math. Working in 24h internally keeps
// the midnight wrap correct in both display modes.

export const stepHour = (hour, delta) => ((hour + delta) % 24 + 24) % 24;

export const stepMinute = (minute, delta) => ((minute + delta) % 60 + 60) % 60;

export const hourTo12 = (hour) => {
  const h = hour % 12;
  return h === 0 ? 12 : h;
};

export const isPM = (hour) => hour >= 12;

export const toHour24 = (hour12, pm) => {
  if (pm) return hour12 === 12 ? 12 : hour12 + 12;
  return hour12 === 12 ? 0 : hour12;
};
