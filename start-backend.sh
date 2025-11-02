#!/bin/bash

# Start CareerGuide Backend with Enhanced Logging

echo "🚀 Starting CareerGuide Backend..."
echo ""

cd backend

# Check if virtual environment exists
if [ -d "venv" ]; then
    echo "📦 Activating virtual environment..."
    source venv/bin/activate
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  Warning: MongoDB doesn't appear to be running"
    echo "   Start MongoDB with: sudo systemctl start mongodb"
    echo ""
fi

# Start the server
echo "🔥 Starting Uvicorn server..."
echo ""

python -m uvicorn server:app --reload --host 0.0.0.0 --port 8001
