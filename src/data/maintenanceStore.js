import { supabase } from './supabaseClient'
import { createBroadcaster } from './broadcast'

const { notify, subscribe } = createBroadcaster('charms-maintenance-updated')
export { subscribe }

const MAINTENANCE_CODE = 'charms2012'

export async function loadMaintenance() {
  const { data, error } = await supabase.from('maintenance').select('enabled').eq('id', 1).maybeSingle()
  if (error) throw error
  return data ? { enabled: data.enabled } : { enabled: false }
}

export async function setMaintenanceEnabled(enabled) {
  const { error } = await supabase.from('maintenance').update({ enabled }).eq('id', 1)
  if (error) throw error
  notify()
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
