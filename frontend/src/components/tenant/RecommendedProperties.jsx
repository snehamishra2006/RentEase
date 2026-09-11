import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAIRecommendations } from '../../redux/slices/aiSlice';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, Bed, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import Loader from '../common/Loader';
import { resolvePropertyImage } from '../../utils/imageHelper';

const RecommendedProperties = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { recommendations, recommendationsLoading } = useSelector((state) => state.ai);

  useEffect(() => {
    if (user && user.role === 'tenant') {
      dispatch(fetchAIRecommendations());
    }
  }, [dispatch, user]);

  if (!user || user.role !== 'tenant' || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 pt-2">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#E2DACD] dark:border-stone-800">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-[#1B3B2B] dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Smart AI Recommendations
            </span>
            <span className="text-xs text-stone-500 dark:text-stone-400 font-medium hidden sm:inline">
              Personalized for {user.name}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1C1917] dark:text-stone-100">
            Recommended for You
          </h2>
        </div>
        <span className="text-xs text-stone-500 dark:text-stone-400 font-semibold">
          {recommendations.length} Matches Found
        </span>
      </div>

      {recommendationsLoading ? (
        <Loader text="Generating personalized property matches..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map(({ property, matchScore, explanation, matches }, idx) => {
            if (!property) return null;
            const propertyImage = resolvePropertyImage(property.images && property.images[0], idx);

            return (
              <div
                key={property._id}
                className="group relative bg-white dark:bg-stone-900 rounded-2xl border border-[#E2DACD] dark:border-stone-800 overflow-hidden shadow-xs hover:shadow-lg hover:border-[#1B3B2B]/40 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Match Score Badge Overlay */}
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1B3B2B]/90 text-amber-300 backdrop-blur-md text-[11px] font-bold shadow-md border border-emerald-500/30">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>{matchScore}% Match</span>
                </div>

                <div>
                  {/* Property Image */}
                  <div className="relative h-52 w-full overflow-hidden bg-[#F4F0E8] dark:bg-stone-800 border-b border-[#E2DACD] dark:border-stone-800">
                    <img
                      src={propertyImage}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
                      <span className="bg-black/40 backdrop-blur-md px-2 py-0.5 rounded text-[10px]">
                        {property.bedrooms} BHK • {property.type?.replace('_', ' ')}
                      </span>
                      {property.verificationStatus === 'approved' && (
                        <span className="bg-emerald-600/90 backdrop-blur-md px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Property Info */}
                  <div className="p-5 space-y-2.5">
                    <h3 className="text-base font-serif font-bold text-[#1C1917] dark:text-stone-100 group-hover:text-[#1B3B2B] dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {property.title}
                    </h3>

                    <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      {property.address?.street}, {property.address?.city}
                    </p>

                    {/* AI Score Explanation Callout */}
                    <div className="p-2.5 rounded-xl bg-[#FAF7F2] dark:bg-stone-800/80 border border-[#E2DACD] dark:border-stone-700 text-[11px] text-[#605A52] dark:text-stone-300 space-y-1">
                      <p className="font-semibold text-[#1B3B2B] dark:text-emerald-400 flex items-center gap-1">
                        💡 AI Match Insight:
                      </p>
                      <p className="italic text-[10.5px] leading-tight">{explanation}</p>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-5 pt-0 flex items-center justify-between border-t border-[#E2DACD]/50 dark:border-stone-800/50 mt-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                      Monthly Rent
                    </span>
                    <span className="text-lg font-serif font-extrabold text-[#1B3B2B] dark:text-emerald-400">
                      ₹{property.rentAmount?.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <Link
                    to={`/properties/${property._id}`}
                    className="px-4 py-2 rounded-xl bg-[#1B3B2B] hover:bg-[#152e22] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5"
                  >
                    View Details <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecommendedProperties;
