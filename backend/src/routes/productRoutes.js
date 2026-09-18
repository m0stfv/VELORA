const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const authenticate = require('../middleware/authenticate');
const authorizeAdmin = require('../middleware/authorizeAdmin');
const { validateProduct, handleValidationErrors } = require('../middleware/validation');
const reviewRoutes = require('./reviewRoutes');

const router = express.Router();

// Mount review routes
router.use('/:productId/reviews', reviewRoutes);

// GET /api/products - Get all products with filters and sorting
router.get('/', getProducts);

// GET /api/products/:id - Get single product
router.get('/:id', getProduct);

// POST /api/products - Create product (Admin only)
router.post('/', authenticate, authorizeAdmin, validateProduct, handleValidationErrors, createProduct);

// PUT /api/products/:id - Update product (Admin only)
router.put('/:id', authenticate, authorizeAdmin, validateProduct, handleValidationErrors, updateProduct);

// DELETE /api/products/:id - Delete product (Admin only)
router.delete('/:id', authenticate, authorizeAdmin, deleteProduct);

module.exports = router;
