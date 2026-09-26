const express = require('express');
const router = express.Router();
const {
  startAuth,
  handleCallback,
  getStatus,
  getProperties,
  selectProperty,
  searchPerformance,
  disconnect,
} = require('../controllers/googleController');

// Initiate OAuth flow → redirects to Google
router.get('/auth', startAuth);

// Google's redirect target after user approves
router.get('/callback', handleCallback);

// Connection status (is user connected?)
router.get('/status', getStatus);

// List Search Console properties for connected account
router.get('/properties', getProperties);

// Store selected property
router.post('/select-property', selectProperty);

// Fetch Search Console performance data
router.get('/search-performance', searchPerformance);

// Revoke connection
router.post('/disconnect', disconnect);

module.exports = router;
