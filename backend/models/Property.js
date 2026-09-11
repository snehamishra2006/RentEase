const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a property title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a property description'],
    },
    type: {
      type: String,
      enum: ['flat_apartment', 'independent_house', 'builder_floor', 'villa', 'pg_shared', 'apartment', 'house', 'studio', 'condo'],
      required: [true, 'Please specify property type'],
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipcode: { type: String, required: true },
    },
    rentAmount: {
      type: Number,
      required: [true, 'Please add monthly rent amount'],
    },
    depositAmount: {
      type: Number,
      required: [true, 'Please add security deposit amount'],
    },
    bedrooms: {
      type: Number,
      required: [true, 'Please add number of bedrooms'],
    },
    bathrooms: {
      type: Number,
      required: [true, 'Please add number of bathrooms'],
    },
    areaSqFt: {
      type: Number,
      required: [true, 'Please add square footage area'],
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
      ],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['available', 'rented', 'maintenance'],
      default: 'available',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Property', propertySchema);
