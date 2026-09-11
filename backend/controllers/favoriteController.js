const Favorite = require('../models/Favorite');

// @desc    Get logged in tenant's favorites
// @route   GET /api/favorites
// @access  Private (Tenant)
exports.getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ tenant: req.user._id })
      .populate({
        path: 'property',
        populate: { path: 'owner', select: 'name email phone avatar' },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: favorites.length,
      favorites: favorites.map((fav) => fav.property).filter(Boolean),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle property favorite
// @route   POST /api/favorites/:propertyId
// @access  Private (Tenant)
exports.toggleFavorite = async (req, res, next) => {
  try {
    const propertyId = req.params.propertyId;
    const existing = await Favorite.findOne({ tenant: req.user._id, property: propertyId });

    if (existing) {
      await existing.deleteOne();
      return res.status(200).json({
        success: true,
        isFavorite: false,
        message: 'Removed from favorites',
      });
    } else {
      await Favorite.create({ tenant: req.user._id, property: propertyId });
      return res.status(201).json({
        success: true,
        isFavorite: true,
        message: 'Added to favorites',
      });
    }
  } catch (error) {
    next(error);
  }
};
