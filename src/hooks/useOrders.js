import { useCallback, useEffect, useMemo, useState } from 'react'
import { loadOrders, saveOrders, subscribe, makeId, todayKey } from '../data/ordersStore'
import { loadProducts, saveProducts } from '../data/productsStore'
import { loadSales, saveSales, makeId as makeSaleId } from '../data/salesStore'

export function useOrders() {
  const [orders, setOrders] = useState(() => loadOrders())

  useEffect(() => subscribe(() => setOrders(loadOrders())), [])

  const placeOrder = useCallback((orderData) => {
    const now = new Date()
    const total = orderData.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const order = {
      ...orderData,
      id: makeId(),
      status: 'confirmed',
      createdAt: now.toISOString(),
      day: todayKey(),
      total,
    }
    saveOrders([...loadOrders(), order])

    const products = loadProducts()
    const updatedProducts = products.map((p) => {
      const item = order.items.find((i) => i.productId === p.id)
      if (!item) return p
      const currentStock = Number.isFinite(p.stock) ? p.stock : 10
      return { ...p, stock: Math.max(0, currentStock - item.quantity) }
    })
    saveProducts(updatedProducts)

    const newSales = order.items.map((item) => ({
      id: makeSaleId(),
      productId: item.productId,
      productName: item.productName,
      grams: 0,
      pricePerGram: 0,
      price: item.price * item.quantity,
      date: now.toISOString(),
      day: order.day,
      orderId: order.id,
    }))
    saveSales([...loadSales(), ...newSales])

    return order
  }, [])

  const updateOrderStatus = useCallback((id, status) => {
    const next = loadOrders().map((o) => (o.id === id ? { ...o, status } : o))
    saveOrders(next)
  }, [])

  const deleteOrder = useCallback((id) => {
    // Removes the order from the admin's view only. The customer's own order
    // history and the sales/analytics records stay intact permanently.
    const next = loadOrders().map((o) => (o.id === id ? { ...o, archived: true } : o))
    saveOrders(next)
  }, [])

  const activeOrders = useMemo(
    () => orders.filter((o) => o.status !== 'completed' && !o.archived).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [orders],
  )

  const completedOrders = useMemo(
    () => orders.filter((o) => o.status === 'completed' && !o.archived).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [orders],
  )

  return { orders, placeOrder, updateOrderStatus, deleteOrder, activeOrders, completedOrders }
}
