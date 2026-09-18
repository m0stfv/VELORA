const express = require('express');
const {
  createOrder,
  getUserOrders,
  getOrder,
  updateOrderStatus,
  getAllOrders,
} = require('../controllers/orderController');
const authenticate = require('../middleware/authenticate');
const authorizeAdmin = require('../middleware/authorizeAdmin');

const router = express.Router();

// POST /api/orders - Create order
router.post('/', authenticate, createOrder);

// GET /api/orders/my-orders - Get user's orders
router.get('/my-orders', authenticate, getUserOrders);

// GET /api/orders/:id - Get single order
router.get('/:id', authenticate, getOrder);

// PUT /api/orders/:id/status - Update order status (Admin only)
router.put('/:id/status', authenticate, authorizeAdmin, updateOrderStatus);

// GET /api/admin/orders - Get all orders (Admin only)
router.get('/admin/all', authenticate, authorizeAdmin, getAllOrders);

module.exports = router;
