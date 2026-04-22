import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { StatCard, StatusBadge } from '../../components/UI'
import { dealerAPI } from '../../services/api'

export default function DealerDashboard() {
  const { user } = useApp()
  const [orders, setOrders] = useState([])

  useEffect(() => {
    if (!user?._id) return
    dealerAPI.getOrders(user._id)
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [user])

  const pending = orders.filter(o => o.status === 'pending')
  const delivered = orders.filter(o => o.status === 'delivered')
  const revenue = delivered.reduce((s, o) => s + (o.total || 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back, {user?.name}</p>
        </div>
        <Link to="/dealer/listings" className="btn-primary text-sm">Manage Listings</Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Orders" value={orders.length} icon="📋" />
        <StatCard label="Pending" value={pending.length} icon="⏳" accent="text-amber-400" />
        <StatCard label="Delivered" value={delivered.length} icon="✅" accent="text-emerald-400" />
        <StatCard label="Revenue" value={`₹${(revenue/1000).toFixed(0)}k`} icon="💰" accent="text-brand-400" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { to: '/dealer/orders',   label: 'Incoming Orders', icon: '📥', badge: pending.length },
          { to: '/dealer/listings', label: 'My Listings',     icon: '🏷️', badge: null },
        ].map(a => (
          <Link key={a.to} to={a.to} className="card hover:border-slate-700 transition-colors flex items-center gap-3 py-4">
            <span className="text-2xl">{a.icon}</span>
            <span className="text-sm font-medium text-slate-200 flex-1">{a.label}</span>
            {a.badge > 0 && (
              <span className="bg-brand-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {a.badge}
              </span>
            )}
          </Link>
        ))}
      </div>

      {pending.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-white">Pending Requests</h2>
            <Link to="/dealer/orders" className="text-sm text-brand-400 hover:text-brand-300">View all →</Link>
          </div>
          <div className="space-y-3">
            {pending.slice(0, 3).map(order => {
              const date = new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
              return (
                <div key={order._id} className="card flex items-center justify-between">
                  <div>
                    <p className="font-mono text-sm text-brand-400">#{order._id.slice(-6)}</p>
                    <p className="text-sm text-white mt-0.5">{order.userId?.name || 'Contractor'}</p>
                    <p className="text-xs text-slate-500">{date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">₹{order.total?.toLocaleString()}</p>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
