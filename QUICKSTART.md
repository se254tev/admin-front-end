# Admin Frontend - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
cd admin-frontend
npm install
```

### Step 2: Create .env File
```bash
# For production backend
echo "VITE_API_URL=https://bingo-meal-backend.onrender.com" > .env

# OR for local backend
echo "VITE_API_URL=http://localhost:5000" > .env
```

### Step 3: Start Dev Server
```bash
npm run dev
```

Visit: **http://localhost:4173**

---

## 📋 Admin Login Credentials

**Username:** `admin`
**Password:** `password`

(Configurable in backend .env variables: `ADMIN_USER` and `ADMIN_PASSWORD`)

---

## 🎯 What You Can Do

### Dashboard
- View total orders, revenue, users, meals
- See revenue trends (chart)
- Monitor order volume (chart)

### Menu Management
- **Create** - Add new meals with price, category, image
- **Edit** - Update meal details
- **Delete** - Remove meals with confirmation
- **Search** - Filter by name, category

### Order Management
- **View** - See all customer orders
- **Update Status** - Change: Pending → Preparing → Delivered → Cancelled
- **Delete** - Remove order records
- **Details** - View full order information

### User Management
- **View** - See all registered customers
- **Suspend** - Block/restore user accounts
- **Delete** - Remove user profiles
- **Search** - Find users by name, email, phone

### Categories
- **Create** - Add new meal categories
- **Delete** - Remove categories
- **View** - See all categories

### Settings
- Access platform settings (stub for future features)

---

## 🔧 Available Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 🌐 Deployment

See `DEPLOYMENT.md` for complete deployment guide to:
- Netlify
- Vercel
- Render

Quick version:
```bash
npm run build           # Creates dist/ folder
# Push to GitHub → Connect to hosting platform
# Set VITE_API_URL environment variable
# Deploy!
```

---

## 🔑 Authentication

The admin panel uses **JWT (JSON Web Tokens)**:

1. Admin logs in with username/password
2. Backend returns JWT token
3. Token stored in localStorage
4. Token auto-added to all admin API requests
5. Expires after 8 hours (auto-logout)

**Logout:** Click "Logout" button in top navbar

---

## 📡 API Connection

All requests go to: `https://bingo-meal-backend.onrender.com/api/admin/*`

Environment variable controls the URL:
- **Production**: `VITE_API_URL=https://bingo-meal-backend.onrender.com`
- **Local dev**: `VITE_API_URL=http://localhost:5000`

Override in `.env` or `.env.local`

---

## 🎨 UI Features

- **Sidebar Navigation** - Access all features
- **Search Bars** - Find items quickly
- **Confirmation Modals** - Prevent accidental deletes
- **Loading States** - See when data is loading
- **Toast Notifications** - Get feedback on actions
- **Responsive Design** - Works on mobile too
- **Dark Sidebar** - Professional dark theme

---

## ⚠️ Troubleshooting

### Login not working?
```
1. Check backend is running
2. Verify VITE_API_URL is correct
3. Check console for error messages
4. Ensure admin credentials are correct
```

### Can't see menu items?
```
1. Verify backend has seed data
2. Check browser Network tab for 401 errors
3. Ensure JWT token is valid
4. Try logout and login again
```

### API calls failing?
```
1. Check if backend is running: curl http://localhost:5000/
2. Verify CORS is enabled in backend
3. Check VITE_API_URL environment variable
4. Look at browser console for full error
```

### Build fails?
```
rm -rf node_modules dist
npm install
npm run build
```

---

## 📚 Documentation

- **README.md** - Feature overview
- **DEPLOYMENT.md** - Deploy to production
- **ARCHITECTURE.md** - Technical deep dive

---

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Axios Documentation](https://axios-http.com)

---

## 💡 Pro Tips

1. **Local Development** - Use `.env.local` to override `.env`
2. **Network Tab** - Open DevTools → Network to see API calls
3. **Console Errors** - Check browser console for detailed errors
4. **Hot Reload** - Vite auto-refreshes on code changes
5. **Component Inspector** - Right-click → Inspect to debug UI

---

## 🚢 Ready to Deploy?

1. Build locally: `npm run build`
2. See `DEPLOYMENT.md` for Netlify/Vercel/Render instructions
3. Set environment variables on hosting platform
4. Test everything with production backend

---

## 📞 Need Help?

Check the error message:
- **CORS Error** → Backend doesn't have cors enabled
- **401 Unauthorized** → JWT token invalid or missing
- **404 Not Found** → API endpoint doesn't exist on backend
- **Connection Refused** → Backend not running

Good luck! 🎉
