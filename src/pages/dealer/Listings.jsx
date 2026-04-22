import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { Modal } from '../../components/UI'
import { dealerAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function DealerListings() {
  const { user } = useApp()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [editModal, setEditModal] = useState(null)
  const [form, setForm] = useState({ price: '', stock: '', deliveryDays: '' })

  useEffect(() => {
    if (!user?._id) return
    dealerAPI.getListings(user._id)
      .then(data => setListings(Array.isArray(data) ? data : []))
      .catch(() => toast.error('Failed to load listings'))
      .finally(() => setLoading(false))
  }, [user])

  const openEdit = (listing) => {
    setEditModal(listing)
    setForm({ price: listing.price, stock: listing.stock, deliveryDays: listing.deliveryDays })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.price || !form.stock) return toast.error('Price and stock are required')
    try {
      await dealerAPI.updateListing({ listingId: editModal._id, ...form })
      setListings(prev => prev.map(l =>
        l._id === editModal._id ? { ...l, price: Number(form.price), stock: Number(form.stock), deliveryDays: Number(form.deliveryDays) } : l
      ))
      setEditModal(null)
      toast.success('Listing updated!')
    } catch (err) {
      toast.error(err.message || 'Failed to update')
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">My Listings</h1>
          <p className="text-slate-500 text-sm mt-1">{listings.length} products listed</p>
        </div>
      </div>

      {loading ? (
        <div className="card text-center py-16 text-slate-500">Loading listings...</div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Product</th>
                  <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Category</th>
                  <th className="text-right text-xs font-medium text-slate-500 px-5 py-3">My Price</th>
                  <th className="text-right text-xs font-medium text-slate-500 px-5 py-3">Stock</th>
                  <th className="text-right text-xs font-medium text-slate-500 px-5 py-3">Delivery</th>
                  <th className="text-right text-xs font-medium text-slate-500 px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {listings.map(l => (
                  <tr key={l._id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-3">
                      <span className="text-sm text-white font-medium">{l.productId?.name || l.name}</span>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-400">{l.productId?.category || l.category}</td>
                    <td className="px-5 py-3 text-right text-sm font-semibold text-white">₹{l.price?.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right">
                      <span className={`text-sm font-medium ${l.stock < 100 ? 'text-amber-400' : 'text-slate-300'}`}>
                        {l.stock?.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right text-sm text-slate-400">{l.deliveryDays}d</td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => openEdit(l)} className="text-sm text-brand-400 hover:text-brand-300 transition-colors">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={!!editModal} onClose={() => setEditModal(null)} title={`Edit — ${editModal?.productId?.name || editModal?.name || ''}`}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Price (₹)</label>
              <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                className="input" placeholder="0" min="1" />
            </div>
            <div>
              <label className="label">Stock Available</label>
              <input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                className="input" placeholder="0" min="0" />
            </div>
          </div>
          <div>
            <label className="label">Delivery Days</label>
            <input type="number" value={form.deliveryDays} onChange={e => setForm(f => ({ ...f, deliveryDays: e.target.value }))}
              className="input" placeholder="2" min="1" max="30" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setEditModal(null)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Save Changes</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
