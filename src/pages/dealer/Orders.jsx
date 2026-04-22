import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { StatusBadge, EmptyState } from '../../components/UI'
import { dealerAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function DealerOrders() {
  const { user } = useApp()
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?._id) return
    dealerAPI.getOrders(user._id)
      .then(data => setOrders(Array.isArray(data) ? data.filter(o => o.status !== 'delivered') : []))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false))
  }, [user])

  const updateStatus = async (id, action) => {
    try {
      if (action === 'accepted') await dealerAPI.acceptOrder(id)
      else await dealerAPI.rejectOrder(id)
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status: action === 'accepted' ? 'accepted' : 'rejected' } : o))
      toast.success(action === 'accepted' ? 'Order accepted!' : 'Order rejected')
    } catch (err) {
      toast.error(err.message || 'Action failed')
    }
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-title">Incoming Orders</h1>
        <p className="text-slate-500 text-sm mt-1">{orders.filter(o => o.status === 'pending').length} pending requests</p>
      </div>

      <div className="flex gap-2">
        {['all', 'pending', 'accepted'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
              filter === s ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}>
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="card text-center py-16 text-slate-500">Loading orders...</div>
      ) : filtered.length === 0 ? (
        <div className="card">
          <EmptyState icon="📥" title="No orders" description="New orders will appear here" />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => {
            const date = new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
            return (
              <div key={order._id} className="card">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-sm text-brand-400">#{order._id.slice(-6)}</p>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-white font-medium mt-1">{order.userId?.name || 'Contractor'}</p>
                    <p className="text-xs text-slate-500">{date}</p>
                  </div>
                  <p className="font-bold text-white text-lg">₹{order.total?.toLocaleString()}</p>
                </div>

                <div className="bg-slate-800 rounded-lg p-3 mb-3 space-y-1">
                  {(order.items || []).map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-slate-300">{item.product?.name || 'Product'}</span>
                      <span className="text-slate-500">{item.quantity} {item.product?.unit}</span>
                    </div>
                  ))}
                </div>

                {order.status === 'pending' && (
                  <div className="flex gap-3">
                    <button onClick={() => updateStatus(order._id, 'rejected')} className="btn-danger flex-1 text-sm">
                      ✕ Reject
                    </button>
                    <button onClick={() => updateStatus(order._id, 'accepted')} className="btn-success flex-1 text-sm">
                      ✓ Accept
                    </button>
                  </div>
                )}
                {order.status === 'accepted' && (
                  <div className="flex items-center gap-2 text-sm text-emerald-400">
                    <span>✓</span>
                    <span>Accepted — awaiting dispatch</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
