import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { OrderCard, EmptyState } from '../../components/UI'
import { ordersAPI } from '../../services/api'
import toast from 'react-hot-toast'

const STATUSES = ['all', 'pending', 'accepted', 'out_for_delivery', 'delivered']

export default function ContractorOrders() {
  const { user } = useApp()
  const [filter, setFilter] = useState('all')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?._id) return
    ordersAPI.getByUser(user._id)
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false))
  }, [user])

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-title">My Orders</h1>
        <p className="text-slate-500 text-sm mt-1">{orders.length} total orders</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {STATUSES.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium flex-shrink-0 capitalize transition-colors ${
              filter === s ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}>
            {s === 'all' ? 'All' : s.replace('_', ' ')}
            <span className="ml-1.5 text-xs opacity-70">
              {s === 'all' ? orders.length : orders.filter(o => o.status === s).length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="card text-center py-16 text-slate-500">Loading orders...</div>
      ) : filtered.length === 0 ? (
        <div className="card">
          <EmptyState icon="📋" title="No orders found" description="No orders match this filter" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(order => <OrderCard key={order._id} order={order} />)}
        </div>
      )}
    </div>
  )
}
