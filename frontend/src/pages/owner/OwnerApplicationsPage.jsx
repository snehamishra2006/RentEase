import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOwnerApplications, updateApplicationStatus } from '../../redux/slices/applicationSlice';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Badge from '../../components/common/Badge';
import { FileText, CheckCircle2, XCircle, Mail, Phone } from 'lucide-react';

const OwnerApplicationsPage = () => {
  const dispatch = useDispatch();
  const { ownerApps: applications, loading } = useSelector((state) => state.applications);

  const [notice, setNotice] = useState('');

  useEffect(() => {
    dispatch(fetchOwnerApplications());
  }, [dispatch]);

  const handleStatusUpdate = async (id, status) => {
    const res = await dispatch(updateApplicationStatus({ id, status }));
    if (!res.error) {
      setNotice(
        status === 'approved'
          ? 'Application approved! Active lease created and property marked as rented.'
          : 'Application rejected.'
      );
      dispatch(fetchOwnerApplications());
    } else {
      alert(res.payload || 'Action failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-[#E2DACD]">
        <div className="w-10 h-10 rounded-lg bg-[#1B3B2B] flex items-center justify-center text-white">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#1C1917]">Tenant Application Ledger</h1>
          <p className="text-xs text-[#605A52]">Review applicant qualifications and approve property lease agreements</p>
        </div>
      </div>

      {notice && (
        <div className="p-4 rounded-lg bg-[#1B3B2B]/10 border border-[#1B3B2B] text-[#1B3B2B] text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" /> {notice}
        </div>
      )}

      {loading ? (
        <Loader text="Loading tenant applications..." />
      ) : applications.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No tenant applications received"
          description="When prospective tenants apply for your property listings, their records will appear here."
        />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const property = app.property || {};
            const tenant = app.tenant || {};

            return (
              <div
                key={app._id}
                className="bg-white p-6 rounded-xl border border-[#E2DACD] space-y-4 shadow-xs"
              >
                {/* Header & Status */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2DACD]">
                  <div className="flex items-center gap-3">
                    <img
                      src={tenant.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'}
                      alt={tenant.name}
                      className="w-11 h-11 rounded-md object-cover border border-[#E2DACD]"
                    />
                    <div>
                      <span className="text-sm font-bold text-[#1C1917] block">{tenant.name}</span>
                      <div className="flex items-center gap-3 text-xs text-[#605A52] mt-0.5">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-[#1B3B2B]" /> {tenant.email}
                        </span>
                        {tenant.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-[#1B3B2B]" /> {tenant.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge status={app.status} text={`APPLICATION ${app.status}`} />
                  </div>
                </div>

                {/* Property & Application Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-lg bg-[#FAF7F2] border border-[#E2DACD] space-y-1">
                    <span className="text-[10px] font-bold text-[#605A52] uppercase tracking-wider">Target Property</span>
                    <h4 className="text-sm font-serif font-bold text-[#1C1917]">{property.title}</h4>
                    <p className="text-[#605A52]">
                      {property.address?.street}, {property.address?.city} • Rent: ₹{property.rentAmount?.toLocaleString('en-IN')}/mo
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-[#FAF7F2] border border-[#E2DACD] space-y-2">
                    <span className="text-[10px] font-bold text-[#605A52] uppercase tracking-wider">Applicant Qualifications</span>
                    <div className="grid grid-cols-3 gap-2 text-[#1C1917]">
                      <div>
                        <span className="text-[10px] text-[#605A52] block">Move-in Date</span>
                        <strong className="text-[#1C1917]">{new Date(app.moveInDate).toLocaleDateString()}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#605A52] block">Stated Income</span>
                        <strong className="text-[#1C1917]">₹{app.monthlyIncome?.toLocaleString('en-IN')}/mo</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#605A52] block">Occupants</span>
                        <strong className="text-[#1C1917]">{app.occupants} Person(s)</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {app.notes && (
                  <div className="p-3.5 rounded-lg bg-[#FAF7F2] border border-[#E2DACD] text-xs text-[#1C1917]">
                    <span className="font-bold text-[#605A52] block mb-1">Applicant Note:</span>
                    {app.notes}
                  </div>
                )}

                {/* Approve / Reject Actions */}
                {app.status === 'pending' && (
                  <div className="flex justify-end gap-3 pt-3 border-t border-[#E2DACD]">
                    <button
                      onClick={() => handleStatusUpdate(app._id, 'rejected')}
                      className="px-4 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-[#991B1B] font-semibold text-xs border border-rose-200 flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" /> Reject Application
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(app._id, 'approved')}
                      className="px-5 py-2 rounded-lg bg-[#1B3B2B] hover:bg-[#152e22] text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve & Issue Lease Deed
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OwnerApplicationsPage;
