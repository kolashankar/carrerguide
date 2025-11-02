# Environment Configuration - Complete Setup Guide

## ✅ Updated Files

### 1. Backend Environment ✅
**File**: `/backend/.env`

**Updated Configuration:**
- ✅ MongoDB URL: `mongodb://localhost:27017`
- ✅ Database Name: `career_guide`
- ✅ JWT Secret: Strong secret key
- ✅ JWT Expiration: 7 days
- ✅ Gemini AI API Key: `AIzaSyAP3N0jTzOMpLTRyy9d77Osq2gwpxZned4`
- ✅ Server: Host `0.0.0.0`, Port `8001`
- ✅ CORS Origins: All frontend apps allowed
- ✅ Admin Credentials: `kolashankar113@gmail.com` / `Shankar@113`
- ✅ File Upload: Max 10MB, uploads directory
- ✅ Email Config: SMTP settings (optional)
- ✅ Redis: URL for caching (optional)
- ✅ Rate Limiting: 100 requests per 15 min window

---

### 2. Admin Dashboard Environment ✅
**File**: `/admin_dashboard/frontend/.env`

**Updated Configuration:**
- ✅ API URL: `http://localhost:8001/api`
- ✅ Backend URL: `http://localhost:8001`
- ✅ App Name: CareerGuide Admin Dashboard
- ✅ Version: 2.0.0
- ✅ JWT Expiration: 7 days
- ✅ Storage Keys: `admin_token`, `admin_user`
- ✅ Feature Flags: Analytics, Notifications, AI, Bulk Operations
- ✅ Pagination: 20 items per page (max 100)
- ✅ File Upload: Max 10MB, image/PDF types
- ✅ Gemini API Key: Included
- ✅ Debug Mode: Enabled
- ✅ Admin Credentials: Reference included

---

### 3. Mobile App Environment ✅
**File**: `/user_app/frontend/.env`

**Updated Configuration:**
- ✅ Expo Subdomain: `careerguide-mobile`
- ✅ API URL: `http://localhost:8001/api`
- ✅ Backend URL: `http://localhost:8001`
- ✅ Physical Device Testing: IP address instructions included
- ✅ App Name: CareerGuide
- ✅ Version: 1.0.0
- ✅ JWT Expiration: 7 days
- ✅ Storage Keys: `user_token`, `user_data`
- ✅ Feature Flags: Notifications, Biometric Auth, Offline Mode
- ✅ WhatsApp Community: URL placeholder
- ✅ Social Media: LinkedIn, Twitter, Instagram links
- ✅ File Upload: Max 5MB, image types
- ✅ Analytics: Optional configuration
- ✅ Debug Mode: Enabled

---

### 4. Web App Environment ⚠️
**File**: `/web_app/.env.local` (needs to be created manually)

**Documentation**: `/web_app/ENV_CONFIGURATION.md` ✅

**Why Manual?**
- The `.env.local` file is blocked by `.gitignore` (correct for security)
- I've created a comprehensive configuration guide instead

**Quick Setup:**
```bash
cd web_app
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:8001/api
NEXT_PUBLIC_BACKEND_URL=http://localhost:8001
NEXT_PUBLIC_APP_NAME=CareerGuide
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_JWT_EXPIRATION=7d
NEXT_PUBLIC_TOKEN_STORAGE_KEY=user_token
NEXT_PUBLIC_USER_STORAGE_KEY=user_data
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
NEXT_PUBLIC_WHATSAPP_COMMUNITY_URL=https://chat.whatsapp.com/your-community-link
NEXT_PUBLIC_SUPPORT_EMAIL=support@careerguide.com
NEXT_PUBLIC_CONTACT_EMAIL=kolashankar113@gmail.com
NEXT_PUBLIC_MAX_FILE_SIZE=5242880
NEXT_PUBLIC_DEFAULT_PAGE_SIZE=20
NEXT_PUBLIC_DEBUG_MODE=true
EOF
```

---

## 🔑 Key Credentials Summary

### Admin Access
- **Email**: `kolashankar113@gmail.com`
- **Password**: `Shankar@113`
- **Used for**: Admin Dashboard login

### API Keys
- **Gemini AI**: `AIzaSyAP3N0jTzOMpLTRyy9d77Osq2gwpxZned4`
- **Used for**: AI-powered job generation, content creation

### Database
- **MongoDB URL**: `mongodb://localhost:27017`
- **Database Name**: `career_guide`

### JWT
- **Secret**: `careerguide-super-secret-jwt-key-2024-change-in-production-shankar113`
- **Expiration**: 7 days

---

## 🚀 Quick Start Guide

### 1. Start Backend
```bash
cd backend
# Ensure .env is configured (already done ✅)
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

### 2. Start Admin Dashboard
```bash
cd admin_dashboard/frontend
# Ensure .env is configured (already done ✅)
npm install lucide-react  # If not already installed
npm run dev
# Opens on http://localhost:3000
```

### 3. Start Web App
```bash
cd web_app
# Create .env.local file first (see command above)
npm run dev
# Opens on http://localhost:3001 (or next available port)
```

### 4. Start Mobile App
```bash
cd user_app/frontend
# Ensure .env is configured (already done ✅)
npm start
# or
npx expo start
```

---

## 📋 Environment Variables by App

### Backend (.env)
| Variable | Value | Purpose |
|----------|-------|---------|
| MONGO_URL | mongodb://localhost:27017 | Database connection |
| DB_NAME | career_guide | Database name |
| JWT_SECRET | [secure-key] | Token signing |
| GEMINI_API_KEY | AIzaSy... | AI features |
| PORT | 8001 | Server port |
| CORS_ORIGINS | localhost:3000,3001,19006,8081 | Allowed origins |

### Admin Dashboard (.env)
| Variable | Value | Purpose |
|----------|-------|---------|
| NEXT_PUBLIC_API_URL | http://localhost:8001/api | API endpoint |
| NEXT_PUBLIC_APP_VERSION | 2.0.0 | App version |
| NEXT_PUBLIC_ENABLE_AI_FEATURES | true | AI features toggle |
| NEXT_PUBLIC_GEMINI_API_KEY | AIzaSy... | AI integration |

### Mobile App (.env)
| Variable | Value | Purpose |
|----------|-------|---------|
| EXPO_PUBLIC_API_URL | http://localhost:8001/api | API endpoint |
| EXPO_PUBLIC_APP_NAME | CareerGuide | App name |
| EXPO_PUBLIC_ENABLE_BIOMETRIC_AUTH | true | Biometric login |

### Web App (.env.local - to be created)
| Variable | Value | Purpose |
|----------|-------|---------|
| NEXT_PUBLIC_API_URL | http://localhost:8001/api | API endpoint |
| NEXT_PUBLIC_APP_NAME | CareerGuide | App name |
| NEXT_PUBLIC_ENABLE_NOTIFICATIONS | true | Notifications toggle |

---

## 🔧 Configuration Details

### CORS Configuration
The backend allows requests from:
- `http://localhost:3000` - Admin Dashboard
- `http://localhost:3001` - Web App
- `http://localhost:19006` - Expo Web
- `http://localhost:8081` - Expo Mobile

### File Upload Limits
- **Admin Dashboard**: 10MB (images, PDFs)
- **Web App**: 5MB (images, PDFs)
- **Mobile App**: 5MB (images only)

### JWT Token Storage
- **Admin Dashboard**: `localStorage.admin_token`
- **Web App**: `localStorage.user_token`
- **Mobile App**: `AsyncStorage.user_token`

### Feature Flags
All apps have configurable feature flags:
- Analytics tracking
- Push notifications
- AI-powered features
- Dark mode (web apps)
- Biometric authentication (mobile)
- Offline mode (mobile)

---

## 🔒 Security Notes

### Development vs Production

**Development (Current Setup):**
- ✅ Debug mode enabled
- ✅ Detailed error messages
- ✅ CORS allows localhost
- ✅ Credentials in comments for reference

**Production (Before Deployment):**
- ⚠️ Change JWT_SECRET to a strong random key
- ⚠️ Change DEFAULT_ADMIN_PASSWORD
- ⚠️ Set DEBUG_MODE=false
- ⚠️ Update CORS_ORIGINS to production domains
- ⚠️ Use environment-specific API URLs
- ⚠️ Enable HTTPS
- ⚠️ Set up proper SMTP credentials
- ⚠️ Configure Redis for caching
- ⚠️ Set up proper analytics IDs

### Sensitive Information
Never commit these to git:
- `.env` files (already in .gitignore)
- API keys
- Database credentials
- JWT secrets
- Admin passwords

---

## 📱 Testing on Physical Devices

### Mobile App on Physical Device

1. Find your computer's IP address:
```bash
# Linux/Mac
ifconfig | grep "inet "
# or
ip addr show

# Windows
ipconfig
```

2. Update mobile app `.env`:
```env
# Replace localhost with your IP
EXPO_PUBLIC_API_URL=http://192.168.1.100:8001/api
EXPO_PUBLIC_BACKEND_URL=http://192.168.1.100:8001
```

3. Ensure backend allows your IP in CORS

4. Connect phone to same WiFi network

5. Start Expo:
```bash
npx expo start
```

6. Scan QR code with Expo Go app

---

## 🐛 Troubleshooting

### Backend not connecting
- ✅ Check MongoDB is running: `mongosh`
- ✅ Verify port 8001 is not in use: `lsof -i :8001`
- ✅ Check CORS settings in backend .env

### Admin Dashboard can't login
- ✅ Verify backend is running
- ✅ Check API_URL in admin .env
- ✅ Use credentials: `kolashankar113@gmail.com` / `Shankar@113`
- ✅ Check browser console for errors

### Mobile app can't fetch data
- ✅ Use correct IP address (not localhost on physical device)
- ✅ Ensure phone and computer on same network
- ✅ Check backend CORS allows the origin
- ✅ Restart Expo dev server

### Web app environment variables not working
- ✅ Ensure `.env.local` file exists
- ✅ Variables must start with `NEXT_PUBLIC_`
- ✅ Restart Next.js dev server after changes
- ✅ Clear browser cache

---

## ✅ Verification Checklist

- [x] Backend .env updated with all credentials
- [x] Admin Dashboard .env updated
- [x] Mobile App .env updated
- [ ] Web App .env.local created (manual step required)
- [x] MongoDB connection string configured
- [x] JWT secret configured
- [x] Gemini API key configured
- [x] CORS origins configured
- [x] Admin credentials documented
- [x] File upload limits set
- [x] Feature flags configured

---

## 📞 Support

If you encounter issues:

1. Check this documentation
2. Verify all .env files are properly configured
3. Ensure all services are running (MongoDB, Backend)
4. Check console/terminal for error messages
5. Verify network connectivity for mobile testing

---

## 🎉 Summary

**Status**: ✅ **3 out of 4 environment files updated**

**Completed:**
- ✅ Backend `.env` - Fully configured
- ✅ Admin Dashboard `.env` - Fully configured  
- ✅ Mobile App `.env` - Fully configured
- ✅ Web App documentation created

**Action Required:**
- ⚠️ Create Web App `.env.local` file manually (command provided above)

**All credentials are configured and ready to use!**

---

**Last Updated**: November 2, 2025  
**Configuration Version**: 2.0
