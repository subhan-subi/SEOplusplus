'use strict';

const crypto = require('crypto');

/**
 * Safely compares two strings in constant time to prevent timing attacks.
 */
function safeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Validates admin key for blog content management operations.
 * Reads BLOG_ADMIN_KEY from environment variables.
 */
function requireAdminAuth(req, res, next) {
  const adminKey = process.env.BLOG_ADMIN_KEY || 'seoplusplus-admin-2026';
  
  // Extract key from x-admin-key header or Authorization: Bearer <key>
  let providedKey = req.headers['x-admin-key'];
  if (!providedKey && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
      providedKey = parts[1];
    }
  }

  if (!providedKey || !safeCompare(providedKey.trim(), adminKey.trim())) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized. A valid content management access key is required.'
    });
  }

  req.isAdmin = true;
  next();
}

module.exports = {
  requireAdminAuth,
  safeCompare
};
