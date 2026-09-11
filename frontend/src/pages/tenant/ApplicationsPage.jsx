import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTenantApplications } from '../../redux/slices/applicationSlice';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Badge from '../../components/common/Badge';
import { FileText, Calendar, DollarSign, Users, ExternalLink, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ApplicationsPage = () => {
  const dispatch = useDispatch();
  const { tenantApps: applications, loading } = useSelector((state) => state.applications);

  useEffect(() => {
    dispatch(fetchTenantApplications());
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-[#E2DACD]">
        <div className="w-10 h-10 rounded-lg bg-[#1B3B2B] flex items-center justify-center text-white">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#1C1917]">Rental Application Records</h1>
          <p className="text-xs text-[#605A52]">Track application approvals and landlord responses</p>
        </div>
      </div>

      {loading ? (
        <Loader text="Fetching submitted applications..." />
      ) : applications.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No rental applications submitted"
          description="You haven't submitted any property applications yet. Browse the registry and click Apply."
          actionText="Browse Available Properties"
          onAction={() => (window.location.href = '/properties')}
        />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const property = app.property || {};
            const owner = app.owner || {};

            return (
              <div
                key={app._id}
                className="bg-white p-6 rounded-xl border border-[#E2DACD] hover:border-[#1B3B2B]/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs"
              >
                {/* Property & App Header */}
                <div className="flex items-start gap-4 flex-1">
                  <img
                    src={
                      property.images && property.images.length > 0
                        ? property.images[0]
                        : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=80'
                    }
                    alt={property.title}
                    className="w-20 h-20 rounded-lg object-cover border border-[#E2DACD] shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge status={app.status} text={`APPLICATION ${app.status}`} />
                      <span className="text-[11px] text-[#605A52]">
                        Filed on {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <Link
                      to={`/properties/${property._id}`}
                      className="text-base font-serif font-bold text-[#1C1917] hover:text-[#1B3B2B] transition-colors line-clamp-1"
                    >
                      {property.title || 'Property Listing'}
                    </Link>
                    <p className="text-xs text-[#605A52] mt-0.5">
                      {property.address?.city}, {property.address?.state} • Landlord: {owner.name || 'Owner'}
                    </p>

                    {/* App Stats */}
                    <div className="flex flex-wrap gap-4 mt-3 text-xs text-[#1C1917]">
                      <span className="flex items-center gap-1 text-[#605A52]">
                        <Calendar className="w-3.5 h-3.5 text-[#1B3B2B]" /> Move-in:{' '}
                        <strong className="text-[#1C1917]">
                          {new Date(app.moveInDate).toLocaleDateString()}
                        </strong>
                      </span>
                      <span className="flex items-center gap-1 text-[#605A52]">
                        <DollarSign className="w-3.5 h-3.5 text-[#1B3B2B]" /> Income:{' '}
                        <strong className="text-[#1C1917]">₹{app.monthlyIncome?.toLocaleString('en-IN')}/mo</strong>
                      </span>
                      <span className="flex items-center gap-1 text-[#605A52]">
                        <Users className="w-3.5 h-3.5 text-[#1B3B2B]" /> Occupants:{' '}
                        <strong className="text-[#1C1917]">{app.occupants}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Action */}
                <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-[#E2DACD]">
                  {app.status === 'approved' ? (
                    <Link
                      to="/tenant/rental"
                      className="w-full md:w-auto px-5 py-2.5 rounded-lg bg-[#1B3B2B] hover:bg-[#152e22] text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Building2 className="w-4 h-4" /> Go to Active Lease
                    </Link>
                  ) : (
                    <Link
                      to={`/properties/${property._id}`}
                      className="w-full md:w-auto px-4 py-2 rounded-lg bg-[#F4F0E8] hover:bg-[#EAE4D8] text-[#1C1917] font-semibold text-xs flex items-center justify-center gap-1 border border-[#E2DACD]"
                    >
                      View Record <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;
