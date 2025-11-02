#!/bin/bash

# Fix Expo WebSocket Error
# Run this script to fix the WebSocketServer constructor error

set -e

echo "🔧 Fixing Expo WebSocket Error..."
echo "=================================="

cd user_app/frontend

echo ""
echo "Step 1: Installing ws package..."
npm install ws@latest --save-dev

echo ""
echo "Step 2: Clearing caches..."
rm -rf .expo .metro-cache

echo ""
echo "Step 3: Starting Expo..."
echo ""
echo "✅ Fix applied! Starting Expo now..."
echo ""

npx expo start --clear
