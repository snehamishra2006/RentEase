import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOwnerMaintenance, updateMaintenanceStatus } from '../../redux/slices/maintenanceSlice';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Badge from '../../components/common/Badge';
import { Wrench, CheckCircle2 } from 'lucide-react';

const OwnerMaintenancePage = () => {
  const dispatch = useDispatch();
  const { ownerRequests: requests, loading } = useSelector((state) => state.maintenance);

  const [notice, setNotice] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState({});

  useEffect(() => {
    dispatch(fetchOwnerMaintenance());
  }, [dispatch]);

  const handleStatusChange = async (id, status) => {
    const notes = resolutionNotes[id] || '';
    const res = await dispatch(updateMaintenanceStatus({ id, status, resolutionNotes: notes }));
    if (!res.error) {
      setNotice(`Ticket status updated to ${status.toUpperCase()}.`);
      dispatch(fetchOwnerMaintenance());
    } else {
      alert(res.payload || 'Failed to update ticket');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-[#E2DACD]">
        <div className="w-10 h-10 rounded-lg bg-[#991B1B]/10 text-[#991B1B] border border-[#991B1B]/20 flex items-center justify-center">
          <Wrench className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#1C1917]">Property Maintenance Management</h1>
          <p className="text-xs text-[#605A52]">Track tenant maintenance tickets and dispatch repair updates</p>
        </div>
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
          title="No maintenance requests"
          description="Tenant reported property repair tickets will be logged here."
        />
      ) : (
        <div className="space-y-4">
          {requests.map((ticket) => {
            const property = ticket.property || {};
            const tenant = ticket.tenant || {};

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
                    <p className="text-xs text-[#605A52]">
                      Property: <strong className="text-[#1C1917]">{property.title}</strong> • Tenant:{' '}
                      <strong className="text-[#1C1917]">{tenant.name}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={ticket.status}
                      onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
                      className="px-3 py-1.5 bg-[#FAF7F2] border border-[#E2DACD] rounded-lg text-xs font-bold text-[#1C1917] capitalize focus:outline-none focus:border-[#1B3B2B]"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>

                <p className="text-xs text-[#1C1917] leading-relaxed">{ticket.description}</p>

                {/* Resolution Note Input */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#605A52] uppercase tracking-wider">
                    Add Landlord Resolution / Dispatch Notes
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Plumber scheduled for Thursday 10 AM..."
                      value={resolutionNotes[ticket._id] || ticket.resolutionNotes || ''}
                      onChange={(e) =>
                        setResolutionNotes({ ...resolutionNotes, [ticket._id]: e.target.value })
                      }
                      className="flex-1 px-3 py-1.5 bg-[#FAF7F2] border border-[#E2DACD] rounded-lg text-xs text-[#1C1917] focus:outline-none focus:border-[#1B3B2B]"
                    />
                    <button
                      onClick={() => handleStatusChange(ticket._id, ticket.status)}
                      className="px-4 py-1.5 rounded-lg bg-[#1B3B2B] hover:bg-[#152e22] text-white text-xs font-semibold shadow-xs"
                    >
                      Save Note
                    </button>
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

export default OwnerMaintenancePage;
