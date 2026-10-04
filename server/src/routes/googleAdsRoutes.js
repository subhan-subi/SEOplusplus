'use strict';

const express = require('express');
const router = express.Router();
const { initiateAuth, handleCallback, getStatus } = require('../controllers/googleAdsController');

// Google Ads OAuth flow routes
router.get('/auth', initiateAuth);
router.get('/callback', handleCallback);
router.get('/status', getStatus);

module.exports = router;
