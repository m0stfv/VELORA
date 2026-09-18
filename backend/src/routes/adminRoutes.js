const express = require('express');
const {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllReviews,
  deleteReviewAdmin,
} = require('../controllers/adminController');
const authenticate = require('../middleware/authenticate');
const authorizeAdmin = require('../middleware/authorizeAdmin');

const router = express.Router();

// GET /api/admin/dashboard - Get dashboard statistics
router.get('/dashboard', authenticate, authorizeAdmin, getDashboardStats);

// GET /api/admin/users - Get all users
router.get('/users', authenticate, authorizeAdmin, getAllUsers);

// PUT /api/admin/users/:id - Update user role
router.put('/users/:id', authenticate, authorizeAdmin, updateUserRole);

// DELETE /api/admin/users/:id - Delete user
router.delete('/users/:id', authenticate, authorizeAdmin, deleteUser);

// GET /api/admin/reviews - Get all reviews
router.get('/reviews', authenticate, authorizeAdmin, getAllReviews);

// DELETE /api/admin/reviews/:id - Delete review
router.delete('/reviews/:id', authenticate, authorizeAdmin, deleteReviewAdmin);

module.exports = router;
