import { supabase } from './supabaseClient'
import { createBroadcaster } from './broadcast'
import { dedupe } from './dedupe'

const { notify, subscribe } = createBroadcaster('charms-inquiries-updated')
export { subscribe }

function mapRow(row) {
  return {
    id: row.id,
    type: row.type,
    name: row.name,
    email: row.email,
    message: row.message,
    productId: row.product_id || undefined,
    productName: row.product_name || undefined,
    size: row.size || undefined,
    read: row.read,
    createdAt: row.created_at,
  }
}

export async function loadInquiries() {
  return dedupe('inquiries', async () => {
    const { data, error } = await supabase.from('inquiries').select('*').order('created_at')
    if (error) throw error
    return data.map(mapRow)
  })
}

export async function addInquiry(inquiry) {
  const { error } = await supabase.from('inquiries').insert({
    type: inquiry.type,
    name: inquiry.name,
    email: inquiry.email,
    message: inquiry.message,
    product_id: inquiry.productId || null,
    product_name: inquiry.productName || null,
    size: inquiry.size || null,
  })
  if (error) throw error
  notify()
}

export async function markRead(id) {
  const { error } = await supabase.from('inquiries').update({ read: true }).eq('id', id)
  if (error) throw error
  notify()
}

export async function deleteInquiry(id) {
  const { error } = await supabase.from('inquiries').delete().eq('id', id)
  if (error) throw error
  notify()
}
