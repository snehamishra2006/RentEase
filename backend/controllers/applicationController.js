const Application = require('../models/Application');
const Property = require('../models/Property');
const Rental = require('../models/Rental');
const RentPayment = require('../models/RentPayment');
const Notification = require('../models/Notification');

// @desc    Submit a rental application (Tenant)
// @route   POST /api/applications
// @access  Private (Tenant)
exports.applyForProperty = async (req, res, next) => {
  try {
    const { propertyId, moveInDate, leaseTermMonths, occupants, monthlyIncome, notes } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    if (property.status !== 'available' || property.verificationStatus !== 'approved') {
      return res.status(400).json({ success: false, message: 'Property is not available for applications' });
    }

    // Check if tenant already applied for this property
    const existingApp = await Application.findOne({
      property: propertyId,
      tenant: req.user._id,
      status: { $in: ['pending', 'approved'] },
    });

    if (existingApp) {
      return res
        .status(400)
        .json({ success: false, message: 'You already have an active/pending application for this property' });
    }

    const application = await Application.create({
      property: propertyId,
      tenant: req.user._id,
      owner: property.owner,
      moveInDate: new Date(moveInDate),
      leaseTermMonths: Number(leaseTermMonths) || 12,
      occupants: Number(occupants),
      monthlyIncome: Number(monthlyIncome),
      notes: notes || '',
      status: 'pending',
    });

    // Notify Owner
    await Notification.create({
      recipient: property.owner,
      sender: req.user._id,
      title: 'New Rental Application',
      message: `${req.user.name} applied for your property "${property.title}".`,
      type: 'application',
      link: '/owner/applications',
    });

    res.status(201).json({
      success: true,
      message: 'Rental application submitted successfully!',
      application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get tenant's submitted applications
// @route   GET /api/applications/tenant
// @access  Private (Tenant)
exports.getTenantApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ tenant: req.user._id })
      .populate('property')
      .populate('owner', 'name email phone avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get applications for owner's properties
// @route   GET /api/applications/owner
// @access  Private (Owner)
exports.getOwnerApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ owner: req.user._id })
      .populate('property')
      .populate('tenant', 'name email phone avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Owner approves or rejects rental application
// @route   PUT /api/applications/:id/status
// @access  Private (Owner)
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body; // 'approved' | 'rejected'
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid application status provided' });
    }

    const application = await Application.findById(req.params.id)
      .populate('property')
      .populate('tenant', 'name email');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Check ownership
    if (application.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to manage this application' });
    }

    if (application.status !== 'pending') {
      return res
        .status(400)
        .json({ success: false, message: `Application is already ${application.status}` });
    }

    application.status = status;
    await application.save();

    if (status === 'approved') {
      const property = await Property.findById(application.property._id);
      
      // Calculate lease dates
      const startDate = application.moveInDate || new Date();
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + (application.leaseTermMonths || 12));

      // 1. Create active Rental agreement
      const rental = await Rental.create({
        property: property._id,
        tenant: application.tenant._id,
        owner: req.user._id,
        application: application._id,
        rentAmount: property.rentAmount,
        depositAmount: property.depositAmount,
        startDate,
        endDate,
        paymentDueDay: 1,
        status: 'active',
      });

      // 2. Update Property status to 'rented'
      property.status = 'rented';
      await property.save();

      // 3. Create initial RentPayment due record
      const dueDate = new Date();
      dueDate.setDate(1); // 1st of current month
      if (dueDate < new Date()) {
        dueDate.setMonth(dueDate.getMonth() + 1); // Next month 1st
      }

      await RentPayment.create({
        rental: rental._id,
        property: property._id,
        tenant: application.tenant._id,
        owner: req.user._id,
        amount: property.rentAmount,
        dueDate: dueDate,
        status: 'due',
        notes: 'Initial monthly rent due',
      });

      // 4. Reject other pending applications for this property
      await Application.updateMany(
        { property: property._id, _id: { $ne: application._id }, status: 'pending' },
        { status: 'rejected', notes: 'Property rented to another tenant' }
      );

      // 5. Notify Tenant of Approval & Active Lease
      await Notification.create({
        recipient: application.tenant._id,
        sender: req.user._id,
        title: 'Application Approved! 🎉',
        message: `Congratulations! Your rental application for "${property.title}" has been approved. Your active lease has begun.`,
        type: 'application',
        link: '/tenant/rental',
      });
    } else {
      // Notify Tenant of Rejection
      await Notification.create({
        recipient: application.tenant._id,
        sender: req.user._id,
        title: 'Application Update',
        message: `Your rental application for "${application.property.title}" was not accepted.`,
        type: 'application',
        link: '/tenant/applications',
      });
    }

    res.status(200).json({
      success: true,
      message: `Application ${status} successfully!`,
      application,
    });
  } catch (error) {
    next(error);
  }
};
