# Expo WebSocket Error Fix

## Error
```
TypeError: _ws(...).WebSocketServer is not a constructor
```

## Root Cause
The `ws` package version conflict between Expo CLI and your project dependencies.

## Solution

### Quick Fix (Running Now)
```bash
cd user_app/frontend
npm install ws@latest --save-dev
```

### Alternative Fixes

#### Option 1: Clear Cache and Reinstall
```bash
cd user_app/frontend

# Clear all caches
rm -rf node_modules
rm -rf .expo
rm -rf .metro-cache
rm package-lock.json

# Reinstall
npm install

# Start Expo
npx expo start --clear
```

#### Option 2: Use Expo Doctor
```bash
cd user_app/frontend

# Run Expo doctor to fix issues
npx expo-doctor

# Then start
npx expo start
```

#### Option 3: Downgrade ws Package
```bash
cd user_app/frontend

# Install specific version
npm install ws@8.13.0 --save-dev

# Start Expo
npx expo start
```

#### Option 4: Use Yarn Instead
```bash
cd user_app/frontend

# Remove npm artifacts
rm -rf node_modules package-lock.json

# Install with yarn
yarn install

# Start with yarn
yarn start
```

## After Fix

Once the `ws` package is installed, start Expo:

```bash
npx expo start --clear
```

Or if that doesn't work:

```bash
npx expo start --tunnel
```

## Backend Pylint Fix

The pylint command was incorrect. Use this instead:

```bash
cd backend

# Lint specific files
pylint server.py seed_admin.py

# Or lint the api directory
pylint api/

# Or lint everything
find . -name "*.py" -not -path "./venv/*" | xargs pylint
```

## Complete Restart Commands

If issues persist, do a complete restart:

```bash
# Mobile App
cd user_app/frontend
rm -rf node_modules .expo .metro-cache package-lock.json
npm install
npx expo start --clear

# Web App
cd ../../web_app
rm -rf node_modules .next package-lock.json
npm install
npm run dev

# Admin Dashboard
cd ../admin_dashboard/frontend
rm -rf node_modules .next package-lock.json
npm install
npm run dev

# Backend
cd ../../backend
# Activate venv if you have one
source venv/bin/activate  # or: . venv/bin/activate
pip install -r requirements.txt
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

## Verification

After applying fixes:

### Mobile App
```bash
cd user_app/frontend
npx expo start

# You should see:
# ✓ Metro waiting on exp://...
# ✓ Scan QR code
# ✓ No WebSocket errors
```

### Backend
```bash
cd backend
pylint server.py

# Should show lint results without "No module named backend" error
```

## Common Issues

### Issue 1: Port Already in Use
```bash
# Kill process on port 8081 (Expo)
lsof -ti:8081 | xargs kill -9

# Kill process on port 8001 (Backend)
lsof -ti:8001 | xargs kill -9
```

### Issue 2: Node Version Issues
```bash
# Check Node version (should be 18+)
node --version

# If too old, update Node.js
# Use nvm or download from nodejs.org
```

### Issue 3: Python Virtual Environment
```bash
cd backend

# Create venv if not exists
python3 -m venv venv

# Activate
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## Status Check

Run these to verify everything is working:

```bash
# Check mobile app packages
cd user_app/frontend
npm list ws
npm list expo

# Check if Expo can start (dry run)
npx expo start --help

# Check backend
cd ../../backend
python -c "import fastapi; print('FastAPI OK')"
python -c "import pymongo; print('PyMongo OK')"
```

## Next Steps

1. ✅ Wait for `ws` package installation to complete
2. ✅ Run `npx expo start --clear`
3. ✅ Scan QR code with Expo Go app
4. ✅ Test on device/emulator

If Expo starts successfully, you should see:
- QR code
- Metro bundler running
- Options to press 'a' for Android, 'i' for iOS, 'w' for web

## Additional Resources

- [Expo WebSocket Issues](https://github.com/expo/expo/issues)
- [Metro Bundler Docs](https://facebook.github.io/metro/)
- [Expo Troubleshooting](https://docs.expo.dev/troubleshooting/overview/)
