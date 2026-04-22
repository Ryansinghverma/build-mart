import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { EmptyState, Modal } from '../../components/UI'
import { ordersAPI, projectsAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function Cart() {
  const { user, cart, updateCartQty, clearCart, cartTotal } = useApp()
  const navigate = useNavigate()
  const [placing, setPlacing] = useState(false)
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState('')

  useEffect(() => {
    if (!user?._id) return
    projectsAPI.getAll(user._id)
      .then(data => setProjects(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [user])

  const handlePlaceOrder = async () => {
    setPlacing(true)
    try {
      await ordersAPI.create({
        items: cart,
        total: cartTotal,
        projectId: selectedProject || null
      })
      clearCart()
      toast.success('Order placed successfully!')
      navigate('/contractor/orders')
    } catch (err) {
      toast.error(err.message || 'Failed to place order')
    } finally {
      setPlacing(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="space-y-5">
        <h1 className="page-title">Cart</h1>
        <div className="card">
          <EmptyState icon="🛒" title="Your cart is empty"
            description="Browse products and add items to get started"
            action={<Link to="/contractor/products" className="btn-primary">Browse Products</Link>}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Cart ({cart.length})</h1>
        <button onClick={() => { clearCart(); toast.success('Cart cleared') }}
          className="text-sm text-slate-500 hover:text-red-400 transition-colors">
          Clear all
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-3">
          {cart.map(item => (
            <div key={item.key} className="card flex gap-4">
              <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                {item.product.image}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white text-sm">{item.product.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {item.product.dealers?.find(d => d.id === item.dealerId)?.name} ·
                  ₹{item.dealerPrice} per {item.product.unit}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateCartQty(item.key, item.quantity - 1)}
                      className="w-7 h-7 bg-slate-800 hover:bg-slate-700 rounded-lg text-white text-sm flex items-center justify-center transition-colors">
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => updateCartQty(item.key, item.quantity + 1)}
                      className="w-7 h-7 bg-slate-800 hover:bg-slate-700 rounded-lg text-white text-sm flex items-center justify-center transition-colors">
                      +
                    </button>
                  </div>
                  <p className="font-semibold text-white">₹{(item.dealerPrice * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="card sticky top-0 space-y-4">
            <h2 className="font-medium text-white">Order Summary</h2>
            <div className="space-y-2">
              {cart.map(item => (
                <div key={item.key} className="flex justify-between text-sm">
                  <span className="text-slate-400 truncate flex-1 mr-2">{item.product.name} × {item.quantity}</span>
                  <span className="text-slate-300 flex-shrink-0">₹{(item.dealerPrice * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-800 pt-3 flex justify-between">
              <span className="font-medium text-white">Total</span>
              <span className="font-bold text-white text-lg">₹{cartTotal.toLocaleString()}</span>
            </div>

            <div>
              <label className="label">Assign to project (optional)</label>
              <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="input">
                <option value="">No project</option>
                {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>

            <button onClick={handlePlaceOrder} disabled={placing} className="btn-primary w-full flex items-center justify-center gap-2">
              {placing ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Placing Order...</>
              ) : (
                <>Place Order · ₹{cartTotal.toLocaleString()}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
