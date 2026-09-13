import React, { useEffect, useRef, useState } from 'react';
import StayCard from './StayCard.jsx';
import { SearchX, RotateCcw, ArrowUp } from 'lucide-react';

export default function StayList({
  stays,
  totalCount,
  selectedCity,
  selectedStayId,
  onSelectStay,
  onOpenMap,
  onResetFilters
}) {
  const listRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Auto-scroll to selected card when selectedStayId changes
  useEffect(() => {
    if (!selectedStayId || !listRef.current) return;
    const cardEl = listRef.current.querySelector(`#stay-card-${selectedStayId}`);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedStayId]);

  const handleScroll = (e) => {
    if (e.target.scrollTop > 280) {
      setShowScrollTop(true);
    } else {
      setShowScrollTop(false);
    }
  };

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

      <div className="stay-cards-container" ref={listRef} onScroll={handleScroll}>
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
              onOpenMap={onOpenMap}
            />
          ))
        )}
      </div>

      {showScrollTop && (
        <button
          type="button"
          className="list-scroll-top-btn"
          onClick={() => listRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
          title="Scroll back to top"
          aria-label="Scroll back to top"
        >
          <ArrowUp size={15} />
          <span>Top</span>
        </button>
      )}
    </div>
  );
}
