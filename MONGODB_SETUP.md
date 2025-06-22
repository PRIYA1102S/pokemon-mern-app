# MongoDB Local Setup Guide

## Prerequisites
You mentioned you have already downloaded MongoDB. This guide will help you configure it properly.

## Step 1: Start MongoDB Service

### Option A: Using Windows Services (Recommended)
1. Press `Win + R`, type `services.msc`, and press Enter
2. Look for "MongoDB" or "MongoDB Server" in the list
3. Right-click on it and select "Start"
4. Set it to "Automatic" startup type for future use

### Option B: Using Command Prompt as Administrator
1. Open Command Prompt as Administrator
2. Run: `net start MongoDB`

### Option C: Manual Start (if service is not installed)
1. Open Command Prompt as Administrator
2. Navigate to your MongoDB installation directory (usually `C:\Program Files\MongoDB\Server\[version]\bin`)
3. Run: `mongod --dbpath "C:\data\db"`

## Step 2: Verify MongoDB is Running

### Check if MongoDB is listening on port 27017:
```cmd
netstat -an | findstr :27017
```

You should see something like:
```
TCP    0.0.0.0:27017          0.0.0.0:0              LISTENING
```

## Step 3: Test Connection

### Option A: Using MongoDB Compass (GUI)
1. Download MongoDB Compass from https://www.mongodb.com/products/compass
2. Connect to: `mongodb://localhost:27017`

### Option B: Using Command Line
1. Open Command Prompt
2. Navigate to MongoDB bin directory
3. Run: `mongosh` or `mongo` (depending on your version)
4. You should see a connection to `mongodb://127.0.0.1:27017`

## Step 4: Create Database Directory (if needed)

If MongoDB fails to start, you might need to create the data directory:

```cmd
mkdir C:\data\db
```

## Common MongoDB Installation Paths:
- `C:\Program Files\MongoDB\Server\7.0\bin\`
- `C:\Program Files\MongoDB\Server\6.0\bin\`
- `C:\Program Files\MongoDB\Server\5.0\bin\`

## Troubleshooting:

### If MongoDB service doesn't exist:
1. Navigate to MongoDB bin directory
2. Run as Administrator: `mongod --install --serviceName "MongoDB" --serviceDisplayName "MongoDB" --dbpath "C:\data\db"`

### If you get "Access Denied":
- Make sure you're running Command Prompt as Administrator
- Check if antivirus is blocking MongoDB

### If port 27017 is in use:
- Check what's using the port: `netstat -ano | findstr :27017`
- Kill the process or use a different port

## Application Configuration:

The Pokemon MERN app is configured to connect to:
- **Host**: 127.0.0.1 (localhost)
- **Port**: 27017 (default MongoDB port)
- **Database**: pokemonDB

## Next Steps:

Once MongoDB is running:
1. Start the server: `cd server && npm start`
2. Start the client: `cd client && npm start`
3. The application will automatically create the `pokemonDB` database and collections as needed.

## Verification:

You can verify the setup is working by:
1. Starting the Pokemon app
2. Searching for a Pokemon (this will save data to MongoDB)
3. Using MongoDB Compass or command line to check if data was saved in the `pokemonDB` database
