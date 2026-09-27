'use strict';

const mongoose = require('mongoose');

/**
 * Stores Google OAuth session data per browser session.
 * sessionId maps to the gsc_session cookie value.
 * Tokens are stored server-side only — never exposed to the frontend.
 */
const googleOAuthSessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    // Google OAuth token bundle — access_token, refresh_token, expiry_date, etc.
    // Stored as a plain object; never serialized to the frontend.
    tokens: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    selectedSite: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // adds createdAt + updatedAt automatically
  }
);

// TTL index: auto-delete sessions after 30 days of no update
googleOAuthSessionSchema.index(
  { updatedAt: 1 },
  { expireAfterSeconds: 30 * 24 * 60 * 60 }
);

const GoogleOAuthSession = mongoose.model(
  'GoogleOAuthSession',
  googleOAuthSessionSchema
);

module.exports = GoogleOAuthSession;
