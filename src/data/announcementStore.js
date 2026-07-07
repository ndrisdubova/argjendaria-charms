const KEY = 'charms_announcement'
const EVENT_NAME = 'charms-announcement-updated'

export function loadAnnouncement() {
  const raw = localStorage.getItem(KEY)
  if (!raw) return { enabled: false, text: '' }
  try {
    return { enabled: false, text: '', ...JSON.parse(raw) }
  } catch {
    return { enabled: false, text: '' }
  }
}

export function saveAnnouncement(data) {
  localStorage.setItem(KEY, JSON.stringify(data))
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
