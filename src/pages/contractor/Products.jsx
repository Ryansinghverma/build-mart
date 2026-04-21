import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { ProductCard } from '../../components/UI'
import { MOCK_PRODUCTS, CATEGORIES } from '../../utils/mockData'
import toast from 'react-hot-toast'

export default function Products() {
  const { addToCart } = useApp()
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('default')
  const [search, setSearch] = useState('')

  const handleAdd = (product, dealerId, price) => {
    addToCart(product, dealerId, price)
    const dealer = product.dealers.find(d => d.id === dealerId)
    toast.success(`Added to cart — ${dealer.name}`)
  }

  let products = MOCK_PRODUCTS
  if (category !== 'All') products = products.filter(p => p.category === category)
  if (search.trim()) products = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
  if (sort === 'asc') products = [...products].sort((a, b) => Math.min(...a.dealers.map(d=>d.price)) - Math.min(...b.dealers.map(d=>d.price)))
  if (sort === 'desc') products = [...products].sort((a, b) => Math.min(...b.dealers.map(d=>d.price)) - Math.min(...a.dealers.map(d=>d.price)))

  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-title">Products</h1>
        <p className="text-slate-500 text-sm mt-1">Compare prices across dealers</p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products..."
          className="input flex-1"
        />
        <select value={sort} onChange={e => setSort(e.target.value)} className="input w-full sm:w-44">
          <option value="default">Default sort</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium flex-shrink-0 transition-colors ${
              category === c ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}>
            {c}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="text-sm text-slate-500">{products.length} product{products.length !== 1 ? 's' : ''} found</p>

      {/* Grid */}
      {products.length === 0 ? (
        <div className="card text-center py-16 text-slate-500">
          <p className="text-4xl mb-3">🔍</p>
          <p>No products match your filters</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(p => (
            <ProductCard key={p.id} product={p} onAddToCart={handleAdd} />
          ))}
        </div>
      )}
    </div>
  )
}
