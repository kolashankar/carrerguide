#!/bin/bash

# Start All CareerGuide Applications
# This script opens 4 terminal windows to run all apps

echo "🚀 Starting All CareerGuide Applications..."
echo ""
echo "This will open 4 terminal windows:"
echo "  1. Backend (Port 8001)"
echo "  2. Mobile App (Expo)"
echo "  3. Web App (Port 3000)"
echo "  4. Admin Dashboard (Port 3001)"
echo ""
echo "Press Ctrl+C in each terminal to stop"
echo ""

# Get the current directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Function to open terminal based on available terminal emulator
open_terminal() {
    local title=$1
    local command=$2
    
    if command -v gnome-terminal &> /dev/null; then
        gnome-terminal --title="$title" -- bash -c "$command; exec bash"
    elif command -v konsole &> /dev/null; then
        konsole --title "$title" -e bash -c "$command; exec bash" &
    elif command -v xterm &> /dev/null; then
        xterm -title "$title" -e bash -c "$command; exec bash" &
    else
        echo "⚠️  No supported terminal found. Please run commands manually:"
        echo "   $command"
    fi
}

# Wait a bit between starting services
sleep_time=2

# 1. Start Backend
echo "1️⃣  Starting Backend..."
open_terminal "CareerGuide - Backend" "cd '$DIR/backend' && python -m uvicorn server:app --reload --host 0.0.0.0 --port 8001"
sleep $sleep_time

# 2. Start Mobile App
echo "2️⃣  Starting Mobile App..."
open_terminal "CareerGuide - Mobile App" "cd '$DIR/user_app/frontend' && npx expo start --clear"
sleep $sleep_time

# 3. Start Web App
echo "3️⃣  Starting Web App..."
open_terminal "CareerGuide - Web App" "cd '$DIR/web_app' && npm run dev"
sleep $sleep_time

# 4. Start Admin Dashboard
echo "4️⃣  Starting Admin Dashboard..."
open_terminal "CareerGuide - Admin Dashboard" "cd '$DIR/admin_dashboard/frontend' && npm run dev -- -p 3001"

echo ""
echo "✅ All applications started!"
echo ""
echo "📱 Mobile App: Scan QR code with Expo Go"
echo "🌐 Web App: http://localhost:3000"
echo "🔧 Admin Dashboard: http://localhost:3001"
echo "📖 Backend API Docs: http://localhost:8001/docs"
echo ""
echo "To stop all apps: Press Ctrl+C in each terminal window"
echo ""
