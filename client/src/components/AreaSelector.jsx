import React from 'react';
import { Compass } from 'lucide-react';

export default function AreaSelector({ areas, selectedArea, onSelectArea, disabled }) {
  // Format area text for clean presentation
  const formatAreaLabel = (area) => {
    if (!area || area === 'all') return 'All Areas';
    return area
      .split('/')
      .map(part => part.trim())
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' / ');
  };

  return (
    <div className="filter-group">
      <label htmlFor="area-select" className="filter-label">
        <Compass size={15} className="label-icon" />
        <span>Area</span>
      </label>
      <div className="select-wrapper">
        <select
          id="area-select"
          value={selectedArea}
          onChange={(e) => onSelectArea(e.target.value)}
          disabled={disabled || areas.length === 0}
          className="filter-select"
        >
          <option value="all">All Areas ({areas.length})</option>
          {areas.map((area) => (
            <option key={area} value={area}>
              {formatAreaLabel(area)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
