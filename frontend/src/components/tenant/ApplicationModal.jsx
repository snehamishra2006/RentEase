import React, { useState } from 'react';
import { X, Send, Calendar, DollarSign, Users, FileText } from 'lucide-react';

const ApplicationModal = ({ isOpen, onClose, onSubmit, property, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    moveInDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    leaseTermMonths: '12',
    occupants: '1',
    monthlyIncome: '',
    notes: '',
  });

  if (!isOpen || !property) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      propertyId: property._id,
      ...formData,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1917]/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-xl border border-[#E2DACD] shadow-2xl p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-[#605A52] hover:text-[#1C1917] hover:bg-[#F4F0E8] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[#E2DACD]">
          <div className="w-10 h-10 rounded-lg bg-[#1B3B2B] flex items-center justify-center text-white">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-[#1C1917]">Apply for Lease Deed</h2>
            <p className="text-xs text-[#B8860B] font-bold line-clamp-1">{property.title}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Summary Box */}
          <div className="p-3.5 rounded-lg bg-[#F4F0E8] border border-[#E2DACD] flex justify-between items-center text-[#1C1917]">
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-[#605A52]">Monthly Rent</span>
              <span className="text-base font-serif font-bold text-[#1B3B2B]">₹{property.rentAmount?.toLocaleString('en-IN')}/mo</span>
            </div>
            <div className="text-right">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-[#605A52]">Security Deposit</span>
              <span className="text-base font-serif font-bold text-[#1C1917]">₹{property.depositAmount?.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#1C1917] font-bold mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#1B3B2B]" /> Move-In Date *
              </label>
              <input
                type="date"
                required
                value={formData.moveInDate}
                onChange={(e) => setFormData({ ...formData, moveInDate: e.target.value })}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E2DACD] rounded-lg text-[#1C1917] focus:outline-none focus:border-[#1B3B2B]"
              />
            </div>

            <div>
              <label className="block text-[#1C1917] font-bold mb-1">Lease Term</label>
              <select
                value={formData.leaseTermMonths}
                onChange={(e) => setFormData({ ...formData, leaseTermMonths: e.target.value })}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E2DACD] rounded-lg text-[#1C1917] focus:outline-none focus:border-[#1B3B2B]"
              >
                <option value="6">6 Months</option>
                <option value="12">12 Months (1 Year)</option>
                <option value="24">24 Months (2 Years)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#1C1917] font-bold mb-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#1B3B2B]" /> Total Occupants *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.occupants}
                onChange={(e) => setFormData({ ...formData, occupants: e.target.value })}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E2DACD] rounded-lg text-[#1C1917] focus:outline-none focus:border-[#1B3B2B]"
              />
            </div>

            <div>
              <label className="block text-[#1C1917] font-bold mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-[#1B3B2B]" /> Monthly Income (₹ INR) *
              </label>
              <input
                type="number"
                required
                placeholder="e.g. 85000"
                value={formData.monthlyIncome}
                onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E2DACD] rounded-lg text-[#1C1917] focus:outline-none focus:border-[#1B3B2B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#1C1917] font-bold mb-1">Message to Property Landlord</label>
            <textarea
              rows={3}
              placeholder="Introduce yourself, employment, rental history, pets..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E2DACD] rounded-lg text-[#1C1917] focus:outline-none focus:border-[#1B3B2B]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#E2DACD]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#F4F0E8] hover:bg-[#EAE4D8] text-[#1C1917] font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-[#1B3B2B] hover:bg-[#152e22] text-white font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-4 h-4" /> {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationModal;
