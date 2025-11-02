# Web App Environment Configuration

## Setup Instructions

Create a `.env.local` file in the `web_app` directory with the following content:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8001/api
NEXT_PUBLIC_BACKEND_URL=http://localhost:8001

# App Configuration
NEXT_PUBLIC_APP_NAME=CareerGuide
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_APP_DESCRIPTION=Your Career Companion - Jobs, Internships, DSA & More
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Authentication
NEXT_PUBLIC_JWT_EXPIRATION=7d
NEXT_PUBLIC_TOKEN_STORAGE_KEY=user_token
NEXT_PUBLIC_USER_STORAGE_KEY=user_data

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
NEXT_PUBLIC_ENABLE_DARK_MODE=true
NEXT_PUBLIC_ENABLE_PWA=true

# Social Authentication (Optional)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_GITHUB_CLIENT_ID=your-github-client-id

# WhatsApp Community
NEXT_PUBLIC_WHATSAPP_COMMUNITY_URL=https://chat.whatsapp.com/your-community-link

# Social Media Links
NEXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/company/careerguide
NEXT_PUBLIC_TWITTER_URL=https://twitter.com/careerguide
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/careerguide
NEXT_PUBLIC_FACEBOOK_URL=https://facebook.com/careerguide

# Contact Information
NEXT_PUBLIC_SUPPORT_EMAIL=support@careerguide.com
NEXT_PUBLIC_CONTACT_EMAIL=kolashankar113@gmail.com
NEXT_PUBLIC_PHONE=+91-1234567890

# File Upload
NEXT_PUBLIC_MAX_FILE_SIZE=5242880
NEXT_PUBLIC_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf

# Pagination
NEXT_PUBLIC_DEFAULT_PAGE_SIZE=20
NEXT_PUBLIC_JOBS_PER_PAGE=12
NEXT_PUBLIC_ARTICLES_PER_PAGE=9

# SEO Configuration
NEXT_PUBLIC_SITE_NAME=CareerGuide
NEXT_PUBLIC_SITE_DESCRIPTION=Find your dream job, internship, scholarship, and master DSA with CareerGuide
NEXT_PUBLIC_SITE_KEYWORDS=jobs,internships,scholarships,dsa,interview,career,placement

# Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_ANALYTICS_ENABLED=false

# Development Settings
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_LOG_LEVEL=info
NEXT_PUBLIC_SHOW_DEV_TOOLS=true
```

## Quick Setup Command

Run this command to create the `.env.local` file:

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

## Environment Variables Explanation

### API Configuration
- `NEXT_PUBLIC_API_URL` - Backend API endpoint for data fetching
- `NEXT_PUBLIC_BACKEND_URL` - Base backend URL

### App Configuration
- `NEXT_PUBLIC_APP_NAME` - Application name displayed in UI
- `NEXT_PUBLIC_APP_VERSION` - Current version number
- `NEXT_PUBLIC_APP_URL` - Frontend URL (for SEO and sharing)

### Authentication
- `NEXT_PUBLIC_JWT_EXPIRATION` - JWT token expiration time
- `NEXT_PUBLIC_TOKEN_STORAGE_KEY` - LocalStorage key for auth token
- `NEXT_PUBLIC_USER_STORAGE_KEY` - LocalStorage key for user data

### Feature Flags
- `NEXT_PUBLIC_ENABLE_ANALYTICS` - Enable/disable analytics tracking
- `NEXT_PUBLIC_ENABLE_NOTIFICATIONS` - Enable/disable notifications
- `NEXT_PUBLIC_ENABLE_DARK_MODE` - Enable/disable dark mode toggle
- `NEXT_PUBLIC_ENABLE_PWA` - Enable Progressive Web App features

### File Upload
- `NEXT_PUBLIC_MAX_FILE_SIZE` - Maximum file size in bytes (5MB default)
- `NEXT_PUBLIC_ALLOWED_FILE_TYPES` - Comma-separated list of MIME types

### Pagination
- `NEXT_PUBLIC_DEFAULT_PAGE_SIZE` - Default items per page
- `NEXT_PUBLIC_JOBS_PER_PAGE` - Jobs per page on jobs listing
- `NEXT_PUBLIC_ARTICLES_PER_PAGE` - Articles per page on learning section

## Important Notes

1. **Never commit `.env.local` to git** - It's already in `.gitignore`
2. **Use `NEXT_PUBLIC_` prefix** for variables that need to be exposed to the browser
3. **Server-only secrets** should NOT have the `NEXT_PUBLIC_` prefix
4. **Restart dev server** after changing environment variables

## For Production

Create a `.env.production.local` file with production values:

```env
NEXT_PUBLIC_API_URL=https://api.careerguide.com/api
NEXT_PUBLIC_BACKEND_URL=https://api.careerguide.com
NEXT_PUBLIC_APP_URL=https://careerguide.com
NEXT_PUBLIC_DEBUG_MODE=false
NEXT_PUBLIC_LOG_LEVEL=error
```

## Verification

After creating the `.env.local` file, verify it's working:

```bash
npm run dev
# Check console for: "API URL: http://localhost:8001/api"
```
