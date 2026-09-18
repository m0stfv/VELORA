const express = require('express');
const authenticate = require('../middleware/authenticate');
const authorizeAdmin = require('../middleware/authorizeAdmin');
const upload = require('../middleware/upload');
const { uploadImages } = require('../controllers/uploadController');

const router = express.Router();

// POST /api/upload - Upload up to 6 product images (Admin only)
router.post('/', authenticate, authorizeAdmin, upload.array('images', 6), uploadImages);

module.exports = router;
