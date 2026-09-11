const RentPayment = require('../models/RentPayment');
const Rental = require('../models/Rental');
const Notification = require('../models/Notification');

// @desc    Get rent payments for tenant or owner
// @route   GET /api/rent-payments
// @access  Private
exports.getRentPayments = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'tenant') {
      query.tenant = req.user._id;
    } else if (req.user.role === 'owner') {
      query.owner = req.user._id;
    }

    if (req.query.rentalId) {
      query.rental = req.query.rentalId;
    }

    const payments = await RentPayment.find(query)
      .populate('property', 'title address images')
      .populate('tenant', 'name email phone')
      .populate('owner', 'name email phone')
      .sort({ dueDate: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Tenant pays rent for a payment due record
// @route   POST /api/rent-payments/:id/pay
// @access  Private (Tenant)
exports.payRent = async (req, res, next) => {
  try {
    const { paymentMethod, transactionId, notes } = req.body;

    const payment = await RentPayment.findById(req.params.id).populate('property');
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Rent payment record not found' });
    }

    if (payment.tenant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to pay this rent' });
    }

    payment.status = 'paid';
    payment.paidDate = new Date();
    payment.paymentMethod = paymentMethod || 'Online Transfer';
    payment.transactionId = transactionId || `TXN-${Date.now()}`;
    payment.notes = notes || payment.notes;

    await payment.save();

    // Notify Owner
    await Notification.create({
      recipient: payment.owner,
      sender: req.user._id,
      title: 'Rent Payment Received 💳',
      message: `${req.user.name} paid $${payment.amount} for property "${payment.property.title}".`,
      type: 'rent',
      link: '/owner/rentals',
    });

    res.status(200).json({
      success: true,
      message: 'Rent payment recorded successfully!',
      payment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate next month's due payment (Owner/System)
// @route   POST /api/rent-payments/generate-due
// @access  Private (Owner/Admin)
exports.generateDuePayment = async (req, res, next) => {
  try {
    const { rentalId, dueDate, notes } = req.body;

    const rental = await Rental.findById(rentalId);
    if (!rental) {
      return res.status(404).json({ success: false, message: 'Rental agreement not found' });
    }

    const payment = await RentPayment.create({
      rental: rental._id,
      property: rental.property,
      tenant: rental.tenant,
      owner: rental.owner,
      amount: rental.rentAmount,
      dueDate: dueDate ? new Date(dueDate) : new Date(),
      status: 'due',
      notes: notes || 'Monthly rent charge',
    });

    // Notify Tenant
    await Notification.create({
      recipient: rental.tenant,
      sender: req.user._id,
      title: 'Rent Payment Due',
      message: `Rent payment of $${rental.rentAmount} is due on ${new Date(payment.dueDate).toLocaleDateString()}.`,
      type: 'rent',
      link: '/tenant/rental',
    });

    res.status(201).json({
      success: true,
      payment,
    });
  } catch (error) {
    next(error);
  }
};
