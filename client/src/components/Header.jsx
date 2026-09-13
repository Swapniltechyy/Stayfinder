import React from 'react';
import logoImg from '../assets/logo.png';
import ExportButton from './ExportButton.jsx';

export default function Header({ filteredStays, selectedCity, totalCount, onScrollToFirst }) {
  return (
    <header className="app-header">
      <div className="header-brand">
        <button
          type="button"
          className="brand-logo-btn"
          onClick={onScrollToFirst}
          title="Go to first accommodation in list"
        >
          <img src={logoImg} alt="StayFinder" className="brand-logo-img" />
        </button>
        <div className="brand-text">
          <h1
            className="app-title brand-title-clickable"
            onClick={onScrollToFirst}
            title="Go to first accommodation in list"
          >
            StayFinder
          </h1>
          <p className="app-subtitle">
            Travel Agency Accommodations Portal by{' '}
            <a
              href="https://www.swapniltech.com/#"
              target="_blank"
              rel="noopener noreferrer"
              className="subtitle-link"
            >
              swapniltech.com
            </a>
          </p>
        </div>
      </div>

      <div className="header-actions">
        <div className="header-stat">
          <span className="stat-value">{filteredStays.length}</span>
          <span className="stat-label">properties visible</span>
        </div>
        <ExportButton stays={filteredStays} selectedCity={selectedCity} />
      </div>
    </header>
  );
}
