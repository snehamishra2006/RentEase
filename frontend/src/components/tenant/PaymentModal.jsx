import React, { useState } from 'react';
import { X, CreditCard, IndianRupee, CheckCircle2 } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, onSubmit, payment, isSubmitting = false }) => {
  const [paymentMethod, setPaymentMethod] = useState('UPI / GPay / PhonePe');
  const [transactionId, setTransactionId] = useState(`UPI-${Math.floor(1000000000 + Math.random() * 9000000000)}`);
  const [notes, setNotes] = useState('');

  if (!isOpen || !payment) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      paymentId: payment._id,
      paymentMethod,
      transactionId,
      notes,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1917]/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-xl border border-[#E2DACD] dark:border-stone-800 shadow-2xl p-6 text-[#1C1917] dark:text-stone-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-[#605A52] dark:text-stone-400 hover:bg-[#F4F0E8] dark:hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[#E2DACD] dark:border-stone-800">
          <div className="w-10 h-10 rounded-lg bg-[#1B3B2B]/10 dark:bg-emerald-950/40 text-[#1B3B2B] dark:text-emerald-400 border border-[#1B3B2B]/20 flex items-center justify-center">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-[#1C1917] dark:text-stone-100">Rent Ledger Payment</h2>
            <p className="text-xs text-[#605A52] dark:text-stone-400">Record rent payment for owner receipt</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Due Info Card */}
          <div className="p-4 rounded-lg bg-[#F4F0E8] dark:bg-stone-800 border border-[#E2DACD] dark:border-stone-700 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#605A52] dark:text-stone-400 block mb-1">Amount Due</span>
            <span className="text-3xl font-serif font-extrabold text-[#1B3B2B] dark:text-emerald-400">
              ₹{payment.amount?.toLocaleString('en-IN')}
            </span>
            <span className="block text-[11px] text-[#605A52] dark:text-stone-400 mt-1">
              Due Date: {new Date(payment.dueDate).toLocaleDateString()}
            </span>
          </div>

          <div>
            <label className="block text-[#1C1917] dark:text-stone-200 font-bold mb-1">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#FAF7F2] dark:bg-stone-800 border border-[#E2DACD] dark:border-stone-700 rounded-lg text-[#1C1917] dark:text-stone-100 focus:outline-none focus:border-[#1B3B2B]"
            >
              <option value="UPI / GPay / PhonePe">UPI (GPay / PhonePe / Paytm)</option>
              <option value="NEFT / RTGS / IMPS">Direct Bank Transfer (NEFT / IMPS)</option>
              <option value="Credit / Debit Card">Credit / Debit Card</option>
              <option value="Cash Deposit">Cheque / Cash Deposit</option>
            </select>
          </div>

          <div>
            <label className="block text-[#1C1917] dark:text-stone-200 font-bold mb-1">Transaction Ref / UTR No.</label>
            <input
              type="text"
              required
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#FAF7F2] dark:bg-stone-800 border border-[#E2DACD] dark:border-stone-700 rounded-lg text-[#1C1917] dark:text-stone-100 focus:outline-none focus:border-[#1B3B2B]"
            />
          </div>

          <div>
            <label className="block text-[#1C1917] dark:text-stone-200 font-bold mb-1">Payment Notes (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Rent for November paid via Google Pay"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#FAF7F2] dark:bg-stone-800 border border-[#E2DACD] dark:border-stone-700 rounded-lg text-[#1C1917] dark:text-stone-100 focus:outline-none focus:border-[#1B3B2B]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#E2DACD] dark:border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#F4F0E8] dark:bg-stone-800 hover:bg-[#EAE4D8] text-[#1C1917] dark:text-stone-200 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-[#1B3B2B] hover:bg-[#152e22] text-white font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" /> {isSubmitting ? 'Processing...' : 'Confirm Rent Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
