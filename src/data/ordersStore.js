const STORAGE_KEY = 'charms_orders'
const EVENT_NAME = 'charms-orders-updated'

export const ORDER_STATUSES = ['confirmed', 'preparing', 'delivering', 'completed']

export const ORDER_STATUS_LABELS = {
  confirmed: 'Confirmed',
  preparing: 'Being Prepared',
  delivering: 'Delivering',
  completed: 'Completed',
}

export function loadOrders() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export function saveOrders(orders) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
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
  return `o${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}

export function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
