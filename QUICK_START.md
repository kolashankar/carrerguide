# 🚀 CareerGuide - Quick Start Guide

## ⚡ 1-Minute Setup

### Step 1: Create Web App Environment File
```bash
cd web_app
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:8001/api
NEXT_PUBLIC_BACKEND_URL=http://localhost:8001
NEXT_PUBLIC_APP_NAME=CareerGuide
NEXT_PUBLIC_TOKEN_STORAGE_KEY=user_token
NEXT_PUBLIC_USER_STORAGE_KEY=user_data
EOF
cd ..
```

### Step 2: Install Admin Dashboard Dependencies
```bash
cd admin_dashboard/frontend
npm install lucide-react
cd ../..
```

### Step 3: Start All Services

**Terminal 1 - Backend:**
```bash
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

**Terminal 2 - Admin Dashboard:**
```bash
cd admin_dashboard/frontend
npm run dev
```

**Terminal 3 - Web App:**
```bash
cd web_app
npm run dev
```

**Terminal 4 - Mobile App (Optional):**
```bash
cd user_app/frontend
npx expo start
```

---

## 🔑 Login Credentials

### Admin Dashboard
- **URL**: http://localhost:3000
- **Email**: `kolashankar113@gmail.com`
- **Password**: `Shankar@113`

### API Endpoints
- **Backend**: http://localhost:8001
- **API Docs**: http://localhost:8001/docs
- **API Base**: http://localhost:8001/api

---

## 📱 Applications

| App | URL | Port | Status |
|-----|-----|------|--------|
| Backend API | http://localhost:8001 | 8001 | ✅ Configured |
| Admin Dashboard | http://localhost:3000 | 3000 | ✅ Configured |
| Web App | http://localhost:3001 | 3001 | ⚠️ Need .env.local |
| Mobile App | Expo Go | 19006 | ✅ Configured |

---

## 🔧 Key Configuration

### Backend
- **MongoDB**: `mongodb://localhost:27017`
- **Database**: `career_guide`
- **Gemini AI**: Configured ✅

### All Apps
- **JWT Expiration**: 7 days
- **File Upload**: 5-10MB max
- **Debug Mode**: Enabled

---

## 📚 Documentation

- **ENV_SETUP_COMPLETE.md** - Complete environment setup guide
- **ADMIN_DASHBOARD_REDESIGN.md** - Admin UI documentation
- **IMPLEMENTATION_GUIDE.md** - Development guide
- **web_app/ENV_CONFIGURATION.md** - Web app environment details

---

## ✅ Checklist

- [x] Backend .env configured
- [x] Admin Dashboard .env configured
- [x] Mobile App .env configured
- [ ] Web App .env.local created (run Step 1 above)
- [ ] MongoDB running
- [ ] lucide-react installed in admin dashboard

---

## 🎯 Next Steps

1. **Run Step 1** to create web app .env.local
2. **Start MongoDB** if not running
3. **Start Backend** (Terminal 1)
4. **Start Admin Dashboard** (Terminal 2)
5. **Login** with provided credentials
6. **Test Jobs CRUD** operations

---

## 🐛 Common Issues

**Issue**: Admin dashboard sidebar not showing  
**Fix**: Run `npm install lucide-react` in admin_dashboard/frontend

**Issue**: Backend connection failed  
**Fix**: Ensure MongoDB is running and backend started on port 8001

**Issue**: Web app can't connect to API  
**Fix**: Create .env.local file (see Step 1)

---

## 🎉 You're Ready!

All environment files are configured. Just create the web app `.env.local` file and start coding!

**Happy Coding! 🚀**
