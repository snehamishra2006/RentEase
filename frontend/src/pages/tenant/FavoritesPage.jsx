import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavorites, toggleFavorite } from '../../redux/slices/propertySlice';
import PropertyCard from '../../components/property/PropertyCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { Heart } from 'lucide-react';

const FavoritesPage = () => {
  const dispatch = useDispatch();
  const { favorites, loading } = useSelector((state) => state.properties);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  const handleFavoriteToggle = (id) => {
    dispatch(toggleFavorite(id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-[#E2DACD]">
        <div className="w-10 h-10 rounded-lg bg-[#991B1B]/10 text-[#991B1B] border border-[#991B1B]/20 flex items-center justify-center">
          <Heart className="w-5 h-5 fill-current" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#1C1917]">Saved Property Favorites</h1>
          <p className="text-xs text-[#605A52]">Keep track of saved listings for easy deed reference</p>
        </div>
      </div>

      {loading ? (
        <Loader text="Loading favorite property records..." />
      ) : favorites.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No favorites saved yet"
          description="Browse available property listings and tap the heart icon to save records here."
          actionText="Browse Property Registry"
          onAction={() => (window.location.href = '/properties')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((property) => (
            <PropertyCard
              key={property._id}
              property={property}
              isFavorite={true}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
