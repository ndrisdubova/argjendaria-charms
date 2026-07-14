import { useCallback, useEffect, useState } from 'react'
import {
  loadCartForCustomer,
  addToCart as addToCartApi,
  updateQuantity as updateQuantityApi,
  removeFromCart as removeFromCartApi,
  clearCart as clearCartApi,
  subscribe,
} from '../data/cartStore'
import { useAuth } from './useAuth'

export function useCart() {
  const { currentUser } = useAuth()
  const [items, setItems] = useState([])

  const refresh = useCallback(() => {
    if (!currentUser) {
      setItems([])
      return
    }
    loadCartForCustomer(currentUser.id).then(setItems)
  }, [currentUser])

  useEffect(() => {
    refresh()
    return subscribe(refresh)
  }, [refresh])

  const addToCart = useCallback(
    async (productId, quantity = 1, size = null, personalization = null) => {
      if (!currentUser) return false
      await addToCartApi(currentUser.id, productId, quantity, size, personalization)
      return true
    },
    [currentUser],
  )

  const updateQuantity = useCallback(
    async (productId, size, quantity, personalization = null) => {
      if (!currentUser) return
      await updateQuantityApi(currentUser.id, productId, size, quantity, personalization)
    },
    [currentUser],
  )

  const removeFromCart = useCallback(
    async (productId, size = null, personalization = null) => {
      if (!currentUser) return
      await removeFromCartApi(currentUser.id, productId, size, personalization)
    },
    [currentUser],
  )

  const clearCart = useCallback(async () => {
    if (!currentUser) return
    await clearCartApi(currentUser.id)
  }, [currentUser])

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)

  const quantityInCart = useCallback(
    (productId) => items.filter((i) => i.productId === productId).reduce((sum, i) => sum + i.quantity, 0),
    [items],
  )

  return { items, addToCart, updateQuantity, removeFromCart, clearCart, itemCount, quantityInCart, requiresLogin: !currentUser }
}
