import { describe, expect, test } from 'vitest';

import { hourTo12, isPM, stepHour, stepMinute, toHour24 } from './timeMath';

describe('stepHour', () => {
  test('wraps 11 PM forward to midnight', () => {
    expect(stepHour(23, 1)).toBe(0);
  });

  test('wraps midnight backward to 11 PM', () => {
    expect(stepHour(0, -1)).toBe(23);
  });

  test('keeps AM/PM on ordinary steps', () => {
    expect(stepHour(13, 1)).toBe(14);
    expect(stepHour(9, 1)).toBe(10);
  });

  test('handles large deltas', () => {
    expect(stepHour(7, 49)).toBe(8);
  });
});

describe('stepMinute', () => {
  test('wraps 59 forward to 0', () => {
    expect(stepMinute(59, 1)).toBe(0);
  });

  test('wraps 0 backward to 59', () => {
    expect(stepMinute(0, -1)).toBe(59);
  });
});

describe('hour display helpers', () => {
  test('hourTo12 maps 0 and 12 to 12', () => {
    expect(hourTo12(0)).toBe(12);
    expect(hourTo12(12)).toBe(12);
    expect(hourTo12(13)).toBe(1);
    expect(hourTo12(23)).toBe(11);
  });

  test('isPM boundary', () => {
    expect(isPM(0)).toBe(false);
    expect(isPM(11)).toBe(false);
    expect(isPM(12)).toBe(true);
    expect(isPM(23)).toBe(true);
  });

  test('toHour24 round-trips', () => {
    expect(toHour24(12, true)).toBe(12);
    expect(toHour24(12, false)).toBe(0);
    expect(toHour24(1, true)).toBe(13);
    expect(toHour24(11, false)).toBe(11);
  });
});
