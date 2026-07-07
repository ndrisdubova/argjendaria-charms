import defaultProducts from './products'

const STORAGE_KEY = 'charms_products'
const EVENT_NAME = 'charms-products-updated'

export function loadProducts() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    saveProducts(defaultProducts)
    return defaultProducts
  }
  try {
    return JSON.parse(raw)
  } catch {
    return defaultProducts
  }
}

export function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
  window.dispatchEvent(new CustomEvent(EVENT_NAME))
}

export function subscribe(callback) {
  window.addEventListener(EVENT_NAME, callback)
  window.addEventListener('storage', callback)
  return () => {
    window.removeEventListener(EVENT_NAME, callback)
    window.removeEventListener('storage', callback)
  }
}

export function makeId() {
  return `p${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}

export function getStock(product) {
  return Number.isFinite(product?.stock) ? product.stock : 10
}
