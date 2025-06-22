const { body, param, query, validationResult } = require('express-validator');
const logger = require('../config/logger');

// Validation error handler
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        logger.warn('Validation failed', {
            url: req.originalUrl,
            method: req.method,
            errors: errors.array(),
            ip: req.ip
        });
        
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: errors.array().map(error => ({
                field: error.path,
                message: error.msg,
                value: error.value
            }))
        });
    }
    
    next();
};

// Pokemon search validation
const validatePokemonSearch = [
    param('name')
        .isString()
        .trim()
        .isLength({ min: 1, max: 50 })
        .matches(/^[a-zA-Z0-9\-]+$/)
        .withMessage('Pokemon name must be alphanumeric with optional hyphens, 1-50 characters long'),
    handleValidationErrors
];

// Pokemon ID validation (can be ID number or name)
const validatePokemonId = [
    param('id')
        .custom((value) => {
            // Allow either numeric ID or pokemon name
            if (/^\d+$/.test(value)) {
                const id = parseInt(value);
                if (id < 1 || id > 10000) {
                    throw new Error('Pokemon ID must be between 1 and 10000');
                }
            } else if (!/^[a-zA-Z0-9\-]+$/.test(value) || value.length > 50) {
                throw new Error('Pokemon name must be alphanumeric with optional hyphens, max 50 characters');
            }
            return true;
        }),
    handleValidationErrors
];

// Query parameter validation for pagination
const validatePagination = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    handleValidationErrors
];

// Sanitize input to prevent XSS and injection attacks
const sanitizeInput = (req, res, next) => {
    // Sanitize params
    if (req.params) {
        Object.keys(req.params).forEach(key => {
            if (typeof req.params[key] === 'string') {
                req.params[key] = req.params[key].trim().toLowerCase();
            }
        });
    }
    
    // Sanitize query parameters
    if (req.query) {
        Object.keys(req.query).forEach(key => {
            if (typeof req.query[key] === 'string') {
                req.query[key] = req.query[key].trim();
            }
        });
    }
    
    next();
};

module.exports = {
    validatePokemonSearch,
    validatePokemonId,
    validatePagination,
    sanitizeInput,
    handleValidationErrors
};
