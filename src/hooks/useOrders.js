import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  loadOrders,
  insertOrderRow,
  updateOrderStatus as updateOrderStatusApi,
  deleteOrder as deleteOrderApi,
  subscribe,
} from '../data/ordersStore'
import { loadProducts, updateProduct } from '../data/productsStore'
import { addSale } from '../data/salesStore'

export function useOrders() {
  const [orders, setOrders] = useState([])

  const refresh = useCallback(() => {
    loadOrders().then(setOrders)
  }, [])

  useEffect(() => {
    refresh()
    return subscribe(refresh)
  }, [refresh])

  const placeOrder = useCallback(async (orderData) => {
    const total = orderData.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const order = await insertOrderRow({ ...orderData, total })

    const products = await loadProducts()
    await Promise.all(
      order.items.map((item) => {
        const product = products.find((p) => p.id === item.productId)
        if (!product) return Promise.resolve()
        const currentStock = Number.isFinite(product.stock) ? product.stock : 10
        return updateProduct(item.productId, { stock: Math.max(0, currentStock - item.quantity) })
      }),
    )

    await Promise.all(
      order.items.map((item) =>
        addSale({
          productId: item.productId,
          productName: item.productName,
          grams: 0,
          pricePerGram: 0,
          price: item.price * item.quantity,
          orderId: order.id,
        }),
      ),
    )

    return order
  }, [])

  const updateOrderStatus = useCallback((id, status) => updateOrderStatusApi(id, status), [])
  const deleteOrder = useCallback((id) => deleteOrderApi(id), [])

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
