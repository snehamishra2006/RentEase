const Property = require('../models/Property');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Get all properties (with search & filter options)
// @route   GET /api/properties
// @access  Public
exports.getProperties = async (req, res, next) => {
  try {
    const { city, type, minRent, maxRent, bedrooms, search, status } = req.query;

    let query = {};

    // For general public search, default to approved & available properties
    if (req.query.all !== 'true') {
      query.verificationStatus = 'approved';
      query.status = status || 'available';
    }

    if (city) {
      query['address.city'] = { $regex: city, $options: 'i' };
    }

    if (type && type !== 'all') {
      query.type = type;
    }

    if (minRent || maxRent) {
      query.rentAmount = {};
      if (minRent) query.rentAmount.$gte = Number(minRent);
      if (maxRent) query.rentAmount.$lte = Number(maxRent);
    }

    if (bedrooms && bedrooms !== 'all') {
      query.bedrooms = { $gte: Number(bedrooms) };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'address.city': { $regex: search, $options: 'i' } },
        { 'address.street': { $regex: search, $options: 'i' } },
      ];
    }

    const properties = await Property.find(query)
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

// @desc    Get single property by ID
// @route   GET /api/properties/:id
// @access  Public
exports.getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner', 'name email phone avatar');

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    res.status(200).json({
      success: true,
      property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new property listing (Owner)
// @route   POST /api/properties
// @access  Private (Owner only)
exports.createProperty = async (req, res, next) => {
  try {
    const {
      title,
      description,
      type,
      street,
      city,
      state,
      zipcode,
      rentAmount,
      depositAmount,
      bedrooms,
      bathrooms,
      areaSqFt,
      amenities,
      images,
    } = req.body;

    const property = await Property.create({
      title,
      description,
      type,
      address: { street, city, state, zipcode },
      rentAmount: Number(rentAmount),
      depositAmount: Number(depositAmount),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      areaSqFt: Number(areaSqFt),
      amenities: Array.isArray(amenities) ? amenities : amenities ? [amenities] : [],
      images: Array.isArray(images) && images.length > 0 ? images : [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
      ],
      owner: req.user._id,
      verificationStatus: 'pending',
      status: 'available',
    });

    // Notify admins about new property pending verification
    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      await Notification.create({
        recipient: admin._id,
        sender: req.user._id,
        title: 'New Property Pending Verification',
        message: `Owner ${req.user.name} submitted "${property.title}" for verification.`,
        type: 'verification',
        link: '/admin/verification',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Property submitted successfully! Pending Admin verification.',
      property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update property (Owner)
// @route   PUT /api/properties/:id
// @access  Private (Owner/Admin)
exports.updateProperty = async (req, res, next) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Ownership check
    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this property' });
    }

    const {
      title,
      description,
      type,
      street,
      city,
      state,
      zipcode,
      rentAmount,
      depositAmount,
      bedrooms,
      bathrooms,
      areaSqFt,
      amenities,
      images,
      status,
    } = req.body;

    const updatedData = {
      ...(title && { title }),
      ...(description && { description }),
      ...(type && { type }),
      ...(rentAmount && { rentAmount: Number(rentAmount) }),
      ...(depositAmount && { depositAmount: Number(depositAmount) }),
      ...(bedrooms && { bedrooms: Number(bedrooms) }),
      ...(bathrooms && { bathrooms: Number(bathrooms) }),
      ...(areaSqFt && { areaSqFt: Number(areaSqFt) }),
      ...(amenities && { amenities }),
      ...(images && { images }),
      ...(status && { status }),
    };

    if (street || city || state || zipcode) {
      updatedData.address = {
        street: street || property.address.street,
        city: city || property.address.city,
        state: state || property.address.state,
        zipcode: zipcode || property.address.zipcode,
      };
    }

    property = await Property.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete property listing
// @route   DELETE /api/properties/:id
// @access  Private (Owner/Admin)
exports.deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Ownership check
    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this property' });
    }

    await property.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get properties owned by logged in user
// @route   GET /api/properties/owner/my-properties
// @access  Private (Owner)
exports.getOwnerProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ owner: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload property images via multer
// @route   POST /api/properties/upload
// @access  Private (Owner/Admin)
exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(200).json({
      success: true,
      url: fileUrl,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get verified owners/landlords from MongoDB
// @route   GET /api/properties/owners/verified
// @access  Public
exports.getVerifiedOwners = async (req, res, next) => {
  try {
    const owners = await User.find({ role: 'owner' }).select('name email phone avatar createdAt');

    const ownersWithListings = await Promise.all(
      owners.map(async (owner, idx) => {
        const properties = await Property.find({ owner: owner._id, verificationStatus: 'approved' });
        const localities = Array.from(new Set(properties.map((p) => p.address?.city || p.address?.street))).slice(0, 3);
        const nameParts = owner.name.split(' ');
        const initials = nameParts.length >= 2 ? `${nameParts[0][0]}${nameParts[1][0]}` : nameParts[0].substring(0, 2).toUpperCase();
        const bgColors = ['bg-[#B8860B]', 'bg-[#1C1917]', 'bg-[#8C3A1D]', 'bg-[#1B3B2B]'];

        return {
          _id: owner._id,
          name: owner.name,
          email: owner.email,
          phone: owner.phone || '+91 98114 56789',
          avatar: owner.avatar,
          initials,
          bg: bgColors[idx % bgColors.length],
          totalListings: `${properties.length} Total listings`,
          localities: localities.length > 0 ? localities : ['Ghaziabad', 'Noida', 'Gurgaon'],
          experience: `${6 + (idx * 2)} Yrs Experience`,
        };
      })
    );

    res.status(200).json({ success: true, count: ownersWithListings.length, owners: ownersWithListings });
  } catch (error) {
    next(error);
  }
};

