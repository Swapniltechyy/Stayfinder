import React from 'react';
import { useStays } from './hooks/useStays.js';
import Header from './components/Header.jsx';
import FilterBar from './components/FilterBar.jsx';
import MapView from './components/MapView.jsx';
import StayList from './components/StayList.jsx';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function App() {
  const {
    cities,
    selectedCity,
    setSelectedCity,
    loading,
    error,
    areas,
    selectedArea,
    setSelectedArea,
    availableCategories,
    selectedCategories,
    toggleCategory,
    selectAllCategories,
    filteredStays,
    selectedStayId,
    setSelectedStayId,
    searchQuery,
    setSearchQuery,
    totalCount,
    filteredCount,
  } = useStays();

  const handleSelectStay = (stay) => {
    setSelectedStayId(stay ? stay.id : null);
  };

  const handleResetFilters = () => {
    setSelectedArea('all');
    selectAllCategories();
    setSearchQuery('');
  };

  const handleScrollToFirst = () => {
    setSelectedStayId(null);
    const container = document.querySelector('.stay-cards-container');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
    const firstCard = document.querySelector('.stay-card');
    if (firstCard) {
      firstCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="app-layout">
      <Header
        filteredStays={filteredStays}
        selectedCity={selectedCity}
        totalCount={totalCount}
        onScrollToFirst={handleScrollToFirst}
      />

      <FilterBar
        cities={cities}
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
        areas={areas}
        selectedArea={selectedArea}
        onSelectArea={setSelectedArea}
        availableCategories={availableCategories}
        selectedCategories={selectedCategories}
        onToggleCategory={toggleCategory}
        onSelectAllCategories={selectAllCategories}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        loading={loading}
      />

      {error && (
        <div className="error-banner">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <main className="main-content">
        {loading && !filteredStays.length ? (
          <div className="main-loading">
            <Loader2 size={32} className="spin-icon" />
            <p>Loading properties for {selectedCity || 'portal'}...</p>
          </div>
        ) : (
          <div className="portal-split-view">
            {/* List / Cards Panel (Left) */}
            <section className="list-panel" aria-label="Stay Cards List">
              <StayList
                stays={filteredStays}
                totalCount={totalCount}
                selectedCity={selectedCity}
                selectedStayId={selectedStayId}
                onSelectStay={handleSelectStay}
                onResetFilters={handleResetFilters}
              />
            </section>

            {/* Map Panel (Right) */}
            <section className="map-panel" aria-label="Interactive Map">
              <MapView
                stays={filteredStays}
                selectedStayId={selectedStayId}
                onSelectStay={handleSelectStay}
              />
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
