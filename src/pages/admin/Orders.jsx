import { useState, useEffect } from 'react'
import { StatusBadge, Modal } from '../../components/UI'
import { ordersAPI } from '../../services/api'
import toast from 'react-hot-toast'

const ALL_STATUSES = ['pending', 'accepted', 'out_for_delivery', 'delivered']

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [editModal, setEditModal] = useState(null)
  const [newStatus, setNewStatus] = useState('')

  useEffect(() => {
    ordersAPI.getAll()
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false))
  }, [])

  const openEdit = (order) => {
    setEditModal(order)
    setNewStatus(order.status)
  }

  const handleUpdate = async () => {
    try {
      await ordersAPI.updateStatus(editModal._id, newStatus)
      setOrders(prev => prev.map(o => o._id === editModal._id ? { ...o, status: newStatus } : o))
      setEditModal(null)
      toast.success('Order status updated')
    } catch (err) {
      toast.error(err.message || 'Failed to update')
    }
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-title">Orders Management</h1>
        <p className="text-slate-500 text-sm mt-1">{orders.length} total orders</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {['all', ...ALL_STATUSES].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium flex-shrink-0 capitalize transition-colors ${
              filter === s ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}>
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="card text-center py-16 text-slate-500">Loading orders...</div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Order</th>
                  <th className="text-left text-xs font-medium text-slate-500 px-5 py-3 hidden md:table-cell">Items</th>
                  <th className="text-left text-xs font-medium text-slate-500 px-5 py-3 hidden sm:table-cell">Contractor</th>
                  <th className="text-right text-xs font-medium text-slate-500 px-5 py-3">Amount</th>
                  <th className="text-center text-xs font-medium text-slate-500 px-5 py-3">Status</th>
                  <th className="text-right text-xs font-medium text-slate-500 px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map(order => {
                  const date = new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                  return (
                    <tr key={order._id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-5 py-3">
                        <p className="font-mono text-sm text-brand-400">#{order._id.slice(-6)}</p>
                        <p className="text-xs text-slate-500">{date}</p>
                      </td>
                      <td className="px-5 py-3 text-sm text-slate-400 hidden md:table-cell">
                        {order.items?.[0]?.product?.name || 'Item'}{order.items?.length > 1 ? ` +${order.items.length - 1}` : ''}
                      </td>
                      <td className="px-5 py-3 text-sm text-slate-400 hidden sm:table-cell">{order.userId?.name || '—'}</td>
                      <td className="px-5 py-3 text-right text-sm font-medium text-white">₹{order.total?.toLocaleString()}</td>
                      <td className="px-5 py-3 text-center"><StatusBadge status={order.status} /></td>
                      <td className="px-5 py-3 text-right">
                        <button onClick={() => openEdit(order)} className="text-sm text-brand-400 hover:text-brand-300 transition-colors">
                          Update
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={!!editModal} onClose={() => setEditModal(null)} title={`Update Order #${editModal?._id?.slice(-6)}`}>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-400 mb-1">Current status</p>
            <StatusBadge status={editModal?.status} />
          </div>
          <div>
            <label className="label">New Status</label>
            <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="input">
              {ALL_STATUSES.map(s => (
                <option key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setEditModal(null)} className="btn-secondary flex-1">Cancel</button>
            <button onClick={handleUpdate} className="btn-primary flex-1">Update Status</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
