const KEY = 'charms_maintenance'
const EVENT_NAME = 'charms-maintenance-updated'
const MAINTENANCE_CODE = 'charms2012'

export function loadMaintenance() {
  const raw = localStorage.getItem(KEY)
  if (!raw) return { enabled: false }
  try {
    return { enabled: false, ...JSON.parse(raw) }
  } catch {
    return { enabled: false }
  }
}

export function setMaintenanceEnabled(enabled) {
  localStorage.setItem(KEY, JSON.stringify({ enabled }))
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

export function requireMaintenanceCode(action = 'change maintenance mode') {
  const input = window.prompt(`Enter the maintenance code to ${action}:`)
  if (input === null) return false
  if (input !== MAINTENANCE_CODE) {
    window.alert('Incorrect code.')
    return false
  }
  return true
}
