import { supabase } from './supabaseClient'
import { createBroadcaster } from './broadcast'
import { dedupe } from './dedupe'

const { notify, subscribe } = createBroadcaster('charms-orders-updated')
export { subscribe }

export const ORDER_STATUSES = ['confirmed', 'preparing', 'delivering', 'completed']

export const ORDER_STATUS_LABELS = {
  confirmed: 'Confirmed',
  preparing: 'Being Prepared',
  delivering: 'Delivering',
  completed: 'Completed',
}

export function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function mapRow(row) {
  return {
    id: row.id,
    customerId: row.customer_id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    address: row.address,
    items: row.items || [],
    status: row.status,
    archived: row.archived,
    total: Number(row.total),
    day: row.day,
    createdAt: row.created_at,
  }
}

export async function loadOrders() {
  return dedupe('orders', async () => {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return data.map(mapRow)
  })
}

export async function insertOrderRow(order) {
  const { data, error } = await supabase
    .from('orders')
    .insert({
      customer_id: order.customerId,
      first_name: order.firstName,
      last_name: order.lastName,
      email: order.email,
      phone: order.phone,
      address: order.address,
      items: order.items,
      status: 'confirmed',
      total: order.total,
      day: todayKey(),
    })
    .select()
    .single()
  if (error) throw error
  notify()
  return mapRow(data)
}

export async function updateOrderStatus(id, status) {
  const { error } = await supabase.from('orders').update({ status }).eq('id', id)
  if (error) throw error
  notify()
}

export async function deleteOrder(id) {
  const { error } = await supabase.from('orders').update({ archived: true }).eq('id', id)
  if (error) throw error
  notify()
}
