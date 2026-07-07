import { useCallback, useEffect, useState } from 'react'
import { loadAllCarts, saveAllCarts, subscribe } from '../data/cartStore'
import { useAuth } from './useAuth'

export function useCart() {
  const { currentUser } = useAuth()
  const [allCarts, setAllCarts] = useState(() => loadAllCarts())

  useEffect(() => subscribe(() => setAllCarts(loadAllCarts())), [])

  const items = currentUser ? allCarts[currentUser.id] || [] : []

  const addToCart = useCallback(
    (productId, quantity = 1, size = null) => {
      if (!currentUser) return false
      const all = loadAllCarts()
      const current = all[currentUser.id] || []
      const idx = current.findIndex((i) => i.productId === productId && (i.size || null) === size)
      const next =
        idx >= 0
          ? current.map((i, ix) => (ix === idx ? { ...i, quantity: i.quantity + quantity } : i))
          : [...current, { productId, quantity, size }]
      saveAllCarts({ ...all, [currentUser.id]: next })
      return true
    },
    [currentUser],
  )

  const updateQuantity = useCallback(
    (productId, size, quantity) => {
      if (!currentUser) return
      const all = loadAllCarts()
      const current = all[currentUser.id] || []
      const matches = (i) => i.productId === productId && (i.size || null) === (size || null)
      const next =
        quantity <= 0
          ? current.filter((i) => !matches(i))
          : current.map((i) => (matches(i) ? { ...i, quantity } : i))
      saveAllCarts({ ...all, [currentUser.id]: next })
    },
    [currentUser],
  )

  const removeFromCart = useCallback(
    (productId, size = null) => {
      if (!currentUser) return
      const all = loadAllCarts()
      const current = all[currentUser.id] || []
      const next = current.filter((i) => !(i.productId === productId && (i.size || null) === (size || null)))
      saveAllCarts({ ...all, [currentUser.id]: next })
    },
    [currentUser],
  )

  const clearCart = useCallback(() => {
    if (!currentUser) return
    const all = loadAllCarts()
    saveAllCarts({ ...all, [currentUser.id]: [] })
  }, [currentUser])

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)

  const quantityInCart = useCallback(
    (productId) => items.filter((i) => i.productId === productId).reduce((sum, i) => sum + i.quantity, 0),
    [items],
  )

  return { items, addToCart, updateQuantity, removeFromCart, clearCart, itemCount, quantityInCart, requiresLogin: !currentUser }
}
