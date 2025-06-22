const logger = require('../config/logger');

/**
 * Standard API response format
 */
class ApiResponse {
    constructor(success, data = null, message = '', error = null, statusCode = 200) {
        this.success = success;
        this.data = data;
        this.message = message;
        this.timestamp = new Date().toISOString();
        
        if (error) {
            this.error = error;
        }
        
        this.statusCode = statusCode;
    }
    
    static success(data, message = 'Success', statusCode = 200) {
        return new ApiResponse(true, data, message, null, statusCode);
    }
    
    static error(message, error = null, statusCode = 500) {
        return new ApiResponse(false, null, message, error, statusCode);
    }
    
    static notFound(message = 'Resource not found') {
        return new ApiResponse(false, null, message, null, 404);
    }
    
    static badRequest(message = 'Bad request', error = null) {
        return new ApiResponse(false, null, message, error, 400);
    }
    
    static unauthorized(message = 'Unauthorized') {
        return new ApiResponse(false, null, message, null, 401);
    }
    
    static forbidden(message = 'Forbidden') {
        return new ApiResponse(false, null, message, null, 403);
    }
    
    static tooManyRequests(message = 'Too many requests') {
        return new ApiResponse(false, null, message, null, 429);
    }
    
    send(res) {
        const response = {
            success: this.success,
            message: this.message,
            timestamp: this.timestamp
        };
        
        if (this.data !== null) {
            response.data = this.data;
        }
        
        if (this.error) {
            response.error = this.error;
        }
        
        // Log the response for monitoring
        if (this.success) {
            logger.info(`API Response: ${this.message}`, {
                statusCode: this.statusCode,
                dataSize: this.data ? JSON.stringify(this.data).length : 0
            });
        } else {
            logger.warn(`API Error Response: ${this.message}`, {
                statusCode: this.statusCode,
                error: this.error
            });
        }
        
        return res.status(this.statusCode).json(response);
    }
}

/**
 * Async error handler wrapper
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Custom error class for application errors
 */
class AppError extends Error {
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.timestamp = new Date().toISOString();
        
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = {
    ApiResponse,
    asyncHandler,
    AppError
};
