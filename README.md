# StayFinder — Travel Agency Internal Accommodations Portal

**StayFinder** is a single-page travel agency portal for browsing accommodations (Hotels, Homestays, and PGs / Hostels) across **Darjeeling** and **Sikkim** on an interactive OpenStreetMap, applying multi-dimensional filters, searching in real time, and exporting datasets to Excel.

---

## 🌟 Key Features

1. **Multi-Destination Architecture**:
   - City selector dynamically populated via `GET /api/cities`.
   - Pre-loaded with **2,207 verified accommodations**:
     - **Darjeeling**: 1,291 stays across all district police stations and sub-localities.
     - **Sikkim**: 916 stays across Gangtok, Pelling, Ravangla, Namchi, Mangan, Lachung, and more.
   - **Zero code changes to add a new destination**: Drop `city.json` into `/server/data/` and add the name to `/server/data/index.json`.

2. **Real-time Global Search**:
   - Capsule search bar styled with `🔍 Search` placeholder.
   - Searches instantly as you type across accommodation name, address, area, phone number, email, website, and category.

2. **Dynamic Dependent Area Selector**:
   - Automatically derives unique areas from the active city's data (e.g. `mall road / chowrasta / chauk bazaar`, `ghoom`, `lebong`, `singamari / north point`, `limbugaon`, etc.).
   - Defaults to "All Areas".

3. **Multi-Category Filter**:
   - Category toggle pills/checkboxes for **Hotel**, **Homestay**, and **PG / Hostel**.
   - Derived dynamically from property listings.
   - Instant AND-logic reactive filtering across City, Area, and Categories.

4. **Interactive Leaflet Map (Free / No Paid API Keys Required)**:
   - Powered by **Leaflet.js** and **OpenStreetMap** tile layers.
   - Custom color-coded marker pins by category:
     - 🔵 **Blue** for Hotels
     - 🟢 **Green** for Homestays
     - 🟠 **Orange** for PGs / Hostels
   - Popups display property name, category badge, area, address, phone number (or "Not available"), and direct `tel:` call link.
   - Includes map category legend.

5. **Synchronized Map & Card Panel (Startup.io UX)**:
   - Click a card in the list: the map smoothly pans/zooms to the property's coordinates and opens its popup.
   - Click a pin on the map: the card in the list is highlighted and smoothly scrolled into view.
   - Live counter: `Showing X of Y stays in {city}`.
   - Graceful empty state when no stays match filter criteria.

6. **Client-Side Excel Export (SheetJS)**:
   - One-click "Export to Excel" button.
   - Generates `.xlsx` files entirely client-side using SheetJS (`xlsx`).
   - Exports the **currently filtered** dataset with columns:
     - `Name`
     - `Category`
     - `Area`
     - `Phone Number`
     - `Address`
     - `Latitude`
     - `Longitude`
   - Named according to standard convention: `stayfinder_<city>_<YYYYMMDD>.xlsx` (e.g. `stayfinder_darjeeling_20260913.xlsx`).

7. **Resilient Data Handling**:
   - `phone_number: null` is handled cleanly without crashes or showing `"null"`.
   - Case-insensitive city matching in the REST API.
   - Fully responsive design (side-by-side desktop layout, stacked mobile/tablet layout).

---

## 🚀 Quick Start

### 1. Install dependencies
From the project root:
```bash
npm install
```
*(This installs root dependencies and automatically installs client dependencies via postinstall).*

### 2. Run the development environment
```bash
npm run dev
```
This runs both the Express API server (`http://localhost:5000`) and the Vite React frontend (`http://localhost:5173`) concurrently.

Open **http://localhost:5173** in your browser.

---

## 🛠️ Production Build & Start

To build the client bundle and serve everything via the Express server:
```bash
npm run build
npm start
```
The unified app will be running at **http://localhost:5000**.

---

## 📂 Project Structure

```
Hotels.io/
├── package.json               # Root scripts (dev, build, start, concurrently)
├── darjeeling_hotels.json     # Raw initial source dataset
├── server/
│   ├── index.js               # Express REST API (serves /api/cities and static client in prod)
│   └── data/
│       ├── index.json         # List of available cities: { "cities": ["Darjeeling"] }
│       └── darjeeling.json    # 84 normalized stays with categories & coordinates
└── client/
    ├── index.html             # Vite entry with Leaflet CSS & Inter font
    ├── vite.config.js         # Vite configuration with /api proxy to Express :5000
    ├── package.json           # React, Leaflet, SheetJS (xlsx), Lucide icons
    └── src/
        ├── main.jsx           # React DOM root
        ├── App.jsx            # Portal layout (Header, FilterBar, Map + List)
        ├── index.css          # Responsive styling, modern cards, and custom Leaflet pins
        ├── hooks/
        │   └── useStays.js    # Data fetching, area/category derivation & reactive filtering
        └── components/
            ├── Header.jsx         # Branding, visible stay counter & Export button
            ├── FilterBar.jsx      # Bar containing City, Area, and Category filters
            ├── CitySelector.jsx   # City dropdown selector
            ├── AreaSelector.jsx   # Dynamic area dropdown selector
            ├── CategoryFilter.jsx # Hotel / Homestay / PG toggle pills
            ├── MapView.jsx        # Leaflet map with custom category markers & auto-fly
            ├── StayList.jsx       # Scrollable stays list with auto-scroll & empty state
            ├── StayCard.jsx       # Card with badges, address, phone & click-to-focus
            └── ExportButton.jsx   # Client-side SheetJS Excel exporter
```

---

## ➕ Adding a New City in the Future

To add a new city (e.g. `Gangtok`):
1. Place `gangtok.json` (following the same `{ city, count, hotels: [...] }` schema) into `server/data/`.
2. Add `"Gangtok"` to the `cities` array in `server/data/index.json`:
   ```json
   {
     "cities": ["Darjeeling", "Gangtok"]
   }
   ```
3. Refresh the application — Gangtok will appear in the city dropdown immediately without any frontend or backend code modifications.
