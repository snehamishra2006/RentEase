import React, { useState } from 'react';
import { X, Wrench, AlertTriangle, Image as ImageIcon } from 'lucide-react';

const MaintenanceModal = ({ isOpen, onClose, onSubmit, isSubmitting = false }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('plumbing');
  const [priority, setPriority] = useState('medium');
  const [imageUrl, setImageUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      category,
      priority,
      images: imageUrl ? [imageUrl] : [],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1917]/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-xl border border-[#E2DACD] shadow-2xl p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-[#605A52] hover:text-[#1C1917] hover:bg-[#F4F0E8] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[#E2DACD]">
          <div className="w-10 h-10 rounded-lg bg-[#B8860B]/10 text-[#B8860B] border border-[#B8860B]/20 flex items-center justify-center">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-[#1C1917]">Report Maintenance Ticket</h2>
            <p className="text-xs text-[#605A52]">Notify your landlord about property maintenance needs</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#1C1917] font-bold mb-1">Issue Summary Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Bathroom pipe leak / AC unit not cooling"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#FAF7F2] border border-[#E2DACD] rounded-lg text-[#1C1917] focus:outline-none focus:border-[#1B3B2B]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#1C1917] font-bold mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E2DACD] rounded-lg text-[#1C1917] capitalize focus:outline-none focus:border-[#1B3B2B]"
              >
                <option value="plumbing">Plumbing</option>
                <option value="electrical">Electrical</option>
                <option value="appliance">Appliance</option>
                <option value="structural">Structural</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-[#1C1917] font-bold mb-1">Urgency Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E2DACD] rounded-lg text-[#1C1917] capitalize focus:outline-none focus:border-[#1B3B2B]"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent / Emergency</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#1C1917] font-bold mb-1">Detailed Description *</label>
            <textarea
              required
              rows={3}
              placeholder="Provide exact location and details about the problem..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#FAF7F2] border border-[#E2DACD] rounded-lg text-[#1C1917] focus:outline-none focus:border-[#1B3B2B]"
            />
          </div>

          <div>
            <label className="block text-[#1C1917] font-bold mb-1 flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5 text-[#605A52]" /> Photo URL (Optional)
            </label>
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#FAF7F2] border border-[#E2DACD] rounded-lg text-[#1C1917] focus:outline-none focus:border-[#1B3B2B]"
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
              className="px-5 py-2 rounded-lg bg-[#B8860B] hover:bg-[#996f08] text-white font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <AlertTriangle className="w-4 h-4" /> {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaintenanceModal;
