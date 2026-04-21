import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Modal, EmptyState } from '../../components/UI'
import { MOCK_PROJECTS, MOCK_ORDERS } from '../../utils/mockData'
import toast from 'react-hot-toast'

export default function Projects() {
  const { user } = useApp()
  const [projects, setProjects] = useState(MOCK_PROJECTS)
  const [createModal, setCreateModal] = useState(false)
  const [assignModal, setAssignModal] = useState(null) // project id
  const [form, setForm] = useState({ name: '', location: '' })
  const [selectedOrder, setSelectedOrder] = useState('')

  const unassignedOrders = MOCK_ORDERS.filter(o => !o.projectId && o.userId === user?.id)

  const handleCreate = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return toast.error('Project name required')
    const newProject = {
      id: `proj${Date.now()}`,
      name: form.name,
      location: form.location,
      orders: [],
      status: 'active',
      createdAt: new Date().toISOString(),
    }
    setProjects(prev => [...prev, newProject])
    setForm({ name: '', location: '' })
    setCreateModal(false)
    toast.success('Project created!')
  }

  const handleAssign = () => {
    if (!selectedOrder) return toast.error('Select an order')
    setProjects(prev => prev.map(p =>
      p.id === assignModal ? { ...p, orders: [...p.orders, selectedOrder] } : p
    ))
    setSelectedOrder('')
    setAssignModal(null)
    toast.success('Order assigned to project')
  }

  const getProjectOrders = (orderIds) =>
    MOCK_ORDERS.filter(o => orderIds.includes(o.id))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="text-slate-500 text-sm mt-1">Organise orders by construction site</p>
        </div>
        <button onClick={() => setCreateModal(true)} className="btn-primary text-sm">+ New Project</button>
      </div>

      {projects.length === 0 ? (
        <div className="card">
          <EmptyState icon="🏗️" title="No projects yet"
            description="Create a project to group orders by site"
            action={<button onClick={() => setCreateModal(true)} className="btn-primary">Create Project</button>}
          />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {projects.map(project => {
            const projOrders = getProjectOrders(project.orders)
            const total = projOrders.reduce((s, o) => s + (o.total || 0), 0)
            return (
              <div key={project.id} className="card space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-white">{project.name}</h3>
                    {project.location && (
                      <p className="text-sm text-slate-500 mt-0.5">📍 {project.location}</p>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${
                    project.status === 'active'
                      ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
                      : 'text-slate-400 bg-slate-400/10 border-slate-400/20'
                  }`}>{project.status}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-800 rounded-lg p-3">
                    <p className="text-xs text-slate-500">Orders</p>
                    <p className="text-lg font-semibold text-white">{projOrders.length}</p>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-3">
                    <p className="text-xs text-slate-500">Total Spent</p>
                    <p className="text-lg font-semibold text-white">₹{total.toLocaleString()}</p>
                  </div>
                </div>

                {projOrders.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Orders</p>
                    {projOrders.map(o => (
                      <div key={o.id} className="flex items-center justify-between bg-slate-800 rounded-lg px-3 py-2 text-sm">
                        <span className="font-mono text-brand-400 text-xs">#{o.id}</span>
                        <span className="text-slate-400 text-xs">{o.dealer}</span>
                        <span className="text-white font-medium">₹{o.total?.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}

                <button onClick={() => setAssignModal(project.id)}
                  className="btn-secondary text-sm w-full">
                  + Assign Order
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Create Project Modal */}
      <Modal open={createModal} onClose={() => setCreateModal(false)} title="New Project">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="label">Project / Site Name</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="input" placeholder="Site A — Sector 12 Residential" autoFocus />
          </div>
          <div>
            <label className="label">Location (optional)</label>
            <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              className="input" placeholder="Gurugram, HR" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setCreateModal(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Create Project</button>
          </div>
        </form>
      </Modal>

      {/* Assign Order Modal */}
      <Modal open={!!assignModal} onClose={() => setAssignModal(null)} title="Assign Order to Project">
        <div className="space-y-4">
          {unassignedOrders.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-4">No unassigned orders available</p>
          ) : (
            <>
              <div>
                <label className="label">Select Order</label>
                <select value={selectedOrder} onChange={e => setSelectedOrder(e.target.value)} className="input">
                  <option value="">Choose an order...</option>
                  {unassignedOrders.map(o => (
                    <option key={o.id} value={o.id}>
                      #{o.id} — {o.products[0]?.name} — ₹{o.total?.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setAssignModal(null)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={handleAssign} className="btn-primary flex-1">Assign</button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  )
}
