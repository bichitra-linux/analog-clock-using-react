import { useEffect, useRef, useState } from 'react';

export const PRESETS_MS = [60, 300, 600, 1800].map((s) => s * 1000);

const useTimer = () => {
  const [timer, setTimer] = useState({
    durationMs: 15 * 60 * 1000,
    remainingMs: 15 * 60 * 1000,
    running: false,
    endsAt: null,
  });
  const intervalRef = useRef();

  useEffect(() => {
    if (!timer.running) return undefined;

    intervalRef.current = setInterval(() => {
      const remainingMs = Math.max(0, timer.endsAt - Date.now());
      setTimer((current) => ({ ...current, remainingMs }));
      if (remainingMs <= 0) {
        clearInterval(intervalRef.current);
        setTimer((current) => ({ ...current, running: false, remainingMs: 0 }));
      }
    }, 200);

    return () => clearInterval(intervalRef.current);
  }, [timer.running, timer.endsAt]);

  const setDuration = (durationMs) =>
    setTimer((current) => ({
      ...current,
      durationMs,
      remainingMs: durationMs,
      running: false,
      endsAt: null,
    }));

  const start = () =>
    setTimer((current) =>
      current.remainingMs > 0
        ? { ...current, running: true, endsAt: Date.now() + current.remainingMs }
        : current,
    );

  const pause = () => setTimer((current) => ({ ...current, running: false, endsAt: null }));
  const reset = () =>
    setTimer((current) => ({
      ...current,
      running: false,
      endsAt: null,
      remainingMs: current.durationMs,
    }));

  const finished = !timer.running && timer.durationMs > 0 && timer.remainingMs === 0;

  return { ...timer, setDuration, start, pause, reset, finished };
};

export default useTimer;
