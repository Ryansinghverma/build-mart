import { NavLink, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import toast from 'react-hot-toast'

const NAV = {
  contractor: [
    { to: '/contractor/dashboard', label: 'Dashboard', icon: '⊞' },
    { to: '/contractor/products',  label: 'Products',  icon: '📦' },
    { to: '/contractor/cart',      label: 'Cart',      icon: '🛒', badge: true },
    { to: '/contractor/orders',    label: 'Orders',    icon: '📋' },
    { to: '/contractor/projects',  label: 'Projects',  icon: '🏗️' },
  ],
  dealer: [
    { to: '/dealer/dashboard', label: 'Dashboard', icon: '⊞' },
    { to: '/dealer/listings',  label: 'My Listings', icon: '🏷️' },
    { to: '/dealer/orders',    label: 'Orders',     icon: '📋' },
    { to: '/dealer/history',   label: 'History',    icon: '🕐' },
  ],
  admin: [
    { to: '/admin/dashboard', label: 'Dashboard',  icon: '⊞' },
    { to: '/admin/orders',    label: 'Orders',      icon: '📋' },
    { to: '/admin/delivery',  label: 'Delivery',    icon: '🚚' },
  ],
}

export default function Sidebar({ mobile, onClose }) {
  const { user, logout, cartCount } = useApp()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out')
    navigate('/login')
  }

  const links = NAV[user?.role] || []
  const roleLabel = { contractor: 'Contractor', dealer: 'Dealer', admin: 'Admin' }[user?.role]

  return (
    <aside className={`flex flex-col h-full bg-slate-950 border-r border-slate-800 ${mobile ? 'w-full' : 'w-60'}`}>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">B</div>
          <span className="font-semibold text-white">BuildMart</span>
        </div>
      </div>

      {/* User info */}
      <div className="px-5 py-4 border-b border-slate-800">
        <p className="text-sm font-medium text-white truncate">{user?.name}</p>
        <p className="text-xs text-slate-500">{roleLabel} · {user?.phone}</p>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-500/15 text-brand-400'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
              }`
            }
          >
            <span className="text-base">{link.icon}</span>
            <span className="flex-1">{link.label}</span>
            {link.badge && cartCount > 0 && (
              <span className="bg-brand-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
        >
          <span>⏻</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
