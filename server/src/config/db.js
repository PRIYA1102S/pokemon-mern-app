const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
    try {
        logger.info('Attempting to connect to MongoDB...');
        logger.debug(`MongoDB URI: ${process.env.MONGODB_URI}`);

        const connectionOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,

            // Connection pool settings
            maxPoolSize: process.env.NODE_ENV === 'production' ? 10 : 5, // Maximum number of connections
            minPoolSize: 1, // Minimum number of connections
            maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity

            // Timeout settings
            serverSelectionTimeoutMS: 5000, // How long to try selecting a server
            socketTimeoutMS: 45000, // How long a send or receive on a socket can take
            connectTimeoutMS: 10000, // How long to wait for a connection to be established

            // Buffering settings
            bufferMaxEntries: 0, // Disable mongoose buffering
            bufferCommands: false, // Disable mongoose buffering

            // Heartbeat settings
            heartbeatFrequencyMS: 10000, // How often to check the server status

            // Retry settings
            retryWrites: true, // Retry writes on network errors
            retryReads: true, // Retry reads on network errors
        };

        await mongoose.connect(process.env.MONGODB_URI, connectionOptions);

        logger.info('MongoDB connected successfully');
        logger.info(`Connected to database: ${mongoose.connection.name}`);

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            logger.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            logger.info('MongoDB reconnected');
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            try {
                await mongoose.connection.close();
                logger.info('MongoDB connection closed through app termination');
                process.exit(0);
            } catch (err) {
                logger.error('Error during MongoDB disconnection:', err);
                process.exit(1);
            }
        });

    } catch (error) {
        logger.error(`MongoDB connection failed: ${error.message}`);
        logger.warn('Running without database - Pokemon data will not be cached');
        logger.info('Please check your MongoDB connection settings');

        // Don't exit the process, just continue without database
        // This allows the API to still work with external Pokemon API
    }
};

module.exports = connectDB;