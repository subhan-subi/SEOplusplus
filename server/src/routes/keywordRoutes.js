'use strict';

const express = require('express');
const router = express.Router();
const { getKeywordIdeas } = require('../controllers/keywordController');
const { keywordLimiter } = require('../middleware/rateLimiter');

// Rate-limited keyword idea generation endpoint: POST /api/keywords/find
router.post('/find', keywordLimiter, getKeywordIdeas);

module.exports = router;
