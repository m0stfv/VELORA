/**
 * Error Handling Middleware
 * Catches and handles errors throughout the application
 * To be expanded in future phases
 */

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    message: message,
    status: status
  });
};

module.exports = errorHandler;
