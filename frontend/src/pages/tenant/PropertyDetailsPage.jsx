import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPropertyDetails, toggleFavorite } from '../../redux/slices/propertySlice';
import { submitApplication } from '../../redux/slices/applicationSlice';
import ApplicationModal from '../../components/tenant/ApplicationModal';
import Loader from '../../components/common/Loader';
import Badge from '../../components/common/Badge';
import { resolvePropertyImage } from '../../utils/imageHelper';
import PropertyMap from '../../components/property/PropertyMap';
import {
  Home,
  Bath,
  Maximize2,
  MapPin,
  Heart,
  CheckCircle,
  Phone,
  Mail,
  ShieldCheck,
  ArrowLeft,
  Send,
} from 'lucide-react';

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

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentProperty: property, favorites, loading } = useSelector((state) => state.properties);
  const { user } = useSelector((state) => state.auth);
  const { loading: appSubmitting } = useSelector((state) => state.applications);

  const [selectedImage, setSelectedImage] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applySuccessMsg, setApplySuccessMsg] = useState('');

  useEffect(() => {
    dispatch(fetchPropertyDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (property && property.images && property.images.length > 0) {
      setSelectedImage(resolvePropertyImage(property.images[0], 0));
    }
  }, [property]);

  if (loading || !property) {
    return <Loader fullScreen text="Loading property deed record..." />;
  }

  const isFavorite = favorites.some((f) => (f._id || f) === property._id);
  const typeDisplay = typeLabels[property.type] || property.type;
  const mainImage = selectedImage || resolvePropertyImage(property.images?.[0], 0);

  const handleFavoriteToggle = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(toggleFavorite(property._id));
  };

  const handleApplySubmit = async (appData) => {
    const res = await dispatch(submitApplication(appData));
    if (!res.error) {
      setShowApplyModal(false);
      setApplySuccessMsg('Application submitted successfully! Track progress under My Applications.');
    } else {
      alert(res.payload || 'Application failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button */}
      <Link
        to="/properties"
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#605A52] dark:text-stone-400 hover:text-[#1B3B2B] dark:hover:text-emerald-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Properties Registry
      </Link>

      {applySuccessMsg && (
        <div className="p-4 rounded-lg bg-[#1B3B2B]/10 dark:bg-emerald-950/40 border border-[#1B3B2B] dark:border-emerald-500 text-[#1B3B2B] dark:text-emerald-300 text-sm font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-[#1B3B2B] dark:text-emerald-400" /> {applySuccessMsg}
          </span>
          <Link to="/tenant/applications" className="underline text-xs hover:text-[#1C1917] dark:hover:text-stone-100">
            View Applications
          </Link>
        </div>
      )}

      {/* Main Grid: Gallery & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Images & Features */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Image Display */}
          <div className="relative h-96 w-full rounded-xl overflow-hidden bg-white dark:bg-stone-900 border border-[#E2DACD] dark:border-stone-800">
            <img
              src={mainImage}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge status={property.verificationStatus} text={property.verificationStatus === 'approved' ? 'VERIFIED RECORD' : 'PENDING'} />
              <Badge status={property.status} />
            </div>

            {user?.role === 'tenant' && (
              <button
                onClick={handleFavoriteToggle}
                className={`absolute top-4 right-4 p-3 rounded-lg bg-white/95 dark:bg-stone-900/95 border transition-all shadow-xs ${
                  isFavorite
                    ? 'border-[#991B1B] text-[#991B1B]'
                    : 'border-[#E2DACD] dark:border-stone-700 text-[#605A52] dark:text-stone-300 hover:text-[#991B1B]'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>

          {/* Image Thumbnails */}
          {property.images && property.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {property.images.map((img, idx) => {
                const resolvedImg = resolvePropertyImage(img, idx);
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(resolvedImg)}
                    className={`h-20 w-28 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImage === resolvedImg
                        ? 'border-[#1B3B2B] dark:border-emerald-400 scale-105 shadow-xs'
                        : 'border-[#E2DACD] dark:border-stone-700 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={resolvedImg} alt="" className="w-full h-full object-cover" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Details & Description */}
          <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-xl border border-[#E2DACD] dark:border-stone-800 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#B8860B] dark:text-amber-400">{typeDisplay}</span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1917] dark:text-stone-100 mt-1 mb-2">{property.title}</h1>
              <p className="flex items-center gap-2 text-xs sm:text-sm text-[#605A52] dark:text-stone-400">
                <MapPin className="w-4 h-4 text-[#1B3B2B] dark:text-emerald-400 shrink-0" />
                {property.address?.street}, {property.address?.city}, {property.address?.state} {property.address?.zipcode}
              </p>
            </div>

            {/* Quick Specs Cards (Indian BHK Format) */}
            <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-[#F4F0E8] dark:bg-stone-800 border border-[#E2DACD] dark:border-stone-700 text-center">
              <div>
                <span className="block text-[10px] text-[#605A52] dark:text-stone-400 uppercase font-bold tracking-wider">Configuration</span>
                <span className="text-lg font-serif font-bold text-[#1C1917] dark:text-stone-100 flex items-center justify-center gap-1.5 mt-0.5">
                  <Home className="w-4 h-4 text-[#1B3B2B] dark:text-emerald-400" /> {property.bedrooms} BHK
                </span>
              </div>
              <div>
                <span className="block text-[10px] text-[#605A52] dark:text-stone-400 uppercase font-bold tracking-wider">Bathrooms</span>
                <span className="text-lg font-serif font-bold text-[#1C1917] dark:text-stone-100 flex items-center justify-center gap-1.5 mt-0.5">
                  <Bath className="w-4 h-4 text-[#1B3B2B] dark:text-emerald-400" /> {property.bathrooms} Bath
                </span>
              </div>
              <div>
                <span className="block text-[10px] text-[#605A52] dark:text-stone-400 uppercase font-bold tracking-wider">Built-up Area</span>
                <span className="text-lg font-serif font-bold text-[#1C1917] dark:text-stone-100 flex items-center justify-center gap-1.5 mt-0.5">
                  <Maximize2 className="w-4 h-4 text-[#1B3B2B] dark:text-emerald-400" /> {property.areaSqFt} sqft
                </span>
              </div>
            </div>

            {/* Description Text */}
            <div>
              <h3 className="text-base font-serif font-bold text-[#1C1917] dark:text-stone-100 mb-2">Property Description & Locality Notes</h3>
              <p className="text-xs sm:text-sm text-[#1C1917] dark:text-stone-300 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Interactive Leaflet Map */}
            <PropertyMap address={property.address} title={property.title} />

            {/* Amenities Grid */}
            {property.amenities && property.amenities.length > 0 && (
              <div>
                <h3 className="text-base font-serif font-bold text-[#1C1917] dark:text-stone-100 mb-3">Amenities & Society Features</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {property.amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-[#FAF7F2] dark:bg-stone-800 border border-[#E2DACD] dark:border-stone-700 text-xs text-[#1C1917] dark:text-stone-200 flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4 text-[#1B3B2B] dark:text-emerald-400 shrink-0" />
                      <span className="font-medium">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Price Card & Owner Contact */}
        <div className="space-y-6">
          {/* Booking / Application Card */}
          <div className="bg-white dark:bg-stone-900 p-6 rounded-xl border border-[#E2DACD] dark:border-stone-800 space-y-5 sticky top-24 shadow-xs">
            <div className="pb-4 border-b border-[#E2DACD] dark:border-stone-800">
              <span className="text-xs text-[#605A52] dark:text-stone-400 uppercase font-bold tracking-wider block mb-1">Monthly Rent</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-serif font-extrabold text-[#1B3B2B] dark:text-emerald-400">
                  ₹{property.rentAmount?.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-[#605A52] dark:text-stone-400 font-medium">/ month</span>
              </div>
              
              <div className="mt-3 p-2.5 rounded-lg bg-[#F4F0E8] dark:bg-stone-800 border border-[#E2DACD] dark:border-stone-700 text-xs text-[#605A52] dark:text-stone-300 flex items-center justify-between">
                <span>Security Deposit</span>
                <strong className="font-serif text-sm font-bold text-[#1C1917] dark:text-stone-100">
                  ₹{property.depositAmount?.toLocaleString('en-IN')}
                </strong>
              </div>
            </div>

            {/* Property Status Notice */}
            {property.status === 'available' ? (
              <div className="p-3 rounded-lg bg-[#1B3B2B]/10 dark:bg-emerald-950/40 border border-[#1B3B2B]/30 dark:border-emerald-500/40 text-[#1B3B2B] dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#1B3B2B] dark:text-emerald-400" /> Available for Immediate Possession
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-[#B8860B] dark:border-amber-500/40 text-[#B8860B] dark:text-amber-300 text-xs font-bold">
                Status: {property.status.toUpperCase()}
              </div>
            )}

            {/* Apply Button */}
            {user?.role === 'tenant' && (
              <button
                onClick={() => setShowApplyModal(true)}
                disabled={property.status !== 'available'}
                className="w-full py-3 rounded-lg bg-[#1B3B2B] hover:bg-[#152e22] text-white font-bold text-xs transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Apply for Property Lease
              </button>
            )}

            {!user && (
              <Link
                to="/login"
                className="w-full py-3 rounded-lg bg-[#1B3B2B] hover:bg-[#152e22] text-white font-bold text-xs text-center block shadow-xs"
              >
                Sign In to Submit Application
              </Link>
            )}

            {user?.role === 'owner' && user._id === property.owner?._id && (
              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-700 text-amber-900 dark:text-amber-300 text-xs font-semibold text-center">
                You are registered as the Landlord of this property.
              </div>
            )}

            {/* Landlord Contact Info */}
            {property.owner && (
              <div className="pt-4 border-t border-[#E2DACD] dark:border-stone-800">
                <h4 className="text-[10px] font-bold text-[#605A52] dark:text-stone-400 uppercase tracking-widest mb-3">
                  Registered Landlord & Host
                </h4>
                <div className="flex items-center gap-3">
                  <img
                    src={property.owner.avatar || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80'}
                    alt={property.owner.name}
                    className="w-10 h-10 rounded-md object-cover border border-[#E2DACD] dark:border-stone-700"
                  />
                  <div>
                    <span className="block text-sm font-bold text-[#1C1917] dark:text-stone-100">{property.owner.name}</span>
                    <span className="block text-xs text-[#605A52] dark:text-stone-400">Verified Owner</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs text-[#1C1917] dark:text-stone-300">
                  {property.owner.phone && (
                    <div className="flex items-center gap-2 text-[#605A52] dark:text-stone-400">
                      <Phone className="w-3.5 h-3.5 text-[#1B3B2B] dark:text-emerald-400" /> {property.owner.phone}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-[#605A52] dark:text-stone-400">
                    <Mail className="w-3.5 h-3.5 text-[#1B3B2B] dark:text-emerald-400" /> {property.owner.email}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <ApplicationModal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        onSubmit={handleApplySubmit}
        property={property}
        isSubmitting={appSubmitting}
      />
    </div>
  );
};

export default PropertyDetailsPage;
