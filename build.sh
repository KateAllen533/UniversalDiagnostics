#!/bin/bash

echo "Universal Vehicle Diagnostics - Build & Installation Script"
echo "=========================================================="
echo "Copyright © Global Technology Consulting LLC"
echo "Prototype under NovarisAI testing. All rights reserved."
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm could not be found. Please install Node.js and npm first."
    echo "Visit https://nodejs.org for installation instructions."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v pg_isready &> /dev/null; then
    echo "Warning: PostgreSQL commands not found. You'll need to set up a PostgreSQL database manually."
    echo "Visit https://www.postgresql.org/download/ for installation instructions."
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file with default settings..."
    cat > .env << EOL
# Universal Vehicle Diagnostics Environment Variables
PORT=5000
NODE_ENV=production

# Database Configuration - Update these with your PostgreSQL credentials
DATABASE_URL=postgresql://postgres:password@localhost:5432/vehicle_diagnostics
PGUSER=postgres
PGHOST=localhost
PGPASSWORD=password
PGDATABASE=vehicle_diagnostics
PGPORT=5432
EOL
    echo ".env file created. Please update the database credentials."
else
    echo ".env file already exists. Skipping creation."
fi

# Check if database exists and is accessible
echo "Checking database connection..."
if command -v pg_isready &> /dev/null; then
    DB_HOST=$(grep PGHOST .env | cut -d '=' -f2)
    DB_PORT=$(grep PGPORT .env | cut -d '=' -f2)
    DB_USER=$(grep PGUSER .env | cut -d '=' -f2)
    
    pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER"
    
    if [ $? -ne 0 ]; then
        echo "Warning: Could not connect to the PostgreSQL database. Please check your credentials in .env"
        echo "You may need to create the database manually before continuing."
    else
        echo "Database connection successful."
    fi
else
    echo "Skipping database check - PostgreSQL tools not found."
fi

# Push database schema
echo "Setting up database schema..."
npm run db:push

# Build application for production
echo "Building application for production..."
npm run build

echo ""
echo "Build process completed!"
echo ""
echo "To start the application in development mode, run:"
echo "  npm run dev"
echo ""
echo "To start the application in production mode, run:"
echo "  npm start"
echo ""
echo "For more information and documentation, visit:"
echo "  https://github.com/KateAllen533/UniversalDiagnostics"
echo ""