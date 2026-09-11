const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'rentease_jwt_secret_key_123456789', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  const options = {
    expires: new Date(Date.now() + (Number(process.env.JWT_COOKIE_EXPIRE) || 30) * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  const userObj = user.toObject ? user.toObject() : user;
  delete userObj.password;

  res.status(statusCode).cookie('jwt', token, options).json({
    success: true,
    user: userObj,
    token, // included for API testing if needed
  });
};

const protect = async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.jwt && req.cookies.jwt !== 'none') {
    token = req.cookies.jwt;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token || token === 'none') {
    return res.status(401).json({ success: false, message: 'Not authorized, please sign in' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'rentease_jwt_secret_key_123456789');
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User account not found' });
    }
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized, session expired or token invalid' });
  }
};

module.exports = { protect, sendTokenResponse };
