/**
 * Health Routes
 * Routes for health check endpoints
 */

const express = require('express');
const { getHealth } = require('../controllers/healthController');

const router = express.Router();

// GET /api/health - Health check endpoint
router.get('/health', getHealth);

module.exports = router;
