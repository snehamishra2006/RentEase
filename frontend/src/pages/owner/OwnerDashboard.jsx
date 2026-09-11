import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOwnerProperties } from '../../redux/slices/propertySlice';
import { fetchOwnerApplications } from '../../redux/slices/applicationSlice';
import { fetchOwnerRentals } from '../../redux/slices/rentalSlice';
import { fetchOwnerMaintenance } from '../../redux/slices/maintenanceSlice';
import { Link } from 'react-router-dom';
import { Building2, FileText, Home, Wrench, Plus, ArrowRight } from 'lucide-react';
import Badge from '../../components/common/Badge';

const OwnerDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { ownerProperties: properties } = useSelector((state) => state.properties);
  const { ownerApps: applications } = useSelector((state) => state.applications);
  const { ownerRentals: rentals } = useSelector((state) => state.rentals);
  const { ownerRequests: maintenance } = useSelector((state) => state.maintenance);

  useEffect(() => {
    dispatch(fetchOwnerProperties());
    dispatch(fetchOwnerApplications());
    dispatch(fetchOwnerRentals());
    dispatch(fetchOwnerMaintenance());
  }, [dispatch]);

  const verifiedCount = properties.filter((p) => p.verificationStatus === 'approved').length;
  const pendingApps = applications.filter((a) => a.status === 'pending');
  const openMaintenance = maintenance.filter((m) => m.status !== 'resolved' && m.status !== 'closed');
  
  const estimatedRevenue = rentals.reduce((sum, r) => sum + (r.rentAmount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E2DACD] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B8860B]">Landlord Ledger</span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1917] mt-1">
            Welcome back, <span className="text-[#1B3B2B]">{user?.name}</span>
          </h1>
          <p className="text-xs text-[#605A52] mt-1">Manage property deeds, verify tenant applications, and process lease rent.</p>
        </div>

        <Link
          to="/owner/my-properties"
          className="px-5 py-2.5 rounded-lg bg-[#1B3B2B] hover:bg-[#152e22] text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Property Listing
        </Link>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#E2DACD] space-y-2 shadow-xs">
          <div className="w-9 h-9 rounded-md bg-[#1B3B2B]/10 text-[#1B3B2B] flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#605A52] block">Total Listed Properties</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-serif font-extrabold text-[#1C1917]">{properties.length}</span>
            <span className="text-xs text-[#1B3B2B] font-bold">{verifiedCount} Verified</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E2DACD] space-y-2 shadow-xs">
          <div className="w-9 h-9 rounded-md bg-[#1B3B2B]/10 text-[#1B3B2B] flex items-center justify-center">
            <Home className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#605A52] block">Active Lease Agreements</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-serif font-extrabold text-[#1C1917]">{rentals.length}</span>
            <span className="text-xs text-[#1B3B2B] font-serif font-bold">₹{estimatedRevenue?.toLocaleString('en-IN')}/mo</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E2DACD] space-y-2 shadow-xs">
          <div className="w-9 h-9 rounded-md bg-[#B8860B]/10 text-[#B8860B] flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#605A52] block">Pending Applications</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-serif font-extrabold text-[#1C1917]">{pendingApps.length}</span>
            <Link to="/owner/applications" className="text-xs text-[#1B3B2B] font-bold hover:underline">
              Review
            </Link>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E2DACD] space-y-2 shadow-xs">
          <div className="w-9 h-9 rounded-md bg-[#991B1B]/10 text-[#991B1B] flex items-center justify-center">
            <Wrench className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#605A52] block">Open Maintenance</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-serif font-extrabold text-[#1C1917]">{openMaintenance.length}</span>
            <Link to="/owner/maintenance" className="text-xs text-[#1B3B2B] font-bold hover:underline">
              Resolve
            </Link>
          </div>
        </div>
      </div>

      {/* Grid: Pending Applications & Active Tenants */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Applications Review Widget */}
        <div className="bg-white p-6 rounded-xl border border-[#E2DACD] space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#E2DACD]">
            <h3 className="font-serif font-bold text-[#1C1917] text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#B8860B]" /> Pending Applications ({pendingApps.length})
            </h3>
            <Link to="/owner/applications" className="text-xs text-[#1B3B2B] font-bold hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {pendingApps.length === 0 ? (
              <div className="p-6 text-center text-[#605A52] text-xs bg-[#FAF7F2] rounded-lg">
                No pending rental applications at the moment.
              </div>
            ) : (
              pendingApps.slice(0, 3).map((app) => (
                <div key={app._id} className="p-4 rounded-lg bg-[#FAF7F2] border border-[#E2DACD] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1C1917] text-xs">{app.tenant?.name || 'Applicant'}</span>
                    <Badge status="pending" />
                  </div>
                  <p className="text-xs text-[#605A52] line-clamp-1">
                    Applied for <strong className="text-[#1C1917]">{app.property?.title}</strong> (₹{app.property?.rentAmount?.toLocaleString('en-IN')}/mo)
                  </p>
                  <div className="flex items-center justify-between pt-1 text-[11px] text-[#605A52]">
                    <span>Income: ₹{app.monthlyIncome?.toLocaleString('en-IN')}/mo</span>
                    <Link to="/owner/applications" className="text-[#1B3B2B] font-bold hover:underline">
                      Review Applicant
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Maintenance Ticket Alert Widget */}
        <div className="bg-white p-6 rounded-xl border border-[#E2DACD] space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#E2DACD]">
            <h3 className="font-serif font-bold text-[#1C1917] text-base flex items-center gap-2">
              <Wrench className="w-4 h-4 text-[#991B1B]" /> Open Maintenance ({openMaintenance.length})
            </h3>
            <Link to="/owner/maintenance" className="text-xs text-[#1B3B2B] font-bold hover:underline flex items-center gap-1">
              Manage Tickets <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {openMaintenance.length === 0 ? (
              <div className="p-6 text-center text-[#605A52] text-xs bg-[#FAF7F2] rounded-lg">
                All property maintenance tickets are clear and resolved!
              </div>
            ) : (
              openMaintenance.slice(0, 3).map((ticket) => (
                <div key={ticket._id} className="p-4 rounded-lg bg-[#FAF7F2] border border-[#E2DACD] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1C1917] text-xs">{ticket.title}</span>
                    <Badge status={ticket.priority} />
                  </div>
                  <p className="text-xs text-[#605A52] line-clamp-1">{ticket.property?.title}</p>
                  <div className="flex items-center justify-between text-[11px] text-[#605A52]">
                    <span>Reported by {ticket.tenant?.name}</span>
                    <Link to="/owner/maintenance" className="text-[#1B3B2B] font-bold hover:underline">
                      Update Status
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
