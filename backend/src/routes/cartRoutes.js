const express = require('express');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require('../controllers/cartController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// GET /api/cart - Get user's cart
router.get('/', authenticate, getCart);

// POST /api/cart - Add product to cart
router.post('/', authenticate, addToCart);

// PUT /api/cart/:productId - Update cart item quantity
router.put('/:productId', authenticate, updateCartItem);

// DELETE /api/cart/:productId - Remove product from cart
router.delete('/:productId', authenticate, removeFromCart);

// DELETE /api/cart - Clear cart
router.delete('/', authenticate, clearCart);

module.exports = router;
