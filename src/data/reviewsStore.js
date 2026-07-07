import { supabase } from './supabaseClient'
import { createBroadcaster } from './broadcast'
import { dedupe } from './dedupe'

const { notify, subscribe } = createBroadcaster('charms-reviews-updated')
export { subscribe }

function mapRow(row) {
  return { id: row.id, name: row.name, rating: row.rating, text: row.text, date: row.created_at }
}

export async function loadReviews() {
  return dedupe('reviews', async () => {
    const { data, error } = await supabase.from('reviews').select('*').order('created_at')
    if (error) throw error
    return data.map(mapRow)
  })
}

export async function addReview(review) {
  const { error } = await supabase.from('reviews').insert({ name: review.name, rating: review.rating, text: review.text })
  if (error) throw error
  notify()
}

export async function updateReview(id, updates) {
  const patch = {}
  if (updates.name !== undefined) patch.name = updates.name
  if (updates.rating !== undefined) patch.rating = updates.rating
  if (updates.text !== undefined) patch.text = updates.text
  const { error } = await supabase.from('reviews').update(patch).eq('id', id)
  if (error) throw error
  notify()
}

export async function deleteReview(id) {
  const { error } = await supabase.from('reviews').delete().eq('id', id)
  if (error) throw error
  notify()
}
