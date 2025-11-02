#!/bin/bash

# Expo Bus Error - Complete Fix Script
# This will completely reset and reinstall everything

set -e

echo "🚨 Fixing Expo Bus Error..."
echo "=============================="
echo ""

cd user_app/frontend

echo "Step 1: Removing corrupted files..."
rm -rf node_modules .expo .metro-cache package-lock.json yarn.lock
echo "✓ Cleaned"

echo ""
echo "Step 2: Cleaning npm cache..."
npm cache clean --force
echo "✓ Cache cleaned"

echo ""
echo "Step 3: Installing dependencies (this may take 3-5 minutes)..."
npm install

echo ""
echo "Step 4: Installing additional packages..."
npm install expo-linear-gradient react-native-worklets ws@latest --save-dev

echo ""
echo "Step 5: Fixing Expo package versions..."
npx expo install --fix

echo ""
echo "✅ Fix complete! Starting Expo..."
echo ""

npx expo start --clear
