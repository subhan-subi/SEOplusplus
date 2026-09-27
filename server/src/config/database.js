'use strict';

const mongoose = require('mongoose');

/**
 * Connects to MongoDB Atlas using the MONGODB_URI environment variable.
 * Safe for both local dev and Vercel serverless cold starts.
 */
async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      '[DB] MONGODB_URI is not defined. ' +
      'Add it to your .env file (local) or Vercel environment variables (production).'
    );
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    const { host } = mongoose.connection;
    console.log(`[DB] MongoDB connected: ${host}`);
    return mongoose.connection;
  } catch (err) {
    console.error('[DB] MongoDB connection failed:', err.message);
    throw err;
  }
}

module.exports = { connectDB };
