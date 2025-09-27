import { useEffect, useRef, useState } from 'react';

const DEFAULT_REFRESH_RATE = 1000;

const useDeviceTime = (refreshRate = DEFAULT_REFRESH_RATE) => {
  const [time, setTime] = useState(() => new Date());
  const timeoutRef = useRef();
  const frameRef = useRef();

  useEffect(() => {
    const scheduleNextTick = () => {
      const now = Date.now();
      const elapsed = now % refreshRate;
      const delay = Math.max(0, refreshRate - elapsed);

      timeoutRef.current = window.setTimeout(() => {
        frameRef.current = window.requestAnimationFrame(() => {
          setTime(new Date());
          scheduleNextTick();
        });
      }, delay);
    };

    scheduleNextTick();

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [refreshRate]);

  return { time };
};

export default useDeviceTime;
