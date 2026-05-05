# Admin Frontend Deployment Guide

## Overview
The Bingo Meal Admin Frontend is a **separate React + Vite application** that runs independently from the customer frontend and connects to the shared backend API.

## Architecture
```
┌─────────────────────────────────────────────────────┐
│                    Backend API                       │
│         (Render: bingo-meal-backend.onrender.com)   │
├──────────────────┬──────────────────────────────────┤
│                  │                                   │
│          ┌───────┴────────┐                          │
│          │                │                          │
│    Customer Frontend   Admin Frontend               │
│  (Frontend Vercel)    (Separate Deploy)            │
│                                                      │
└─────────────────────────────────────────────────────┘
```

## Pre-Deployment Checklist
- [ ] Backend is deployed and running (https://bingo-meal-backend.onrender.com)
- [ ] Backend has JWT_SECRET configured
- [ ] Backend has ADMIN_USER and ADMIN_PASSWORD set
- [ ] Frontend can access backend API
- [ ] Environment variables are configured

## Option 1: Deploy to Netlify

### Step 1: Build the app
```bash
npm run build
```

### Step 2: Create Netlify Account
1. Go to https://app.netlify.com
2. Sign up or log in
3. Connect your GitHub repository

### Step 3: Deploy from GitHub
1. Click "New site from Git"
2. Select your repository
3. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

### Step 4: Set Environment Variables
1. Go to Site settings → Build & deploy → Environment
2. Add variable:
   ```
   VITE_API_URL=https://bingo-meal-backend.onrender.com
   ```
3. Redeploy

### Step 5: Configure Domain (Optional)
1. Site settings → Domain management
2. Add custom domain or use Netlify subdomain

### Result
Your admin app will be live at: `https://your-site-name.netlify.app`

---

## Option 2: Deploy to Vercel

### Step 1: Build the app (Local test)
```bash
npm run build
```

### Step 2: Create Vercel Account
1. Go to https://vercel.com
2. Sign up or log in with GitHub

### Step 3: Import Project
1. Click "Add New" → Project
2. Import Git Repository
3. Select your project

### Step 4: Configure Environment
1. Environment Variables:
   ```
   VITE_API_URL=https://bingo-meal-backend.onrender.com
   ```
2. Click Deploy

### Step 5: Custom Domain (Optional)
1. Settings → Domains
2. Add custom domain

### Result
Your admin app will be live at: `https://your-project.vercel.app`

---

## Option 3: Deploy to Render (Alternative)

### Step 1: Create Static Site
1. Go to https://render.com
2. New → Static Site
3. Connect GitHub repository

### Step 2: Build Configuration
- **Build command:** `npm run build`
- **Publish directory:** `dist`

### Step 3: Environment Variables
```
VITE_API_URL=https://bingo-meal-backend.onrender.com
```

### Step 4: Deploy
Click "Create Static Site"

### Result
Your admin app will be live at: `https://your-app-name.onrender.com`

---

## Local Development

### Setup
```bash
# 1. Install dependencies
npm install

# 2. Create .env.local for local backend
echo "VITE_API_URL=http://localhost:5000" > .env.local

# 3. Start dev server
npm run dev
```

### Access
- Admin Panel: http://localhost:4173
- Login with: `admin` / `password`

### Test Features
1. **Dashboard** - View metrics
2. **Menu** - Add/edit/delete items
3. **Orders** - Manage orders, change status
4. **Users** - Manage user accounts
5. **Categories** - Manage menu categories
6. **Settings** - View settings

---

## Environment Variables

### Production (.env)
```
VITE_API_URL=https://bingo-meal-backend.onrender.com
```

### Development (.env.local)
```
VITE_API_URL=http://localhost:5000
```

---

## Backend Requirements

### Endpoints Used by Admin
- `POST /api/admin/login` - Authenticate
- `GET /api/admin/dashboard` - Dashboard data
- `GET /api/admin/menu` - Fetch menu items
- `POST /api/admin/menu` - Create menu
- `PUT /api/admin/menu/:id` - Update menu
- `DELETE /api/admin/menu/:id` - Delete menu
- `GET /api/admin/orders` - Fetch orders
- `PUT /api/admin/orders/:id` - Update order
- `DELETE /api/admin/orders/:id` - Delete order
- `GET /api/admin/users` - Fetch users
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/categories` - Fetch categories
- `POST /api/admin/categories` - Create category
- `DELETE /api/admin/categories/:id` - Delete category

### Backend Environment (.env)
```
JWT_SECRET=your_secret_key
ADMIN_USER=admin
ADMIN_PASSWORD=password
```

---

## Troubleshooting

### Build Error
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### CORS Error
Ensure backend has CORS enabled:
```javascript
app.use(cors()); // Should be in server.js
```

### Login Not Working
1. Check backend credentials in .env
2. Verify JWT_SECRET is set
3. Test backend login: `curl -X POST http://localhost:5000/api/admin/login`

### API Calls Failing
1. Check VITE_API_URL is correct in .env
2. Verify backend is running and accessible
3. Check browser console for errors

---

## Production Checklist

Before deploying to production:

- [ ] Backend is stable and running
- [ ] JWT_SECRET is strong and secret
- [ ] ADMIN_USER and ADMIN_PASSWORD are secure
- [ ] VITE_API_URL points to production backend
- [ ] CORS is properly configured
- [ ] All API endpoints return correct data
- [ ] Error handling is in place
- [ ] Toast notifications work
- [ ] Auth flow is tested
- [ ] Mobile responsiveness verified

---

## Performance Optimization

### Code Splitting
The app bundles at ~755KB. To optimize:

1. Enable dynamic imports:
```javascript
const Dashboard = lazy(() => import('./pages/Dashboard'));
```

2. Update vite.config.js:
```javascript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom', 'react-router-dom'],
      }
    }
  }
}
```

### Caching
- Static assets auto-cached by Netlify/Vercel
- Set cache headers in netlify.toml or vercel.json

---

## Monitoring

### Key Metrics
- Build time
- Bundle size
- Page load time
- API response time
- Error rate

### Tools
- Netlify Analytics
- Vercel Analytics
- Browser DevTools
- Network tab

---

## Support & Documentation

- React: https://react.dev
- Vite: https://vitejs.dev
- Tailwind: https://tailwindcss.com
- Axios: https://axios-http.com
- React Router: https://reactrouter.com

For issues, check the browser console and network tab for detailed error messages.
