const STORAGE_KEY = 'charms_inquiries'
const EVENT_NAME = 'charms-inquiries-updated'

export function loadInquiries() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export function saveInquiries(inquiries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(inquiries))
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
  return `i${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}
