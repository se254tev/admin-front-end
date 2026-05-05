# Admin Frontend Architecture

## Project Structure
```
admin-frontend/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── CardMetric.jsx   # Metric card component
│   │   ├── ConfirmModal.jsx # Delete confirmation modal
│   │   ├── LoadingSpinner.jsx
│   │   ├── Navbar.jsx       # Top navigation
│   │   └── Sidebar.jsx      # Left sidebar navigation
│   │
│   ├── pages/               # Page components
│   │   ├── Login.jsx        # Admin login page
│   │   ├── Dashboard.jsx    # Dashboard with analytics
│   │   ├── MenuManagement.jsx
│   │   ├── Orders.jsx
│   │   ├── Users.jsx
│   │   ├── Categories.jsx
│   │   └── Settings.jsx
│   │
│   ├── layouts/
│   │   └── AdminLayout.jsx  # Main layout wrapper
│   │
│   ├── services/
│   │   ├── api.js          # API service functions
│   │   └── axios.js        # Axios instance with auth
│   │
│   ├── context/
│   │   └── AuthContext.jsx # Authentication state
│   │
│   ├── routes/
│   │   └── ProtectedRoute.jsx # Route protection
│   │
│   ├── App.jsx             # Main app with routing
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
│
├── public/
├── dist/                   # Production build
├── .env                    # Environment variables
├── .env.example
├── .env.local             # Local development
├── package.json
├── vite.config.js
├── tailwind.config.cjs
├── postcss.config.cjs
├── netlify.toml           # Netlify deployment config
├── vercel.json            # Vercel deployment config
├── README.md
└── DEPLOYMENT.md
```

## Data Flow

### Authentication Flow
```
1. User visits /admin/login
2. Enters username and password
3. Submits form
4. API POST /api/admin/login
5. Backend returns JWT token
6. Token stored in localStorage
7. Token added to all subsequent requests
8. User redirected to /admin/dashboard
```

### API Request Flow
```
Request → AuthContext (JWT) → Axios interceptor → API call
↓
Backend receives request with Authorization header
↓
Backend validates JWT token
↓
Backend processes request and returns data
↓
Component receives data
↓
State updates → UI re-renders
```

### Component Hierarchy
```
App
├── Routes
│   ├── /admin/login → Login (public)
│   └── /admin/* → ProtectedRoute → AdminLayout
│       ├── Sidebar
│       ├── Navbar
│       └── Routes
│           ├── Dashboard
│           ├── MenuManagement
│           ├── Orders
│           ├── Users
│           ├── Categories
│           └── Settings
```

## Key Technologies

### React Ecosystem
- **React 18** - UI library
- **React Router DOM 6** - Client-side routing
- **Context API** - State management for auth
- **React Hot Toast** - Toast notifications

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS processing
- **Framer Motion** - Animations and transitions

### Data Visualization
- **Recharts** - React charts library
- **React Icons** - Icon library

### HTTP
- **Axios** - HTTP client with interceptors
- **JWT** - Secure authentication tokens

## Authentication

### Login Process
1. User provides credentials on login page
2. Frontend sends to `/api/admin/login`
3. Backend validates and returns JWT
4. Token stored in localStorage
5. Added as Bearer token in Authorization header
6. Auto-refreshed on component mount

### Protected Routes
- ProtectedRoute component checks for token
- If no token → redirect to /admin/login
- If token exists → render component
- Token auto-added to all admin API requests

### Token Management
- Stored in `localStorage` with key `admin_token`
- Added to axios interceptor automatically
- Expires based on backend configuration (default 8h)
- Cleared on logout

## State Management

### AuthContext
- `user` - Current admin user
- `token` - JWT token
- `login(credentials)` - Authenticate admin
- `logout()` - Clear auth and redirect
- `loading` - Loading state

### Component State
- Page components manage local state (loading, items, etc.)
- Form states for create/edit operations
- Modal states for confirmations

## API Integration

### Service Functions (src/services/api.js)
```javascript
// Dashboard
fetchDashboardMetrics()

// Menu
fetchMenuItems()
createMenuItem()
updateMenuItem()
deleteMenuItem()

// Orders
fetchOrders()
updateOrderStatus()
deleteOrder()

// Users
fetchUsers()
updateUserStatus()
deleteUser()

// Categories
fetchCategories()
createCategory()
deleteCategory()
```

### Error Handling
- Try-catch blocks in async operations
- Toast notifications for errors
- Fallback UI for loading states
- Console logging for debugging

## UI Components

### CardMetric
Displays key metrics with icon and value
```jsx
<CardMetric 
  title="Total Orders"
  value={100}
  icon={<FaShoppingCart />}
/>
```

### ConfirmModal
Delete confirmation with custom title/description
```jsx
<ConfirmModal
  open={isOpen}
  title="Delete item"
  description="This cannot be undone"
  onConfirm={handleDelete}
  onCancel={handleCancel}
/>
```

### LoadingSpinner
Centered loading animation

## Styling Approach

### Tailwind CSS
- Utility-first approach
- Custom colors: slate, emerald, rose, blue
- Responsive breakpoints: sm, md, lg, xl
- Dark mode compatible (future enhancement)

### Common Classes
```
Rounded: rounded-3xl, rounded-2xl
Padding: px-4 py-3, p-6
Shadow: shadow-soft
Border: border border-slate-200
Colors: text-slate-900, bg-slate-50
```

## Performance

### Optimization Strategies
1. **Code Splitting** - Dynamic imports for routes
2. **Lazy Loading** - Components load on demand
3. **Caching** - API responses cached where appropriate
4. **Image Optimization** - Base64 for menu images
5. **Bundle Size** - ~755KB minified

### Monitoring
- Vite build analysis
- Network tab for API calls
- React DevTools for component renders
- Lighthouse for performance scores

## Development Workflow

### Local Setup
```bash
npm install
npm run dev
```

### Building
```bash
npm run build  # Production build
npm run preview  # Preview build locally
```

### Environment Variables
- `.env` - Production variables
- `.env.local` - Local override variables
- `.env.example` - Template for developers

## Deployment Strategy

### CI/CD Pipeline
1. **Development** - Local testing with .env.local
2. **Build** - `npm run build` creates dist/
3. **Testing** - Run `npm run preview`
4. **Deploy** - Push to GitHub → Auto-deploy via Netlify/Vercel

### Hosting Options
- **Netlify** - Serverless functions + static hosting
- **Vercel** - Edge functions + serverless
- **Render** - Static site hosting

## Security Considerations

### Frontend
- JWT token in localStorage
- Secure HTTP headers
- CORS validation
- Input sanitization

### Backend Requirements
- Validate JWT tokens
- Hash admin passwords
- HTTPS only in production
- Rate limiting on login endpoint
- Secure CORS configuration

## Future Enhancements

1. **Dark Mode** - Theme toggle in settings
2. **Advanced Analytics** - More detailed charts
3. **Bulk Operations** - Select multiple items
4. **Export Data** - CSV/PDF reports
5. **Real-time Updates** - WebSocket for live order notifications
6. **Mobile App** - React Native version
7. **Multi-language** - Internationalization (i18n)
8. **Advanced Filtering** - Date ranges, custom filters
9. **Audit Logs** - Track all admin actions
10. **Two-Factor Auth** - Enhanced security
