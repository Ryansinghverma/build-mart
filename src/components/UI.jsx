import { STATUS_META } from '../utils/mockData'

// ─── StatusBadge ─────────────────────────────────────────────────────────────
export function StatusBadge({ status }) {
  const meta = STATUS_META[status] || { label: status, color: 'text-slate-400 bg-slate-400/10 border-slate-400/20' }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${meta.color}`}>
      {meta.label}
    </span>
  )
}

// ─── Loader ─────────────────────────────────────────────────────────────────
export function Loader({ size = 'md', className = '' }) {
  const s = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' }
  return (
    <div className={`${s[size]} border-2 border-slate-700 border-t-brand-500 rounded-full animate-spin ${className}`} />
  )
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <Loader size="lg" />
        <p className="text-slate-500 text-sm">Loading...</p>
      </div>
    </div>
  )
}

// ─── Modal ─────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors text-xl leading-none">×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ─── ProductCard ─────────────────────────────────────────────────────────────
export function ProductCard({ product, onAddToCart }) {
  const lowestPrice = Math.min(...product.dealers.map(d => d.price))
  const fastestDelivery = Math.min(...product.dealers.map(d => d.deliveryDays))

  return (
    <div className="card hover:border-slate-700 transition-colors">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
          {product.image}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-white truncate">{product.name}</h3>
          <p className="text-sm text-slate-500">{product.category} · per {product.unit}</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {product.dealers.map(dealer => (
          <div key={dealer.id} className="flex items-center justify-between bg-slate-800 rounded-lg px-3 py-2">
            <div>
              <p className="text-xs text-slate-400">{dealer.name}</p>
              <p className="text-sm font-semibold text-white">₹{dealer.price.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">{dealer.deliveryDays}d delivery</p>
              <button
                onClick={() => onAddToCart(product, dealer.id, dealer.price)}
                className="text-xs text-brand-400 hover:text-brand-300 font-medium mt-0.5 transition-colors"
              >
                Add to cart →
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-800">
        <span>From ₹{lowestPrice.toLocaleString()}</span>
        <span>Fastest: {fastestDelivery} day{fastestDelivery > 1 ? 's' : ''}</span>
      </div>
    </div>
  )
}

// ─── OrderCard ────────────────────────────────────────────────────────────────
export function OrderCard({ order, actions }) {
  const date = new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  return (
    <div className="card">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-mono text-sm text-brand-400">#{order.id}</p>
          <p className="text-xs text-slate-500 mt-0.5">{date}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>
      <div className="space-y-1 mb-3">
        {order.products.map((p, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <span className="text-slate-300">{p.name}</span>
            <span className="text-slate-500">{p.qty} {p.unit}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-slate-800">
        <div>
          <p className="text-xs text-slate-500">{order.dealer || order.contractor}</p>
          <p className="font-semibold text-white">₹{order.total?.toLocaleString()}</p>
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
    </div>
  )
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
export function StatCard({ label, value, sub, icon, accent }) {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-500 text-sm">{label}</span>
        <span className="text-xl">{icon}</span>
      </div>
      <p className={`text-3xl font-semibold ${accent || 'text-white'}`}>{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <p className="font-medium text-white mb-1">{title}</p>
      <p className="text-sm text-slate-500 mb-4">{description}</p>
      {action}
    </div>
  )
}
