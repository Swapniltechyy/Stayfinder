import React from 'react';
import { Hotel, Home, Building2 } from 'lucide-react';

const CATEGORY_META = {
  Hotel: {
    label: 'Hotel',
    icon: Hotel,
    colorClass: 'category-hotel',
  },
  Homestay: {
    label: 'Homestay',
    icon: Home,
    colorClass: 'category-homestay',
  },
  PG: {
    label: 'PG / Hostel',
    icon: Building2,
    colorClass: 'category-pg',
  },
};

export default function CategoryFilter({
  availableCategories,
  selectedCategories,
  onToggleCategory,
  onSelectAll
}) {
  return (
    <div className="filter-group category-filter-group">
      <div className="filter-label">
        <span>Category</span>
        {selectedCategories.length < availableCategories.length && (
          <button
            type="button"
            className="select-all-btn"
            onClick={onSelectAll}
            title="Select all categories"
          >
            Reset
          </button>
        )}
      </div>
      <div className="category-pills">
        {availableCategories.map((cat) => {
          const isSelected = selectedCategories.includes(cat);
          const meta = CATEGORY_META[cat] || {
            label: cat,
            icon: Building2,
            colorClass: 'category-default',
          };
          const Icon = meta.icon;

          return (
            <button
              key={cat}
              type="button"
              onClick={() => onToggleCategory(cat)}
              className={`category-pill ${meta.colorClass} ${isSelected ? 'active' : 'inactive'}`}
              aria-pressed={isSelected}
            >
              <span className="pill-checkbox">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => {}} // handled by button click
                  tabIndex={-1}
                />
              </span>
              <Icon size={14} className="pill-icon" />
              <span className="pill-label">{meta.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
