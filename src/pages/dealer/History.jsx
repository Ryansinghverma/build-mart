import { OrderCard, EmptyState, StatCard } from '../../components/UI'
import { MOCK_DEALER_ORDERS } from '../../utils/mockData'

export default function DealerHistory() {
  const completed = MOCK_DEALER_ORDERS.filter(o => o.status === 'delivered')
  const revenue = completed.reduce((s, o) => s + o.total, 0)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-title">Order History</h1>
        <p className="text-slate-500 text-sm mt-1">Completed deliveries</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Completed Orders" value={completed.length} icon="✅" accent="text-emerald-400" />
        <StatCard label="Total Revenue" value={`₹${(revenue / 1000).toFixed(1)}k`} icon="💰" accent="text-brand-400" />
      </div>

      {completed.length === 0 ? (
        <div className="card">
          <EmptyState icon="🕐" title="No completed orders yet" description="Delivered orders will appear here" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {completed.map(order => <OrderCard key={order.id} order={order} />)}
        </div>
      )}
    </div>
  )
}
