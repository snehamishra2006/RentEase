import React, { useState, useEffect } from 'react';
import { Phone, ChevronRight, UserCheck } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

const VerifiedLandlords = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeContactIdx, setActiveContactIdx] = useState(null);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const res = await axiosClient.get('/properties/owners/verified');
        if (res.data?.owners && res.data.owners.length > 0) {
          setSellers(res.data.owners);
        }
      } catch (err) {
        console.error('Error fetching verified owners:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOwners();
  }, []);

  const handleShowContact = (idx) => {
    setActiveContactIdx(activeContactIdx === idx ? null : idx);
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-xs text-[#605A52] font-medium">
        Loading verified host directory from database...
      </div>
    );
  }

  if (sellers.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6 pt-4">
      {/* Section Header matching Housing.com */}
      <div className="space-y-1 pb-2 border-b border-[#E2DACD] dark:border-stone-800">
        <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-[#1C1917] dark:text-stone-100 flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-[#1B3B2B] dark:text-emerald-400" />
          Recommended sellers
        </h2>
        <p className="text-xs text-[#605A52] dark:text-stone-400 font-medium">
          Sellers with complete knowledge about locality
        </p>
      </div>

      {/* Grid of Recommended Sellers Cards dynamically rendered from MongoDB Atlas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {sellers.map((seller, idx) => (
          <div
            key={seller._id || idx}
            className="rounded-xl border border-[#E2DACD] dark:border-stone-800 bg-[#FAF7F2] dark:bg-stone-900 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            {/* Top Seller Info Container */}
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                {seller.avatar ? (
                  <img
                    src={seller.avatar}
                    alt={seller.name}
                    className="w-10 h-10 rounded-md object-cover border border-[#E2DACD] shrink-0"
                  />
                ) : (
                  <div
                    className={`w-10 h-10 rounded-md ${seller.bg || 'bg-[#1B3B2B]'} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs`}
                  >
                    {seller.initials || 'OW'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-serif font-bold text-[#1C1917] dark:text-stone-100 truncate flex items-center gap-1 cursor-pointer hover:underline">
                    {seller.name} <ChevronRight className="w-3.5 h-3.5 text-[#605A52]" />
                  </h3>
                </div>
              </div>

              {/* Experience & Listings Counts */}
              <div className="flex items-center justify-between text-[11px] text-[#605A52] dark:text-stone-400 font-semibold border-t border-b border-[#E2DACD]/60 dark:border-stone-800 py-2">
                <span>
                  <strong className="text-[#1C1917] dark:text-stone-200">{seller.experience}</strong>
                </span>
                <span>
                  <strong className="text-[#1C1917] dark:text-stone-200">{seller.totalListings}</strong>
                </span>
              </div>

              {/* Locality Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {seller.localities.map((loc, lIdx) => (
                  <span
                    key={lIdx}
                    className="px-2 py-0.5 rounded-md bg-white dark:bg-stone-800 border border-[#E2DACD] dark:border-stone-700 text-[10px] font-semibold text-[#605A52] dark:text-stone-300"
                  >
                    {loc}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Show Contact Button */}
            <div className="p-4 pt-0">
              <button
                type="button"
                onClick={() => handleShowContact(idx)}
                className="w-full py-2.5 rounded-lg border border-[#1B3B2B] dark:border-emerald-500 text-[#1B3B2B] dark:text-emerald-400 font-bold text-xs hover:bg-[#1B3B2B] hover:text-white transition-all flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Phone className="w-3.5 h-3.5" />
                {activeContactIdx === idx ? seller.phone : 'Show Contact'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerifiedLandlords;
