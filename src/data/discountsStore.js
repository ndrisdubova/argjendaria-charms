const STORAGE_KEY = 'charms_discounts'
const EVENT_NAME = 'charms-discounts-updated'

export function loadDiscounts() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return {}
  try {
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

export function saveDiscounts(discounts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(discounts))
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

export function getDiscountedPrice(price, percent) {
  return Math.round(price * (1 - percent / 100) * 100) / 100
}

export function formatDiscountedPrice(price) {
  return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
