import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchOwnerProperties,
  createProperty,
  updateProperty,
  deleteProperty,
} from '../../redux/slices/propertySlice';
import PropertyCard from '../../components/property/PropertyCard';
import PropertyFormModal from '../../components/owner/PropertyFormModal';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { Building2, Plus, CheckCircle2 } from 'lucide-react';

const MyPropertiesPage = () => {
  const dispatch = useDispatch();
  const { ownerProperties: properties, loading } = useSelector((state) => state.properties);

  const [showModal, setShowModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    dispatch(fetchOwnerProperties());
  }, [dispatch]);

  const handleOpenAddModal = () => {
    setSelectedProperty(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (property) => {
    setSelectedProperty(property);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property listing deed?')) {
      await dispatch(deleteProperty(id));
      setNotice('Property listing deleted successfully.');
    }
  };

  const handleSubmitProperty = async (formData) => {
    setIsSubmitting(true);
    let res;
    if (selectedProperty) {
      res = await dispatch(updateProperty({ id: selectedProperty._id, data: formData }));
    } else {
      res = await dispatch(createProperty(formData));
    }
    setIsSubmitting(false);

    if (!res.error) {
      setShowModal(false);
      setNotice(
        selectedProperty
          ? 'Property listing updated successfully.'
          : 'Property submitted! Admin will verify your listing for the public registry.'
      );
      dispatch(fetchOwnerProperties());
    } else {
      alert(res.payload || 'Failed to save property');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2DACD]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#1B3B2B] flex items-center justify-center text-white">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#1C1917]">My Property Deeds & Listings</h1>
            <p className="text-xs text-[#605A52]">Manage real estate listing deeds and status</p>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-lg bg-[#1B3B2B] hover:bg-[#152e22] text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" /> Create New Property Listing
        </button>
      </div>

      {notice && (
        <div className="p-4 rounded-lg bg-[#1B3B2B]/10 border border-[#1B3B2B] text-[#1B3B2B] text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" /> {notice}
        </div>
      )}

      {loading ? (
        <Loader text="Loading your property records..." />
      ) : properties.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No property listings created"
          description="Click Create New Property Listing to register your home on the RentEase platform."
          actionText="Add Property Deed Now"
          onAction={handleOpenAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property._id}
              property={property}
              showOwnerActions={true}
              onEdit={handleOpenEditModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <PropertyFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmitProperty}
        initialData={selectedProperty}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default MyPropertiesPage;
