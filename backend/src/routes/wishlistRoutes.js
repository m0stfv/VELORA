const express = require('express');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require('../controllers/wishlistController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// GET /api/wishlist - Get user's wishlist
router.get('/', authenticate, getWishlist);

// POST /api/wishlist/:productId - Add product to wishlist
router.post('/:productId', authenticate, addToWishlist);

// DELETE /api/wishlist/:productId - Remove product from wishlist
router.delete('/:productId', authenticate, removeFromWishlist);

module.exports = router;
