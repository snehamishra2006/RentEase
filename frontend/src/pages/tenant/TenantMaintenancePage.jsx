import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTenantMaintenance, submitMaintenanceRequest } from '../../redux/slices/maintenanceSlice';
import MaintenanceModal from '../../components/tenant/MaintenanceModal';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Badge from '../../components/common/Badge';
import { Wrench, Plus, CheckCircle2 } from 'lucide-react';

const TenantMaintenancePage = () => {
  const dispatch = useDispatch();
  const { tenantRequests: requests, loading } = useSelector((state) => state.maintenance);

  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    dispatch(fetchTenantMaintenance());
  }, [dispatch]);

  const handleSubmitTicket = async (data) => {
    setSubmitting(true);
    const res = await dispatch(submitMaintenanceRequest(data));
    setSubmitting(false);

    if (!res.error) {
      setShowModal(false);
      setNotice('Maintenance ticket submitted! Your landlord has been notified.');
      dispatch(fetchTenantMaintenance());
    } else {
      alert(res.payload || 'Submission failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2DACD]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#B8860B]/10 text-[#B8860B] border border-[#B8860B]/20 flex items-center justify-center">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#1C1917]">Maintenance Tickets Ledger</h1>
            <p className="text-xs text-[#605A52]">Report plumbing, electrical, or structural issues to your landlord</p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-lg bg-[#1B3B2B] hover:bg-[#152e22] text-white font-semibold text-xs flex items-center gap-2 shadow-xs"
        >
          <Plus className="w-4 h-4" /> Report Maintenance Issue
        </button>
      </div>

      {notice && (
        <div className="p-4 rounded-lg bg-[#1B3B2B]/10 border border-[#1B3B2B] text-[#1B3B2B] text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" /> {notice}
        </div>
      )}

      {loading ? (
        <Loader text="Loading maintenance tickets..." />
      ) : requests.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No maintenance tickets reported"
          description="If you notice any property maintenance issues, click Report Maintenance Issue."
          actionText="Report Issue Now"
          onAction={() => setShowModal(true)}
        />
      ) : (
        <div className="space-y-4">
          {requests.map((ticket) => {
            const property = ticket.property || {};
            return (
              <div
                key={ticket._id}
                className="bg-white p-6 rounded-xl border border-[#E2DACD] space-y-4 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#E2DACD]">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge status={ticket.priority} text={`${ticket.priority} PRIORITY`} />
                      <Badge status={ticket.status} />
                      <span className="text-[11px] text-[#605A52] font-semibold uppercase">{ticket.category}</span>
                    </div>
                    <h3 className="text-base font-serif font-bold text-[#1C1917]">{ticket.title}</h3>
                    <p className="text-xs text-[#605A52] mt-0.5">
                      Property: <strong className="text-[#1C1917]">{property.title || 'Rental Property'}</strong> • Reported on{' '}
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-[#1C1917] leading-relaxed">{ticket.description}</p>

                {ticket.images && ticket.images.length > 0 && (
                  <div className="flex gap-2">
                    {ticket.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="Issue photo"
                        className="w-20 h-20 rounded-lg object-cover border border-[#E2DACD]"
                      />
                    ))}
                  </div>
                )}

                {ticket.resolutionNotes && (
                  <div className="p-3.5 rounded-lg bg-[#FAF7F2] border border-[#E2DACD] text-xs text-[#1C1917]">
                    <span className="font-bold text-[#1B3B2B] block mb-1">Landlord Resolution Update:</span>
                    {ticket.resolutionNotes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Maintenance Modal */}
      <MaintenanceModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmitTicket}
        isSubmitting={submitting}
      />
    </div>
  );
};

export default TenantMaintenancePage;
