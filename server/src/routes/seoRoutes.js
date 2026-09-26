const express = require('express');
const router = express.Router();
const { analyzeUrl, healthCheck } = require('../controllers/seoController');
const { analyzeLimiter } = require('../middleware/rateLimiter');

// Rate-limited analyze endpoint
router.post('/analyze', analyzeLimiter, analyzeUrl);

// Health check endpoint
router.get('/health', healthCheck);

module.exports = router;
