import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { StatCard, OrderCard, StatusBadge } from '../../components/UI'
import { MOCK_ORDERS } from '../../utils/mockData'

export default function ContractorDashboard() {
  const { user, cartCount } = useApp()
  const orders = MOCK_ORDERS.filter(o => o.userId === user?.id)
  const recentOrders = orders.slice(0, 3)
  const pendingCount = orders.filter(o => o.status === 'pending').length
  const deliveredCount = orders.filter(o => o.status === 'delivered').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back, {user?.name}</p>
        </div>
        <Link to="/contractor/products" className="btn-primary text-sm">
          + New Order
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Orders" value={orders.length} icon="📋" />
        <StatCard label="Pending" value={pendingCount} icon="⏳" accent="text-amber-400" />
        <StatCard label="Delivered" value={deliveredCount} icon="✅" accent="text-emerald-400" />
        <StatCard label="Cart Items" value={cartCount} icon="🛒" sub="ready to order" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { to: '/contractor/products', label: 'Browse Products', icon: '📦', color: 'text-blue-400' },
          { to: '/contractor/cart',     label: 'View Cart',       icon: '🛒', color: 'text-amber-400' },
          { to: '/contractor/orders',   label: 'My Orders',       icon: '📋', color: 'text-purple-400' },
          { to: '/contractor/projects', label: 'Projects',        icon: '🏗️', color: 'text-emerald-400' },
        ].map(a => (
          <Link key={a.to} to={a.to}
            className="card hover:border-slate-700 transition-colors flex items-center gap-3 py-4">
            <span className={`text-2xl ${a.color}`}>{a.icon}</span>
            <span className="text-sm font-medium text-slate-200">{a.label}</span>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium text-white">Recent Orders</h2>
          <Link to="/contractor/orders" className="text-sm text-brand-400 hover:text-brand-300">View all →</Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="card text-center py-10 text-slate-500">
            <p className="text-3xl mb-2">📦</p>
            <p>No orders yet. <Link to="/contractor/products" className="text-brand-400">Browse products</Link></p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentOrders.map(order => (
              <OrderCard key={order.id} order={order}
                actions={order.status === 'delivered' && (
                  <Link to="/contractor/products" className="btn-secondary text-xs">Reorder</Link>
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
