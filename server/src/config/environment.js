const logger = require('./logger');

// Validate required environment variables
const requiredEnvVars = [
    'MONGODB_URI',
    'PORT'
];

const validateEnvironment = () => {
    const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    if (missing.length > 0) {
        logger.error(`Missing required environment variables: ${missing.join(', ')}`);
        logger.error('Please check your .env file and ensure all required variables are set');
        process.exit(1);
    }
    
    logger.info('Environment validation passed');
};

// Environment-specific configurations
const config = {
    development: {
        logLevel: 'debug',
        rateLimit: {
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 1000 // requests per windowMs
        },
        cors: {
            origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
            credentials: true
        },
        database: {
            maxPoolSize: 5,
            serverSelectionTimeoutMS: 5000
        }
    },
    
    staging: {
        logLevel: 'info',
        rateLimit: {
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 200 // requests per windowMs
        },
        cors: {
            origin: process.env.FRONTEND_URL || 'https://staging.your-domain.com',
            credentials: true
        },
        database: {
            maxPoolSize: 8,
            serverSelectionTimeoutMS: 10000
        }
    },
    
    production: {
        logLevel: 'warn',
        rateLimit: {
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100 // requests per windowMs
        },
        cors: {
            origin: process.env.FRONTEND_URL || 'https://your-domain.com',
            credentials: true
        },
        database: {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 30000
        }
    }
};

const getConfig = () => {
    const env = process.env.NODE_ENV || 'development';
    
    if (!config[env]) {
        logger.error(`Invalid NODE_ENV: ${env}. Must be one of: ${Object.keys(config).join(', ')}`);
        process.exit(1);
    }
    
    return {
        ...config[env],
        env,
        port: parseInt(process.env.PORT) || 5000,
        mongoUri: process.env.MONGODB_URI,
        frontendUrl: process.env.FRONTEND_URL,
        pokemonApiBaseUrl: process.env.POKEMON_API_BASE_URL || 'https://pokeapi.co/api/v2'
    };
};

module.exports = {
    validateEnvironment,
    getConfig
};
