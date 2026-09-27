// Load environment variables first
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const seoRoutes = require('./routes/seoRoutes');
const googleRoutes = require('./routes/googleRoutes');
const { errorHandler } = require('./middleware/errorHandler');
const { connectDB } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5001;

// Security & Parsing Middleware
app.disable('x-powered-by');

// Allow local + production frontend
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests without an Origin header
    // (for example, server-to-server requests)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept'],
  credentials: true,
}));

// Basic security response headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// JSON body parser with strict limit
app.use(express.json({ limit: '32kb' }));

// Cookie parser (needed for GSC session cookie)
app.use(cookieParser());

// API routes
app.use('/api', seoRoutes);

// Ensure DB connection is active before processing Google routes (critical for Vercel cold starts)
app.use('/api/google', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('[DB] Failed to connect for /api/google request:', err.message);
    next(err);
  }
});

app.use('/api/google', googleRoutes);

// 404 for unknown endpoints
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found.',
  });
});

// Centralized error handler
app.use(errorHandler);

// Vercel/serverless export
module.exports = app;

// Local development server
if (!process.env.VERCEL) {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(
          `[SEO++ Server] Backend running smoothly on http://localhost:${PORT}`
        );
      });
    })
    .catch((err) => {
      console.error('[SEO++ Server] Startup aborted — DB connection failed:', err.message);
      process.exit(1);
    });
} else {
  // Vercel: connect on cold start; subsequent invocations reuse the connection
  connectDB().catch((err) => {
    console.error('[SEO++ Server] Vercel cold-start DB connection failed:', err.message);
  });
}