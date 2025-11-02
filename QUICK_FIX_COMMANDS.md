# 🚀 Quick Fix Commands - Copy & Paste

## ⚡ Run This First (Automated Fix)

```bash
cd /home/kolashankar/Downloads/carrerguide-main
./fix-all-lint.sh
```

---

## 📱 Mobile App Manual Fixes

### 1. Fix Unescaped Quotes (8 files)
```bash
cd /home/kolashankar/Downloads/carrerguide-main/user_app/frontend

# Use sed to replace unescaped quotes
sed -i "s/Don't/Don\&apos;t/g" app/(auth)/login.tsx
sed -i "s/We're/We\&apos;re/g" app/(tabs)/contact.tsx
sed -i "s/Let's/Let\&apos;s/g" app/(tabs)/contact.tsx
sed -i "s/company's/company\&apos;s/g" app/(tabs)/dsa/company-[id].tsx
sed -i "s/You're/You\&apos;re/g" components/common/OfflineIndicator.tsx
```

### 2. Re-run Lint
```bash
npm run lint
```

---

## 🌐 Web App Manual Fixes

### 1. Create .env.local
```bash
cd /home/kolashankar/Downloads/carrerguide-main/web_app

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
```

### 2. Fix Unescaped Quotes
```bash
# Fix contact page
sed -i "s/We'd/We\&apos;d/g" app/contact/page.tsx
sed -i "s/We're/We\&apos;re/g" app/contact/page.tsx

# Fix login page
sed -i "s/Don't/Don\&apos;t/g" app/login/page.tsx

# Fix home page
sed -i "s/India's/India\&apos;s/g" app/page.tsx

# Fix FAQ
sed -i "s/CareerGuide's/CareerGuide\&apos;s/g" components/common/FAQ.tsx
```

### 3. Re-run Lint
```bash
npm run lint
```

---

## 🔧 Admin Dashboard

```bash
cd /home/kolashankar/Downloads/carrerguide-main/admin_dashboard/frontend

# Run lint
npm run lint

# Auto-fix what's possible
npm run lint -- --fix
```

---

## 🐍 Backend

```bash
cd /home/kolashankar/Downloads/carrerguide-main/backend

# Lint all Python files
find . -name "*.py" -not -path "./venv/*" -not -path "./.venv/*" | xargs pylint
```

---

## 🧪 Test Builds

### Mobile App
```bash
cd /home/kolashankar/Downloads/carrerguide-main/user_app/frontend
npx expo start --clear
```

### Web App
```bash
cd /home/kolashankar/Downloads/carrerguide-main/web_app
npm run build
```

### Admin Dashboard
```bash
cd /home/kolashankar/Downloads/carrerguide-main/admin_dashboard/frontend
npm run build
```

### Backend
```bash
cd /home/kolashankar/Downloads/carrerguide-main/backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

---

## 🔄 If Packages Still Installing

Check status:
```bash
cd /home/kolashankar/Downloads/carrerguide-main/user_app/frontend
ps aux | grep "expo install"
```

Wait for completion, then:
```bash
npm run lint
```

---

## 📊 Check Status

```bash
cd /home/kolashankar/Downloads/carrerguide-main

echo "=== Mobile App ==="
cd user_app/frontend && npm run lint 2>&1 | tail -5 && cd ../..

echo "=== Web App ==="
cd web_app && npm run lint 2>&1 | tail -5 && cd ..

echo "=== Admin Dashboard ==="
cd admin_dashboard/frontend && npm run lint 2>&1 | tail -5 && cd ../..
```

---

## ⚠️ If Errors Persist

### Clear All Caches
```bash
cd /home/kolashankar/Downloads/carrerguide-main

# Mobile app
cd user_app/frontend
rm -rf node_modules .expo .metro-cache
npm install
cd ../..

# Web app
cd web_app
rm -rf node_modules .next
npm install
cd ..

# Admin dashboard
cd admin_dashboard/frontend
rm -rf node_modules .next
npm install
cd ../..
```

---

## ✅ Verification Checklist

- [ ] Mobile app packages installed
- [ ] SortModal parsing error fixed
- [ ] Unescaped quotes fixed
- [ ] .env.local created for web app
- [ ] Lint scripts added
- [ ] All builds pass
- [ ] Apps run without errors

---

## 📝 Quick Summary

**Fixed Automatically**:
- ✅ SortModal parsing error
- ✅ Missing lint scripts
- ✅ ESLint configs
- ✅ Package installations

**Need Manual Fix** (10-15 min):
- 🔧 Unescaped quotes (use sed commands above)
- 🔧 TypeScript `any` types (see LINT_FIX_GUIDE.md)
- 🔧 Unused variables (review and remove)

**Total Time**: ~30-45 minutes for complete fix

---

**Run the automated script first, then apply manual fixes!**

```bash
./fix-all-lint.sh
```
