#!/bin/bash

echo "Starting Pokemon MERN App Deployment..."

echo ""
echo "Step 1: Installing server dependencies..."
cd server
npm install
if [ $? -ne 0 ]; then
    echo "Error: Failed to install server dependencies"
    exit 1
fi

echo ""
echo "Step 2: Installing client dependencies..."
cd ../client
npm install
if [ $? -ne 0 ]; then
    echo "Error: Failed to install client dependencies"
    exit 1
fi

echo ""
echo "Step 3: Building React application..."
npm run build
if [ $? -ne 0 ]; then
    echo "Error: Failed to build React application"
    exit 1
fi

echo ""
echo "Step 4: Starting production server..."
cd ../server
echo "Server will start in production mode and serve the React app"
echo "Access the application at: http://localhost:5000"
echo "Press Ctrl+C to stop the server"
npm start
