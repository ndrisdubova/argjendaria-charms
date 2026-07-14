import { supabase } from './supabaseClient'
import { createBroadcaster } from './broadcast'
import { dedupe } from './dedupe'
import { samePersonalization } from './personalization'

const { notify, subscribe } = createBroadcaster('charms-cart-updated')
export { subscribe }

function mapRow(row) {
  return {
    productId: row.product_id,
    quantity: row.quantity,
    size: row.size || null,
    personalization: row.personalization || null,
  }
}

// Matched in JS rather than via a jsonb query so that two of the same piece with
// different engravings stay separate cart lines instead of merging into one.
async function findRow(customerId, productId, size, personalization) {
  const { data, error } = await supabase
    .from('cart_items')
    .select('id, quantity, size, personalization')
    .eq('customer_id', customerId)
    .eq('product_id', productId)
  if (error) throw error
  return (
    (data || []).find(
      (row) =>
        (row.size || null) === (size || null) &&
        samePersonalization(row.personalization, personalization),
    ) || null
  )
}

export async function loadCartForCustomer(customerId) {
  if (!customerId) return []
  return dedupe(`cart:${customerId}`, async () => {
    const { data, error } = await supabase.from('cart_items').select('*').eq('customer_id', customerId)
    if (error) throw error
    return data.map(mapRow)
  })
}

export async function addToCart(customerId, productId, quantity, size = null, personalization = null) {
  const existing = await findRow(customerId, productId, size, personalization)
  if (existing) {
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: existing.quantity + quantity, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
    if (error) throw error
  } else {
    const { error } = await supabase
      .from('cart_items')
      .insert({ customer_id: customerId, product_id: productId, quantity, size, personalization })
    if (error) throw error
  }
  notify()
}

export async function updateQuantity(customerId, productId, size, quantity, personalization = null) {
  const existing = await findRow(customerId, productId, size, personalization)
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

// Deletes by row id so removing one engraving doesn't wipe the other variants
// of the same piece.
export async function removeFromCart(customerId, productId, size = null, personalization = null) {
  const existing = await findRow(customerId, productId, size, personalization)
  if (!existing) return
  const { error } = await supabase.from('cart_items').delete().eq('id', existing.id)
  if (error) throw error
  notify()
}

export async function clearCart(customerId) {
  const { error } = await supabase.from('cart_items').delete().eq('customer_id', customerId)
  if (error) throw error
  notify()
}
