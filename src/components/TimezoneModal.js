import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import timezoneStructure from '../data/timezoneStructure.json';
import Icon from './Icon';
import { useBackPress } from '../hooks/useBackPress';
import {
  formatOffsetChip,
  getTimeZoneOffset,
  getZoneAbbrev,
  getPrettyZoneName,
} from '../utils/timezone';

const POPULAR = ['America/New_York', 'Europe/London', 'Asia/Tokyo', 'Asia/Dubai'];

const TimezoneModal = ({ open, value, onChange, onClose, title = 'Select Timezone', nearbyZone = null, deviceTimeZone }) => {
  useBackPress(
    open
      ? () => {
          onClose();
          return true;
        }
      : null,
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [showBrowse, setShowBrowse] = useState(false);

  // Convert JSON structure to proper format with timezones
  const hierarchicalData = useMemo(() => {
    const structure = {};

    Object.keys(timezoneStructure).forEach((continent) => {
      structure[continent] = {};

      Object.keys(timezoneStructure[continent]).forEach((country) => {
        structure[continent][country] = {};

        timezoneStructure[continent][country].forEach((city) => {
          // Build proper IANA timezone format: Continent/City
          const timezone = `${continent}/${city}`;
          structure[continent][country][city] = timezone;
        });
      });
    });

    return structure;
  }, []);

  // Get available continents
  const continents = useMemo(() => {
    return Object.keys(hierarchicalData).sort();
  }, [hierarchicalData]);

  // Get all unique countries from selected continent
  const availableCountries = useMemo(() => {
    if (!selectedContinent || !hierarchicalData[selectedContinent]) return [];
    return Object.keys(hierarchicalData[selectedContinent]).sort();
  }, [selectedContinent, hierarchicalData]);

  // Get cities filtered by continent and optionally by country
  const availableCities = useMemo(() => {
    if (!selectedContinent || !hierarchicalData[selectedContinent]) return [];

    const citiesMap = {};

    // If a country is selected, only show cities from that country
    if (selectedCountry) {
      const countryCities = hierarchicalData[selectedContinent][selectedCountry];
      if (countryCities) {
        Object.keys(countryCities).forEach((city) => {
          citiesMap[city] = {
            timezone: countryCities[city],
            country: selectedCountry,
          };
        });
      }
    } else {
      // No country filter - show all cities from the continent
      Object.keys(hierarchicalData[selectedContinent]).forEach((country) => {
        Object.keys(hierarchicalData[selectedContinent][country]).forEach((city) => {
          citiesMap[city] = {
            timezone: hierarchicalData[selectedContinent][country][city],
            country,
          };
        });
      });
    }

    return Object.keys(citiesMap).sort().map((city) => ({
      name: city,
      timezone: citiesMap[city].timezone,
      country: citiesMap[city].country,
    }));
  }, [selectedContinent, selectedCountry, hierarchicalData]);

  // Search across all timezones
  const searchResults = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return [];

    // Split query into individual words for flexible matching
    const queryWords = query.split(/\s+/).filter((word) => word.length > 0);
    const results = [];

    Object.keys(hierarchicalData).forEach((continent) => {
      Object.keys(hierarchicalData[continent]).forEach((country) => {
        Object.keys(hierarchicalData[continent][country]).forEach((city) => {
          const timezone = hierarchicalData[continent][country][city];
          const searchText = `${continent} ${country} ${city}`.toLowerCase().replace(/_/g, ' ');

          // Check if ALL query words are found in the search text
          const matchesAllWords = queryWords.every((word) => searchText.includes(word));

          if (matchesAllWords) {
            results.push({
              continent,
              country,
              city,
              timezone,
              displayName: `${city.replace(/_/g, ' ')} (${country}, ${continent})`,
            });
          }
        });
      });
    });

    return results.sort((a, b) => a.displayName.localeCompare(b.displayName));
  }, [searchQuery, hierarchicalData]);

  // Get UTC offset for a timezone
  const getUTCOffset = (timezone) => {
    try {
      const date = new Date();
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        timeZoneName: 'short',
      });
      const parts = formatter.formatToParts(date);
      const timeZonePart = parts.find((part) => part.type === 'timeZoneName');
      return timeZonePart?.value || '';
    } catch (error) {
      return '';
    }
  };

  // Get current time for a timezone
  const getCurrentTime = (timezone) => {
    try {
      const date = new Date();
      return date.toLocaleTimeString('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch (error) {
      return '';
    }
  };

  const deviceOffset = useMemo(
    () => (deviceTimeZone ? getTimeZoneOffset(new Date(), deviceTimeZone) : 0),
    [deviceTimeZone],
  );

  const offsetChip = (timezone) =>
    formatOffsetChip(getTimeZoneOffset(new Date(), timezone), deviceOffset);

  // Handlers
  const handleContinentChange = (e) => {
    setSelectedContinent(e.target.value);
    setSelectedCountry('');
    setSelectedCity('');
  };

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    setSelectedCity('');
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);

    // Find the timezone for the selected city
    if (city && selectedContinent) {
      const cityData = availableCities.find((c) => c.name === city);
      if (cityData && cityData.timezone) {
        onChange(cityData.timezone);
        onClose();
      }
    }
  };

  const handleSearchSelect = (timezone) => {
    onChange(timezone);
    onClose();
  };

  useEffect(() => {
    if (!open) {
      setSearchQuery('');
      setSelectedContinent('');
      setSelectedCountry('');
      setSelectedCity('');
      setShowBrowse(false);
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    // Clear dropdown selections when searching
    if (event.target.value) {
      setSelectedContinent('');
      setSelectedCountry('');
      setSelectedCity('');
    }
  };

  const showSearchResults = searchQuery.length > 0;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={handleOverlayClick}
    >
      <div className="modal-sheet">
        <div className="modal-header">
          <div className="modal-header-text">
            <h2 className="modal-title">{title}</h2>
            <p className="modal-subtitle">
              {showSearchResults
                ? `${searchResults.length} results found`
                : 'Search or pick a destination'}
            </p>
          </div>
          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Close timezone picker"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        <div className="search-container">
          <Icon name="search" size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search for a city, country, or continent..."
            value={searchQuery}
            onChange={handleSearchChange}
            autoFocus
          />
          {searchQuery && (
            <button
              className="search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <Icon name="close" size={16} />
            </button>
          )}
        </div>

        <div className="modal-content">
          {showSearchResults ? (
            <div className="timezone-list">
              {searchResults.length === 0 ? (
                <div className="empty-state">
                  <Icon name="globe" size={40} className="empty-state-icon" />
                  <p className="empty-state-title">No timezones found</p>
                  <p className="empty-state-subtitle">Try a different search term</p>
                </div>
              ) : (
                searchResults.map((result) => {
                  const isSelected = result.timezone === value;
                  const currentTime = getCurrentTime(result.timezone);
                  const offset = getUTCOffset(result.timezone);

                  return (
                    <button
                      key={result.timezone}
                      className={`timezone-row ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSearchSelect(result.timezone)}
                    >
                      <div className="timezone-row-main">
                        <span className="timezone-row-city">
                          {result.city.replace(/_/g, ' ')}
                        </span>
                        <span className="timezone-row-region">
                          {result.country}, {result.continent}
                        </span>
                      </div>
                      <div className="timezone-row-details">
                        <span className="timezone-row-time">{currentTime}</span>
                        {offset && <span className="chip chip-offset">{offset}</span>}
                      </div>
                      {isSelected && (
                        <span className="timezone-row-check"><Icon name="check" size={16} /></span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          ) : (
            <div className="picker-sections">
              {nearbyZone && (
                <section className="picker-section">
                  <h3 className="section-title">Nearby</h3>
                  <button
                    className="timezone-row"
                    onClick={() => handleSearchSelect(nearbyZone)}
                  >
                    <div className="timezone-row-main">
                      <span className="timezone-row-city">{getPrettyZoneName(nearbyZone)}</span>
                      <span className="timezone-row-region">
                        {getZoneAbbrev(new Date(), nearbyZone)} ({getUTCOffset(nearbyZone)})
                      </span>
                    </div>
                    <div className="timezone-row-details">
                      <span className="timezone-row-time">{getCurrentTime(nearbyZone)}</span>
                      <Icon name="myLocation" size={18} className="timezone-row-locate" />
                    </div>
                  </button>
                </section>
              )}

              <section className="picker-section">
                <h3 className="section-title">Popular Destinations</h3>
                <div className="timezone-list">
                  {POPULAR.map((zone) => (
                    <button
                      key={zone}
                      className={`timezone-row ${zone === value ? 'selected' : ''}`}
                      onClick={() => handleSearchSelect(zone)}
                    >
                      <div className="timezone-row-main">
                        <span className="timezone-row-city">{getPrettyZoneName(zone)}</span>
                        <span className="timezone-row-region">
                          {getZoneAbbrev(new Date(), zone)} ({getUTCOffset(zone)})
                        </span>
                      </div>
                      <div className="timezone-row-details">
                        <span className="timezone-row-time">{getCurrentTime(zone)}</span>
                        <span className="chip chip-offset">{offsetChip(zone)}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <button
                type="button"
                className="chip chip-action browse-toggle"
                onClick={() => setShowBrowse((current) => !current)}
              >
                <Icon name={showBrowse ? 'close' : 'globe'} size={16} />
                {showBrowse ? 'Hide browse' : 'Browse all timezones'}
              </button>

              {showBrowse && (
                <div className="timezone-dropdown-container">
                  {/* Step 1: Select Continent */}
                  <div className="timezone-dropdown-group">
                    <label htmlFor="continent-select" className="timezone-dropdown-label">
                      <span className="timezone-step-number">1</span>
                      Select Continent
                    </label>
                    <select
                      id="continent-select"
                      className="timezone-dropdown"
                      value={selectedContinent}
                      onChange={handleContinentChange}
                    >
                      <option value="">-- Choose a continent --</option>
                      {continents.map((continent) => (
                        <option key={continent} value={continent}>
                          {continent.replace(/_/g, ' ')}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Step 2: Select Country (only show when continent is selected) */}
                  {selectedContinent && availableCountries.length > 0 && (
                    <div className="timezone-dropdown-group">
                      <label htmlFor="country-select" className="timezone-dropdown-label">
                        <span className="timezone-step-number">2</span>
                        Select Country
                      </label>
                      <select
                        id="country-select"
                        className="timezone-dropdown"
                        value={selectedCountry}
                        onChange={handleCountryChange}
                      >
                        <option value="">-- Choose a country --</option>
                        {availableCountries.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Step 3: Select City (only show when continent is selected) */}
                  {selectedContinent && availableCities.length > 0 && (
                    <div className="timezone-dropdown-group">
                      <label htmlFor="city-select" className="timezone-dropdown-label">
                        <span className="timezone-step-number">3</span>
                        Select City
                        {selectedCountry && ` in ${selectedCountry}`}
                      </label>
                      <select
                        id="city-select"
                        className="timezone-dropdown"
                        value={selectedCity}
                        onChange={handleCityChange}
                      >
                        <option value="">-- Choose a city ({availableCities.length} available) --</option>
                        {availableCities.map((cityData) => (
                          <option key={cityData.name} value={cityData.name}>
                            {cityData.name.replace(/_/g, ' ')}
                            {!selectedCountry && ` (${cityData.country})`}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {!selectedContinent && (
                    <p className="browse-hint">
                      Start by selecting a continent, or use the search bar to find a specific city.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <span className="modal-footer-label">Current:</span>
          <span className="chip chip-active">{value.replace(/_/g, ' ')}</span>
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
  title: PropTypes.string,
  nearbyZone: PropTypes.string,
  deviceTimeZone: PropTypes.string.isRequired,
};

export default TimezoneModal;
