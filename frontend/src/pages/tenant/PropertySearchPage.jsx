import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProperties, setFilters, resetFilters, fetchFavorites } from '../../redux/slices/propertySlice';
import HousingHero from '../../components/property/HousingHero';
import PropertyCard from '../../components/property/PropertyCard';
import VerifiedLandlords from '../../components/property/VerifiedLandlords';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import RecommendedProperties from '../../components/tenant/RecommendedProperties';
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, MapPin, Users, FileCheck, ArrowRight, BookOpen, PlusCircle } from 'lucide-react';

const newsArticles = [
  {
    title: 'Delhi-Meerut RRTS Metro Corridor: Impact on Ghaziabad Rents',
    date: 'Aug 2026',
    tag: 'Locality Trends',
    desc: 'The newly operational 82km RRTS stretch boosts rental demand in Rajendra Nagar, Indirapuram, and Vaishali by 18%.',
    img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Circle Rate Revisions & Security Deposit Rules in Noida & Gurgaon',
    date: 'Jul 2026',
    tag: 'Property Law',
    desc: 'Stamp duty officials mandate strict 2-month deposit limits and standardized digital lease deeds across NCR.',
    img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Top 5 Affordable Localities for 2 BHK Rentals in NCR',
    date: 'Aug 2026',
    tag: 'Tenant Guide',
    desc: 'Comprehensive market analysis comparing rental yields, metro proximity, and gated society amenities in 2026.',
    img: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=600&q=80',
  },
];

const PropertySearchPage = () => {
  const dispatch = useDispatch();
  const { list: properties, favorites, loading, filters } = useSelector((state) => state.properties);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProperties(filters));
    if (user?.role === 'tenant') {
      dispatch(fetchFavorites());
    }
  }, [dispatch, filters, user]);

  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters));
  };

  const handleReset = () => {
    dispatch(resetFilters());
  };

  const favoriteIds = favorites.map((f) => f._id || f);
  const verifiedCount = properties.filter((p) => p.verificationStatus === 'approved').length;

  return (
    <div className="w-full space-y-10 pb-12">
      {/* 100% Full-Width Edge-to-Edge Housing.com Hero Section */}
      <HousingHero
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        verifiedCount={verifiedCount}
      />

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Live Stats Banner with Deliberately Varied Color Palette */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Stat 1: Terracotta / Coral Accent */}
          <div className="p-5 rounded-2xl bg-[#FDF0EB] dark:bg-[#2D1B16] border border-[#F4D3C7] dark:border-[#4A2920] space-y-1.5 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C3A1D] dark:text-amber-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#C85A32]" /> Verified Listings
            </span>
            <span className="text-2xl sm:text-3xl font-serif font-extrabold text-[#C85A32] dark:text-[#E07A5F] block">
              {verifiedCount > 0 ? verifiedCount : '6'} Records
            </span>
          </div>

          {/* Stat 2: Forest Green Accent */}
          <div className="p-5 rounded-2xl bg-[#EBF3EE] dark:bg-[#15271D] border border-[#C8E0D2] dark:border-[#224430] space-y-1.5 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1B3B2B] dark:text-emerald-300 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#1B3B2B] dark:text-emerald-400" /> Verified Hosts
            </span>
            <span className="text-2xl sm:text-3xl font-serif font-extrabold text-[#1B3B2B] dark:text-emerald-400 block">
              2+ Owners
            </span>
          </div>

          {/* Stat 3: Muted Gold / Ochre Accent */}
          <div className="p-5 rounded-2xl bg-[#FDF8EA] dark:bg-[#2A2312] border border-[#F6E8C2] dark:border-[#46381B] space-y-1.5 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#B8860B] dark:text-amber-300 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#B8860B]" /> Cities Covered
            </span>
            <span className="text-2xl sm:text-3xl font-serif font-extrabold text-[#B8860B] dark:text-amber-400 block">
              4 NCR Hubs
            </span>
          </div>

          {/* Stat 4: Deep Dusty Rose / Wine Accent */}
          <div className="p-5 rounded-2xl bg-[#FDF0F0] dark:bg-[#2C1818] border border-[#F5D3D3] dark:border-[#492222] space-y-1.5 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#991B1B] dark:text-rose-300 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-[#991B1B]" /> Active Deeds
            </span>
            <span className="text-2xl sm:text-3xl font-serif font-extrabold text-[#991B1B] dark:text-rose-400 block">
              1+ Recorded
            </span>
          </div>
        </div>

        {/* Smart AI Recommendations Section for Logged-In Tenants */}
        <RecommendedProperties />

        {/* Property Results Grid */}
        {loading ? (
          <Loader text="Retrieving verified property records..." />
        ) : properties.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No properties match your filters"
            description="There are no listings matching your specified criteria. Try clearing search keywords or resetting filters."
            actionText="Reset All Filters"
            onAction={handleReset}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E2DACD] dark:border-stone-800">
              <p className="text-xs text-[#605A52] dark:text-stone-400 font-semibold uppercase tracking-wider">
                Showing <span className="text-[#1C1917] dark:text-stone-100 font-bold">{properties.length}</span> verified property records
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  isFavorite={favoriteIds.includes(property._id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Housing.com Style Recommended Sellers / Verified Landlords Directory */}
        <VerifiedLandlords />

        {/* Housing.com Style "Have a Property to Rent or Sell?" Callout Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#F5D5C6] via-[#FAF7F2] to-[#EBF3EE] dark:from-[#2B1D19] dark:via-[#1F1816] dark:to-[#15271D] border border-[#E2DACD] dark:border-stone-800 p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#B8860B] dark:text-amber-400">
              Property Landlord Services
            </span>
            <h3 className="text-2xl font-serif font-extrabold text-[#1C1917] dark:text-stone-100">
              Have a property to sell or rent?
            </h3>
            <p className="text-xs text-[#605A52] dark:text-stone-300 max-w-xl font-medium">
              List your property & connect with clients faster! Post property for FREE with zero brokerage fees.
            </p>
          </div>

          <Link
            to={user?.role === 'owner' ? '/owner/dashboard' : '/login'}
            className="px-6 py-3 rounded-xl bg-[#1B3B2B] hover:bg-[#152e22] text-white font-extrabold text-xs shadow-md transition-all shrink-0 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" /> Sell / Rent for FREE <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Housing.com Style News & Articles Locality Insights Section */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2DACD] dark:border-stone-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#B8860B] dark:text-amber-400 block mb-1">
                News and Articles
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1C1917] dark:text-stone-100 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#1B3B2B] dark:text-emerald-400" /> Read what's happening in Real Estate
              </h2>
            </div>
            <span className="text-xs text-[#605A52] dark:text-stone-400 font-semibold">Updated August 2026</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsArticles.map((article, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-stone-900 rounded-xl border border-[#E2DACD] dark:border-stone-800 overflow-hidden shadow-xs hover:border-[#1B3B2B]/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="h-44 w-full overflow-hidden bg-stone-100">
                    <img src={article.img} alt={article.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="px-2 py-0.5 rounded-md bg-[#FAF7F2] dark:bg-stone-800 border border-[#E2DACD] dark:border-stone-700 text-[#B8860B] dark:text-amber-400">
                        {article.tag}
                      </span>
                      <span className="text-[#605A52] dark:text-stone-400">{article.date}</span>
                    </div>
                    <h3 className="text-sm font-serif font-bold text-[#1C1917] dark:text-stone-100 leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-xs text-[#605A52] dark:text-stone-400 line-clamp-2 leading-relaxed">
                      {article.desc}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <span className="text-xs font-bold text-[#1B3B2B] dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer">
                    Read Full Article <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertySearchPage;
