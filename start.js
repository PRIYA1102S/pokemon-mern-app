#!/usr/bin/env node

// Set Node.js options for compatibility
process.env.NODE_OPTIONS = '--openssl-legacy-provider';

// Start the server
require('./server/src/app.js');
