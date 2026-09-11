import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActiveTenantRental, fetchRentPayments, payRent } from '../../redux/slices/rentalSlice';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Badge from '../../components/common/Badge';
import PaymentModal from '../../components/tenant/PaymentModal';
import { Building2, Calendar, CreditCard, Phone, Mail, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const ActiveRentalPage = () => {
  const dispatch = useDispatch();
  const { activeRental: rental, payments, loading } = useSelector((state) => state.rentals);
  const { loading: paymentSubmitting } = useSelector((state) => state.rentals);

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [successNotice, setSuccessNotice] = useState('');

  useEffect(() => {
    dispatch(fetchActiveTenantRental());
  }, [dispatch]);

  useEffect(() => {
    if (rental) {
      dispatch(fetchRentPayments(rental._id));
    }
  }, [dispatch, rental]);

  if (loading) {
    return <Loader fullScreen text="Loading active lease deed..." />;
  }

  if (!rental) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EmptyState
          icon={Building2}
          title="No active lease agreement"
          description="You currently don't have an active property rental lease. Discover available listings and submit an application."
          actionText="Explore Properties Registry"
          onAction={() => (window.location.href = '/properties')}
        />
      </div>
    );
  }

  const property = rental.property || {};
  const owner = rental.owner || {};

  const handlePayRentSubmit = async (paymentData) => {
    const res = await dispatch(payRent(paymentData));
    if (!res.error) {
      setShowPaymentModal(false);
      setSuccessNotice('Payment recorded successfully! Landlord notified.');
      dispatch(fetchRentPayments(rental._id));
    } else {
      alert(res.payload || 'Payment failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E2DACD] relative overflow-hidden shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <img
              src={
                property.images && property.images.length > 0
                  ? property.images[0]
                  : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80'
              }
              alt={property.title}
              className="w-24 h-24 rounded-lg object-cover border border-[#E2DACD] shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge status={rental.status} text="ACTIVE LEASE DEED" />
                <span className="text-xs text-[#B8860B] font-bold uppercase">{property.type}</span>
              </div>
              <h1 className="text-2xl font-serif font-bold text-[#1C1917]">{property.title}</h1>
              <p className="text-xs text-[#605A52] mt-1">
                {property.address?.street}, {property.address?.city}, {property.address?.state}
              </p>
              <div className="flex flex-wrap gap-4 mt-3 text-xs text-[#1C1917]">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#1B3B2B]" /> Start:{' '}
                  <strong className="text-[#1C1917]">{new Date(rental.startDate).toLocaleDateString()}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#1B3B2B]" /> End:{' '}
                  <strong className="text-[#1C1917]">{new Date(rental.endDate).toLocaleDateString()}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[#FAF7F2] border border-[#E2DACD] text-right w-full md:w-auto">
            <span className="text-[10px] text-[#605A52] uppercase font-bold tracking-wider block">Monthly Rent Rate</span>
            <span className="text-3xl font-serif font-extrabold text-[#1B3B2B]">₹{rental.rentAmount?.toLocaleString('en-IN')}</span>
            <span className="block text-[11px] text-[#1B3B2B] font-semibold mt-1 flex items-center justify-end gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Deposit Paid (₹{rental.depositAmount?.toLocaleString('en-IN')})
            </span>
          </div>
        </div>
      </div>

      {successNotice && (
        <div className="p-4 rounded-lg bg-[#1B3B2B]/10 border border-[#1B3B2B] text-[#1B3B2B] text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" /> {successNotice}
        </div>
      )}

      {/* Grid: Landlord Contact & Rent Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 1 Col: Landlord Card */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-[#E2DACD] space-y-4 shadow-xs">
            <h3 className="text-xs font-bold text-[#605A52] uppercase tracking-wider">Registered Landlord</h3>
            <div className="flex items-center gap-3">
              <img
                src={owner.avatar || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80'}
                alt={owner.name}
                className="w-11 h-11 rounded-md object-cover border border-[#E2DACD]"
              />
              <div>
                <span className="block font-bold text-[#1C1917] text-sm">{owner.name}</span>
                <span className="block text-xs text-[#605A52]">Property Owner</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2DACD] space-y-2 text-xs text-[#1C1917]">
              {owner.phone && (
                <p className="flex items-center gap-2 text-[#605A52]">
                  <Phone className="w-4 h-4 text-[#1B3B2B]" /> {owner.phone}
                </p>
              )}
              <p className="flex items-center gap-2 text-[#605A52]">
                <Mail className="w-4 h-4 text-[#1B3B2B]" /> {owner.email}
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/tenant/maintenance"
                className="w-full text-center py-2.5 rounded-lg bg-[#FAF7F2] hover:bg-[#F4F0E8] text-[#1C1917] font-semibold text-xs border border-[#E2DACD] block transition-colors"
              >
                Report Maintenance Issue
              </Link>
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Monthly Rent Payments Ledger */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E2DACD]">
            <h3 className="text-lg font-serif font-bold text-[#1C1917] flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#1B3B2B]" /> Rent Ledger & Monthly Payments
            </h3>
          </div>

          <div className="space-y-3">
            {payments.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-xl border border-[#E2DACD] text-[#605A52] text-xs">
                No payment entries logged for this lease.
              </div>
            ) : (
              payments.map((pmt) => (
                <div
                  key={pmt._id}
                  className="bg-white p-5 rounded-xl border border-[#E2DACD] flex items-center justify-between gap-4 shadow-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge status={pmt.status} />
                      <span className="text-sm font-serif font-bold text-[#1C1917]">₹{pmt.amount?.toLocaleString('en-IN')}</span>
                    </div>
                    <p className="text-xs text-[#605A52]">
                      Due Date: <strong className="text-[#1C1917]">{new Date(pmt.dueDate).toLocaleDateString()}</strong>
                    </p>
                    {pmt.paidDate && (
                      <p className="text-[11px] text-[#1B3B2B] font-medium">
                        Paid on {new Date(pmt.paidDate).toLocaleDateString()} via {pmt.paymentMethod} (Ref: {pmt.transactionId})
                      </p>
                    )}
                  </div>

                  <div>
                    {pmt.status === 'due' || pmt.status === 'overdue' ? (
                      <button
                        onClick={() => {
                          setSelectedPayment(pmt);
                          setShowPaymentModal(true);
                        }}
                        className="px-5 py-2 rounded-lg bg-[#1B3B2B] hover:bg-[#152e22] text-white font-semibold text-xs shadow-xs transition-colors"
                      >
                        Pay Rent Now
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-[#1B3B2B] flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> RECORDED PAID
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSubmit={handlePayRentSubmit}
        payment={selectedPayment}
        isSubmitting={paymentSubmitting}
      />
    </div>
  );
};

export default ActiveRentalPage;
