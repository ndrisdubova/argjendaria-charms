import { supabase } from './supabaseClient'
import { createBroadcaster } from './broadcast'

const { notify, subscribe } = createBroadcaster('charms-discounts-updated')
export { subscribe }

export async function loadDiscounts() {
  const { data, error } = await supabase.from('discounts').select('product_id, percent')
  if (error) throw error
  const map = {}
  data.forEach((row) => {
    map[row.product_id] = row.percent
  })
  return map
}

export async function setDiscount(productId, percent) {
  if (percent > 0) {
    const { error } = await supabase.from('discounts').upsert({ product_id: productId, percent })
    if (error) throw error
  } else {
    const { error } = await supabase.from('discounts').delete().eq('product_id', productId)
    if (error) throw error
  }
  notify()
}

export async function removeDiscount(productId) {
  const { error } = await supabase.from('discounts').delete().eq('product_id', productId)
  if (error) throw error
  notify()
}

export function getDiscountedPrice(price, percent) {
  return Math.round(price * (1 - percent / 100) * 100) / 100
}

export function formatDiscountedPrice(price) {
  return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
