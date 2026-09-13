import React, { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';
import { X, Phone, Mail, Globe, List } from 'lucide-react';

// OpenStreetMap (Standard) Tile Engine
const OSM_STANDARD = {
  name: 'OpenStreetMap (Standard)',
  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
};

// Custom helper to recompute Leaflet dimensions when mobile tab changes
function MapResizeHandler({ mobileView }) {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);
    return () => clearTimeout(timer);
  }, [mobileView, map]);
  return null;
}

// Custom SVG Icons for Leaflet markers by category
const createCategoryIcon = (category, isSelected) => {
  let color = '#2563eb'; // Hotel: blue
  let iconSvg = `<path d="M10 22v-6.57a2 2 0 0 1 1.05-1.75l4-2.22A2 2 0 0 1 18 13.21V22M4 22V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v18M4 9h4M4 14h4M4 19h4" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;

  if (category === 'Homestay') {
    color = '#059669'; // Homestay: emerald
    iconSvg = `<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="9 22 9 12 15 12 15 22" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
  } else if (category === 'PG') {
    color = '#d97706'; // PG: amber
    iconSvg = `<rect width="16" height="20" x="4" y="2" rx="2" ry="2" fill="none" stroke="white" stroke-width="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" stroke="white" stroke-width="2" stroke-linecap="round"/>`;
  }

  const size = isSelected ? 40 : 32;
  const anchorY = isSelected ? 40 : 32;
  const anchorX = size / 2;

  const html = `
    <div class="custom-leaflet-marker ${isSelected ? 'marker-selected' : ''}" style="--marker-color: ${color}">
      <div class="marker-pin" style="background-color: ${color}; width: ${size}px; height: ${size}px;">
        <svg class="marker-symbol" viewBox="0 0 24 24" width="${size * 0.5}" height="${size * 0.5}">
          ${iconSvg}
        </svg>
      </div>
      <div class="marker-shadow"></div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-div-icon',
    html,
    iconSize: [size, size],
    iconAnchor: [anchorX, anchorY],
    popupAnchor: [0, -anchorY + 4],
  });
};

// Map controller for clustering, panning, auto-fly, and selection
function StaysClusterLayer({ stays, selectedStay, onSelectStay, markerRefs, clusterGroupRef, defaultCenter }) {
  const map = useMap();
  const prevSelectedIdRef = useRef(null);

  // Initialize and update cluster group
  useEffect(() => {
    if (!map) return;

    const clusterGroup = L.markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 40,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      disableClusteringAtZoom: 16,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        let sizeClass = 'small';
        if (count > 50) sizeClass = 'large';
        else if (count > 15) sizeClass = 'medium';

        return L.divIcon({
          html: `<div class="stay-cluster stay-cluster-${sizeClass}"><span>${count}</span></div>`,
          className: 'custom-cluster-wrapper',
          iconSize: L.point(36, 36)
        });
      }
    });

    clusterGroupRef.current = clusterGroup;
    markerRefs.current = {};

    // Add markers
    stays.forEach((stay) => {
      if (!stay.latitude || !stay.longitude) return;
      const isSelected = selectedStay && stay.id === selectedStay.id;
      const icon = createCategoryIcon(stay.category, isSelected);
      const marker = L.marker([stay.latitude, stay.longitude], { icon });

      const hasPhone = Boolean(stay.phone_number && stay.phone_number.trim() !== '');
      const hasEmail = Boolean(stay.email && stay.email.trim() !== '');
      const hasWebsite = Boolean(stay.website && stay.website.trim() !== '');
      const displayWeb = hasWebsite ? stay.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') : '';

      const popupHtml = `
        <div class="popup-content">
          <div class="popup-header">
            <span class="popup-category-badge badge-${(stay.category || 'hotel').toLowerCase()}">
              ${stay.category}
            </span>
          </div>
          <h4 class="popup-title">${stay.name}</h4>
          <div class="popup-row">
            <span class="popup-icon">📍</span>
            <span>${stay.area || ''}</span>
          </div>
          <div class="popup-row">
            <span class="popup-icon">🏢</span>
            <span class="popup-address">${stay.address || ''}</span>
          </div>
          <div class="popup-row popup-phone-row">
            ${hasPhone ? `<a href="tel:${stay.phone_number}" class="popup-phone-link">📞 ${stay.phone_number} (Call)</a>` : `<span class="popup-phone-na">Phone not available</span>`}
          </div>
          ${hasEmail ? `<div class="popup-row"><span class="popup-icon">✉️</span><a href="mailto:${stay.email}" class="popup-link">${stay.email}</a></div>` : ''}
          ${hasWebsite ? `<div class="popup-row"><span class="popup-icon">🌐</span><a href="${stay.website}" target="_blank" rel="noopener noreferrer" class="popup-link">${displayWeb} ↗</a></div>` : ''}
        </div>
      `;

      marker.bindPopup(popupHtml, { className: 'stay-map-popup', autoPan: false });

      marker.on('click', () => {
        onSelectStay(stay);
      });

      clusterGroup.addLayer(marker);
      markerRefs.current[stay.id] = marker;
    });

    map.addLayer(clusterGroup);

    // Auto-fit bounds if no stay is currently selected
    if (stays.length > 0 && !selectedStay) {
      const validPoints = stays.filter(s => s.latitude && s.longitude);
      if (validPoints.length === 1) {
        map.setView([validPoints[0].latitude, validPoints[0].longitude], 15);
      } else if (validPoints.length > 1) {
        const bounds = L.latLngBounds(validPoints.map(s => [s.latitude, s.longitude]));
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      }
    } else if (stays.length === 0) {
      map.setView(defaultCenter, 12);
    }

    return () => {
      map.removeLayer(clusterGroup);
    };
  }, [stays, map]);

  // Handle selected stay fly-to and popup opening
  useEffect(() => {
    if (selectedStay && selectedStay.id !== prevSelectedIdRef.current) {
      prevSelectedIdRef.current = selectedStay.id;
      const marker = markerRefs.current[selectedStay.id];
      const clusterGroup = clusterGroupRef.current;

      if (clusterGroup && marker) {
        clusterGroup.zoomToShowLayer(marker, () => {
          map.flyTo([selectedStay.latitude, selectedStay.longitude], 16, { duration: 0.6 });
          marker.openPopup();
        });
      } else {
        map.flyTo([selectedStay.latitude, selectedStay.longitude], 16, { duration: 0.6 });
      }
    }
  }, [selectedStay, map]);

  return null;
}

export default function MapView({
  stays,
  selectedStayId,
  onSelectStay,
  mobileView,
  onSwitchView,
  defaultCenter = [27.041, 88.266]
}) {
  const markerRefs = useRef({});
  const clusterGroupRef = useRef(null);

  const selectedStay = useMemo(() => {
    return stays.find(s => s.id === selectedStayId) || null;
  }, [stays, selectedStayId]);

  // Compute map center
  const initialCenter = useMemo(() => {
    if (stays.length > 0) {
      const avgLat = stays.reduce((sum, s) => sum + s.latitude, 0) / stays.length;
      const avgLng = stays.reduce((sum, s) => sum + s.longitude, 0) / stays.length;
      return [avgLat, avgLng];
    }
    return defaultCenter;
  }, [stays, defaultCenter]);

  return (
    <div className="map-view-container">
      <MapContainer
        center={initialCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="leaflet-map"
        attributionControl={false}
      >
        <TileLayer
          attribution={OSM_STANDARD.attribution}
          url={OSM_STANDARD.url}
          maxZoom={OSM_STANDARD.maxZoom}
        />

        <MapResizeHandler mobileView={mobileView} />

        <StaysClusterLayer
          stays={stays}
          selectedStay={selectedStay}
          onSelectStay={onSelectStay}
          markerRefs={markerRefs}
          clusterGroupRef={clusterGroupRef}
          defaultCenter={defaultCenter}
        />
      </MapContainer>

      {/* Map Legend */}
      <div className="map-legend">
        <div className="legend-title">Stay Categories</div>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-dot dot-hotel"></span>
            <span>Hotel</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot dot-homestay"></span>
            <span>Homestay</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot dot-pg"></span>
            <span>PG / Hostel</span>
          </div>
        </div>
      </div>

      {/* Dynamic Floating Stay Card on Map */}
      {selectedStay && (
        <div className="map-floating-card">
          <button
            type="button"
            className="map-card-close-btn"
            onClick={() => onSelectStay(null)}
            title="Close card"
            aria-label="Close card"
          >
            <X size={15} />
          </button>
          
          <div className="map-card-body">
            <div className="map-card-badge-row">
              <span className={`category-badge badge-${(selectedStay.category || 'hotel').toLowerCase()}`}>
                {selectedStay.category}
              </span>
              <span className="map-card-area-text">{selectedStay.area}</span>
            </div>
            
            <h4 className="map-card-name">{selectedStay.name}</h4>
            <p className="map-card-address-text">{selectedStay.address}</p>

            <div className="map-card-actions-bar">
              {selectedStay.phone_number && (
                <a href={`tel:${selectedStay.phone_number}`} className="map-action-btn btn-call" title="Call">
                  <Phone size={13} />
                  <span>Call</span>
                </a>
              )}
              {selectedStay.email && (
                <a href={`mailto:${selectedStay.email}`} className="map-action-btn btn-email" title="Email">
                  <Mail size={13} />
                  <span>Email</span>
                </a>
              )}
              {selectedStay.website && (
                <a href={selectedStay.website} target="_blank" rel="noopener noreferrer" className="map-action-btn btn-web" title="Website">
                  <Globe size={13} />
                  <span>Website</span>
                </a>
              )}
              {onSwitchView && (
                <button
                  type="button"
                  className="map-action-btn btn-list-view"
                  onClick={() => onSwitchView('list')}
                  title="View in list"
                >
                  <List size={13} />
                  <span>View in List</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
