'use strict';

const express = require('express');
const router = express.Router();
const { checkDomainRating } = require('../controllers/drController');
const { drLimiter } = require('../middleware/rateLimiter');

// Rate-limited domain rating check endpoint: POST /api/dr/check
router.post('/check', drLimiter, checkDomainRating);

module.exports = router;
