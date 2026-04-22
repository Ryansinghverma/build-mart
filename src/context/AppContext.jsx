import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('bm_user')
    if (saved) {
      try { setUser(JSON.parse(saved)) } catch {}
    }
    const savedCart = localStorage.getItem('bm_cart')
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)) } catch {}
    }
    setLoading(false)
  }, [])

  // Accepts real user object from backend (has _id, name, phone, role, token)
  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('bm_user', JSON.stringify(userData))
    return userData
  }

  const logout = () => {
    setUser(null)
    setCart([])
    localStorage.removeItem('bm_user')
    localStorage.removeItem('bm_cart')
  }

  const addToCart = (product, dealerId, dealerPrice, quantity = 1) => {
    setCart(prev => {
      const key = `${product._id || product.id}_${dealerId}`
      const existing = prev.find(i => i.key === key)
      let updated
      if (existing) {
        updated = prev.map(i => i.key === key ? { ...i, quantity: i.quantity + quantity } : i)
      } else {
        updated = [...prev, { key, product, dealerId, dealerPrice, quantity }]
      }
      localStorage.setItem('bm_cart', JSON.stringify(updated))
      return updated
    })
  }

  const updateCartQty = (key, quantity) => {
    setCart(prev => {
      const updated = quantity <= 0
        ? prev.filter(i => i.key !== key)
        : prev.map(i => i.key === key ? { ...i, quantity } : i)
      localStorage.setItem('bm_cart', JSON.stringify(updated))
      return updated
    })
  }

  const clearCart = () => {
    setCart([])
    localStorage.removeItem('bm_cart')
  }

  const cartTotal = cart.reduce((sum, i) => sum + i.dealerPrice * i.quantity, 0)
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <AppContext.Provider value={{ user, login, logout, loading, cart, addToCart, updateCartQty, clearCart, cartTotal, cartCount }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
