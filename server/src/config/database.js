'use strict';

const mongoose = require('mongoose');

/**
 * Connects to MongoDB Atlas using the MONGODB_URI environment variable.
 * Call once at application startup — safe for both local dev and Vercel.
 */
async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      '[DB] MONGODB_URI is not defined. ' +
      'Add it to your .env file (local) or Vercel environment variables (production).'
    );
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // fail fast if Atlas is unreachable
    });

    const { host } = mongoose.connection;
    console.log(`[DB] MongoDB connected: ${host}`);
  } catch (err) {
    console.error('[DB] MongoDB connection failed:', err.message);
    // Re-throw so the caller (server.js) can decide to exit or handle
    throw err;
  }
}

module.exports = { connectDB };
