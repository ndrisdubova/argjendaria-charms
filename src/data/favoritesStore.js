const STORAGE_KEY = 'charms_favorites'
const EVENT_NAME = 'charms-favorites-updated'

export function loadAllFavorites() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? {} : parsed
  } catch {
    return {}
  }
}

export function saveAllFavorites(map) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
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

export function addFavoriteForCustomer(customerId, productId) {
  const all = loadAllFavorites()
  const current = all[customerId] || []
  if (!current.includes(productId)) {
    saveAllFavorites({ ...all, [customerId]: [...current, productId] })
  }
}

export function getFavoriteCounts() {
  const all = loadAllFavorites()
  const counts = {}
  Object.values(all).forEach((ids) => {
    ids.forEach((id) => {
      counts[id] = (counts[id] || 0) + 1
    })
  })
  return counts
}
