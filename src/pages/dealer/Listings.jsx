import { useState } from 'react'
import { Modal } from '../../components/UI'
import { MOCK_PRODUCTS } from '../../utils/mockData'
import toast from 'react-hot-toast'

const DEALER_ID = 'd1'

export default function DealerListings() {
  const myListings = MOCK_PRODUCTS
    .filter(p => p.dealers.some(d => d.id === DEALER_ID))
    .map(p => {
      const myDealer = p.dealers.find(d => d.id === DEALER_ID)
      return { ...p, myPrice: myDealer.price, myStock: myDealer.stock, deliveryDays: myDealer.deliveryDays }
    })

  const [listings, setListings] = useState(myListings)
  const [editModal, setEditModal] = useState(null)
  const [addModal, setAddModal] = useState(false)
  const [form, setForm] = useState({ price: '', stock: '', deliveryDays: '' })

  const openEdit = (listing) => {
    setEditModal(listing.id)
    setForm({ price: listing.myPrice, stock: listing.myStock, deliveryDays: listing.deliveryDays })
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (!form.price || !form.stock) return toast.error('Price and stock are required')
    setListings(prev => prev.map(l =>
      l.id === editModal ? { ...l, myPrice: Number(form.price), myStock: Number(form.stock), deliveryDays: Number(form.deliveryDays) } : l
    ))
    setEditModal(null)
    toast.success('Listing updated!')
  }

  const editedListing = listings.find(l => l.id === editModal)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">My Listings</h1>
          <p className="text-slate-500 text-sm mt-1">{listings.length} products listed</p>
        </div>
        <button onClick={() => setAddModal(true)} className="btn-primary text-sm">+ Add Product</button>
      </div>

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
                <tr key={l.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{l.image}</span>
                      <span className="text-sm text-white font-medium">{l.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-400">{l.category}</td>
                  <td className="px-5 py-3 text-right text-sm font-semibold text-white">₹{l.myPrice.toLocaleString()}</td>
                  <td className="px-5 py-3 text-right">
                    <span className={`text-sm font-medium ${l.myStock < 100 ? 'text-amber-400' : 'text-slate-300'}`}>
                      {l.myStock.toLocaleString()}
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

      {/* Edit Modal */}
      <Modal open={!!editModal} onClose={() => setEditModal(null)} title={`Edit — ${editedListing?.name || ''}`}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Price (₹ per {editedListing?.unit})</label>
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

      {/* Add product placeholder modal */}
      <Modal open={addModal} onClose={() => setAddModal(false)} title="Add Product Listing">
        <div className="text-center py-6 space-y-3">
          <p className="text-4xl">🏗️</p>
          <p className="text-slate-400 text-sm">Connect with backend to browse the product catalogue and set your price for any product.</p>
          <button onClick={() => setAddModal(false)} className="btn-secondary">Close</button>
        </div>
      </Modal>
    </div>
  )
}
