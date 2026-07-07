import { supabase } from './supabaseClient'
import { createBroadcaster } from './broadcast'
import { dedupe } from './dedupe'

const { notify, subscribe } = createBroadcaster('charms-product-views-updated')
export { subscribe }

export async function loadViews() {
  return dedupe('product-views', async () => {
    const { data, error } = await supabase.from('product_views').select('product_id, count')
    if (error) throw error
    const map = {}
    data.forEach((row) => {
      map[row.product_id] = row.count
    })
    return map
  })
}

export async function recordView(productId) {
  const { error } = await supabase.rpc('increment_product_view', { p_product_id: productId })
  if (error) throw error
  notify()
}
