import React, { useState } from 'react';
import { Search, MapPin, Sparkles, ShieldCheck, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';
import coupleHero from '../../assets/couple_hero.png';
import { Link } from 'react-router-dom';

const popularLocalities = [
  { label: 'Indirapuram', city: 'Ghaziabad' },
  { label: 'Siddharth Vihar', city: 'Ghaziabad' },
  { label: 'Wave City', city: 'Ghaziabad' },
  { label: 'Mahurali', city: 'Ghaziabad' },
  { label: 'Vasundhara', city: 'Ghaziabad' },
  { label: 'Raj Nagar Extension', city: 'Ghaziabad' },
  { label: 'Golf Course Road', city: 'Gurgaon' },
  { label: 'Sector 62 Noida', city: 'Noida' },
];

const categoryTabs = [
  { id: 'all', label: 'BUY' },
  { id: 'flat_apartment', label: 'RENT' },
  { id: 'independent_house', label: 'COMMERCIAL' },
  { id: 'pg_shared', label: 'PG / CO-LIVING' },
  { id: 'villa', label: 'PLOTS' },
];

const HousingHero = ({ filters, onFilterChange, verifiedCount = 6 }) => {
  const [selectedTab, setSelectedTab] = useState(filters.type || 'flat_apartment');
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedCity, setSelectedCity] = useState(filters.city || 'Ghaziabad');

  const handleTabClick = (tabId) => {
    setSelectedTab(tabId);
    onFilterChange({ type: tabId === 'all' ? '' : tabId });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onFilterChange({ search: searchTerm, city: selectedCity, type: selectedTab === 'all' ? '' : selectedTab });
  };

  const handleLocalityClick = (locality) => {
    setSearchTerm(locality.label);
    onFilterChange({ search: locality.label });
  };

  return (
    <div className="w-full bg-gradient-to-r from-[#D78B81] via-[#E8A59C] to-[#FAF7F2] dark:from-[#3A1E1B] dark:via-[#291715] dark:to-[#121210] py-6 sm:py-8 lg:py-9 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b border-[#E2DACD] dark:border-stone-800 transition-all">
      {/* Floor Lamp & Moving Boxes Line-Art Background (Left Side) */}
      <svg
        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-[280px] sm:w-[360px] h-[340px] text-white/30 dark:text-stone-600/20 pointer-events-none stroke-current"
        fill="none"
        strokeWidth="1.5"
        viewBox="0 0 400 400"
      >
        <path d="M 70 380 L 70 120" />
        <path d="M 40 380 L 100 380" />
        <path d="M 35 120 L 105 120 L 95 60 L 45 60 Z" fill="currentColor" fillOpacity="0.1" />
        <rect x="20" y="280" width="100" height="70" rx="4" />
        <line x1="20" y1="315" x2="120" y2="315" strokeDasharray="3 3" />
        <rect x="35" y="220" width="70" height="60" rx="4" />
        <line x1="35" y1="250" x2="105" y2="250" strokeDasharray="3 3" />
        <rect x="45" y="170" width="50" height="50" rx="4" />
      </svg>

      {/* Bookshelf Line-Art (Right Background) */}
      <svg
        className="absolute right-72 top-1/2 -translate-y-1/2 hidden xl:block w-[200px] h-[260px] text-white/25 dark:text-stone-600/20 pointer-events-none stroke-current"
        fill="none"
        strokeWidth="1.5"
        viewBox="0 0 200 300"
      >
        <path d="M 20 280 L 180 280 M 20 200 L 180 200 M 20 120 L 180 120" />
        <rect x="30" y="210" width="15" height="70" />
        <rect x="50" y="220" width="15" height="60" />
        <rect x="70" y="205" width="18" height="75" />
        <circle cx="140" cy="160" r="18" />
        <path d="M 140 142 L 140 100 M 130 115 L 140 100 L 150 115" />
      </svg>

      {/* Background Soft Glow Spheres */}
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/25 dark:bg-emerald-500/10 blur-3xl pointer-events-none" />

      {/* Inner Centered 7xl Container */}
      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        {/* Left Column: Headline & Floating Search Container */}
        <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
          {/* Eyebrow Badge & Primary Brand Tagline */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/85 dark:bg-stone-900/85 border border-[#E2DACD] dark:border-stone-700 text-[#8C3A1D] dark:text-amber-300 text-[10px] sm:text-[11px] font-extrabold shadow-2xs">
              <Sparkles className="w-3 h-3 text-[#B8860B]" />
              <span>OFFICIAL VERIFIED PROPERTY REGISTRY</span>
            </div>

            {/* Catchy Large Primary Hero Brand Tagline Pill */}
            <div className="pt-0.5">
              <span className="inline-block px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#4A322B] via-[#612417] to-[#752613] text-[#FAF7F2] font-serif font-extrabold text-sm sm:text-base lg:text-lg tracking-wide uppercase shadow-md border border-amber-400/50">
                <span className="text-amber-300">#Search</span> Se Shift Tak, <span className="text-amber-200 underline decoration-amber-400 decoration-2">Sab Ek Jagah</span>
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-extrabold text-white dark:text-[#FAF7F2] tracking-tight leading-tight pt-0.5 drop-shadow-xs">
              Properties for rent in {selectedCity || 'Ghaziabad'}
            </h1>

            <p className="text-xs sm:text-xs text-white/95 dark:text-stone-300 font-semibold drop-shadow-2xs">
              <strong className="text-amber-200 dark:text-amber-400 font-extrabold">{verifiedCount > 0 ? verifiedCount : '7K'}+ listings added daily</strong> and <strong className="text-white font-extrabold">73K+ total verified</strong>
            </p>
          </div>

          {/* Elevated Search Container */}
          <div className="rounded-xl overflow-hidden shadow-xl border border-[#E2DACD] dark:border-stone-800 space-y-0">
            {/* Top Dark Tab Bar Header: BUY | RENT | COMMERCIAL | PG/CO-LIVING */}
            <div className="bg-[#4A322B] dark:bg-stone-900 text-white px-5 py-2 flex items-center gap-5 overflow-x-auto text-[11px] font-extrabold tracking-wider uppercase border-b border-stone-700">
              {categoryTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabClick(tab.id)}
                  className={`pb-0.5 transition-all whitespace-nowrap border-b-2 ${
                    selectedTab === tab.id
                      ? 'border-white text-white font-extrabold opacity-100'
                      : 'border-transparent text-white/70 hover:text-white opacity-80'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Main White Search Body */}
            <div className="bg-white dark:bg-stone-900 p-4 sm:p-5 space-y-3">
              <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch gap-2.5">
                <div className="flex-1 relative flex items-center">
                  <Search className="w-3.5 h-3.5 absolute left-3.5 text-[#605A52] dark:text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search for locality, landmark, project, or builder (e.g. Indirapuram, Vaishali)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-[#FAF7F2] dark:bg-stone-800 border border-[#E2DACD] dark:border-stone-700 rounded-lg text-xs text-[#1C1917] dark:text-stone-100 focus:outline-none focus:border-[#1B3B2B]"
                  />
                </div>

                <div className="w-full sm:w-40 relative flex items-center">
                  <MapPin className="w-3.5 h-3.5 absolute left-3.5 text-[#605A52] dark:text-stone-400" />
                  <select
                    value={selectedCity}
                    onChange={(e) => {
                      setSelectedCity(e.target.value);
                      onFilterChange({ city: e.target.value });
                    }}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-[#FAF7F2] dark:bg-stone-800 border border-[#E2DACD] dark:border-stone-700 rounded-lg text-xs text-[#1C1917] dark:text-stone-100 focus:outline-none focus:border-[#1B3B2B]"
                  >
                    <option value="Ghaziabad">Ghaziabad</option>
                    <option value="Gurgaon">Gurgaon</option>
                    <option value="Noida">Noida</option>
                    <option value="Delhi">Delhi</option>
                  </select>
                </div>

                {/* Primary Action Button */}
                <button
                  type="submit"
                  className="px-7 py-2.5 rounded-lg bg-[#1B3B2B] hover:bg-[#152e22] text-white font-extrabold text-xs shadow-md transition-all shrink-0 flex items-center justify-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" /> Search
                </button>
              </form>

              {/* Popular Localities Chips Row */}
              <div className="pt-0.5 flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-[10px] font-bold text-[#605A52] dark:text-stone-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#B8860B]" /> Popular:
                </span>
                {popularLocalities.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleLocalityClick(item)}
                    className="px-2 py-0.5 rounded-md bg-[#FAF7F2] dark:bg-stone-800 hover:bg-[#F4F0E8] text-[#1C1917] dark:text-stone-200 border border-[#E2DACD] dark:border-stone-700 text-[10px] font-semibold transition-colors flex items-center gap-0.5"
                  >
                    {item.label} <ChevronRight className="w-2.5 h-2.5 text-[#605A52]" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Floating Dark Landlord Banner Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4A322B]/90 dark:bg-stone-900/90 text-white text-[11px] font-bold shadow-md border border-white/20 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Are you a Property Owner?</span>
            <Link to="/owner/dashboard" className="text-amber-300 underline hover:text-white font-extrabold flex items-center gap-1">
              Sell / Rent for FREE <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Right Column: Slanted Photo Frame */}
        <div className="lg:col-span-4 relative flex justify-center">
          <div className="relative w-full max-w-xs sm:max-w-sm rounded-2xl overflow-hidden bg-white dark:bg-stone-900 border-4 border-white dark:border-stone-800 p-3 shadow-xl transform lg:rotate-2 hover:rotate-0 transition-transform duration-500 space-y-2">
            <div className="relative h-48 sm:h-56 rounded-xl overflow-hidden border border-[#E2DACD] dark:border-stone-800">
              <img
                src={coupleHero}
                alt="Happy Indian Couple Moving Home"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-[#B8860B] text-white text-[9px] font-extrabold uppercase tracking-widest flex items-center gap-1 shadow-xs">
                <ShieldCheck className="w-3 h-3 text-white" /> 100% Verified Deed
              </div>
            </div>

            <div className="space-y-1 text-xs text-center sm:text-left">
              <h4 className="font-serif font-bold text-[#1C1917] dark:text-stone-100 text-xs sm:text-sm">
                Direct Landlord & Lease Deed Ledger
              </h4>
              <p className="text-[10px] text-[#605A52] dark:text-stone-400 font-medium leading-tight">
                Verified ownership records with zero brokerage fees and digital agreements.
              </p>

              <div className="pt-1.5 border-t border-[#E2DACD] dark:border-stone-800 flex items-center justify-between text-[10px] text-[#1B3B2B] dark:text-emerald-400 font-bold">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#1B3B2B] dark:text-emerald-400" /> Direct Contact
                </span>
                <span className="text-[#8C3A1D] dark:text-amber-400">Zero Commission</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HousingHero;
