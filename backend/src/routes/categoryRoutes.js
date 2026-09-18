const express = require('express');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const authenticate = require('../middleware/authenticate');
const authorizeAdmin = require('../middleware/authorizeAdmin');
const { validateCategory, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// GET /api/categories - Get all categories
router.get('/', getCategories);

// GET /api/categories/:id - Get single category
router.get('/:id', getCategory);

// POST /api/categories - Create category (Admin only)
router.post('/', authenticate, authorizeAdmin, validateCategory, handleValidationErrors, createCategory);

// PUT /api/categories/:id - Update category (Admin only)
router.put('/:id', authenticate, authorizeAdmin, validateCategory, handleValidationErrors, updateCategory);

// DELETE /api/categories/:id - Delete category (Admin only)
router.delete('/:id', authenticate, authorizeAdmin, deleteCategory);

module.exports = router;
