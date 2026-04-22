import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { Modal, EmptyState } from '../../components/UI'
import { projectsAPI, ordersAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function Projects() {
  const { user } = useApp()
  const [projects, setProjects] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [createModal, setCreateModal] = useState(false)
  const [assignModal, setAssignModal] = useState(null)
  const [form, setForm] = useState({ name: '', location: '' })
  const [selectedOrder, setSelectedOrder] = useState('')

  useEffect(() => {
    if (!user?._id) return
    Promise.all([
      projectsAPI.getAll(user._id),
      ordersAPI.getByUser(user._id)
    ]).then(([proj, ord]) => {
      setProjects(Array.isArray(proj) ? proj : [])
      setOrders(Array.isArray(ord) ? ord : [])
    }).catch(() => toast.error('Failed to load data'))
      .finally(() => setLoading(false))
  }, [user])

  const unassignedOrders = orders.filter(o => !o.projectId)

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return toast.error('Project name required')
    try {
      const newProject = await projectsAPI.create({ ...form, userId: user._id })
      setProjects(prev => [...prev, newProject])
      setForm({ name: '', location: '' })
      setCreateModal(false)
      toast.success('Project created!')
    } catch (err) {
      toast.error(err.message || 'Failed to create project')
    }
  }

  const handleAssign = async () => {
    if (!selectedOrder) return toast.error('Select an order')
    try {
      await projectsAPI.assignOrder(assignModal, selectedOrder)
      setProjects(prev => prev.map(p =>
        p._id === assignModal ? { ...p, orders: [...(p.orders || []), selectedOrder] } : p
      ))
      setSelectedOrder('')
      setAssignModal(null)
      toast.success('Order assigned to project')
    } catch (err) {
      toast.error(err.message || 'Failed to assign order')
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="text-slate-500 text-sm mt-1">Organise orders by construction site</p>
        </div>
        <button onClick={() => setCreateModal(true)} className="btn-primary text-sm">+ New Project</button>
      </div>

      {loading ? (
        <div className="card text-center py-16 text-slate-500">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="card">
          <EmptyState icon="🏗️" title="No projects yet"
            description="Create a project to group orders by site"
            action={<button onClick={() => setCreateModal(true)} className="btn-primary">Create Project</button>}
          />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {projects.map(project => {
            const projOrders = orders.filter(o => (project.orders || []).includes(o._id))
            const total = projOrders.reduce((s, o) => s + (o.total || 0), 0)
            return (
              <div key={project._id} className="card space-y-4">
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

                <button onClick={() => setAssignModal(project._id)} className="btn-secondary text-sm w-full">
                  + Assign Order
                </button>
              </div>
            )
          })}
        </div>
      )}

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
                    <option key={o._id} value={o._id}>
                      #{o._id.slice(-6)} — ₹{o.total?.toLocaleString()}
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
