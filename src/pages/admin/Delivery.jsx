import { useState, useEffect } from 'react'
import { StatusBadge, Modal } from '../../components/UI'
import { ordersAPI } from '../../services/api'
import toast from 'react-hot-toast'

const DRIVERS = [
  { id: 'drv1', name: 'Ramu Yadav', phone: '9811001100', vehicle: 'Tata Ace — DL 01 AB 1234' },
  { id: 'drv2', name: 'Shyam Singh', phone: '9822002200', vehicle: 'Mahindra Bolero — HR 26 CD 5678' },
  { id: 'drv3', name: 'Vijay Kumar', phone: '9833003300', vehicle: 'Ashok Leyland — UP 14 EF 9012' },
]

export default function AdminDelivery() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [assignments, setAssignments] = useState({})
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({ driverId: '', eta: '' })

  useEffect(() => {
    ordersAPI.getAll()
      .then(data => {
        const list = Array.isArray(data) ? data : []
        setOrders(list.filter(o => ['accepted', 'out_for_delivery'].includes(o.status)))
      })
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false))
  }, [])

  const openAssign = (order) => {
    setModal(order)
    const existing = assignments[order._id]
    setForm({ driverId: existing?.driverId || '', eta: existing?.eta || '' })
  }
const handleAssign = async () => {
  if (!form.driverId) return toast.error('Select a driver')
  if (!form.eta) return toast.error('Set an ETA')
  const driver = DRIVERS.find(d => d.id === form.driverId)
  try {
    await ordersAPI.assignDelivery(modal._id, {
      driverName:  driver.name,
      vehicleType: driver.vehicle,
      eta:         form.eta,
    })
    setAssignments(prev => ({ ...prev, [modal._id]: { ...form } }))
    setOrders(prev => prev.map(o =>
      o._id === modal._id ? { ...o, status: 'out_for_delivery' } : o
    ))
    setModal(null)
    toast.success('Driver assigned!')
  } catch (err) {
    toast.error(err.message || 'Failed to assign')
  }
}
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-title">Delivery Assignment</h1>
        <p className="text-slate-500 text-sm mt-1">{orders.length} orders ready for dispatch</p>
      </div>

      <div>
        <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-3">Available Drivers</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {DRIVERS.map(d => {
            const assignedCount = Object.values(assignments).filter(a => a.driverId === d.id).length
            return (
              <div key={d.id} className="card">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-brand-500/20 rounded-full flex items-center justify-center text-brand-400 font-semibold text-sm">
                    {d.name[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white">{d.name}</p>
                    <p className="text-xs text-slate-500 truncate">{d.vehicle}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Active orders</span>
                  <span className={`font-semibold ${assignedCount > 0 ? 'text-amber-400' : 'text-slate-400'}`}>{assignedCount}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-3">Orders Awaiting Dispatch</h2>
        {loading ? (
          <div className="card text-center py-16 text-slate-500">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="card text-center py-10 text-slate-500">No orders awaiting dispatch</div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => {
              const assigned = assignments[order._id]
              const driver = DRIVERS.find(d => d.id === assigned?.driverId)
              const date = new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
              return (
                <div key={order._id} className="card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-mono text-sm text-brand-400">#{order._id.slice(-6)}</p>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-sm text-white">{order.items?.[0]?.product?.name || 'Order'}</p>
                    <p className="text-xs text-slate-500">{order.userId?.name || 'Contractor'} · {date}</p>
                  </div>

                  {assigned ? (
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm text-white">{driver?.name}</p>
                        <p className="text-xs text-slate-500">ETA: {new Date(assigned.eta).toLocaleDateString('en-IN')}</p>
                      </div>
                      <button onClick={() => openAssign(order)} className="btn-secondary text-xs">Edit</button>
                    </div>
                  ) : (
                    <button onClick={() => openAssign(order)} className="btn-primary text-sm">
                      Assign Driver
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <Modal open={!!modal} onClose={() => setModal(null)} title={`Assign Delivery — #${modal?._id?.slice(-6)}`}>
        <form onSubmit={handleAssign} className="space-y-4">
          <div>
            <label className="label">Select Driver</label>
            <select value={form.driverId} onChange={e => setForm(f => ({ ...f, driverId: e.target.value }))} className="input">
              <option value="">Choose driver...</option>
              {DRIVERS.map(d => (
                <option key={d.id} value={d.id}>{d.name} — {d.vehicle}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Expected Delivery Date & Time</label>
            <input type="datetime-local" value={form.eta}
              onChange={e => setForm(f => ({ ...f, eta: e.target.value }))}
              className="input" min={new Date().toISOString().slice(0, 16)} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModal(null)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Assign</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
