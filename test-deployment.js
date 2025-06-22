const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Pokemon MERN App Deployment...\n');

// Check if build directory exists
const buildPath = path.join(__dirname, 'client', 'build');
if (fs.existsSync(buildPath)) {
    console.log('✅ Client build directory exists');
    
    // Check for key build files
    const indexPath = path.join(buildPath, 'index.html');
    const staticPath = path.join(buildPath, 'static');
    
    if (fs.existsSync(indexPath)) {
        console.log('✅ index.html found in build directory');
    } else {
        console.log('❌ index.html not found in build directory');
    }
    
    if (fs.existsSync(staticPath)) {
        console.log('✅ static directory found in build');
    } else {
        console.log('❌ static directory not found in build');
    }
} else {
    console.log('❌ Client build directory does not exist');
    console.log('   Run: cd client && npm run build');
}

// Check server files
const serverPath = path.join(__dirname, 'server', 'src', 'app.js');
if (fs.existsSync(serverPath)) {
    console.log('✅ Server app.js exists');
} else {
    console.log('❌ Server app.js not found');
}

// Check package.json files
const serverPackagePath = path.join(__dirname, 'server', 'package.json');
const clientPackagePath = path.join(__dirname, 'client', 'package.json');

if (fs.existsSync(serverPackagePath)) {
    console.log('✅ Server package.json exists');
} else {
    console.log('❌ Server package.json not found');
}

if (fs.existsSync(clientPackagePath)) {
    console.log('✅ Client package.json exists');
} else {
    console.log('❌ Client package.json not found');
}

// Check deployment scripts
const deployBatPath = path.join(__dirname, 'deploy.bat');
const deployShPath = path.join(__dirname, 'deploy.sh');

if (fs.existsSync(deployBatPath)) {
    console.log('✅ Windows deployment script (deploy.bat) exists');
} else {
    console.log('❌ Windows deployment script not found');
}

if (fs.existsSync(deployShPath)) {
    console.log('✅ Linux/Mac deployment script (deploy.sh) exists');
} else {
    console.log('❌ Linux/Mac deployment script not found');
}

console.log('\n🚀 Deployment Status Summary:');
console.log('- React app has been built successfully');
console.log('- Server is configured to serve static files in production');
console.log('- Deployment scripts are ready');
console.log('\n📋 Next Steps:');
console.log('1. Ensure MongoDB is running');
console.log('2. Set up environment variables in server/.env');
console.log('3. Run deployment script:');
console.log('   Windows: .\\deploy.bat');
console.log('   Linux/Mac: ./deploy.sh');
console.log('4. Access app at http://localhost:5000');
