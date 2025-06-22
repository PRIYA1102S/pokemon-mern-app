@echo off
echo Starting Pokemon MERN App Deployment...

echo.
echo Step 1: Installing server dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install server dependencies
    exit /b 1
)

echo.
echo Step 2: Installing client dependencies...
cd ..\client
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install client dependencies
    exit /b 1
)

echo.
echo Step 3: Building React application...
call npm run build
if %errorlevel% neq 0 (
    echo Error: Failed to build React application
    exit /b 1
)

echo.
echo Step 4: Starting production server...
cd ..\server
echo Server will start in production mode and serve the React app
echo Access the application at: http://localhost:5000
echo Press Ctrl+C to stop the server
call npm run start:windows
