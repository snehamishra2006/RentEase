const User = require('../models/User');
const { sendTokenResponse } = require('../middleware/authMiddleware');
const { DEFAULT_AVATAR } = require('../config/constants');

// Email Regex: Must follow valid user@domain.ext format
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Indian Mobile Number Regex: 10 digits starting with 6, 7, 8, or 9
const PHONE_REGEX = /^[6-9]\d{9}$/;

// Password Regex: mix of uppercase, lowercase, and at least 1 symbol (min 6 chars)
const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&^#()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;

// @desc    Register user (Tenant or Owner)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, role, phone, avatar } = req.body;

    // 1. Basic Name Check
    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, message: 'Please enter your full name.' });
    }

    // 2. Email Validation (Trim + Format)
    const sanitizedEmail = email ? String(email).trim().toLowerCase() : '';
    if (!sanitizedEmail || !EMAIL_REGEX.test(sanitizedEmail)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    // 3. Mobile Number Validation (Digits only, 10 digits, starts with 6-9)
    const sanitizedPhone = phone ? String(phone).replace(/\D/g, '') : '';
    if (!sanitizedPhone || !PHONE_REGEX.test(sanitizedPhone)) {
      return res.status(400).json({
        success: false,
        message: 'Phone number must contain exactly 10 digits and start with 6, 7, 8, or 9.',
      });
    }

    // 4. Password Validation (uppercase, lowercase, at least 1 symbol)
    if (!password || !STRONG_PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          'Password must contain a mix of uppercase and lowercase letters and at least 1 special character (e.g. @, #, !).',
      });
    }

    // 5. Confirm Password Match (if provided)
    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    // 6. Check Duplicate Email
    const existingEmail = await User.findOne({ email: sanitizedEmail });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    // 7. Check Duplicate Phone Number
    const existingPhone = await User.findOne({ phone: sanitizedPhone });
    if (existingPhone) {
      return res.status(400).json({ success: false, message: 'An account with this phone number already exists.' });
    }

    // 8. Role Assignment
    let userRole = role === 'owner' ? 'owner' : 'tenant';
    if (role === 'admin') userRole = 'admin';

    // 9. Assign Default Profile Picture if not provided
    const userAvatar = avatar && avatar.trim() !== '' ? avatar.trim() : DEFAULT_AVATAR;

    // 10. Create User
    const user = await User.create({
      name: name.trim(),
      email: sanitizedEmail,
      password,
      role: userRole,
      phone: sanitizedPhone,
      avatar: userAvatar,
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    const sanitizedEmail = String(email).trim().toLowerCase();

    // Check user & include password for verification
    const user = await User.findOne({ email: sanitizedEmail }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public / Private
exports.logout = async (req, res) => {
  res.cookie('jwt', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {};

    if (req.body.name) fieldsToUpdate.name = req.body.name.trim();

    if (req.body.phone) {
      const sanitizedPhone = String(req.body.phone).replace(/\D/g, '');
      if (!PHONE_REGEX.test(sanitizedPhone)) {
        return res.status(400).json({
          success: false,
          message: 'Phone number must contain exactly 10 digits and start with 6, 7, 8, or 9.',
        });
      }
      // Check phone duplicate if changing phone
      const phoneExists = await User.findOne({ phone: sanitizedPhone, _id: { $ne: req.user._id } });
      if (phoneExists) {
        return res.status(400).json({ success: false, message: 'An account with this phone number already exists.' });
      }
      fieldsToUpdate.phone = sanitizedPhone;
    }

    if (req.body.avatar) {
      fieldsToUpdate.avatar = req.body.avatar.trim();
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};
