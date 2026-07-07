import { useCallback, useEffect, useState } from 'react'
import { loadDiscounts, setDiscount as setDiscountApi, removeDiscount as removeDiscountApi, subscribe } from '../data/discountsStore'

export function useDiscounts() {
  const [discounts, setDiscounts] = useState({})

  const refresh = useCallback(() => {
    loadDiscounts().then(setDiscounts)
  }, [])

  useEffect(() => {
    refresh()
    return subscribe(refresh)
  }, [refresh])

  const setDiscount = useCallback((productId, percent) => setDiscountApi(productId, percent), [])
  const removeDiscount = useCallback((productId) => removeDiscountApi(productId), [])

  return { discounts, setDiscount, removeDiscount }
}
