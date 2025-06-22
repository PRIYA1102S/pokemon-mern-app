const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const compression = require('compression');
const logger = require('../config/logger');

// Rate limiting configuration
const createRateLimiter = (windowMs, max, message) => {
    return rateLimit({
        windowMs,
        max,
        message: {
            success: false,
            error: 'Too many requests',
            message,
            retryAfter: Math.ceil(windowMs / 1000)
        },
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req, res) => {
            logger.warn(`Rate limit exceeded for IP: ${req.ip}`, {
                ip: req.ip,
                userAgent: req.get('User-Agent'),
                url: req.originalUrl
            });
            
            res.status(429).json({
                success: false,
                error: 'Too many requests',
                message,
                retryAfter: Math.ceil(windowMs / 1000)
            });
        }
    });
};

// General API rate limiter
const apiLimiter = createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    process.env.NODE_ENV === 'production' ? 100 : 1000,
    'Too many API requests from this IP, please try again later.'
);

// Strict rate limiter for search endpoints
const searchLimiter = createRateLimiter(
    1 * 60 * 1000, // 1 minute
    process.env.NODE_ENV === 'production' ? 20 : 100,
    'Too many search requests from this IP, please try again later.'
);

// Security headers configuration
const helmetConfig = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:", "http:"],
            connectSrc: ["'self'", "https://pokeapi.co"],
            mediaSrc: ["'self'"],
            objectSrc: ["'none'"],
            frameSrc: ["'none'"],
        },
    },
    crossOriginEmbedderPolicy: false, // Allow external images
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
});

// MongoDB injection prevention
const mongoSanitizeConfig = mongoSanitize({
    replaceWith: '_',
    onSanitize: ({ req, key }) => {
        logger.warn(`Potential MongoDB injection attempt detected`, {
            ip: req.ip,
            key,
            userAgent: req.get('User-Agent'),
            url: req.originalUrl
        });
    }
});

// HTTP Parameter Pollution prevention
const hppConfig = hpp({
    whitelist: ['sort', 'fields', 'page', 'limit'] // Allow these parameters to be arrays
});

// Compression middleware
const compressionConfig = compression({
    level: 6,
    threshold: 1024, // Only compress responses larger than 1KB
    filter: (req, res) => {
        // Don't compress if the request includes a cache-control no-transform directive
        if (req.headers['cache-control'] && req.headers['cache-control'].includes('no-transform')) {
            return false;
        }
        
        // Use compression filter function
        return compression.filter(req, res);
    }
});

// CORS configuration
const getCorsOptions = () => {
    const NODE_ENV = process.env.NODE_ENV || 'development';
    
    return {
        origin: (origin, callback) => {
            const allowedOrigins = NODE_ENV === 'production' 
                ? [process.env.FRONTEND_URL || 'https://your-domain.com']
                : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3001'];
            
            // Allow requests with no origin (mobile apps, etc.)
            if (!origin) return callback(null, true);
            
            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                logger.warn(`CORS blocked request from origin: ${origin}`);
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        exposedHeaders: ['X-Total-Count', 'X-Page-Count']
    };
};

module.exports = {
    helmetConfig,
    apiLimiter,
    searchLimiter,
    mongoSanitizeConfig,
    hppConfig,
    compressionConfig,
    getCorsOptions
};
