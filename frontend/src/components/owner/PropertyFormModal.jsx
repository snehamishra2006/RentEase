import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, Trash2, Building2 } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

const AVAILABLE_AMENITIES = [
  'Covered Parking',
  'Lift / Elevator',
  'Power Backup',
  'Modular Kitchen',
  '24/7 Water Supply',
  'Gated Security',
  'Clubhouse & Gym',
  'Balcony / Terrace',
  'Geyser / Water Heater',
  'Pet Friendly',
  'High-Speed Wifi',
  'Gas Pipeline',
];

const PropertyFormModal = ({ isOpen, onClose, onSubmit, initialData = null, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'flat_apartment',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    rentAmount: '',
    depositAmount: '',
    bedrooms: '2',
    bathrooms: '2',
    areaSqFt: '',
    amenities: [],
    images: [''],
  });

  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        type: initialData.type || 'flat_apartment',
        street: initialData.address?.street || '',
        city: initialData.address?.city || '',
        state: initialData.address?.state || '',
        zipcode: initialData.address?.zipcode || '',
        rentAmount: initialData.rentAmount || '',
        depositAmount: initialData.depositAmount || '',
        bedrooms: initialData.bedrooms || '2',
        bathrooms: initialData.bathrooms || '2',
        areaSqFt: initialData.areaSqFt || '',
        amenities: initialData.amenities || [],
        images: initialData.images && initialData.images.length > 0 ? initialData.images : [''],
      });
    } else {
      setFormData({
        title: '',
        description: '',
        type: 'flat_apartment',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        rentAmount: '',
        depositAmount: '',
        bedrooms: '2',
        bathrooms: '2',
        areaSqFt: '',
        amenities: [],
        images: ['/src/assets/Property1.jpg'],
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists ? prev.amenities.filter((a) => a !== amenity) : [...prev.amenities, amenity],
      };
    });
  };

  const handleImageChange = (index, value) => {
    const updated = [...formData.images];
    updated[index] = value;
    setFormData({ ...formData, images: updated });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const removeImageField = (index) => {
    setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);

    try {
      setUploadingImage(true);
      const res = await axiosClient.post('/properties/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.url) {
        setFormData((prev) => ({
          ...prev,
          images: [res.data.url, ...prev.images.filter(Boolean)],
        }));
      }
    } catch (err) {
      alert(err.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanImages = formData.images.filter((img) => img.trim() !== '');
    onSubmit({
      ...formData,
      images: cleanImages.length > 0 ? cleanImages : ['/src/assets/Property1.jpg'],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1917]/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-stone-900 rounded-xl border border-[#E2DACD] dark:border-stone-800 shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto text-[#1C1917] dark:text-stone-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-[#605A52] dark:text-stone-400 hover:bg-[#F4F0E8] dark:hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6 pb-3 border-b border-[#E2DACD] dark:border-stone-800">
          <div className="w-10 h-10 rounded-lg bg-[#1B3B2B] flex items-center justify-center text-white">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-[#1C1917] dark:text-stone-100">
              {initialData ? 'Edit Property Listing Deed' : 'New Property Listing Deed'}
            </h2>
            <p className="text-xs text-[#605A52] dark:text-stone-400">
              Submit your property details for Admin verification and archival registration.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Property Title & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[#1C1917] dark:text-stone-200 font-bold mb-1">Property Title *</label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. Spacious 2 BHK Builder Floor in Rajendra Nagar"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-[#FAF7F2] dark:bg-stone-800 border border-[#E2DACD] dark:border-stone-700 rounded-lg text-[#1C1917] dark:text-stone-100 focus:outline-none focus:border-[#1B3B2B] dark:focus:border-emerald-400"
              />
            </div>
            <div>
              <label className="block text-[#1C1917] dark:text-stone-200 font-bold mb-1">Property Category *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-[#FAF7F2] dark:bg-stone-800 border border-[#E2DACD] dark:border-stone-700 rounded-lg text-[#1C1917] dark:text-stone-100 focus:outline-none focus:border-[#1B3B2B] dark:focus:border-emerald-400"
              >
                <option value="flat_apartment">Flat / Apartment</option>
                <option value="builder_floor">Builder Floor</option>
                <option value="independent_house">Independent House</option>
                <option value="villa">Villa</option>
                <option value="pg_shared">PG / Shared</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[#1C1917] dark:text-stone-200 font-bold mb-1">Description *</label>
            <textarea
              name="description"
              required
              rows={3}
              placeholder="Describe locality, nearby metro station, floor layout, ventilation..."
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-[#FAF7F2] dark:bg-stone-800 border border-[#E2DACD] dark:border-stone-700 rounded-lg text-[#1C1917] dark:text-stone-100 focus:outline-none focus:border-[#1B3B2B] dark:focus:border-emerald-400"
            />
          </div>

          {/* Address Fields */}
          <div>
            <label className="block text-[#1C1917] dark:text-stone-200 font-bold mb-2">Locality & Location *</label>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                type="text"
                name="street"
                required
                placeholder="Locality / Sector (e.g. Sector 3 Rajendra Nagar)"
                value={formData.street}
                onChange={handleChange}
                className="sm:col-span-2 px-3.5 py-2 bg-[#FAF7F2] dark:bg-stone-800 border border-[#E2DACD] dark:border-stone-700 rounded-lg text-[#1C1917] dark:text-stone-100 focus:outline-none focus:border-[#1B3B2B]"
              />
              <input
                type="text"
                name="city"
                required
                placeholder="City (e.g. Ghaziabad)"
                value={formData.city}
                onChange={handleChange}
                className="px-3.5 py-2 bg-[#FAF7F2] dark:bg-stone-800 border border-[#E2DACD] dark:border-stone-700 rounded-lg text-[#1C1917] dark:text-stone-100 focus:outline-none focus:border-[#1B3B2B]"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  name="state"
                  required
                  placeholder="State (e.g. UP)"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-1/2 px-3 py-2 bg-[#FAF7F2] dark:bg-stone-800 border border-[#E2DACD] dark:border-stone-700 rounded-lg text-[#1C1917] dark:text-stone-100 focus:outline-none focus:border-[#1B3B2B]"
                />
                <input
                  type="text"
                  name="zipcode"
                  required
                  placeholder="Pincode"
                  value={formData.zipcode}
                  onChange={handleChange}
                  className="w-1/2 px-3 py-2 bg-[#FAF7F2] dark:bg-stone-800 border border-[#E2DACD] dark:border-stone-700 rounded-lg text-[#1C1917] dark:text-stone-100 focus:outline-none focus:border-[#1B3B2B]"
                />
              </div>
            </div>
          </div>

          {/* Financials & Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div>
              <label className="block text-[#1C1917] dark:text-stone-200 font-bold mb-1">Rent (₹/mo) *</label>
              <input
                type="number"
                name="rentAmount"
                required
                placeholder="14500"
                value={formData.rentAmount}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#FAF7F2] dark:bg-stone-800 border border-[#E2DACD] dark:border-stone-700 rounded-lg text-[#1C1917] dark:text-stone-100 focus:outline-none focus:border-[#1B3B2B]"
              />
            </div>
            <div>
              <label className="block text-[#1C1917] dark:text-stone-200 font-bold mb-1">Deposit (₹) *</label>
              <input
                type="number"
                name="depositAmount"
                required
                placeholder="29000"
                value={formData.depositAmount}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#FAF7F2] dark:bg-stone-800 border border-[#E2DACD] dark:border-stone-700 rounded-lg text-[#1C1917] dark:text-stone-100 focus:outline-none focus:border-[#1B3B2B]"
              />
            </div>
            <div>
              <label className="block text-[#1C1917] dark:text-stone-200 font-bold mb-1">BHK Bedrooms *</label>
              <input
                type="number"
                name="bedrooms"
                required
                min="1"
                value={formData.bedrooms}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#FAF7F2] dark:bg-stone-800 border border-[#E2DACD] dark:border-stone-700 rounded-lg text-[#1C1917] dark:text-stone-100 focus:outline-none focus:border-[#1B3B2B]"
              />
            </div>
            <div>
              <label className="block text-[#1C1917] dark:text-stone-200 font-bold mb-1">Bathrooms *</label>
              <input
                type="number"
                name="bathrooms"
                required
                min="1"
                step="1"
                value={formData.bathrooms}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#FAF7F2] dark:bg-stone-800 border border-[#E2DACD] dark:border-stone-700 rounded-lg text-[#1C1917] dark:text-stone-100 focus:outline-none focus:border-[#1B3B2B]"
              />
            </div>
            <div>
              <label className="block text-[#1C1917] dark:text-stone-200 font-bold mb-1">Area (sqft) *</label>
              <input
                type="number"
                name="areaSqFt"
                required
                placeholder="950"
                value={formData.areaSqFt}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#FAF7F2] dark:bg-stone-800 border border-[#E2DACD] dark:border-stone-700 rounded-lg text-[#1C1917] dark:text-stone-100 focus:outline-none focus:border-[#1B3B2B]"
              />
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-[#1C1917] dark:text-stone-200 font-bold mb-2">Amenities & Features</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {AVAILABLE_AMENITIES.map((amenity) => {
                const isSelected = formData.amenities.includes(amenity);
                return (
                  <button
                    type="button"
                    key={amenity}
                    onClick={() => handleAmenityToggle(amenity)}
                    className={`py-2 px-3 rounded-lg border text-left flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-[#1B3B2B]/10 dark:bg-emerald-950/40 border-[#1B3B2B] dark:border-emerald-500 text-[#1B3B2B] dark:text-emerald-300 font-bold'
                        : 'bg-[#FAF7F2] dark:bg-stone-800 border-[#E2DACD] dark:border-stone-700 text-[#605A52] dark:text-stone-300 hover:border-[#605A52]'
                    }`}
                  >
                    <span>{amenity}</span>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-[#1B3B2B] dark:bg-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Images Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[#1C1917] dark:text-stone-200 font-bold">Property Photos & Image URLs</label>
              <label className="cursor-pointer text-xs text-[#1B3B2B] dark:text-emerald-400 font-bold hover:underline flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" />
                {uploadingImage ? 'Uploading...' : 'Upload Image File'}
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>

            <div className="space-y-2">
              {formData.images.map((imgUrl, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="/src/assets/Property1.jpg or https://..."
                    value={imgUrl}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 bg-[#FAF7F2] dark:bg-stone-800 border border-[#E2DACD] dark:border-stone-700 rounded-lg text-[#1C1917] dark:text-stone-100 focus:outline-none focus:border-[#1B3B2B]"
                  />
                  {formData.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      className="p-2 text-[#991B1B] hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg border border-rose-200 dark:border-rose-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addImageField}
              className="mt-2 text-xs text-[#1B3B2B] dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Another Image URL
            </button>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#E2DACD] dark:border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg bg-[#F4F0E8] dark:bg-stone-800 hover:bg-[#EAE4D8] text-[#1C1917] dark:text-stone-200 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-lg bg-[#1B3B2B] hover:bg-[#152e22] text-white font-semibold shadow-xs transition-colors"
            >
              {isSubmitting ? 'Saving...' : initialData ? 'Update Listing' : 'Submit for Verification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyFormModal;
