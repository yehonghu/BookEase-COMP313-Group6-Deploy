/**
 * @module app
 * @description Express application configuration.
 * Sets up middleware, routes, and error handling.
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { errorHandler } = require('./middleware/error.middleware');

// Import routes
const authRoutes = require('./routes/auth.routes');
const servicesRoutes = require('./routes/services.routes');
const availabilityRoutes = require('./routes/availability.routes');
const bookingsRoutes = require('./routes/bookings.routes');
const adminRoutes = require('./routes/admin.routes');
const reviewRoutes = require('./routes/reviews.routes');
const contactRoutes = require('./routes/contact.routes');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? (process.env.FRONTEND_URL || true)
    : true,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'BookEase API is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/offers', require('./routes/offers.routes'));
app.use('/api/contact', contactRoutes);
app.use('/api/reviews', reviewRoutes);

// Serve uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Serve frontend static files in production
// Try multiple possible paths for the frontend dist directory
const fs = require('fs');
const possiblePaths = [
  path.join(__dirname, '../../frontend/dist'),
  path.resolve(process.cwd(), '../frontend/dist'),
  path.resolve(process.cwd(), 'frontend/dist'),
  path.resolve(__dirname, '../../../frontend/dist'),
];

let frontendDist = possiblePaths[0]; // default
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    frontendDist = p;
    console.log(`Frontend dist found at: ${p}`);
    break;
  }
}
console.log(`Using frontend dist path: ${frontendDist}`);
console.log(`Frontend dist exists: ${fs.existsSync(frontendDist)}`);
console.log(`__dirname: ${__dirname}`);
console.log(`process.cwd(): ${process.cwd()}`);

app.use(express.static(frontendDist));

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  const indexPath = path.join(frontendDist, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send(`Not Found - frontendDist: ${frontendDist}, indexPath: ${indexPath}, exists: ${fs.existsSync(frontendDist)}, cwd: ${process.cwd()}, dirname: ${__dirname}`);
  }
});

// Global error handler
app.use(errorHandler);

module.exports = app;
