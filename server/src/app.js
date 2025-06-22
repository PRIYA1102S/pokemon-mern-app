require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
// const swaggerUi = require('swagger-ui-express');
const connectDB = require('./config/db');
const pokemonRoutes = require('./routes/pokemonRoutes');
const logger = require('./config/logger');
const { validateEnvironment } = require('./config/environment');
// const swaggerSpecs = require('./config/swagger');
const {
    helmetConfig,
    apiLimiter,
    searchLimiter,
    mongoSanitizeConfig,
    hppConfig,
    compressionConfig,
    getCorsOptions
} = require('./middleware/security');

// Validate environment variables
validateEnvironment();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Trust proxy for accurate IP addresses behind reverse proxy
app.set('trust proxy', 1);

// Compression middleware (should be early in the stack)
app.use(compressionConfig);

// Security middleware
app.use(helmetConfig);

// MongoDB injection prevention
app.use(mongoSanitizeConfig);

// HTTP Parameter Pollution prevention
app.use(hppConfig);

// CORS configuration
app.use(cors(getCorsOptions()));

// Rate limiting
app.use('/api/', apiLimiter);
app.use('/api/pokemon/search/', searchLimiter);
app.use('/api/pokemon/suggestions/', searchLimiter);

// HTTP request logging
app.use(morgan('combined', { stream: logger.stream }));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection
connectDB();

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: NODE_ENV,
    });
});

// API Documentation (disabled for now)
// if (NODE_ENV !== 'production') {
//     app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
//         explorer: true,
//         customCss: '.swagger-ui .topbar { display: none }',
//         customSiteTitle: 'Pokemon API Documentation'
//     }));
//
//     // Redirect /docs to /api-docs for convenience
//     app.get('/docs', (req, res) => {
//         res.redirect('/api-docs');
//     });
// }

// API routes
app.use('/api/pokemon', pokemonRoutes);

// Serve static files from React build in production
if (NODE_ENV === 'production') {
    const path = require('path');

    // Serve static files from the React app build directory
    app.use(express.static(path.join(__dirname, '../../client/build')));

    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
    });
} else {
    // 404 handler for development
    app.use('*', (req, res) => {
        logger.warn(`404 - Route not found: ${req.method} ${req.originalUrl}`);
        res.status(404).json({
            error: 'Route not found',
            message: `Cannot ${req.method} ${req.originalUrl}`,
        });
    });
}

// Global error handler
app.use((error, req, res, next) => {
    logger.error(`Global error handler: ${error.message}`, {
        error: error.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
    });

    res.status(error.status || 500).json({
        error: NODE_ENV === 'production' ? 'Internal Server Error' : error.message,
        ...(NODE_ENV !== 'production' && { stack: error.stack }),
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('SIGINT received. Shutting down gracefully...');
    process.exit(0);
});

// Start server
const server = app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT} in ${NODE_ENV} mode`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Promise Rejection:', err);
    server.close(() => {
        process.exit(1);
    });
});

module.exports = app;
