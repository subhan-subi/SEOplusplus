// Load environment variables first
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const seoRoutes = require('./routes/seoRoutes');
const googleRoutes = require('./routes/googleRoutes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5001;

// Security & Parsing Middleware
app.disable('x-powered-by');

// Restrict CORS in dev/prod
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept'],
  credentials: true, // Required for cookie-based session
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
app.use('/api/google', googleRoutes);

// 404 for unknown endpoints
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found.' });
});

// Centralized error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`[SEOly Server] Backend running smoothly on http://localhost:${PORT}`);
});
