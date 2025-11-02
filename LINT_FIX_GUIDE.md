# Lint Errors Fix Guide

## Summary of Issues

### Mobile App (user_app/frontend)
- ✅ **SortModal parsing error** - FIXED
- ⚠️ Missing `expo-linear-gradient` package - Installing
- ⚠️ Missing `react-native-worklets` package - Installing
- ⚠️ Package version mismatches - Running `expo install --fix`
- 🔧 29 errors, 59 warnings (mostly unused vars and unescaped quotes)

### Web App (web_app)
- 🔧 47 errors, 47 warnings
- Main issues: `any` types, unescaped quotes, unused variables

### Admin Dashboard (admin_dashboard/frontend)
- ✅ **Missing lint script** - FIXED
- ✅ **ESLint config** - CREATED
- Need to run lint to see issues

### Backend
- ⚠️ Pylint command incorrect - needs proper module path

---

## Quick Fixes

### 1. Mobile App - Install Dependencies (Running)
```bash
cd user_app/frontend
npm install react-native-worklets expo-linear-gradient
npx expo install --fix
```

### 2. Mobile App - Fix Common Lint Errors

**Unescaped Quotes** - Replace `'` with `&apos;`:
```bash
cd user_app/frontend
# Auto-fix what's possible
npm run lint -- --fix
```

### 3. Web App - Fix Common Lint Errors

**Auto-fix unused vars and formatting**:
```bash
cd web_app
npm run lint -- --fix
```

### 4. Backend - Correct Pylint Command

Instead of:
```bash
pylint --disable=all --enable=E,F --score=no --output-format=colorized backend
```

Use:
```bash
cd backend
# Lint specific files
pylint --disable=all --enable=E,F --score=no --output-format=colorized *.py

# Or lint all Python files
find . -name "*.py" -not -path "./venv/*" -not -path "./.venv/*" | xargs pylint --disable=all --enable=E,F --score=no
```

---

## Detailed Fix Instructions

### Mobile App Fixes

#### 1. Unescaped Quotes (29 instances)
Replace `'` with `&apos;` in JSX:

**Example**:
```tsx
// Before
<Text>Don't worry</Text>

// After
<Text>Don&apos;t worry</Text>
```

**Files to fix**:
- `app/(auth)/login.tsx` (line 120)
- `app/(tabs)/contact.tsx` (lines 72, 101)
- `app/(tabs)/dsa/company-[id].tsx` (lines 361, 373)
- `app/(tabs)/jobs/[id].tsx` (lines 42)
- `app/(tabs)/learning/[id].tsx` (lines 135)
- `components/common/OfflineIndicator.tsx` (line 23)

#### 2. Unused Variables
Remove or use these variables:
- `loading` in `app/(tabs)/dsa/index.tsx`
- `router` in various files
- `error` in catch blocks (prefix with `_` if intentionally unused)

#### 3. Missing Dependencies in useEffect
Add missing dependencies or use `// eslint-disable-next-line react-hooks/exhaustive-deps`

---

### Web App Fixes

#### 1. Replace `any` Types (47 instances)

**In `lib/api.ts`** - Define proper types:
```typescript
// Before
export const getJobs = async (params?: any) => {

// After
interface JobParams {
  search?: string;
  category?: string;
  location?: string;
  job_type?: string;
}
export const getJobs = async (params?: JobParams) => {
```

#### 2. Unescaped Quotes
Same as mobile app - replace `'` with `&apos;`

**Files**:
- `app/contact/page.tsx` (lines 83, 125, 133)
- `app/login/page.tsx` (line 126)
- `app/page.tsx` (line 82)
- `components/common/FAQ.tsx` (line 57)

#### 3. Image Optimization
Replace `<img>` with Next.js `<Image>`:

```tsx
// Before
<img src={job.logo} alt={job.company} />

// After
import Image from 'next/image'
<Image src={job.logo} alt={job.company} width={100} height={100} />
```

---

### Admin Dashboard Fixes

Run lint to see issues:
```bash
cd admin_dashboard/frontend
npm run lint
```

Then apply similar fixes as web app.

---

## Automated Fix Commands

### Run These in Order:

```bash
# 1. Mobile App
cd user_app/frontend
npm install react-native-worklets expo-linear-gradient
npx expo install --fix
npm run lint -- --fix
cd ../..

# 2. Web App  
cd web_app
npm run lint -- --fix
cd ..

# 3. Admin Dashboard
cd admin_dashboard/frontend
npm install eslint --save-dev
npm run lint -- --fix
cd ../..

# 4. Backend
cd backend
# Create a .pylintrc file to configure pylint
cat > .pylintrc << 'EOF'
[MASTER]
ignore=venv,.venv,node_modules

[MESSAGES CONTROL]
disable=all
enable=E,F

[REPORTS]
output-format=colorized
score=no
EOF

# Run pylint on all Python files
find . -name "*.py" -not -path "./venv/*" -not -path "./.venv/*" | xargs pylint
cd ..
```

---

## Manual Fixes Required

### 1. Unescaped Quotes
These cannot be auto-fixed. Search and replace:
- Find: `'` (in JSX text)
- Replace: `&apos;`

### 2. Any Types
Define proper interfaces/types for each `any` usage

### 3. Unused Variables
Either use them or remove them

### 4. Image Tags
Replace with Next.js Image component

---

## ESLint Configuration

### Suppress Specific Rules (if needed)

**For a single line**:
```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data: any = await fetch()
```

**For a file**:
```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
// file content
/* eslint-enable @typescript-eslint/no-explicit-any */
```

**In .eslintrc.json** (make warnings instead of errors):
```json
{
  "rules": {
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": "warn",
    "react/no-unescaped-entities": "warn"
  }
}
```

---

## Build Commands

After fixing lint errors, test builds:

```bash
# Mobile App
cd user_app/frontend
npx expo start --clear

# Web App
cd web_app
npm run build

# Admin Dashboard
cd admin_dashboard/frontend
npm run build

# Backend
cd backend
python -m pytest  # if you have tests
```

---

## Priority Fixes

### High Priority (Breaks Build):
1. ✅ SortModal parsing error - FIXED
2. ⏳ Missing packages (expo-linear-gradient, react-native-worklets) - INSTALLING
3. ⏳ Package version mismatches - FIXING

### Medium Priority (Lint Errors):
1. Unescaped quotes (easy find-replace)
2. `any` types (define proper types)
3. Unused variables (remove or use)

### Low Priority (Lint Warnings):
1. Missing useEffect dependencies
2. Image optimization suggestions
3. Unused imports

---

## Status

- ✅ SortModal parsing error fixed
- ✅ Admin dashboard lint script added
- ✅ Admin dashboard ESLint config created
- ⏳ Installing mobile app dependencies
- ⏳ Fixing package versions
- 🔧 Manual fixes needed for quotes and types

---

## Next Steps

1. Wait for package installations to complete
2. Run auto-fix commands above
3. Manually fix remaining unescaped quotes
4. Define proper TypeScript types
5. Test builds
6. Commit changes

---

**Estimated Time**: 
- Auto-fixes: 5-10 minutes
- Manual fixes: 30-60 minutes
- Testing: 15-30 minutes
