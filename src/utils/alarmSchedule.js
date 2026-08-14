// Compute the next occurrences of an alarm's selected weekdays so
// @capacitor/local-notifications can fire while the app is backgrounded.
// windowDays is 14 (not 7) so a "today, time already passed" weekday is
// still covered next week even if the app isn't opened again before then.
export const nextOccurrences = (alarm, from = new Date(), windowDays = 14) => {
  const selectedDays = alarm.days.map((on, index) => (on ? index : -1)).filter((index) => index >= 0);
  if (selectedDays.length === 0) return [];

  const occurrences = [];
  const cursor = new Date(from);
  for (let i = 0; i < windowDays; i += 1) {
    if (selectedDays.includes(cursor.getDay())) {
      const at = new Date(cursor);
      at.setHours(alarm.hour, alarm.minute, 0, 0);
      if (at.getTime() > from.getTime()) {
        occurrences.push(at);
      }
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return occurrences;
};

// Stable integer notification id per alarm+day so resyncs replace, not duplicate.
export const notificationIdFor = (alarmId, at) => {
  let hash = 0;
  const seed = `${alarmId}:${at.toISOString().slice(0, 10)}`;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % 2147483647;
};
