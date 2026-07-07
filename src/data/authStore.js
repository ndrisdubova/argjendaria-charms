const USERS_KEY = 'charms_customers'
const SESSION_KEY = 'charms_customer_session'
const EVENT_NAME = 'charms-auth-updated'

export function loadCustomers() {
  const raw = localStorage.getItem(USERS_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function saveCustomers(customers) {
  localStorage.setItem(USERS_KEY, JSON.stringify(customers))
}

export function getSession() {
  return localStorage.getItem(SESSION_KEY)
}

function setSession(customerId) {
  if (customerId) {
    localStorage.setItem(SESSION_KEY, customerId)
  } else {
    localStorage.removeItem(SESSION_KEY)
  }
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

export function signup({ name, email, password }) {
  const customers = loadCustomers()
  if (customers.some((c) => c.email.toLowerCase() === email.toLowerCase())) {
    return { ok: false, error: 'An account with this email already exists.' }
  }
  const customer = { id: makeId(), name, email, password }
  saveCustomers([...customers, customer])
  setSession(customer.id)
  return { ok: true, customer }
}

export function login(email, password) {
  const customers = loadCustomers()
  const match = customers.find((c) => c.email.toLowerCase() === email.toLowerCase() && c.password === password)
  if (!match) {
    return { ok: false, error: 'Incorrect email or password.' }
  }
  setSession(match.id)
  return { ok: true, customer: match }
}

export function logout() {
  setSession(null)
}

export function resetPassword(email, newPassword) {
  const customers = loadCustomers()
  const idx = customers.findIndex((c) => c.email.toLowerCase() === email.toLowerCase())
  if (idx === -1) {
    return { ok: false, error: 'No account found with that email.' }
  }
  const updated = { ...customers[idx], password: newPassword }
  const next = [...customers]
  next[idx] = updated
  saveCustomers(next)
  setSession(updated.id)
  return { ok: true, customer: updated }
}

export function changePassword(customerId, currentPassword, newPassword) {
  const customers = loadCustomers()
  const idx = customers.findIndex((c) => c.id === customerId)
  if (idx === -1) {
    return { ok: false, error: 'Account not found.' }
  }
  if (customers[idx].password !== currentPassword) {
    return { ok: false, error: 'Current password is incorrect.' }
  }
  const next = [...customers]
  next[idx] = { ...customers[idx], password: newPassword }
  saveCustomers(next)
  return { ok: true }
}

export function makeId() {
  return `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}
