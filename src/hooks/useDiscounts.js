import { useCallback, useEffect, useState } from 'react'
import { loadDiscounts, saveDiscounts, subscribe } from '../data/discountsStore'

export function useDiscounts() {
  const [discounts, setDiscounts] = useState(() => loadDiscounts())

  useEffect(() => subscribe(() => setDiscounts(loadDiscounts())), [])

  const setDiscount = useCallback((productId, percent) => {
    const next = { ...loadDiscounts() }
    if (percent > 0) {
      next[productId] = percent
    } else {
      delete next[productId]
    }
    saveDiscounts(next)
  }, [])

  const removeDiscount = useCallback((productId) => {
    const next = { ...loadDiscounts() }
    delete next[productId]
    saveDiscounts(next)
  }, [])

  return { discounts, setDiscount, removeDiscount }
}
