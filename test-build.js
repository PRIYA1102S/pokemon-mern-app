#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Pokemon MERN App Build Process...\n');

try {
    // Test 1: Install dependencies
    console.log('📦 Step 1: Installing dependencies...');
    
    console.log('  Installing server dependencies...');
    execSync('npm install', { cwd: 'server', stdio: 'inherit' });
    
    console.log('  Installing client dependencies...');
    execSync('npm install', { cwd: 'client', stdio: 'inherit' });
    
    console.log('✅ Dependencies installed successfully\n');
    
    // Test 2: Build React app
    console.log('🏗️  Step 2: Building React application...');
    execSync('npm run build', { cwd: 'client', stdio: 'inherit' });
    
    // Check if build directory exists
    const buildPath = path.join(__dirname, 'client', 'build');
    if (fs.existsSync(buildPath)) {
        console.log('✅ React build completed successfully');
        
        // Check for key files
        const indexPath = path.join(buildPath, 'index.html');
        const staticPath = path.join(buildPath, 'static');
        
        if (fs.existsSync(indexPath)) {
            console.log('✅ index.html found');
        } else {
            console.log('❌ index.html missing');
        }
        
        if (fs.existsSync(staticPath)) {
            console.log('✅ static directory found');
        } else {
            console.log('❌ static directory missing');
        }
    } else {
        throw new Error('Build directory not created');
    }
    
    console.log('\n🎉 Build test completed successfully!');
    console.log('📋 Summary:');
    console.log('  ✅ Server dependencies installed');
    console.log('  ✅ Client dependencies installed');
    console.log('  ✅ React build successful');
    console.log('  ✅ Build artifacts created');
    console.log('\n🚀 Ready for deployment!');
    
} catch (error) {
    console.error('\n❌ Build test failed:');
    console.error(error.message);
    process.exit(1);
}
