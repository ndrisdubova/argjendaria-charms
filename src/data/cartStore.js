import { supabase } from './supabaseClient'
import { createBroadcaster } from './broadcast'
import { dedupe } from './dedupe'

const { notify, subscribe } = createBroadcaster('charms-cart-updated')
export { subscribe }

function mapRow(row) {
  return { productId: row.product_id, quantity: row.quantity, size: row.size || null }
}

async function findRow(customerId, productId, size) {
  let query = supabase.from('cart_items').select('id, quantity').eq('customer_id', customerId).eq('product_id', productId)
  query = size ? query.eq('size', size) : query.is('size', null)
  const { data, error } = await query.maybeSingle()
  if (error) throw error
  return data
}

export async function loadCartForCustomer(customerId) {
  if (!customerId) return []
  return dedupe(`cart:${customerId}`, async () => {
    const { data, error } = await supabase.from('cart_items').select('*').eq('customer_id', customerId)
    if (error) throw error
    return data.map(mapRow)
  })
}

export async function addToCart(customerId, productId, quantity, size = null) {
  const existing = await findRow(customerId, productId, size)
  if (existing) {
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: existing.quantity + quantity, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
    if (error) throw error
  } else {
    const { error } = await supabase.from('cart_items').insert({ customer_id: customerId, product_id: productId, quantity, size })
    if (error) throw error
  }
  notify()
}

export async function updateQuantity(customerId, productId, size, quantity) {
  const existing = await findRow(customerId, productId, size)
  if (!existing) return
  if (quantity <= 0) {
    const { error } = await supabase.from('cart_items').delete().eq('id', existing.id)
    if (error) throw error
  } else {
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
    if (error) throw error
  }
  notify()
}

export async function removeFromCart(customerId, productId, size = null) {
  let query = supabase.from('cart_items').delete().eq('customer_id', customerId).eq('product_id', productId)
  query = size ? query.eq('size', size) : query.is('size', null)
  const { error } = await query
  if (error) throw error
  notify()
}

export async function clearCart(customerId) {
  const { error } = await supabase.from('cart_items').delete().eq('customer_id', customerId)
  if (error) throw error
  notify()
}
