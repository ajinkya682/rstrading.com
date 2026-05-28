const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authorization token required' });
  }

  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

exports.requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};

exports.requireActive = async (req, res, next) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.userId);
    if (!user || !user.isActive) {
      return res.status(403).json({ success: false, message: 'Account not activated. Please use an E-Pin to activate.' });
    }
    next();
  } catch (err) {
    next(err);
  }
};
