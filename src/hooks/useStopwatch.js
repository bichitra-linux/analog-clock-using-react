import { useEffect, useRef, useState } from 'react';

const useStopwatch = () => {
  const [state, setState] = useState({ running: false, elapsedMs: 0, laps: [] });
  const refs = useRef({ running: false, startedAt: 0, accumulated: 0, laps: [] });
  const frameRef = useRef();

  const tick = () => {
    const { running, startedAt, accumulated } = refs.current;
    const elapsedMs = accumulated + (running ? performance.now() - startedAt : 0);
    setState({ running, elapsedMs, laps: [...refs.current.laps] });
    if (running) {
      frameRef.current = requestAnimationFrame(tick);
    }
  };

  useEffect(() => {
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  const start = () => {
    if (refs.current.running) return;
    refs.current.running = true;
    refs.current.startedAt = performance.now();
    frameRef.current = requestAnimationFrame(tick);
  };

  const stop = () => {
    if (!refs.current.running) return;
    refs.current.accumulated += performance.now() - refs.current.startedAt;
    refs.current.running = false;
    cancelAnimationFrame(frameRef.current);
    tick();
  };

  const reset = () => {
    cancelAnimationFrame(frameRef.current);
    refs.current = { running: false, startedAt: 0, accumulated: 0, laps: [] };
    setState({ running: false, elapsedMs: 0, laps: [] });
  };

  const lap = () => {
    if (!refs.current.running) return;
    const totalMs = state.elapsedMs;
    const previousTotal = refs.current.laps.length > 0 ? refs.current.laps[0].totalMs : 0;
    refs.current.laps = [{ lapMs: totalMs - previousTotal, totalMs }, ...refs.current.laps];
    setState({ ...state, laps: refs.current.laps });
  };

  return { ...state, start, stop, reset, lap };
};

export default useStopwatch;
