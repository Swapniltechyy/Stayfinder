import React from 'react';
import { MapPin, Phone, Building2, Hotel, Home, Compass, Mail, Globe, ExternalLink } from 'lucide-react';

const CATEGORY_CONFIG = {
  Hotel: {
    badgeClass: 'badge-hotel',
    icon: Hotel,
    label: 'Hotel',
  },
  Homestay: {
    badgeClass: 'badge-homestay',
    icon: Home,
    label: 'Homestay',
  },
  PG: {
    badgeClass: 'badge-pg',
    icon: Building2,
    label: 'PG / Hostel',
  },
};

export default function StayCard({ stay, isSelected, onSelect, onOpenMap }) {
  const config = CATEGORY_CONFIG[stay.category] || {
    badgeClass: 'badge-default',
    icon: Building2,
    label: stay.category || 'Stay',
  };
  const CategoryIcon = config.icon;

  const hasPhone = Boolean(stay.phone_number && stay.phone_number.trim() !== '');
  const hasEmail = Boolean(stay.email && stay.email.trim() !== '');
  const hasWebsite = Boolean(stay.website && stay.website.trim() !== '');

  // Format display website (strip https:// and trailing slash)
  const displayWebsite = hasWebsite
    ? stay.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
    : '';

  return (
    <div
      id={`stay-card-${stay.id}`}
      className={`stay-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(stay)}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(stay);
        }
      }}
      aria-label={`View ${stay.name} on map`}
    >
      <div className="card-header">
        <h3 className="stay-name">{stay.name}</h3>
        <div className="card-header-tags">
          <span className={`category-badge ${config.badgeClass}`}>
            <CategoryIcon size={12} className="badge-icon" />
            <span>{config.label}</span>
          </span>
          {onOpenMap && (
            <button
              type="button"
              className="card-map-pin-btn"
              onClick={(e) => {
                e.stopPropagation();
                onOpenMap(stay);
              }}
              title="Locate on map"
              aria-label="Locate on map"
            >
              <MapPin size={11} />
              <span>Map</span>
            </button>
          )}
        </div>
      </div>

      <div className="card-area">
        <Compass size={13} className="meta-icon" />
        <span className="area-text">{stay.area}</span>
      </div>

      <div className="card-address">
        <MapPin size={13} className="meta-icon flex-shrink-0" />
        <span className="address-text">{stay.address}</span>
      </div>

      {/* Card Contact & Links Footer */}
      <div className="card-footer">
        <div className="card-contacts">
          {/* Phone */}
          <div className="contact-row phone-wrapper">
            <Phone size={13} className="meta-icon" />
            {hasPhone ? (
              <a
                href={`tel:${stay.phone_number}`}
                onClick={(e) => e.stopPropagation()}
                className="phone-link"
                title="Call this stay"
              >
                {stay.phone_number}
              </a>
            ) : (
              <span className="phone-unavailable">Phone not available</span>
            )}
          </div>

          {/* Email (if available) */}
          {hasEmail && (
            <div className="contact-row email-wrapper">
              <Mail size={13} className="meta-icon text-blue-600" />
              <a
                href={`mailto:${stay.email}`}
                onClick={(e) => e.stopPropagation()}
                className="email-link"
                title={`Send email to ${stay.email}`}
              >
                {stay.email}
              </a>
            </div>
          )}

          {/* Website (if available) */}
          {hasWebsite && (
            <div className="contact-row website-wrapper">
              <Globe size={13} className="meta-icon text-emerald-600" />
              <a
                href={stay.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="website-link"
                title={`Visit ${stay.website}`}
              >
                <span>{displayWebsite}</span>
                <ExternalLink size={10} className="inline-block ml-1" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
