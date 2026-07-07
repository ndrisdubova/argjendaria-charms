import { supabase } from './supabaseClient'
import { createBroadcaster } from './broadcast'

const SESSION_KEY = 'charms_customer_session'
const { notify, subscribe } = createBroadcaster('charms-auth-updated')
export { subscribe }

export function getSession() {
  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function setSession(customer) {
  if (customer) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(customer))
  } else {
    localStorage.removeItem(SESSION_KEY)
  }
  notify()
}

export async function signup({ name, email, password }) {
  const { data, error } = await supabase.rpc('rpc_signup', { p_name: name, p_email: email, p_password: password })
  if (error) return { ok: false, error: error.message }
  const customer = data[0]
  setSession(customer)
  return { ok: true, customer }
}

export async function login(email, password) {
  const { data, error } = await supabase.rpc('rpc_login', { p_email: email, p_password: password })
  if (error) return { ok: false, error: error.message }
  if (!data || data.length === 0) {
    return { ok: false, error: 'Incorrect email or password.' }
  }
  const customer = data[0]
  setSession(customer)
  return { ok: true, customer }
}

export function logout() {
  setSession(null)
}

export async function resetPassword(email, newPassword) {
  const { data, error } = await supabase.rpc('rpc_reset_password', { p_email: email, p_new_password: newPassword })
  if (error) return { ok: false, error: error.message }
  const customer = data[0]
  setSession(customer)
  return { ok: true, customer }
}

export async function changePassword(customerId, currentPassword, newPassword) {
  const { error } = await supabase.rpc('rpc_change_password', {
    p_customer_id: customerId,
    p_current_password: currentPassword,
    p_new_password: newPassword,
  })
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function listCustomers() {
  const { data, error } = await supabase.rpc('rpc_list_customers')
  if (error) throw error
  return data.map((row) => ({ id: row.id, name: row.name, email: row.email, createdAt: row.created_at }))
}
