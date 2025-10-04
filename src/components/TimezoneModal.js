import React, { useEffect, useMemo } from "react";
import PropTypes from "prop-types";

import { listTimeZones } from "../utils/timezone";

const TimezoneModal = ({ open, value, onChange, onClose }) => {
  const timeZones = useMemo(() => listTimeZones(), []);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleSelectionChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <div
      className="timezone-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Select a timezone"
      onClick={handleOverlayClick}
    >
      <div className="timezone-modal-card">
        <div className="timezone-modal-header">
          <h2 className="timezone-modal-title">Choose Time Zone</h2>
          <button
            type="button"
            className="timezone-modal-close"
            onClick={onClose}
            aria-label="Close timezone picker"
          >
            x
          </button>
        </div>
        <p className="timezone-modal-subtitle">
          Update the southern clock by selecting a region below.
        </p>
        <label className="timezone-modal-label" htmlFor="timezone-modal-select">
          Time zone
        </label>
        <select
          id="timezone-modal-select"
          className="timezone-modal-select"
          value={value}
          onChange={handleSelectionChange}
        >
          {timeZones.map((zone) => (
            <option key={zone} value={zone}>
              {zone.replace(/_/g, " ")}
            </option>
          ))}
        </select>
        <div className="timezone-modal-actions">
          <button type="button" className="button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

TimezoneModal.propTypes = {
  open: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default TimezoneModal;
