exports.errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal server error';

  // MongoDB duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(400).json({
      success: false,
      message: `This ${field} is already registered. Please use a different ${field}.`,
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ success: false, message: errors.join(', ') });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }

  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  res.status(status).json({ success: false, message });
};
