import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Home, Bath, Maximize2, MapPin } from 'lucide-react';
import Badge from '../common/Badge';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavorite } from '../../redux/slices/propertySlice';
import { resolvePropertyImage } from '../../utils/imageHelper';

const typeLabels = {
  flat_apartment: 'Flat / Apartment',
  independent_house: 'Independent House',
  builder_floor: 'Builder Floor',
  villa: 'Villa',
  pg_shared: 'PG / Shared',
  apartment: 'Flat / Apartment',
  house: 'Independent House',
  studio: 'PG / Shared Studio',
  condo: 'Condo',
};

const PropertyCard = ({ property, onFavoriteToggle, isFavorite = false, showOwnerActions = false, onEdit, onDelete }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(property._id);
    } else {
      dispatch(toggleFavorite(property._id));
    }
  };

  const rawImage = property.images && property.images.length > 0 ? property.images[0] : null;
  const image = resolvePropertyImage(rawImage);
  const typeDisplay = typeLabels[property.type] || property.type;

  return (
    <div className="ledger-card ledger-card-hover rounded-xl border-t-4 border-t-[#1B3B2B] dark:border-t-emerald-500 overflow-hidden flex flex-col dark:bg-stone-900 dark:border-stone-800 shadow-md">
      {/* Image Container */}
      <div className="relative h-52 w-full overflow-hidden bg-[#F4F0E8] dark:bg-stone-800 border-b border-[#E2DACD] dark:border-stone-800">
        <img
          src={image}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges (Official Stamps) */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5">
            <Badge status={property.verificationStatus} text={property.verificationStatus === 'approved' ? 'VERIFIED' : 'PENDING'} />
            <Badge status={property.status} />
          </div>

          {user?.role === 'tenant' && (
            <button
              onClick={handleFavoriteClick}
              className={`pointer-events-auto p-2 rounded-md bg-white/90 dark:bg-stone-900/90 border transition-all shadow-xs ${
                isFavorite
                  ? 'border-[#991B1B] text-[#991B1B]'
                  : 'border-[#E2DACD] dark:border-stone-700 text-[#605A52] dark:text-stone-300 hover:text-[#991B1B]'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>

        {/* Price & Deposit Tag */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
          <div className="px-3 py-1 bg-white/95 dark:bg-stone-900/95 border border-[#E2DACD] dark:border-stone-700 rounded-md shadow-xs flex items-baseline gap-1">
            <span className="text-lg font-serif font-bold text-[#1B3B2B] dark:text-emerald-400">₹{property.rentAmount?.toLocaleString('en-IN')}</span>
            <span className="text-[10px] text-[#605A52] dark:text-stone-400 font-medium">/mo</span>
          </div>

          {property.depositAmount && (
            <div className="px-2.5 py-0.5 bg-[#FAF7F2]/90 dark:bg-stone-800/90 border border-[#E2DACD] dark:border-stone-700 rounded-md text-[10px] text-[#605A52] dark:text-stone-300 font-medium">
              Dep: <strong className="text-[#1C1917] dark:text-stone-100">₹{property.depositAmount?.toLocaleString('en-IN')}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#B8860B] dark:text-amber-400 mb-1">
            {typeDisplay}
          </div>
          <Link to={`/properties/${property._id}`} className="block group">
            <h3 className="text-lg font-serif font-bold text-[#1C1917] dark:text-stone-100 hover:text-[#1B3B2B] dark:hover:text-emerald-400 transition-colors line-clamp-1 mb-1">
              {property.title}
            </h3>
          </Link>

          <p className="flex items-center gap-1.5 text-xs text-[#605A52] dark:text-stone-400 mb-4 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-[#1B3B2B] dark:text-emerald-400 shrink-0" />
            {property.address?.street}, {property.address?.city}, {property.address?.state}
          </p>

          {/* Key Specs (Indian BHK Convention) */}
          <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-lg bg-[#F4F0E8] dark:bg-stone-800 border border-[#E2DACD] dark:border-stone-700 mb-4 text-xs text-[#1C1917] dark:text-stone-200">
            <div className="flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-[#1B3B2B] dark:text-emerald-400" />
              <span className="font-semibold">{property.bedrooms} BHK</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="w-3.5 h-3.5 text-[#1B3B2B] dark:text-emerald-400" />
              <span className="font-semibold">{property.bathrooms} Bath</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-[#1B3B2B] dark:text-emerald-400" />
              <span className="font-semibold">{property.areaSqFt} sqft</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {showOwnerActions ? (
          <div className="flex items-center gap-2 pt-2 border-t border-[#E2DACD] dark:border-stone-800">
            <button
              onClick={() => onEdit(property)}
              className="flex-1 py-2 rounded-lg bg-[#F4F0E8] dark:bg-stone-800 hover:bg-[#EAE4D8] text-[#1C1917] dark:text-stone-200 text-xs font-semibold transition-colors border border-[#E2DACD] dark:border-stone-700"
            >
              Edit Listing
            </button>
            <button
              onClick={() => onDelete(property._id)}
              className="py-2 px-3 rounded-lg bg-rose-50 dark:bg-rose-950 hover:bg-rose-100 text-[#991B1B] dark:text-rose-300 text-xs font-semibold transition-colors border border-rose-200 dark:border-rose-800"
            >
              Delete
            </button>
          </div>
        ) : (
          <Link
            to={`/properties/${property._id}`}
            className="w-full text-center py-2.5 rounded-lg bg-[#1B3B2B] hover:bg-[#152e22] text-white font-semibold text-xs transition-colors shadow-xs block"
          >
            View Record & Apply
          </Link>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;
