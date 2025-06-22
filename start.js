#!/usr/bin/env node

// Start the server without OpenSSL legacy provider for production
// The legacy provider is only needed for older React versions in development
require('./server/src/app.js');
