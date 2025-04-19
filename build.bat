@echo off
echo Universal Vehicle Diagnostics - Build ^& Installation Script
echo ==========================================================
echo Copyright (C) Global Technology Consulting LLC
echo Prototype under NovarisAI testing. All rights reserved.
echo.

:: Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: npm could not be found. Please install Node.js and npm first.
    echo Visit https://nodejs.org for installation instructions.
    exit /b 1
)

:: Install dependencies
echo Installing dependencies...
call npm install

:: Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file with default settings...
    (
        echo # Universal Vehicle Diagnostics Environment Variables
        echo PORT=5000
        echo NODE_ENV=production
        echo.
        echo # Database Configuration - Update these with your PostgreSQL credentials
        echo DATABASE_URL=postgresql://postgres:password@localhost:5432/vehicle_diagnostics
        echo PGUSER=postgres
        echo PGHOST=localhost
        echo PGPASSWORD=password
        echo PGDATABASE=vehicle_diagnostics
        echo PGPORT=5432
    ) > .env
    echo .env file created. Please update the database credentials.
) else (
    echo .env file already exists. Skipping creation.
)

:: Push database schema
echo Setting up database schema...
call npm run db:push

:: Build application for production
echo Building application for production...
call npm run build

echo.
echo Build process completed!
echo.
echo To start the application in development mode, run:
echo   npm run dev
echo.
echo To start the application in production mode, run:
echo   npm start
echo.
echo For more information and documentation, visit:
echo   https://github.com/KateAllen533/UniversalDiagnostics
echo.

pause