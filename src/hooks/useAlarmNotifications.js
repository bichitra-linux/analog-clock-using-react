import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { LocalNotifications } from '@capacitor/local-notifications';
import { useEffect, useRef } from 'react';

import { nextOccurrences, notificationIdFor } from '../utils/alarmSchedule';

const CHANNEL_ID = 'chrono-alarms';

const ensureChannel = async () => {
  try {
    await LocalNotifications.createChannel({
      id: CHANNEL_ID,
      name: 'Alarms',
      importance: 5,
      vibration: true,
      sound: 'Default',
    });
  } catch (error) {
    /* channel exists or unsupported (iOS) */
  }
};

const ensurePermission = async () => {
  const status = await LocalNotifications.checkPermissions();
  if (status.display !== 'granted') {
    await LocalNotifications.requestPermissions();
  }
};

const useAlarmNotifications = (alarms) => {
  const resyncRef = useRef(() => {});

  resyncRef.current = async () => {
    if (!Capacitor.isNativePlatform()) return;
    try {
      await ensureChannel();
      await ensurePermission();
      await LocalNotifications.cancelAll();
      const notifications = [];
      alarms.forEach((alarm) => {
        if (!alarm.enabled) return;
        nextOccurrences(alarm).forEach((at) => {
          notifications.push({
            id: notificationIdFor(alarm.id, at),
            title: alarm.label || 'Alarm',
            body: `Alarm set for ${at.toLocaleTimeString()}`,
            channelId: CHANNEL_ID,
            schedule: { at },
          });
        });
      });
      if (notifications.length > 0) {
        await LocalNotifications.schedule({ notifications });
      }
    } catch (error) {
      /* notifications unavailable */
    }
  };

  useEffect(() => {
    resyncRef.current();
  }, [alarms]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return undefined;
    const listeners = [
      App.addListener('appStateChange', ({ isActive }) => {
        if (isActive) resyncRef.current();
      }),
      LocalNotifications.addListener('localNotificationReceived', () => resyncRef.current()),
      LocalNotifications.addListener('localNotificationActionPerformed', () => resyncRef.current()),
    ];
    return () => listeners.forEach((promise) => promise.then((l) => l.remove()));
  }, []);
};

export default useAlarmNotifications;
