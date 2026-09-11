import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPendingVerifications, verifyProperty } from '../../redux/slices/propertySlice';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Badge from '../../components/common/Badge';
import { ShieldCheck, CheckCircle2, XCircle, MapPin, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const PropertyVerificationPage = () => {
  const dispatch = useDispatch();
  const { pendingProperties: properties, loading } = useSelector((state) => state.properties);

  const [notice, setNotice] = useState('');

  useEffect(() => {
    dispatch(fetchPendingVerifications());
  }, [dispatch]);

  const handleVerify = async (id, status) => {
    const res = await dispatch(verifyProperty({ id, verificationStatus: status }));
    if (!res.error) {
      setNotice(
        status === 'approved'
          ? 'Property listing verified and published to public registry!'
          : 'Property listing rejected.'
      );
      dispatch(fetchPendingVerifications());
    } else {
      alert(res.payload || 'Action failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-[#E2DACD]">
        <div className="w-10 h-10 rounded-lg bg-[#1B3B2B] flex items-center justify-center text-white">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#1C1917]">Property Deed Verification Queue</h1>
          <p className="text-xs text-[#605A52]">Review newly created owner listings before public publication</p>
        </div>
      </div>

      {notice && (
        <div className="p-4 rounded-lg bg-[#1B3B2B]/10 border border-[#1B3B2B] text-[#1B3B2B] text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" /> {notice}
        </div>
      )}

      {loading ? (
        <Loader text="Fetching pending verification queue..." />
      ) : properties.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="Verification queue clear"
          description="There are currently no property listings waiting for admin verification."
        />
      ) : (
        <div className="space-y-4">
          {properties.map((property) => {
            const owner = property.owner || {};

            return (
              <div
                key={property._id}
                className="bg-white p-6 rounded-xl border border-[#E2DACD] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs"
              >
                <div className="flex items-start gap-4 flex-1">
                  <img
                    src={
                      property.images && property.images.length > 0
                        ? property.images[0]
                        : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=80'
                    }
                    alt={property.title}
                    className="w-24 h-24 rounded-lg object-cover border border-[#E2DACD] shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge status="pending" text="PENDING VERIFICATION" />
                      <span className="text-xs text-[#B8860B] font-bold uppercase">{property.type}</span>
                    </div>

                    <h3 className="text-lg font-serif font-bold text-[#1C1917]">{property.title}</h3>
                    <p className="text-xs text-[#605A52] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#1B3B2B]" /> {property.address?.street},{' '}
                      {property.address?.city}, {property.address?.state}
                    </p>
                    <p className="text-xs text-[#605A52]">
                      Rent: <strong className="text-[#1B3B2B] font-serif font-bold">₹{property.rentAmount?.toLocaleString('en-IN')}/mo</strong> • Landlord:{' '}
                      <strong className="text-[#1C1917]">{owner.name || 'Owner'}</strong> ({owner.email})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-[#E2DACD]">
                  <Link
                    to={`/properties/${property._id}`}
                    target="_blank"
                    className="px-3.5 py-2 rounded-lg bg-[#FAF7F2] hover:bg-[#F4F0E8] text-[#1C1917] font-semibold text-xs border border-[#E2DACD] flex items-center gap-1"
                  >
                    View <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => handleVerify(property._id, 'rejected')}
                    className="px-4 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-[#991B1B] font-semibold text-xs border border-rose-200 flex items-center gap-1"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>

                  <button
                    onClick={() => handleVerify(property._id, 'approved')}
                    className="px-5 py-2 rounded-lg bg-[#1B3B2B] hover:bg-[#152e22] text-white font-semibold text-xs flex items-center gap-1 shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve Listing
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PropertyVerificationPage;
