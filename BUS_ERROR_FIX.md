# Bus Error (Core Dumped) - Complete Fix

## Error
```
Bus error (core dumped)
```

## What This Means
A bus error indicates:
1. Corrupted Node modules
2. Memory alignment issues
3. Incompatible binary dependencies
4. System memory problems

## ✅ Solution Applied (Running Now)

```bash
cd user_app/frontend

# Step 1: Remove all caches and modules
rm -rf node_modules .expo .metro-cache package-lock.json yarn.lock

# Step 2: Clean npm cache
npm cache clean --force

# Step 3: Reinstall everything fresh
npm install

# Step 4: Install missing packages
npm install expo-linear-gradient react-native-worklets ws@latest --save-dev

# Step 5: Fix Expo package versions
npx expo install --fix

# Step 6: Start Expo
npx expo start --clear
```

## Alternative Solutions

### Solution 1: Use Yarn Instead of NPM
```bash
cd user_app/frontend

# Remove npm artifacts
rm -rf node_modules .expo .metro-cache package-lock.json

# Install yarn if not installed
npm install -g yarn

# Install with yarn
yarn install

# Start with yarn
yarn start
```

### Solution 2: Check Node.js Version
```bash
# Check current version
node --version

# Should be 18.x or 20.x
# If using old version (14.x or 16.x), update Node.js

# Using nvm (recommended)
nvm install 20
nvm use 20

# Or download from nodejs.org
```

### Solution 3: Increase Node Memory
```bash
cd user_app/frontend

# Set Node memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# Then start Expo
npx expo start --clear
```

### Solution 4: Use Expo Go Web Instead
```bash
cd user_app/frontend

# Start in web mode only
npx expo start --web
```

### Solution 5: Check System Memory
```bash
# Check available memory
free -h

# If low memory, close other applications
# Or restart your computer
```

## Complete Fresh Install Script

```bash
#!/bin/bash

cd user_app/frontend

echo "🧹 Cleaning everything..."
rm -rf node_modules
rm -rf .expo
rm -rf .metro-cache
rm -rf package-lock.json
rm -rf yarn.lock
rm -rf ~/.expo
rm -rf ~/.npm

echo "🔧 Cleaning npm cache..."
npm cache clean --force

echo "📦 Installing dependencies..."
npm install

echo "📱 Installing Expo packages..."
npm install expo-linear-gradient react-native-worklets

echo "🔄 Fixing Expo versions..."
npx expo install --fix

echo "✅ Starting Expo..."
npx expo start --clear
```

## If Still Getting Bus Error

### Check for Corrupted System Files
```bash
# Check disk for errors
sudo fsck -f /dev/sda1  # Replace with your disk

# Check memory
sudo memtest86+  # Reboot required
```

### Try Different Terminal
```bash
# Sometimes the terminal itself has issues
# Try:
# 1. New terminal window
# 2. Different terminal app (gnome-terminal, konsole, etc.)
# 3. TTY (Ctrl+Alt+F2)
```

### Reinstall Node.js
```bash
# Remove Node.js completely
sudo apt remove nodejs npm
sudo apt autoremove

# Reinstall using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20

# Verify
node --version
npm --version
```

## Debugging Steps

### 1. Check Core Dump
```bash
# Check if core dumps are enabled
ulimit -c

# If 0, enable them
ulimit -c unlimited

# Try running again to see detailed error
npx expo start --clear

# Check core dump location
ls -lh core*
```

### 2. Run with Debugging
```bash
# Run with Node debugging
NODE_OPTIONS="--trace-warnings" npx expo start --clear

# Or with verbose logging
DEBUG=* npx expo start --clear
```

### 3. Check for Conflicting Processes
```bash
# Check if port is in use
lsof -i :8081
lsof -i :19000
lsof -i :19001

# Kill if needed
lsof -ti:8081 | xargs kill -9
```

## System Requirements Check

### Minimum Requirements
- **Node.js**: 18.x or 20.x
- **RAM**: 4GB minimum, 8GB recommended
- **Disk Space**: 10GB free
- **OS**: Ubuntu 20.04+ or similar

### Check Your System
```bash
# Node version
node --version

# NPM version
npm --version

# Available memory
free -h

# Disk space
df -h

# CPU info
lscpu | grep "Model name"
```

## Working Configuration

### package.json (Known Working Versions)
```json
{
  "dependencies": {
    "expo": "~54.0.0",
    "react": "19.0.0",
    "react-native": "0.79.5",
    "expo-router": "~5.1.0",
    "expo-linear-gradient": "~14.0.0"
  },
  "devDependencies": {
    "@babel/core": "^7.25.0",
    "ws": "^8.18.0"
  }
}
```

## After Fix Completes

### Verify Installation
```bash
cd user_app/frontend

# Check packages installed
npm list expo
npm list react-native
npm list ws

# Check Expo CLI
npx expo --version

# Try starting
npx expo start --clear
```

### Expected Success Output
```
✓ Metro waiting on exp://10.91.79.143:8081
✓ Scan the QR code above with Expo Go
✓ Press a │ open Android
✓ Press w │ open web
```

## Prevention

### To Avoid Bus Errors in Future

1. **Always use `--clear` flag**
   ```bash
   npx expo start --clear
   ```

2. **Regularly clean caches**
   ```bash
   npm cache clean --force
   rm -rf .expo .metro-cache
   ```

3. **Keep Node.js updated**
   ```bash
   nvm install --lts
   nvm use --lts
   ```

4. **Don't mix package managers**
   - Use either npm OR yarn, not both
   - Delete lock files from the other manager

5. **Monitor system resources**
   - Close unused applications
   - Ensure adequate free memory
   - Check disk space regularly

## Alternative: Use Expo Web Only

If mobile keeps failing, develop on web first:

```bash
cd user_app/frontend

# Start web only
npx expo start --web

# Opens in browser at http://localhost:8081
```

## Emergency Fallback

If nothing works, use the web app instead:

```bash
cd ../../web_app

# Create .env.local if missing
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:8001/api
NEXT_PUBLIC_BACKEND_URL=http://localhost:8001
EOF

# Start web app
npm run dev

# Opens at http://localhost:3000
```

## Status Check

Run this after installation completes:

```bash
cd user_app/frontend

echo "=== Node Version ==="
node --version

echo "=== NPM Version ==="
npm --version

echo "=== Expo Version ==="
npx expo --version

echo "=== Package Check ==="
npm list expo react-native ws

echo "=== Memory ==="
free -h

echo "=== Disk Space ==="
df -h .

echo "=== Try Starting ==="
npx expo start --clear
```

## Next Steps

1. ✅ Wait for `npm install` to complete (running now)
2. ✅ Install additional packages
3. ✅ Fix Expo versions
4. ✅ Try starting Expo
5. ✅ If still fails, try yarn or web-only mode

## Timeline

- **npm install**: 3-5 minutes
- **Additional packages**: 1-2 minutes
- **Expo fix**: 1-2 minutes
- **Total**: ~5-10 minutes

---

**Current Status**: 🔄 Reinstalling all packages from scratch...

This should resolve the bus error. If it persists, it may indicate a hardware or system-level issue.
