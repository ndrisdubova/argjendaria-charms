import { supabase } from './supabaseClient'
import { createBroadcaster } from './broadcast'

const { notify, subscribe } = createBroadcaster('charms-sales-updated')
export { subscribe }

export function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function mapRow(row) {
  return {
    id: row.id,
    productId: row.product_id || undefined,
    productName: row.product_name,
    grams: Number(row.grams),
    pricePerGram: Number(row.price_per_gram),
    price: Number(row.price),
    date: row.created_at,
    day: row.day,
    orderId: row.order_id || undefined,
  }
}

export async function loadSales() {
  const { data, error } = await supabase.from('sales').select('*').order('created_at')
  if (error) throw error
  return data.map(mapRow)
}

export async function addSale(sale) {
  const { error } = await supabase.from('sales').insert({
    product_id: sale.productId || null,
    product_name: sale.productName,
    grams: sale.grams,
    price_per_gram: sale.pricePerGram,
    price: sale.price,
    day: todayKey(),
    order_id: sale.orderId || null,
  })
  if (error) throw error
  notify()
}

const UPDATE_FIELD_MAP = {
  productName: 'product_name',
  grams: 'grams',
  pricePerGram: 'price_per_gram',
  price: 'price',
}

export async function updateSale(id, updates) {
  const patch = {}
  for (const [key, value] of Object.entries(updates)) {
    const column = UPDATE_FIELD_MAP[key]
    if (column) patch[column] = value
  }
  const { error } = await supabase.from('sales').update(patch).eq('id', id)
  if (error) throw error
  notify()
}

export async function deleteSale(id) {
  const { error } = await supabase.from('sales').delete().eq('id', id)
  if (error) throw error
  notify()
}
