import React from 'react';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function ExportButton({ stays, selectedCity, disabled }) {
  const handleExport = () => {
    if (!stays || stays.length === 0) return;

    // Transform dataset to specified columns
    const exportData = stays.map((stay) => ({
      'Name': stay.name || '',
      'Category': stay.category || '',
      'Area': stay.area || '',
      'Phone Number': stay.phone_number || 'Not available',
      'Email': stay.email || 'Not available',
      'Website': stay.website || 'Not available',
      'Address': stay.address || '',
      'Latitude': stay.latitude,
      'Longitude': stay.longitude,
    }));

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Auto-size column widths for professional appearance
    const colWidths = [
      { wch: 35 }, // Name
      { wch: 12 }, // Category
      { wch: 25 }, // Area
      { wch: 20 }, // Phone Number
      { wch: 28 }, // Email
      { wch: 35 }, // Website
      { wch: 50 }, // Address
      { wch: 14 }, // Latitude
      { wch: 14 }, // Longitude
    ];
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Stays');

    // Generate filename: stayfinder_<city>_<YYYYMMDD>.xlsx
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;
    const citySlug = (selectedCity || 'city').toLowerCase().replace(/\s+/g, '_');
    const filename = `stayfinder_${citySlug}_${dateStr}.xlsx`;

    // Export file
    XLSX.writeFile(workbook, filename);
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={disabled || !stays || stays.length === 0}
      className="export-button"
      title={stays?.length > 0 ? `Export ${stays.length} stays to Excel` : 'No stays to export'}
    >
      <Download size={16} className="export-icon" />
      <span>Export</span>
      {stays && stays.length > 0 && <span className="export-count">({stays.length})</span>}
    </button>
  );
}
