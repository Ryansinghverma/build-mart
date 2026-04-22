import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { Modal } from '../../components/UI'
import { dealerAPI, productsAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function DealerListings() {
  const { user } = useApp()
  const [listings, setListings] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editModal, setEditModal] = useState(null)
  const [addModal, setAddModal] = useState(false)
  const [form, setForm] = useState({ price: '', stock: '', deliveryDays: '' })
  const [addForm, setAddForm] = useState({ productId: '', price: '', stock: '', deliveryDays: '' })

  useEffect(() => {
    if (!user?._id && !user?.id) return
    const id = user._id || user.id
    Promise.all([
      dealerAPI.getListings(id),
      productsAPI.getAll(),
    ])
      .then(([listData, prodData]) => {
        setListings(Array.isArray(listData) ? listData : [])
        setAllProducts(Array.isArray(prodData) ? prodData : [])
      })
      .catch(() => toast.error('Failed to load data'))
      .finally(() => setLoading(false))
  }, [user])

  const listedProductIds = listings.map(l => String(l.productId?._id || l.productId))
  const availableProducts = allProducts.filter(p => !listedProductIds.includes(String(p._id)))

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

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!addForm.productId) return toast.error('Select a product')
    if (!addForm.price || !addForm.stock) return toast.error('Price and stock are required')
    try {
      const id = user._id || user.id
      await dealerAPI.createListing({
        productId: addForm.productId,
        price: Number(addForm.price),
        stock: Number(addForm.stock),
        deliveryDays: Number(addForm.deliveryDays) || 2,
        dealerId: id,
      })
      const refreshed = await dealerAPI.getListings(id)
      setListings(Array.isArray(refreshed) ? refreshed : [])
      setAddModal(false)
      setAddForm({ productId: '', price: '', stock: '', deliveryDays: '' })
      toast.success('Listing added!')
    } catch (err) {
      toast.error(err.message || 'Failed to add listing')
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">My Listings</h1>
          <p className="text-slate-500 text-sm mt-1">{listings.length} products listed</p>
        </div>
        <button onClick={() => setAddModal(true)} className="btn-primary text-sm">+ Add Listing</button>
      </div>

      {loading ? (
        <div className="card text-center py-16 text-slate-500">Loading listings...</div>
      ) : listings.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-3xl mb-3">🏷️</p>
          <p className="text-slate-400 mb-2">No listings yet</p>
          <p className="text-slate-600 text-sm mb-4">Add products you sell with your price and stock</p>
          <button onClick={() => setAddModal(true)} className="btn-primary text-sm">+ Add Listing</button>
        </div>
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
                      <button onClick={() => openEdit(l)} className="text-sm text-brand-400 hover:text-brand-300 transition-colors">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Modal */}
      <Modal open={addModal} onClose={() => setAddModal(false)} title="Add New Listing">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="label">Product</label>
            <select value={addForm.productId} onChange={e => setAddForm(f => ({ ...f, productId: e.target.value }))} className="input">
              <option value="">Select a product...</option>
              {availableProducts.map(p => (
                <option key={p._id} value={p._id}>{p.name} — {p.category}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Price (₹)</label>
              <input type="number" value={addForm.price} onChange={e => setAddForm(f => ({ ...f, price: e.target.value }))}
                className="input" placeholder="0" min="1" />
            </div>
            <div>
              <label className="label">Stock</label>
              <input type="number" value={addForm.stock} onChange={e => setAddForm(f => ({ ...f, stock: e.target.value }))}
                className="input" placeholder="0" min="0" />
            </div>
          </div>
          <div>
            <label className="label">Delivery Days</label>
            <input type="number" value={addForm.deliveryDays} onChange={e => setAddForm(f => ({ ...f, deliveryDays: e.target.value }))}
              className="input" placeholder="2" min="1" max="30" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setAddModal(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Add Listing</button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
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
