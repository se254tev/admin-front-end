# Admin Frontend - Bingo Meal
Professional admin dashboard for meal ordering platform management.

## Features
✅ Admin Authentication with JWT
✅ Dashboard Analytics (Orders, Revenue, Users, Meals)
✅ Menu Management (Create, Edit, Delete meals)
✅ Order Management (Status updates, Details view)
✅ User Management (Suspend, Delete users)
✅ Category Management
✅ Responsive Design (Desktop & Mobile)
✅ Modern UI with Tailwind CSS
✅ Real-time data fetching
✅ Error handling & Toast notifications

## Tech Stack
- React + Vite
- Tailwind CSS
- Axios
- React Router DOM
- React Icons
- Framer Motion
- Recharts
- React Hot Toast

## Setup & Installation

### 1. Install dependencies
```bash
npm install
```

### 2. Create .env file
```bash
cp .env.example .env
```

Update `VITE_API_URL` with your backend URL:
```
VITE_API_URL=https://bingo-meal-backend.onrender.com
```

### 3. Start development server
```bash
npm run dev
```
Visit `http://localhost:4173`

### 4. Build for production
```bash
npm run build
```

## Admin Credentials
- **Username:** admin
- **Password:** password
(Configurable via backend environment variables)

## API Endpoints
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/dashboard` - Dashboard metrics
- `GET /api/admin/menu` - Get all menu items
- `POST /api/admin/menu` - Create menu item
- `PUT /api/admin/menu/:id` - Update menu item
- `DELETE /api/admin/menu/:id` - Delete menu item
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id` - Update order status
- `DELETE /api/admin/orders/:id` - Delete order
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user status
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/categories` - Get categories
- `POST /api/admin/categories` - Create category
- `DELETE /api/admin/categories/:id` - Delete category

## Deployment

### Deploy to Netlify
1. Build: `npm run build`
2. Create `netlify.toml`:
```toml
[build]
command = "npm run build"
publish = "dist"

[[redirects]]
from = "/*"
to = "/index.html"
status = 200
```
3. Push to GitHub and connect with Netlify

### Deploy to Vercel
1. Build: `npm run build`
2. Push to GitHub
3. Connect repository to Vercel
4. Set environment variables in Vercel dashboard

## Project Structure
```
src/
├── components/      # Reusable components
├── pages/          # Page components
├── layouts/        # Layout components
├── services/       # API services
├── context/        # Auth context
├── routes/         # Protected routes
├── App.jsx         # Main app
├── main.jsx        # Entry point
└── index.css       # Global styles
```

## License
ISC
