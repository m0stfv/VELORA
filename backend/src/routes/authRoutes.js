const express = require('express');
const {
  register,
  login,
  getCurrentUser,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');
const {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  handleValidationErrors,
} = require('../middleware/validation');

const router = express.Router();

// POST /api/auth/register - Register a new user
router.post('/register', validateRegister, handleValidationErrors, register);

// POST /api/auth/login - Login user
router.post('/login', validateLogin, handleValidationErrors, login);

// GET /api/auth/me - Get current logged-in user
router.get('/me', authenticate, getCurrentUser);

// Address routes
router.get('/addresses', authenticate, getAddresses);
router.post('/addresses', authenticate, addAddress);
router.put('/addresses/:id', authenticate, updateAddress);
router.delete('/addresses/:id', authenticate, deleteAddress);
router.patch('/addresses/:id/default', authenticate, setDefaultAddress);

// POST /api/auth/forgot-password - Request a password reset email
router.post('/forgot-password', validateForgotPassword, handleValidationErrors, forgotPassword);

// POST /api/auth/reset-password - Reset password using token from email
router.post('/reset-password', validateResetPassword, handleValidationErrors, resetPassword);

module.exports = router;
