import { supabase } from './supabaseClient'
import { createBroadcaster } from './broadcast'

const { notify, subscribe } = createBroadcaster('charms-favorites-updated')
export { subscribe }

export async function loadFavoritesForCustomer(customerId) {
  if (!customerId) return []
  const { data, error } = await supabase.from('favorites').select('product_id').eq('customer_id', customerId)
  if (error) throw error
  return data.map((row) => row.product_id)
}

export async function addFavoriteForCustomer(customerId, productId) {
  const { error } = await supabase
    .from('favorites')
    .upsert({ customer_id: customerId, product_id: productId }, { onConflict: 'customer_id,product_id' })
  if (error) throw error
  notify()
}

export async function removeFavoriteForCustomer(customerId, productId) {
  const { error } = await supabase.from('favorites').delete().eq('customer_id', customerId).eq('product_id', productId)
  if (error) throw error
  notify()
}

export async function getFavoriteCounts() {
  const { data, error } = await supabase.from('favorites').select('product_id')
  if (error) throw error
  const counts = {}
  data.forEach((row) => {
    counts[row.product_id] = (counts[row.product_id] || 0) + 1
  })
  return counts
}
