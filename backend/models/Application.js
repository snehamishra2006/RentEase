const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'cancelled'],
      default: 'pending',
    },
    moveInDate: {
      type: Date,
      required: [true, 'Please specify intended move-in date'],
    },
    leaseTermMonths: {
      type: Number,
      default: 12,
    },
    occupants: {
      type: Number,
      required: [true, 'Please specify number of occupants'],
    },
    monthlyIncome: {
      type: Number,
      required: [true, 'Please state monthly income'],
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Application', applicationSchema);
