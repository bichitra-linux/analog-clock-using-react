import { describe, expect, test } from 'vitest';

import { nextOccurrences, notificationIdFor } from './alarmSchedule';

const alarm = (overrides = {}) => ({
  id: 'a1',
  hour: 7,
  minute: 30,
  days: [false, true, false, false, false, false, false],
  ...overrides,
});

describe('nextOccurrences', () => {
  test('returns empty for no selected days', () => {
    expect(nextOccurrences(alarm({ days: [false, false, false, false, false, false, false] }))).toEqual([]);
  });

  test('finds next Monday 07:30 after a Friday', () => {
    const from = new Date(2026, 7, 14, 12, 0); // Friday
    const occurrences = nextOccurrences(alarm(), from, 7);
    expect(occurrences[0].getDay()).toBe(1); // Monday
    expect(occurrences[0].getHours()).toBe(7);
    expect(occurrences[0].getMinutes()).toBe(30);
  });

  test('skips a selected weekday whose time already passed today (covered next week)', () => {
    const from = new Date(2026, 7, 10, 9, 0); // Monday, 09:00 — alarm 07:30 passed
    const occurrences = nextOccurrences(alarm(), from);
    expect(occurrences[0].getDay()).toBe(1); // next Monday
    expect(occurrences[0].getDate()).toBe(17);
  });

  test('windowDays default covers the same weekday twice', () => {
    const from = new Date(2026, 7, 14, 12, 0); // Friday
    const occurrences = nextOccurrences(alarm(), from);
    expect(occurrences.length).toBe(2);
  });
});

describe('notificationIdFor', () => {
  test('is stable for the same alarm and day', () => {
    const at = new Date(2026, 7, 17, 7, 30);
    expect(notificationIdFor('a1', at)).toBe(notificationIdFor('a1', at));
  });

  test('differs across alarms and days', () => {
    const at = new Date(2026, 7, 17, 7, 30);
    const nextDay = new Date(2026, 7, 18, 7, 30);
    expect(notificationIdFor('a1', at)).not.toBe(notificationIdFor('a2', at));
    expect(notificationIdFor('a1', at)).not.toBe(notificationIdFor('a1', nextDay));
  });

  test('is a positive 32-bit integer', () => {
    const at = new Date(2026, 7, 17, 7, 30);
    expect(notificationIdFor('a1', at)).toBeGreaterThan(0);
    expect(notificationIdFor('a1', at)).toBeLessThan(2147483648);
  });
});
