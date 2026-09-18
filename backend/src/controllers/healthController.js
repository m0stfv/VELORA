/**
 * Health Controller
 * Handles health check requests to verify the API is running
 */

const getHealth = (req, res) => {
  res.json({
    success: true,
    message: 'VELORA API is running'
  });
};

module.exports = {
  getHealth
};
