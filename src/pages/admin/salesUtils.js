const MANAGE_PASSWORD = 'abc123'
const ANALYTICS_PASSWORD = 'adc123'

export function requirePassword() {
  const input = window.prompt('Enter password to edit or delete a sale:')
  if (input === null) return false
  if (input !== MANAGE_PASSWORD) {
    window.alert('Incorrect password.')
    return false
  }
  return true
}

export function requireAnalyticsPassword() {
  const input = window.prompt('Enter password to delete this piece:')
  if (input === null) return false
  if (input !== ANALYTICS_PASSWORD) {
    window.alert('Incorrect password.')
    return false
  }
  return true
}

export function formatMoney(n) {
  return `$${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function formatGrams(n) {
  return `${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}g`
}

export function formatDayLabel(day) {
  const [y, m, d] = day.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

export function formatTime(iso) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
}
