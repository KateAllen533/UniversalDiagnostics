#!/bin/bash

echo "Starting Universal Diagnostics Server..."
echo ""
echo "This will start the development server and open your browser automatically."
echo ""

# Set DATABASE_URL if not already set
if [ -z "$DATABASE_URL" ]; then
    export DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy_db"
fi

echo "Starting server in background..."
npm run dev &

# Wait for server to start
sleep 8

# Open browser (works on macOS and Linux)
echo "Opening browser..."
if command -v xdg-open > /dev/null; then
    # Linux
    xdg-open http://localhost:5000
elif command -v open > /dev/null; then
    # macOS
    open http://localhost:5000
fi

echo ""
echo "Server is running at http://localhost:5000"
echo "The server is running in the background."

