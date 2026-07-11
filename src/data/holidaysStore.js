import { supabase } from './supabaseClient'
import { createBroadcaster } from './broadcast'
import { dedupe } from './dedupe'

const { notify, subscribe } = createBroadcaster('charms-holidays-updated')
export { subscribe }

export const HOLIDAY_DEFS = [
  { key: 'valentines', label: "Valentine's Day" },
  { key: 'christmas', label: 'Christmas' },
  { key: 'newyears', label: "New Year's" },
  { key: 'mothersday', label: "Mother's Day" },
]

export function defaultHolidays() {
  return HOLIDAY_DEFS.reduce((acc, h) => {
    acc[h.key] = { enabled: false, productIds: [] }
    return acc
  }, {})
}

let cachedHolidays = null

export function getCachedHolidays() {
  return cachedHolidays
}

export async function loadHolidays() {
  return dedupe('holidays', async () => {
    const { data, error } = await supabase.from('holidays').select('*')
    if (error) throw error
    const map = defaultHolidays()
    data.forEach((row) => {
      map[row.key] = { enabled: row.enabled, productIds: row.product_ids || [] }
    })
    cachedHolidays = map
    return cachedHolidays
  })
}

export async function setHolidayEnabled(key, enabled) {
  const { error } = await supabase.from('holidays').update({ enabled }).eq('key', key)
  if (error) throw error
  notify()
}

export async function setHolidayProductIds(key, productIds) {
  const { error } = await supabase.from('holidays').update({ product_ids: productIds }).eq('key', key)
  if (error) throw error
  notify()
}
