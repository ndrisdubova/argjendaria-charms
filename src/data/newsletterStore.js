import { supabase } from './supabaseClient'
import { createBroadcaster } from './broadcast'

const { notify, subscribe } = createBroadcaster('charms-newsletter-updated')
export { subscribe }

function mapRow(row) {
  return { id: row.id, email: row.email, subscribedAt: row.subscribed_at }
}

export async function loadSubscribers() {
  const { data, error } = await supabase.from('newsletter_subscribers').select('*').order('subscribed_at')
  if (error) throw error
  return data.map(mapRow)
}

export async function addSubscriber(email) {
  const { error } = await supabase.from('newsletter_subscribers').insert({ email })
  if (error) {
    if (error.code === '23505') return 'duplicate'
    throw error
  }
  notify()
  return 'ok'
}

export async function deleteSubscriber(id) {
  const { error } = await supabase.from('newsletter_subscribers').delete().eq('id', id)
  if (error) throw error
  notify()
}
