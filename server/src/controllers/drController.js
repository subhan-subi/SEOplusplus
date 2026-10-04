'use strict';

const { fetchDomainRating } = require('../services/ahrefsService');

/**
 * Controller to handle POST /api/dr/check
 * Analyzes target domain and retrieves official Ahrefs Domain Rating.
 */
async function checkDomainRating(req, res, next) {
  try {
    const rawTarget = req.body?.domain || req.body?.url || req.body?.target;

    if (!rawTarget || typeof rawTarget !== 'string' || !rawTarget.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid website domain name (e.g., example.com).'
      });
    }

    const result = await fetchDomainRating(rawTarget);
    return res.json(result);
  } catch (err) {
    const statusCode = err.statusCode || err.status || 500;
    return res.status(statusCode).json({
      success: false,
      error: err.message || 'Failed to check Domain Rating. Please check the domain and try again.'
    });
  }
}

module.exports = {
  checkDomainRating
};
