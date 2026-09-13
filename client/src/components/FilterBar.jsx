import React from 'react';
import CitySelector from './CitySelector.jsx';
import AreaSelector from './AreaSelector.jsx';
import CategoryFilter from './CategoryFilter.jsx';
import { Search, X } from 'lucide-react';

export default function FilterBar({
  cities,
  selectedCity,
  onSelectCity,
  areas,
  selectedArea,
  onSelectArea,
  availableCategories,
  selectedCategories,
  onToggleCategory,
  onSelectAllCategories,
  searchQuery,
  onSearchChange,
  loading
}) {
  return (
    <div className="filter-bar">
      <div className="filter-bar-inner">
        <CitySelector
          cities={cities}
          selectedCity={selectedCity}
          onSelectCity={onSelectCity}
          disabled={loading}
        />

        <div className="filter-divider" />

        <AreaSelector
          areas={areas}
          selectedArea={selectedArea}
          onSelectArea={onSelectArea}
          disabled={loading}
        />

        <div className="filter-divider" />

        <CategoryFilter
          availableCategories={availableCategories}
          selectedCategories={selectedCategories}
          onToggleCategory={onToggleCategory}
          onSelectAll={onSelectAllCategories}
        />

        <div className="filter-divider" />

        {/* Global Search Filter (after PG / Hostel) */}
        <div className="search-filter-group">
          <div className="search-input-wrapper">
            <input
              id="search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="🔍 Search"
              className="filter-search-input"
              disabled={loading}
              aria-label="Search"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="search-clear-btn"
                title="Clear search"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
