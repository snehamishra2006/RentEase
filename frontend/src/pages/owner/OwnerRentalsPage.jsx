import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOwnerRentals } from '../../redux/slices/rentalSlice';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Badge from '../../components/common/Badge';
import { Home, Calendar, Phone, Mail, ShieldCheck } from 'lucide-react';

const OwnerRentalsPage = () => {
  const dispatch = useDispatch();
  const { ownerRentals: rentals, loading } = useSelector((state) => state.rentals);

  useEffect(() => {
    dispatch(fetchOwnerRentals());
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-[#E2DACD]">
        <div className="w-10 h-10 rounded-lg bg-[#1B3B2B] flex items-center justify-center text-white">
          <Home className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#1C1917]">Active Lease Agreements & Tenants</h1>
          <p className="text-xs text-[#605A52]">Directory of occupied property deeds and active tenant leases</p>
        </div>
      </div>

      {loading ? (
        <Loader text="Loading active lease agreements..." />
      ) : rentals.length === 0 ? (
        <EmptyState
          icon={Home}
          title="No active lease agreements"
          description="When you approve tenant applications, active lease records and rent tracking will display here."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rentals.map((rental) => {
            const property = rental.property || {};
            const tenant = rental.tenant || {};

            return (
              <div
                key={rental._id}
                className="bg-white p-6 rounded-xl border border-[#E2DACD] space-y-4 shadow-xs"
              >
                <div className="flex items-start justify-between gap-4 pb-3 border-b border-[#E2DACD]">
                  <div>
                    <Badge status={rental.status} text="ACTIVE LEASE" />
                    <h3 className="text-base font-serif font-bold text-[#1C1917] mt-1">{property.title}</h3>
                    <p className="text-xs text-[#605A52]">
                      {property.address?.street}, {property.address?.city}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-[#605A52] block">Monthly Rent</span>
                    <span className="text-xl font-serif font-bold text-[#1B3B2B]">₹{rental.rentAmount?.toLocaleString('en-IN')}/mo</span>
                  </div>
                </div>

                {/* Tenant Card */}
                <div className="p-4 rounded-lg bg-[#FAF7F2] border border-[#E2DACD] flex items-center gap-3">
                  <img
                    src={tenant.avatar || 'https://ik.imagekit.io/f8khymiop/9dd2906190f0c1813429fe0c8695ed04.png?updatedAt=1786639995780'}
                    alt={tenant.name}
                    className="w-10 h-10 rounded-md object-cover border border-[#E2DACD]"
                  />
                  <div className="text-xs space-y-0.5">
                    <span className="font-bold text-[#1C1917] block">{tenant.name}</span>
                    <p className="text-[#605A52] flex items-center gap-2">
                      <Mail className="w-3 h-3 text-[#1B3B2B]" /> {tenant.email}
                      {tenant.phone && (
                        <>
                          • <Phone className="w-3 h-3 text-[#1B3B2B]" /> {tenant.phone}
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-[#FAF7F2] border border-[#E2DACD] text-xs text-[#1C1917]">
                  <div>
                    <span className="text-[10px] text-[#605A52] block font-bold uppercase">Lease Start Date</span>
                    <span className="font-bold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#1B3B2B]" /> {new Date(rental.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#605A52] block font-bold uppercase">Lease End Date</span>
                    <span className="font-bold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#1B3B2B]" /> {new Date(rental.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OwnerRentalsPage;
