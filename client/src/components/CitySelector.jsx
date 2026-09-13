import React from 'react';
import { MapPin } from 'lucide-react';

export default function CitySelector({ cities, selectedCity, onSelectCity, disabled }) {
  return (
    <div className="filter-group">
      <label htmlFor="city-select" className="filter-label">
        <MapPin size={15} className="label-icon" />
        <span>City</span>
      </label>
      <div className="select-wrapper">
        <select
          id="city-select"
          value={selectedCity || ''}
          onChange={(e) => onSelectCity(e.target.value)}
          disabled={disabled || cities.length === 0}
          className="filter-select"
        >
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
