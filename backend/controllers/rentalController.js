const Rental = require('../models/Rental');
const Property = require('../models/Property');
const Notification = require('../models/Notification');

// @desc    Get active rental for tenant
// @route   GET /api/rentals/tenant/active
// @access  Private (Tenant)
exports.getActiveTenantRental = async (req, res, next) => {
  try {
    const rental = await Rental.findOne({ tenant: req.user._id, status: 'active' })
      .populate('property')
      .populate('owner', 'name email phone avatar')
      .populate('application');

    res.status(200).json({
      success: true,
      rental: rental || null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get rentals for owner's properties
// @route   GET /api/rentals/owner
// @access  Private (Owner)
exports.getOwnerRentals = async (req, res, next) => {
  try {
    const rentals = await Rental.find({ owner: req.user._id })
      .populate('property')
      .populate('tenant', 'name email phone avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: rentals.length,
      rentals,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Terminate / End rental lease & make property available again
// @route   PUT /api/rentals/:id/terminate
// @access  Private (Owner/Admin)
exports.terminateRental = async (req, res, next) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) {
      return res.status(404).json({ success: false, message: 'Rental agreement not found' });
    }

    if (rental.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to terminate this rental' });
    }

    rental.status = 'completed';
    await rental.save();

    // Revert Property status to available
    const property = await Property.findById(rental.property);
    if (property) {
      property.status = 'available';
      await property.save();
    }

    // Send notification to tenant
    await Notification.create({
      recipient: rental.tenant,
      sender: req.user._id,
      title: 'Rental Lease Concluded',
      message: `Your rental lease for property "${property ? property.title : 'Property'}" has been closed.`,
      type: 'rent',
      link: '/tenant/rental',
    });

    res.status(200).json({
      success: true,
      message: 'Rental terminated successfully. Property is now available again.',
      rental,
    });
  } catch (error) {
    next(error);
  }
};
