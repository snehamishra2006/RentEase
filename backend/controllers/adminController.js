const User = require('../models/User');
const Property = require('../models/Property');
const Application = require('../models/Application');
const Rental = require('../models/Rental');
const RentPayment = require('../models/RentPayment');
const MaintenanceRequest = require('../models/MaintenanceRequest');
const Notification = require('../models/Notification');

// @desc    Get Platform Summary & Analytics for Admin Dashboard
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getPlatformStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTenants = await User.countDocuments({ role: 'tenant' });
    const totalOwners = await User.countDocuments({ role: 'owner' });

    const totalProperties = await Property.countDocuments();
    const pendingProperties = await Property.countDocuments({ verificationStatus: 'pending' });
    const verifiedProperties = await Property.countDocuments({ verificationStatus: 'approved' });
    const activeRentals = await Rental.countDocuments({ status: 'active' });

    const totalApplications = await Application.countDocuments();
    const pendingApplications = await Application.countDocuments({ status: 'pending' });

    const totalPayments = await RentPayment.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, totalAmount: { $sum: '$amount' } } },
    ]);

    const revenue = totalPayments.length > 0 ? totalPayments[0].totalAmount : 0;

    const maintenanceOpen = await MaintenanceRequest.countDocuments({ status: { $ne: 'resolved' } });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalTenants,
        totalOwners,
        totalProperties,
        pendingProperties,
        verifiedProperties,
        activeRentals,
        totalApplications,
        pendingApplications,
        revenue,
        maintenanceOpen,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pending properties for verification
// @route   GET /api/admin/properties/pending
// @access  Private (Admin)
exports.getPendingProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ verificationStatus: 'pending' })
      .populate('owner', 'name email phone avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or Reject Property verification
// @route   PUT /api/admin/properties/:id/verify
// @access  Private (Admin)
exports.verifyProperty = async (req, res, next) => {
  try {
    const { status, reason } = req.body; // 'approved' | 'rejected'

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid verification status' });
    }

    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    property.verificationStatus = status;
    property.verifiedBy = req.user._id;

    if (status === 'approved') {
      property.status = 'available';
    }

    await property.save();

    // Notify Owner
    const isApprove = status === 'approved';
    await Notification.create({
      recipient: property.owner,
      sender: req.user._id,
      title: isApprove ? 'Property Verified! 🏠' : 'Property Verification Declined',
      message: isApprove
        ? `Your property "${property.title}" has been verified and is now live for public search!`
        : `Your property listing "${property.title}" was rejected by Admin. ${reason ? 'Reason: ' + reason : ''}`,
      type: 'verification',
      link: isApprove ? '/owner/my-properties' : '/owner/my-properties',
    });

    res.status(200).json({
      success: true,
      message: `Property ${status} successfully!`,
      property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (Admin User Management)
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    let query = {};
    if (role && role !== 'all') {
      query.role = role;
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user active/verification status
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin)
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isVerified = !user.isVerified;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User status updated to ${user.isVerified ? 'Active' : 'Suspended'}`,
      user,
    });
  } catch (error) {
    next(error);
  }
};
