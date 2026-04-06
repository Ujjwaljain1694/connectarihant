const errorHandler = (err, req, res, next) => {
  // Log full error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', err);
  }

  // Custom thrown errors with status codes
  if (err.status) {
    return res.status(err.status).json({
      success: false,
      message: err.message || 'An error occurred.',
      ...(err.remainingSeconds && { remainingSeconds: err.remainingSeconds }),
    });
  }

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    return res.status(422).json({
      success: false,
      message: 'Database validation error.',
      errors: err.errors.map((e) => ({ field: e.path, message: e.message })),
    });
  }

  // Sequelize unique constraint
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      success: false,
      message: 'Duplicate entry. A record with this value already exists.',
    });
  }

  // JWT errors (shouldn't reach here but just in case)
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
    });
  }

  // Fallback: internal server error
  return res.status(500).json({
    success: false,
    message: 'Internal server error. Please try again later.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
