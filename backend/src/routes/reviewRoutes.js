const express = require('express');
const {
  getProductReviews,
  createReview,
  deleteReview,
} = require('../controllers/reviewController');
const authenticate = require('../middleware/authenticate');
const { validateReview, handleValidationErrors } = require('../middleware/validation');

const router = express.Router({ mergeParams: true });

// GET /api/products/:productId/reviews - Get all reviews for a product
router.get('/', getProductReviews);

// POST /api/products/:productId/reviews - Create review
router.post('/', authenticate, validateReview, handleValidationErrors, createReview);

// DELETE /api/reviews/:id - Delete review
router.delete('/:id', authenticate, deleteReview);

module.exports = router;
