const express = require('express');
const { getSettings, updateSettings } = require('../controllers/settingsController');
const authenticate = require('../middleware/authenticate');
const authorizeAdmin = require('../middleware/authorizeAdmin');

const router = express.Router();
router.get('/', getSettings);
router.put('/', authenticate, authorizeAdmin, updateSettings);
module.exports = router;
