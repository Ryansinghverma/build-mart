export const MOCK_PRODUCTS = [
  { id: 'p1', name: 'OPC Cement 53 Grade', category: 'Cement', unit: 'bag (50kg)', image: '🏗️', description: 'High strength ordinary portland cement', dealers: [
    { id: 'd1', name: 'Sharma Traders', price: 380, deliveryDays: 2, stock: 500 },
    { id: 'd2', name: 'Modi Suppliers', price: 365, deliveryDays: 3, stock: 200 },
    { id: 'd3', name: 'Patel Building Mart', price: 390, deliveryDays: 1, stock: 800 },
  ]},
  { id: 'p2', name: 'TMT Steel Bar 12mm Fe500', category: 'Steel', unit: 'kg', image: '⚙️', description: 'High ductility thermo-mechanically treated bars', dealers: [
    { id: 'd1', name: 'Sharma Traders', price: 68, deliveryDays: 3, stock: 5000 },
    { id: 'd2', name: 'Modi Suppliers', price: 66, deliveryDays: 2, stock: 8000 },
  ]},
  { id: 'p3', name: 'River Sand (Fine)', category: 'Aggregates', unit: 'cubic ft', image: '🟤', description: 'Washed river sand for masonry and plastering', dealers: [
    { id: 'd2', name: 'Modi Suppliers', price: 45, deliveryDays: 1, stock: 10000 },
    { id: 'd3', name: 'Patel Building Mart', price: 42, deliveryDays: 2, stock: 15000 },
  ]},
  { id: 'p4', name: 'Red Clay Bricks (Class A)', category: 'Bricks', unit: 'piece', image: '🧱', description: 'Standard modular bricks, 3 inch thickness', dealers: [
    { id: 'd1', name: 'Sharma Traders', price: 9, deliveryDays: 2, stock: 50000 },
    { id: 'd3', name: 'Patel Building Mart', price: 8, deliveryDays: 1, stock: 100000 },
  ]},
  { id: 'p5', name: 'Plywood 18mm BWR Grade', category: 'Timber', unit: 'sheet (8x4 ft)', image: '🪵', description: 'Boiling water resistant commercial plywood', dealers: [
    { id: 'd2', name: 'Modi Suppliers', price: 1850, deliveryDays: 3, stock: 200 },
    { id: 'd3', name: 'Patel Building Mart', price: 1780, deliveryDays: 2, stock: 350 },
  ]},
  { id: 'p6', name: 'White Cement (50kg)', category: 'Cement', unit: 'bag', image: '⬜', description: 'Premium white portland cement for finishing', dealers: [
    { id: 'd1', name: 'Sharma Traders', price: 720, deliveryDays: 2, stock: 120 },
  ]},
  { id: 'p7', name: 'Coarse Aggregate 20mm', category: 'Aggregates', unit: 'cubic ft', image: '🪨', description: 'Crushed granite aggregate for concrete', dealers: [
    { id: 'd2', name: 'Modi Suppliers', price: 38, deliveryDays: 1, stock: 20000 },
    { id: 'd3', name: 'Patel Building Mart', price: 40, deliveryDays: 1, stock: 18000 },
  ]},
  { id: 'p8', name: 'GI Wire 16 Gauge', category: 'Steel', unit: 'kg', image: '🔩', description: 'Galvanized iron binding wire for construction', dealers: [
    { id: 'd1', name: 'Sharma Traders', price: 85, deliveryDays: 2, stock: 1000 },
    { id: 'd2', name: 'Modi Suppliers', price: 82, deliveryDays: 3, stock: 800 },
  ]},
]

export const MOCK_ORDERS = [
  { id: 'ORD001', userId: 'c1', products: [{ productId: 'p1', name: 'OPC Cement 53 Grade', qty: 50, price: 380, unit: 'bag' }], dealer: 'Sharma Traders', total: 19000, status: 'delivered', projectId: 'proj1', createdAt: '2024-01-15T10:30:00Z' },
  { id: 'ORD002', userId: 'c1', products: [{ productId: 'p2', name: 'TMT Steel Bar 12mm', qty: 200, price: 66, unit: 'kg' }], dealer: 'Modi Suppliers', total: 13200, status: 'out_for_delivery', projectId: 'proj1', createdAt: '2024-01-18T09:00:00Z' },
  { id: 'ORD003', userId: 'c1', products: [{ productId: 'p4', name: 'Red Clay Bricks', qty: 1000, price: 8, unit: 'piece' }], dealer: 'Patel Building Mart', total: 8000, status: 'accepted', projectId: 'proj2', createdAt: '2024-01-20T14:00:00Z' },
  { id: 'ORD004', userId: 'c1', products: [{ productId: 'p3', name: 'River Sand (Fine)', qty: 100, price: 42, unit: 'cubic ft' }], dealer: 'Patel Building Mart', total: 4200, status: 'pending', projectId: null, createdAt: '2024-01-21T11:00:00Z' },
  { id: 'ORD005', userId: 'c1', products: [{ productId: 'p5', name: 'Plywood 18mm BWR', qty: 20, price: 1780, unit: 'sheet' }], dealer: 'Patel Building Mart', total: 35600, status: 'pending', projectId: null, createdAt: '2024-01-22T16:00:00Z' },
]

export const MOCK_PROJECTS = [
  { id: 'proj1', name: 'Site A — Sector 12 Residential', location: 'Gurugram, HR', orders: ['ORD001', 'ORD002'], status: 'active', createdAt: '2024-01-10T00:00:00Z' },
  { id: 'proj2', name: 'Site B — NH-8 Commercial', location: 'Delhi, DL', orders: ['ORD003'], status: 'active', createdAt: '2024-01-12T00:00:00Z' },
]

export const MOCK_DEALER_ORDERS = [
  { id: 'ORD003', contractor: 'Rajesh Kumar', products: [{ name: 'Red Clay Bricks', qty: 1000, unit: 'piece' }], total: 8000, status: 'accepted', createdAt: '2024-01-20T14:00:00Z' },
  { id: 'ORD004', contractor: 'Suresh Verma', products: [{ name: 'River Sand (Fine)', qty: 100, unit: 'cubic ft' }], total: 4200, status: 'pending', createdAt: '2024-01-21T11:00:00Z' },
  { id: 'ORD005', contractor: 'Amit Singh', products: [{ name: 'Plywood 18mm BWR', qty: 20, unit: 'sheet' }], total: 35600, status: 'pending', createdAt: '2024-01-22T16:00:00Z' },
  { id: 'ORD006', contractor: 'Priya Contractors', products: [{ name: 'OPC Cement 53 Grade', qty: 100, unit: 'bag' }], total: 39000, status: 'delivered', createdAt: '2024-01-10T00:00:00Z' },
]

export const STATUS_META = {
  pending:          { label: 'Pending',          color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
  accepted:         { label: 'Accepted',         color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  out_for_delivery: { label: 'Out for Delivery', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
  delivered:        { label: 'Delivered',        color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
  rejected:         { label: 'Rejected',         color: 'text-red-400 bg-red-400/10 border-red-400/20' },
}

export const CATEGORIES = ['All', 'Cement', 'Steel', 'Aggregates', 'Bricks', 'Timber']
