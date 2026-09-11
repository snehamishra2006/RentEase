import React, { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, IndianRupee, Home, SlidersHorizontal, RotateCcw } from 'lucide-react';

const PropertyFilter = ({ filters, onFilterChange, onReset }) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [cityTerm, setCityTerm] = useState(filters.city || '');

  // Keep local search & city terms in sync with prop updates
  useEffect(() => {
    setSearchTerm(filters.search || '');
    setCityTerm(filters.city || '');
  }, [filters.search, filters.city]);

  // Debounce text search dispatch (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== (filters.search || '')) {
        onFilterChange({ search: searchTerm });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, filters.search, onFilterChange]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (cityTerm !== (filters.city || '')) {
        onFilterChange({ city: cityTerm });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [cityTerm, filters.city, onFilterChange]);

  const handleSelectChange = (field, value) => {
    onFilterChange({ [field]: value });
  };

  const handleResetClick = () => {
    setSearchTerm('');
    setCityTerm('');
    onReset();
  };

  return (
    <div className="bg-white dark:bg-stone-900 p-5 rounded-xl border border-[#E2DACD] dark:border-stone-800 mb-8 shadow-xs">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E2DACD] dark:border-stone-800">
        <h3 className="font-serif font-bold text-[#1C1917] dark:text-stone-100 text-base flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#1B3B2B] dark:text-emerald-400" /> Property Ledger Search & Filter
        </h3>
        <button
          onClick={handleResetClick}
          className="text-xs text-[#605A52] dark:text-stone-400 hover:text-[#1B3B2B] dark:hover:text-emerald-400 flex items-center gap-1 font-semibold transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Search Keyword */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#605A52] dark:text-stone-400 mb-1">
            Search Keywords
          </label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#605A52] dark:text-stone-400" />
            <input
              type="text"
              placeholder="Title, locality, street..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#FAF7F2] dark:bg-stone-800 border border-[#E2DACD] dark:border-stone-700 rounded-lg text-xs text-[#1C1917] dark:text-stone-100 placeholder-[#605A52] dark:placeholder-stone-400 focus:outline-none focus:border-[#1B3B2B] dark:focus:border-emerald-400 transition-colors"
            />
          </div>
        </div>

        {/* City / Locality Filter */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#605A52] dark:text-stone-400 mb-1">
            City / Locality
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-[#605A52] dark:text-stone-400" />
            <input
              type="text"
              placeholder="e.g. Ghaziabad, Vaishali"
              value={cityTerm}
              onChange={(e) => setCityTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#FAF7F2] dark:bg-stone-800 border border-[#E2DACD] dark:border-stone-700 rounded-lg text-xs text-[#1C1917] dark:text-stone-100 placeholder-[#605A52] dark:placeholder-stone-400 focus:outline-none focus:border-[#1B3B2B] dark:focus:border-emerald-400 transition-colors"
            />
          </div>
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#605A52] dark:text-stone-400 mb-1">
            Property Type
          </label>
          <div className="relative">
            <Home className="w-4 h-4 absolute left-3 top-2.5 text-[#605A52] dark:text-stone-400 pointer-events-none" />
            <select
              value={filters.type || 'all'}
              onChange={(e) => handleSelectChange('type', e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#FAF7F2] dark:bg-stone-800 border border-[#E2DACD] dark:border-stone-700 rounded-lg text-xs text-[#1C1917] dark:text-stone-100 focus:outline-none focus:border-[#1B3B2B] dark:focus:border-emerald-400 transition-colors cursor-pointer appearance-none"
            >
              <option value="all">All Types</option>
              <option value="flat_apartment">Flat / Apartment</option>
              <option value="builder_floor">Builder Floor</option>
              <option value="independent_house">Independent House</option>
              <option value="villa">Villa</option>
              <option value="pg_shared">PG / Shared</option>
            </select>
          </div>
        </div>

        {/* Max Rent */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#605A52] dark:text-stone-400 mb-1">
            Max Monthly Rent (₹)
          </label>
          <div className="relative">
            <IndianRupee className="w-4 h-4 absolute left-3 top-2.5 text-[#605A52] dark:text-stone-400" />
            <input
              type="number"
              placeholder="e.g. 25000"
              value={filters.maxRent || ''}
              onChange={(e) => handleSelectChange('maxRent', e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#FAF7F2] dark:bg-stone-800 border border-[#E2DACD] dark:border-stone-700 rounded-lg text-xs text-[#1C1917] dark:text-stone-100 placeholder-[#605A52] dark:placeholder-stone-400 focus:outline-none focus:border-[#1B3B2B] dark:focus:border-emerald-400 transition-colors"
            />
          </div>
        </div>

        {/* Bedrooms / BHK */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#605A52] dark:text-stone-400 mb-1">
            Bedrooms (BHK)
          </label>
          <select
            value={filters.bedrooms || 'all'}
            onChange={(e) => handleSelectChange('bedrooms', e.target.value)}
            className="w-full px-3 py-2 bg-[#FAF7F2] dark:bg-stone-800 border border-[#E2DACD] dark:border-stone-700 rounded-lg text-xs text-[#1C1917] dark:text-stone-100 focus:outline-none focus:border-[#1B3B2B] dark:focus:border-emerald-400 transition-colors cursor-pointer"
          >
            <option value="all">Any BHK</option>
            <option value="1">1 BHK</option>
            <option value="2">2 BHK</option>
            <option value="3">3 BHK</option>
            <option value="4">4+ BHK</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilter;
