import { useState, useEffect, useMemo } from 'react';

export function useStays() {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [cityData, setCityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedStayId, setSelectedStayId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch available cities on mount
  useEffect(() => {
    async function fetchCities() {
      try {
        setLoading(true);
        let res = await fetch('/api/cities');
        if (!res.ok) {
          // Fallback to static data
          res = await fetch('/data/index.json');
        }
        if (!res.ok) throw new Error(`Failed to fetch cities: ${res.statusText}`);
        const data = await res.json();
        const cityList = Array.isArray(data) ? data : (data.cities || []);
        setCities(cityList);
        if (cityList.length > 0) {
          setSelectedCity(cityList[0]);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCities();
  }, []);

  // Fetch city data whenever selectedCity changes
  useEffect(() => {
    if (!selectedCity) return;

    async function fetchCityData() {
      try {
        setLoading(true);
        setError(null);
        let res = await fetch(`/api/cities/${encodeURIComponent(selectedCity)}`);
        if (!res.ok) {
          // Fallback to static data file
          res = await fetch(`/data/${encodeURIComponent(selectedCity.toLowerCase())}.json`);
        }
        if (!res.ok) throw new Error(`Failed to fetch stays for ${selectedCity}`);
        const data = await res.json();
        
        // Ensure each hotel has a stable index ID for selection/sync
        const normalizedHotels = (data.hotels || []).map((hotel, index) => ({
          ...hotel,
          id: hotel.id !== undefined ? hotel.id : `${selectedCity.toLowerCase()}-${index}`,
          originalIndex: index
        }));

        setCityData({
          ...data,
          hotels: normalizedHotels
        });

        // Reset downstream filters: area -> 'all', categories -> all present categories, clear search
        setSelectedArea('all');
        const uniqueCats = Array.from(new Set(normalizedHotels.map(h => h.category).filter(Boolean)));
        setSelectedCategories(uniqueCats.length > 0 ? uniqueCats : ['Hotel', 'Homestay', 'PG']);
        setSelectedStayId(null);
        setSearchQuery('');
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCityData();
  }, [selectedCity]);

  // Derive unique sorted areas from current city's hotels
  const areas = useMemo(() => {
    if (!cityData || !cityData.hotels) return [];
    const areaSet = new Set(cityData.hotels.map(h => h.area).filter(Boolean));
    return Array.from(areaSet).sort((a, b) => a.localeCompare(b));
  }, [cityData]);

  // Derive available categories from current city's hotels
  const availableCategories = useMemo(() => {
    if (!cityData || !cityData.hotels) return ['Hotel', 'Homestay', 'PG'];
    const catSet = new Set(cityData.hotels.map(h => h.category).filter(Boolean));
    const list = Array.from(catSet);
    return list.length > 0 ? list : ['Hotel', 'Homestay', 'PG'];
  }, [cityData]);

  // Combined reactive filtering (City + Area + Category + Global Search)
  const filteredStays = useMemo(() => {
    if (!cityData || !cityData.hotels) return [];
    const query = searchQuery.trim().toLowerCase();

    return cityData.hotels.filter(hotel => {
      const matchesArea = selectedArea === 'all' || hotel.area.toLowerCase() === selectedArea.toLowerCase();
      const matchesCategory = selectedCategories.includes(hotel.category);

      if (!matchesArea || !matchesCategory) return false;

      if (!query) return true;

      const nameMatch = (hotel.name || '').toLowerCase().includes(query);
      const emailMatch = (hotel.email || '').toLowerCase().includes(query);
      const phoneMatch = (hotel.phone_number || '').toLowerCase().includes(query);
      const addressMatch = (hotel.address || '').toLowerCase().includes(query);
      const areaMatch = (hotel.area || '').toLowerCase().includes(query);
      const categoryMatch = (hotel.category || '').toLowerCase().includes(query);
      const websiteMatch = (hotel.website || '').toLowerCase().includes(query);

      return nameMatch || emailMatch || phoneMatch || addressMatch || areaMatch || categoryMatch || websiteMatch;
    });
  }, [cityData, selectedArea, selectedCategories, searchQuery]);

  // Toggle category helper
  const toggleCategory = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const selectAllCategories = () => {
    setSelectedCategories(availableCategories);
  };

  return {
    cities,
    selectedCity,
    setSelectedCity,
    cityData,
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
    totalCount: cityData?.hotels?.length || 0,
    filteredCount: filteredStays.length
  };
}
