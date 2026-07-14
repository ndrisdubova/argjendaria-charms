import { supabase } from './supabaseClient'
import { createBroadcaster } from './broadcast'
import { dedupe } from './dedupe'

const { notify, subscribe } = createBroadcaster('charms-products-updated')
export { subscribe }

const FIELD_MAP = {
  name: 'name',
  category: 'category',
  price: 'price',
  offerPrice: 'offer_price',
  material: 'material',
  description: 'description',
  featured: 'featured',
  image: 'image',
  gallery: 'gallery',
  sizes: 'sizes',
  stock: 'stock',
  personalizable: 'personalizable',
}

function toPatch(fields) {
  const patch = {}
  for (const [key, value] of Object.entries(fields)) {
    const column = FIELD_MAP[key]
    if (column) patch[column] = value
  }
  return patch
}

function mapRow(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: Number(row.price),
    offerPrice: row.offer_price != null ? Number(row.offer_price) : undefined,
    material: row.material,
    description: row.description,
    featured: row.featured,
    image: row.image || undefined,
    gallery: row.gallery || [],
    sizes: row.sizes || [],
    stock: row.stock,
    personalizable: row.personalizable ?? false,
    createdAt: row.created_at,
  }
}

let cachedProducts = null

export function getCachedProducts() {
  return cachedProducts
}

export async function loadProducts() {
  return dedupe('products', async () => {
    const { data, error } = await supabase.from('products').select('*').order('created_at')
    if (error) throw error
    cachedProducts = data.map(mapRow)
    return cachedProducts
  })
}

export async function addProduct(product) {
  const { error } = await supabase.from('products').insert(toPatch(product))
  if (error) throw error
  notify()
}

export async function updateProduct(id, updates) {
  const { error } = await supabase.from('products').update(toPatch(updates)).eq('id', id)
  if (error) throw error
  notify()
}

export async function deleteProduct(id) {
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
  notify()
}

export function getStock(product) {
  return Number.isFinite(product?.stock) ? product.stock : 10
}
