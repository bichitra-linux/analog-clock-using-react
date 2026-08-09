import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import Icon from './Icon';
import AlarmEditor from './AlarmEditor';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const nextAlarmIn = (alarms, now) => {
  const enabled = alarms.filter((alarm) => alarm.enabled);
  if (enabled.length === 0) return null;

  let best = Infinity;
  enabled.forEach((alarm) => {
    for (let daysAhead = 0; daysAhead < 7; daysAhead += 1) {
      const day = (now.getDay() + daysAhead) % 7;
      if (!alarm.days[day]) continue;
      const candidate = new Date(now);
      candidate.setDate(now.getDate() + daysAhead);
      candidate.setHours(alarm.hour, alarm.minute, 0, 0);
      const diff = candidate.getTime() - now.getTime();
      if (diff > 0 && diff < best) best = diff;
    }
  });

  if (best === Infinity) return null;
  const totalMinutes = Math.ceil(best / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};

const formatAlarmTime = (alarm, hour12) => {
  const h = alarm.hour % 12 === 0 ? 12 : alarm.hour % 12;
  const display = hour12 ? `${h}:${String(alarm.minute).padStart(2, '0')}` : `${String(alarm.hour).padStart(2, '0')}:${String(alarm.minute).padStart(2, '0')}`;
  return hour12 ? { time: display, ampm: alarm.hour >= 12 ? 'PM' : 'AM' } : { time: display, ampm: '' };
};

const AlarmsView = ({ alarms, time, onAdd, onUpdate, onDelete, onToggle, settings }) => {
  const [editingId, setEditingId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const upcoming = useMemo(() => nextAlarmIn(alarms, time), [alarms, time]);
  const sorted = useMemo(
    () => [...alarms].sort((a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute)),
    [alarms],
  );

  const editingAlarm = alarms.find((alarm) => alarm.id === editingId) ?? null;

  return (
    <div className="alarms-view">
      <div className="status-line">
        <span className="status-dot" />
        <span className="status-text">Upcoming Alarms</span>
        <span className="status-sub">{upcoming ? `Next alarm in ${upcoming}` : 'No alarms set'}</span>
      </div>

      {sorted.length === 0 ? (
        <div className="empty-state">
          <Icon name="alarm" size={40} className="empty-state-icon" />
          <p className="empty-state-title">No alarms</p>
          <p className="empty-state-subtitle">Add an alarm to start your routine</p>
        </div>
      ) : (
        <div className="alarm-list">
          {sorted.map((alarm) => {
            const display = formatAlarmTime(alarm, settings.hour12);
            const anyDay = alarm.days.some(Boolean);
            return (
              <button
                key={alarm.id}
                type="button"
                className={`glass-card alarm-row ${alarm.enabled ? '' : 'disabled'}`}
                onClick={() => setEditingId(alarm.id)}
                aria-label={`Edit alarm ${display.time}`}
              >
                <div className="alarm-row-time">
                  <span className="alarm-time">{display.time}</span>
                  {display.ampm && <span className="alarm-ampm">{display.ampm}</span>}
                </div>
                <div className="alarm-row-main">
                  <span className="alarm-label">{alarm.label || 'Alarm'}</span>
                  <div className="day-dots">
                    {DAYS.map((day, index) => (
                      <span key={day} className={`day-dot ${alarm.days[index] ? 'active' : ''}`}>
                        {day}
                      </span>
                    ))}
                    {!anyDay && <span className="alarm-once">Once</span>}
                  </div>
                </div>
                <button
                  type="button"
                  className={`icon-button alarm-toggle ${alarm.enabled ? 'on' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle(alarm.id);
                  }}
                  aria-label={alarm.enabled ? 'Disable alarm' : 'Enable alarm'}
                >
                  <Icon name="alarm" size={22} />
                </button>
              </button>
            );
          })}
        </div>
      )}

      <button type="button" className="fab" onClick={() => setShowAdd(true)} aria-label="Add alarm">
        <Icon name="add" size={26} />
      </button>

      {showAdd && (
        <AlarmEditor
          alarm={null}
          onSave={(draft) => onAdd(draft)}
          onDelete={() => {}}
          onClose={() => setShowAdd(false)}
          settings={settings}
        />
      )}

      {editingAlarm && (
        <AlarmEditor
          alarm={editingAlarm}
          onSave={(draft) => onUpdate(editingAlarm.id, draft)}
          onDelete={onDelete}
          onClose={() => setEditingId(null)}
          settings={settings}
        />
      )}
    </div>
  );
};

AlarmsView.propTypes = {
  alarms: PropTypes.arrayOf(PropTypes.object).isRequired,
  time: PropTypes.instanceOf(Date).isRequired,
  onAdd: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  settings: PropTypes.shape({ hour12: PropTypes.bool }).isRequired,
};

export default AlarmsView;
