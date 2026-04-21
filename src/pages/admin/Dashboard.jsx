import { Link } from 'react-router-dom'
import { StatCard, StatusBadge } from '../../components/UI'
import { MOCK_ORDERS, MOCK_DEALER_ORDERS } from '../../utils/mockData'

export default function AdminDashboard() {
  const allOrders = [...MOCK_ORDERS, ...MOCK_DEALER_ORDERS.filter(o => !MOCK_ORDERS.find(mo => mo.id === o.id))]
  const active = allOrders.filter(o => o.status === 'out_for_delivery').length
  const pending = allOrders.filter(o => o.status === 'pending').length
  const delivered = allOrders.filter(o => o.status === 'delivered').length
  const revenue = MOCK_ORDERS.reduce((s, o) => s + (o.total || 0), 0)

  const recent = MOCK_ORDERS.slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Platform overview</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Orders" value={MOCK_ORDERS.length} icon="📋" />
        <StatCard label="Active Deliveries" value={active} icon="🚚" accent="text-purple-400" />
        <StatCard label="Pending" value={pending} icon="⏳" accent="text-amber-400" />
        <StatCard label="Platform Revenue" value={`₹${(revenue / 1000).toFixed(0)}k`} icon="💰" accent="text-brand-400" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { to: '/admin/orders',   label: 'Manage Orders',      icon: '📋', color: 'text-blue-400' },
          { to: '/admin/delivery', label: 'Delivery Assignment', icon: '🚚', color: 'text-purple-400' },
        ].map(a => (
          <Link key={a.to} to={a.to} className="card hover:border-slate-700 transition-colors flex items-center gap-3 py-4">
            <span className={`text-2xl ${a.color}`}>{a.icon}</span>
            <span className="text-sm font-medium text-slate-200">{a.label}</span>
          </Link>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium text-white">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm text-brand-400 hover:text-brand-300">View all →</Link>
        </div>
        <div className="card p-0 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Order ID</th>
                <th className="text-left text-xs font-medium text-slate-500 px-5 py-3 hidden sm:table-cell">Dealer</th>
                <th className="text-right text-xs font-medium text-slate-500 px-5 py-3">Amount</th>
                <th className="text-right text-xs font-medium text-slate-500 px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {recent.map(order => (
                <tr key={order.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-5 py-3 font-mono text-sm text-brand-400">#{order.id}</td>
                  <td className="px-5 py-3 text-sm text-slate-400 hidden sm:table-cell">{order.dealer}</td>
                  <td className="px-5 py-3 text-right text-sm font-medium text-white">₹{order.total?.toLocaleString()}</td>
                  <td className="px-5 py-3 text-right"><StatusBadge status={order.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
