const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
  {
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

favoriteSchema.index({ tenant: 1, property: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
