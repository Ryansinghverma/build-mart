# BuildMart — B2B Construction Materials Platform

A complete React frontend for a B2B construction materials marketplace with Contractor, Dealer, and Admin roles.

## Tech Stack
- **React 18** + **Vite**
- **Tailwind CSS** for styling
- **Axios** for API calls (with interceptors)
- **React Router v6** for navigation
- **react-hot-toast** for notifications

## Quick Start

```bash
cd buildmart
npm install
npm run dev
```

Open http://localhost:5173

## Demo Login

On the login page, select a role, enter any 10-digit phone, and use OTP **1234**.

| Role       | Redirects to              |
|------------|---------------------------|
| Contractor | /contractor/dashboard     |
| Dealer     | /dealer/dashboard         |
| Admin      | /admin/dashboard          |

## Project Structure

```
src/
├── components/
│   ├── Layout.jsx          # Sidebar + mobile nav wrapper
│   ├── Sidebar.jsx         # Role-based navigation sidebar
│   ├── ProtectedRoute.jsx  # Auth + role guard
│   └── UI.jsx              # StatusBadge, Loader, Modal, ProductCard, OrderCard, StatCard
├── context/
│   └── AppContext.jsx      # Global state: user, cart, auth
├── pages/
│   ├── Login.jsx           # Phone + OTP login
│   ├── Signup.jsx          # Role-based signup
│   ├── contractor/
│   │   ├── Dashboard.jsx   # Stats + recent orders
│   │   ├── Products.jsx    # Browse + filter + add to cart
│   │   ├── Cart.jsx        # Cart management + order placement
│   │   ├── Orders.jsx      # Order list with status filter
│   │   └── Projects.jsx    # Project/site management
│   ├── dealer/
│   │   ├── Dashboard.jsx   # Revenue stats + pending orders
│   │   ├── Listings.jsx    # Manage product prices & stock
│   │   ├── Orders.jsx      # Accept / reject incoming orders
│   │   └── History.jsx     # Completed order history
│   └── admin/
│       ├── Dashboard.jsx   # Platform-wide overview
│       ├── Orders.jsx      # View + update all order statuses
│       └── Delivery.jsx    # Assign drivers + set ETAs
├── services/
│   └── api.js              # Axios instance + all API endpoints
└── utils/
    └── mockData.js         # Mock products, orders, projects for demo
```

## Backend Integration

Set `VITE_API_URL` in a `.env` file (copy `.env.example`).

All API calls are in `src/services/api.js`:

```js
// Products
GET  /products?category=&sort=
GET  /products/:id

// Orders
POST /orders
GET  /orders/:userId
PUT  /orders/:id/status
PUT  /orders/:id/delivery

// Dealer
GET  /dealer/:dealerId/listings
PUT  /dealer/listing
GET  /dealer/:dealerId/orders
PUT  /dealer/orders/:id/accept
PUT  /dealer/orders/:id/reject

// Auth
POST /auth/send-otp
POST /auth/verify-otp
POST /auth/signup

// Projects
GET  /projects/:userId
POST /projects
PUT  /projects/:projectId/orders
```

Auth token is automatically attached to every request from `localStorage`.
401 responses auto-redirect to `/login`.
