const STORAGE_KEY = 'charms_product_views'
const EVENT_NAME = 'charms-product-views-updated'

export function loadViews() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return {}
  try {
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

function saveViews(views) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(views))
  window.dispatchEvent(new CustomEvent(EVENT_NAME))
}

export function recordView(productId) {
  const views = loadViews()
  saveViews({ ...views, [productId]: (views[productId] || 0) + 1 })
}

export function subscribe(callback) {
  window.addEventListener(EVENT_NAME, callback)
  window.addEventListener('storage', callback)
  return () => {
    window.removeEventListener(EVENT_NAME, callback)
    window.removeEventListener('storage', callback)
  }
}
