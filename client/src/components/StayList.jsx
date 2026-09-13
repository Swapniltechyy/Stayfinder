import React, { useEffect, useRef } from 'react';
import StayCard from './StayCard.jsx';
import { SearchX, RotateCcw } from 'lucide-react';

export default function StayList({
  stays,
  totalCount,
  selectedCity,
  selectedStayId,
  onSelectStay,
  onResetFilters
}) {
  const listRef = useRef(null);

  // Auto-scroll to selected card when selectedStayId changes
  useEffect(() => {
    if (!selectedStayId || !listRef.current) return;
    const cardEl = listRef.current.querySelector(`#stay-card-${selectedStayId}`);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedStayId]);

  return (
    <div className="stay-list-panel">
      <div className="stay-list-header">
        <div className="count-info">
          <span className="count-badge">{stays.length}</span>
          <span className="count-text">
            Showing <strong>{stays.length}</strong> of <strong>{totalCount}</strong> stays in {selectedCity}
          </span>
        </div>
      </div>

      <div className="stay-cards-container" ref={listRef}>
        {stays.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon-wrapper">
              <SearchX size={36} className="empty-icon" />
            </div>
            <h4 className="empty-title">No stays match these filters</h4>
            <p className="empty-description">
              Try selecting a different area or enabling more categories to see available properties.
            </p>
            {onResetFilters && (
              <button type="button" onClick={onResetFilters} className="reset-filters-btn">
                <RotateCcw size={14} />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        ) : (
          stays.map((stay) => (
            <StayCard
              key={stay.id}
              stay={stay}
              isSelected={selectedStayId === stay.id}
              onSelect={onSelectStay}
            />
          ))
        )}
      </div>
    </div>
  );
}
