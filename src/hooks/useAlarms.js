import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'chrono:alarms';
const SNOOZE_MS = 5 * 60 * 1000;

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
};

const useAlarms = (now) => {
  const [alarms, setAlarms] = useState(load);
  const [ringingId, setRingingId] = useState(null);
  const firedKeys = useRef(new Set());
  const snoozes = useRef([]);
  const snoozeFired = useRef(new Set());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(alarms));
    } catch (error) {
      /* storage unavailable */
    }
  }, [alarms]);

  useEffect(() => {
    const hour = now.getHours();
    const minute = now.getMinutes();
    const dayOfWeek = now.getDay();
    const nowMs = now.getTime();

    alarms.forEach((alarm) => {
      if (!alarm.enabled) return;
      if (alarm.days[dayOfWeek] && alarm.hour === hour && alarm.minute === minute) {
        const key = `${alarm.id}:${hour}:${minute}`;
        if (!firedKeys.current.has(key)) {
          firedKeys.current.add(key);
          setRingingId(alarm.id);
        }
      }
    });

    snoozes.current.forEach((snooze) => {
      if (nowMs >= snooze.at) {
        const key = `${snooze.id}:${snooze.at}`;
        if (!snoozeFired.current.has(key)) {
          snoozeFired.current.add(key);
          setRingingId(snooze.id);
        }
      }
    });
  }, [now, alarms]);

  const addAlarm = (alarm) =>
    setAlarms((current) => [
      ...current,
      { id: `a${Date.now()}`, days: [false, false, false, false, false, false, false], sound: 'Cosmic Chime', vibrate: false, ...alarm },
    ]);

  const updateAlarm = (id, patch) =>
    setAlarms((current) => current.map((alarm) => (alarm.id === id ? { ...alarm, ...patch } : alarm)));

  const deleteAlarm = (id) => setAlarms((current) => current.filter((alarm) => alarm.id !== id));

  const toggleAlarm = (id) =>
    setAlarms((current) => current.map((alarm) => (alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm)));

  const dismiss = () => setRingingId(null);

  const snooze = () => {
    if (ringingId) {
      snoozes.current.push({ id: ringingId, at: Date.now() + SNOOZE_MS });
    }
    setRingingId(null);
  };

  const ringingAlarm = alarms.find((alarm) => alarm.id === ringingId) ?? null;

  return { alarms, addAlarm, updateAlarm, deleteAlarm, toggleAlarm, ringingAlarm, dismiss, snooze };
};

export default useAlarms;
