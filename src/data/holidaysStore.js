const STORAGE_KEY = 'charms_holidays'
const EVENT_NAME = 'charms-holidays-updated'

export const HOLIDAY_DEFS = [
  { key: 'valentines', label: "Valentine's Day" },
  { key: 'christmas', label: 'Christmas' },
  { key: 'newyears', label: "New Year's" },
  { key: 'mothersday', label: "Mother's Day" },
]

function defaultHolidays() {
  return HOLIDAY_DEFS.reduce((acc, h) => {
    acc[h.key] = { enabled: false, productIds: [] }
    return acc
  }, {})
}

export function loadHolidays() {
  const raw = localStorage.getItem(STORAGE_KEY)
  const defaults = defaultHolidays()
  if (!raw) return defaults
  try {
    const parsed = JSON.parse(raw)
    return { ...defaults, ...parsed }
  } catch {
    return defaults
  }
}

export function saveHolidays(holidays) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(holidays))
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
