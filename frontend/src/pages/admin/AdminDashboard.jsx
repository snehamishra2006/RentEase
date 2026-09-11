import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminStats } from '../../redux/slices/propertySlice';
import Loader from '../../components/common/Loader';
import { Building2, Users, ShieldCheck, Home, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { adminStats: stats, loading } = useSelector((state) => state.properties);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  if (loading) {
    return <Loader fullScreen text="Loading platform registry analytics..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E2DACD] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#991B1B]">Platform Administration</span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1917] mt-1">
            RentEase Registry Console
          </h1>
          <p className="text-xs text-[#605A52] mt-1">Audit property listings, verify owner deeds, and oversee active lease agreements.</p>
        </div>

        <Link
          to="/admin/verification"
          className="px-5 py-2.5 rounded-lg bg-[#1B3B2B] hover:bg-[#152e22] text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-colors shrink-0"
        >
          <ShieldCheck className="w-4 h-4" /> Verification Queue ({stats?.pendingVerifications || 0})
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#E2DACD] space-y-2 shadow-xs">
          <div className="w-9 h-9 rounded-md bg-[#1B3B2B]/10 text-[#1B3B2B] flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#605A52] block">Registered Users</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-serif font-extrabold text-[#1C1917]">{stats?.totalUsers || 0}</span>
            <Link to="/admin/users" className="text-xs text-[#1B3B2B] font-bold hover:underline">
              Manage
            </Link>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E2DACD] space-y-2 shadow-xs">
          <div className="w-[#1B3B2B]/10 w-9 h-9 rounded-md text-[#1B3B2B] flex items-center justify-center bg-[#1B3B2B]/10">
            <Building2 className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#605A52] block">Total Properties</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-serif font-extrabold text-[#1C1917]">{stats?.totalProperties || 0}</span>
            <span className="text-xs text-[#1B3B2B] font-bold">{stats?.approvedProperties || 0} Verified</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E2DACD] space-y-2 shadow-xs">
          <div className="w-9 h-9 rounded-md bg-[#B8860B]/10 text-[#B8860B] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#605A52] block">Pending Verifications</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-serif font-extrabold text-[#1C1917]">{stats?.pendingVerifications || 0}</span>
            <Link to="/admin/verification" className="text-xs text-[#1B3B2B] font-bold hover:underline">
              Review
            </Link>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E2DACD] space-y-2 shadow-xs">
          <div className="w-9 h-9 rounded-md bg-[#1B3B2B]/10 text-[#1B3B2B] flex items-center justify-center">
            <Home className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#605A52] block">Active Rentals</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-serif font-extrabold text-[#1C1917]">{stats?.totalRentals || 0}</span>
            <span className="text-xs text-[#605A52] font-semibold">Live Leases</span>
          </div>
        </div>
      </div>

      {/* Role Breakdown Panel */}
      <div className="bg-white p-6 rounded-xl border border-[#E2DACD] space-y-4 shadow-xs">
        <h3 className="font-serif font-bold text-[#1C1917] text-lg">User Directory Distribution</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-[#FAF7F2] border border-[#E2DACD]">
            <span className="text-[#605A52] font-bold uppercase text-[10px] block">Tenants</span>
            <span className="text-2xl font-serif font-bold text-[#1C1917]">{stats?.roleBreakdown?.tenant || 0}</span>
          </div>
          <div className="p-4 rounded-lg bg-[#FAF7F2] border border-[#E2DACD]">
            <span className="text-[#605A52] font-bold uppercase text-[10px] block">Property Owners / Landlords</span>
            <span className="text-2xl font-serif font-bold text-[#1C1917]">{stats?.roleBreakdown?.owner || 0}</span>
          </div>
          <div className="p-4 rounded-lg bg-[#FAF7F2] border border-[#E2DACD]">
            <span className="text-[#605A52] font-bold uppercase text-[10px] block">Platform Administrators</span>
            <span className="text-2xl font-serif font-bold text-[#1C1917]">{stats?.roleBreakdown?.admin || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
