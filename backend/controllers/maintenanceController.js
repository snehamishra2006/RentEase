const MaintenanceRequest = require('../models/MaintenanceRequest');
const Rental = require('../models/Rental');
const Notification = require('../models/Notification');

// @desc    Submit a maintenance request (Tenant)
// @route   POST /api/maintenance
// @access  Private (Tenant)
exports.createMaintenanceRequest = async (req, res, next) => {
  try {
    const { title, description, category, priority, images } = req.body;

    const activeRental = await Rental.findOne({ tenant: req.user._id, status: 'active' }).populate('property');
    if (!activeRental) {
      return res.status(400).json({ success: false, message: 'You must have an active rental to submit maintenance requests' });
    }

    const request = await MaintenanceRequest.create({
      rental: activeRental._id,
      property: activeRental.property._id,
      tenant: req.user._id,
      owner: activeRental.owner,
      title,
      description,
      category: category || 'other',
      priority: priority || 'medium',
      images: images || [],
      status: 'submitted',
    });

    // Notify Owner
    await Notification.create({
      recipient: activeRental.owner,
      sender: req.user._id,
      title: 'New Maintenance Ticket 🔧',
      message: `Tenant ${req.user.name} reported: "${title}" (${priority} priority).`,
      type: 'maintenance',
      link: '/owner/maintenance',
    });

    res.status(201).json({
      success: true,
      message: 'Maintenance request submitted successfully!',
      request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get tenant's maintenance requests
// @route   GET /api/maintenance/tenant
// @access  Private (Tenant)
exports.getTenantMaintenanceRequests = async (req, res, next) => {
  try {
    const requests = await MaintenanceRequest.find({ tenant: req.user._id })
      .populate('property', 'title address images')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get maintenance requests for owner's properties
// @route   GET /api/maintenance/owner
// @access  Private (Owner)
exports.getOwnerMaintenanceRequests = async (req, res, next) => {
  try {
    const requests = await MaintenanceRequest.find({ owner: req.user._id })
      .populate('property', 'title address images')
      .populate('tenant', 'name email phone avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update maintenance ticket status & resolution notes
// @route   PUT /api/maintenance/:id/status
// @access  Private (Owner/Admin)
exports.updateMaintenanceStatus = async (req, res, next) => {
  try {
    const { status, resolutionNotes } = req.body;

    const request = await MaintenanceRequest.findById(req.params.id).populate('property');
    if (!request) {
      return res.status(404).json({ success: false, message: 'Maintenance ticket not found' });
    }

    if (request.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this ticket' });
    }

    if (status) request.status = status;
    if (resolutionNotes !== undefined) request.resolutionNotes = resolutionNotes;

    await request.save();

    // Notify Tenant
    await Notification.create({
      recipient: request.tenant,
      sender: req.user._id,
      title: `Maintenance Ticket Updated (${status.replace('_', ' ')})`,
      message: `Owner updated your maintenance request "${request.title}" to ${status.replace('_', ' ')}.`,
      type: 'maintenance',
      link: '/tenant/maintenance',
    });

    res.status(200).json({
      success: true,
      message: 'Maintenance ticket updated successfully',
      request,
    });
  } catch (error) {
    next(error);
  }
};
