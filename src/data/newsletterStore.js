const STORAGE_KEY = 'charms_newsletter'
const EVENT_NAME = 'charms-newsletter-updated'

export function loadSubscribers() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export function saveSubscribers(subscribers) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subscribers))
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
  return `n${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}
