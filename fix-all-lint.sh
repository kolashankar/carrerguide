#!/bin/bash

# CareerGuide - Fix All Lint Errors Script
# This script attempts to auto-fix as many lint errors as possible

set -e  # Exit on error

echo "🚀 Starting Lint Fix Process..."
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo ""
echo "📱 Step 1: Fixing Mobile App (user_app/frontend)"
echo "================================================"

cd user_app/frontend

# Check if packages are already installed
if [ ! -d "node_modules/expo-linear-gradient" ]; then
    print_warning "Installing missing packages..."
    npm install expo-linear-gradient react-native-worklets --legacy-peer-deps || print_error "Failed to install packages"
fi

# Fix Expo package versions
print_status "Fixing Expo package versions..."
npx expo install --fix || print_warning "Expo install --fix had issues (may be normal)"

# Run lint with auto-fix
print_status "Running ESLint auto-fix..."
npm run lint -- --fix || print_warning "Some lint errors remain (manual fix needed)"

cd ../..

echo ""
echo "🌐 Step 2: Fixing Web App (web_app)"
echo "===================================="

cd web_app

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    print_warning "Creating .env.local file..."
    cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:8001/api
NEXT_PUBLIC_BACKEND_URL=http://localhost:8001
NEXT_PUBLIC_APP_NAME=CareerGuide
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_TOKEN_STORAGE_KEY=user_token
NEXT_PUBLIC_USER_STORAGE_KEY=user_data
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
NEXT_PUBLIC_MAX_FILE_SIZE=5242880
NEXT_PUBLIC_DEBUG_MODE=true
EOF
    print_status ".env.local created"
fi

# Run lint with auto-fix
print_status "Running ESLint auto-fix..."
npm run lint -- --fix || print_warning "Some lint errors remain (manual fix needed)"

cd ..

echo ""
echo "🔧 Step 3: Fixing Admin Dashboard (admin_dashboard/frontend)"
echo "============================================================="

cd admin_dashboard/frontend

# Install ESLint if not present
if [ ! -f "node_modules/.bin/eslint" ]; then
    print_warning "Installing ESLint..."
    npm install eslint --save-dev || print_error "Failed to install ESLint"
fi

# Run lint with auto-fix
print_status "Running ESLint auto-fix..."
npm run lint -- --fix || print_warning "Some lint errors remain (manual fix needed)"

cd ../..

echo ""
echo "🐍 Step 4: Checking Backend (backend)"
echo "======================================"

cd backend

# Check if pylint is installed
if command -v pylint &> /dev/null; then
    print_status "Running Pylint..."
    # Find all Python files and lint them
    find . -name "*.py" \
        -not -path "./venv/*" \
        -not -path "./.venv/*" \
        -not -path "./node_modules/*" \
        -not -path "./__pycache__/*" \
        | xargs pylint || print_warning "Pylint found issues (review output)"
else
    print_warning "Pylint not installed. Install with: pip install pylint"
fi

cd ..

echo ""
echo "✅ Lint Fix Process Complete!"
echo "=============================="
echo ""
echo "📋 Summary:"
echo "  - Mobile App: Auto-fixed what's possible"
echo "  - Web App: Auto-fixed what's possible"
echo "  - Admin Dashboard: Auto-fixed what's possible"
echo "  - Backend: Linted (if pylint installed)"
echo ""
echo "⚠️  Manual Fixes Still Needed:"
echo "  1. Unescaped quotes (' → &apos;)"
echo "  2. TypeScript 'any' types (define proper interfaces)"
echo "  3. Unused variables (remove or use them)"
echo "  4. Missing useEffect dependencies"
echo ""
echo "📚 See LINT_FIX_GUIDE.md for detailed instructions"
echo ""
echo "🧪 Next Steps:"
echo "  1. Review remaining lint errors"
echo "  2. Apply manual fixes"
echo "  3. Test builds:"
echo "     - cd user_app/frontend && npx expo start"
echo "     - cd web_app && npm run build"
echo "     - cd admin_dashboard/frontend && npm run build"
echo ""
