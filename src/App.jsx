import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AppProvider, useApp } from './context/AppContext'
import ProtectedRoute from './components/ProtectedRoute'

// Auth pages
import Login from './pages/Login'
import Signup from './pages/Signup'

// Contractor pages
import ContractorDashboard from './pages/contractor/Dashboard'
import Products from './pages/contractor/Products'
import Cart from './pages/contractor/Cart'
import ContractorOrders from './pages/contractor/Orders'
import Projects from './pages/contractor/Projects'

// Dealer pages
import DealerDashboard from './pages/dealer/Dashboard'
import DealerListings from './pages/dealer/Listings'
import DealerOrders from './pages/dealer/Orders'
import DealerHistory from './pages/dealer/History'

// Admin pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminOrders from './pages/admin/Orders'
import AdminDelivery from './pages/admin/Delivery'

function RootRedirect() {
  const { user } = useApp()
  if (user) return <Navigate to={`/${user.role}/dashboard`} replace />
  return <Navigate to="/login" replace />
}

function AppRoutes() {
  return (
    <Routes>
      {/* Root */}
      <Route path="/" element={<RootRedirect />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Contractor */}
      <Route path="/contractor/dashboard" element={<ProtectedRoute role="contractor"><ContractorDashboard /></ProtectedRoute>} />
      <Route path="/contractor/products"  element={<ProtectedRoute role="contractor"><Products /></ProtectedRoute>} />
      <Route path="/contractor/cart"      element={<ProtectedRoute role="contractor"><Cart /></ProtectedRoute>} />
      <Route path="/contractor/orders"    element={<ProtectedRoute role="contractor"><ContractorOrders /></ProtectedRoute>} />
      <Route path="/contractor/projects"  element={<ProtectedRoute role="contractor"><Projects /></ProtectedRoute>} />

      {/* Dealer */}
      <Route path="/dealer/dashboard" element={<ProtectedRoute role="dealer"><DealerDashboard /></ProtectedRoute>} />
      <Route path="/dealer/listings"  element={<ProtectedRoute role="dealer"><DealerListings /></ProtectedRoute>} />
      <Route path="/dealer/orders"    element={<ProtectedRoute role="dealer"><DealerOrders /></ProtectedRoute>} />
      <Route path="/dealer/history"   element={<ProtectedRoute role="dealer"><DealerHistory /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/orders"    element={<ProtectedRoute role="admin"><AdminOrders /></ProtectedRoute>} />
      <Route path="/admin/delivery"  element={<ProtectedRoute role="admin"><AdminDelivery /></ProtectedRoute>} />

      {/* 404 fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid #334155',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#f97316', secondary: '#fff' } },
          }}
        />
      </BrowserRouter>
    </AppProvider>
  )
}
