import axios from 'axios'

// VITE_API_URL should be set to: https://your-backend-domain.com/api
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor — attach auth token
api.interceptors.request.use(
  config => {
    const user = JSON.parse(localStorage.getItem('bm_user') || '{}')
    if (user.token) config.headers.Authorization = `Bearer ${user.token}`
    return config
  },
  error => Promise.reject(error)
)

// Response interceptor — handle 401
api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('bm_user')
      window.location.href = '/login'
    }
    return Promise.reject(error.response?.data || { message: 'Network error' })
  }
)

// ─── Auth ──────────────────────────────────────────────────────────────────
export const authAPI = {
  sendOTP:   (phone)      => api.post('/auth/send-otp', { phone }),
  verifyOTP: (phone, otp) => api.post('/auth/verify-otp', { phone, otp }),
  signup:    (data)       => api.post('/auth/signup', data),
}

// ─── Products ──────────────────────────────────────────────────────────────
export const productsAPI = {
  getAll:       (params) => api.get('/products', { params }),
  getById:      (id)     => api.get(`/products/${id}`),
  getCategories:()       => api.get('/products/categories'),
}

// ─── Orders ────────────────────────────────────────────────────────────────
export const ordersAPI = {
  create:         (data)        => api.post('/orders', data),
  getByUser:      (userId, params) => api.get(`/orders/${userId}`, { params }),
  getAll:         (params)      => api.get('/orders', { params }),
  updateStatus:   (id, status)  => api.put(`/orders/${id}/status`, { status }),
  assignDelivery: (orderId, data) => api.post('/delivery/assign', { orderId, ...data }),
}

// ─── Dealer ────────────────────────────────────────────────────────────────
export const dealerAPI = {
  getListings:   (dealerId) => api.get(`/dealer/${dealerId}/listings`),
  createListing: (data)     => api.post('/listings', data),
  updateListing: (data)     => api.put('/dealer/listing', data),
  getOrders:     (dealerId) => api.get(`/dealer/${dealerId}/orders`),
  acceptOrder:   (id)       => api.put(`/dealer/orders/${id}/accept`),
  rejectOrder:   (id)       => api.put(`/dealer/orders/${id}/reject`),
}

// ─── Projects ──────────────────────────────────────────────────────────────
export const projectsAPI = {
  getAll:      (userId)              => api.get(`/projects/${userId}`),
  create:      (data)                => api.post('/projects', data),
  assignOrder: (projectId, orderId)  => api.put(`/projects/${projectId}/orders`, { orderId }),
}

export default api
