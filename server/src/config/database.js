'use strict';

const dns = require('dns');
const mongoose = require('mongoose');

// Configure reliable public DNS servers (Google DNS) for Node.js SRV resolution
// Resolves querySrv ECONNREFUSED on local Windows environments when connecting to MongoDB Atlas mongodb+srv://
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (dnsErr) {
  console.warn('[DB] Custom DNS resolver setup warning:', dnsErr.message);
}

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
    try {
      dns.setServers(['8.8.8.8', '8.8.4.4']);
    } catch {
      // Continue if environment restricts DNS mutation
    }

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 30000,
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
