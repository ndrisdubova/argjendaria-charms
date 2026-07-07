import { supabase } from './supabaseClient'
import { createBroadcaster } from './broadcast'
import { dedupe } from './dedupe'

const { notify, subscribe } = createBroadcaster('charms-announcement-updated')
export { subscribe }

export async function loadAnnouncement() {
  return dedupe('announcement', async () => {
    const { data, error } = await supabase.from('announcement').select('enabled, text').eq('id', 1).maybeSingle()
    if (error) throw error
    return data ? { enabled: data.enabled, text: data.text } : { enabled: false, text: '' }
  })
}

export async function saveAnnouncement(updates) {
  const { error } = await supabase.from('announcement').update(updates).eq('id', 1)
  if (error) throw error
  notify()
}
