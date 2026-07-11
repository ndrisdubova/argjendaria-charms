import { useCallback, useEffect, useState } from 'react'
import { loadHolidays, setHolidayEnabled, setHolidayProductIds, subscribe, HOLIDAY_DEFS, getCachedHolidays, defaultHolidays } from '../data/holidaysStore'

export function useHolidays() {
  const [holidays, setHolidays] = useState(() => getCachedHolidays() || defaultHolidays())
  const [error, setError] = useState(null)

  const refresh = useCallback(() => {
    loadHolidays()
      .then((data) => {
        setHolidays(data)
        setError(null)
      })
      .catch((err) => {
        console.error('Failed to load holidays:', err)
        setError(err)
      })
  }, [])

  useEffect(() => {
    refresh()
    return subscribe(refresh)
  }, [refresh])

  const withErrorHandling = useCallback((promise) => {
    return Promise.resolve(promise).catch((err) => {
      console.error('Failed to update holiday:', err)
      setError(err)
    })
  }, [])

  const toggleHoliday = useCallback(
    (key) => withErrorHandling(setHolidayEnabled(key, !holidays[key]?.enabled)),
    [holidays, withErrorHandling],
  )

  const addProductToHoliday = useCallback(
    (key, productId) => {
      const ids = holidays[key]?.productIds || []
      if (ids.includes(productId)) return Promise.resolve()
      return withErrorHandling(setHolidayProductIds(key, [...ids, productId]))
    },
    [holidays, withErrorHandling],
  )

  const removeProductFromHoliday = useCallback(
    (key, productId) => {
      const ids = holidays[key]?.productIds || []
      return withErrorHandling(setHolidayProductIds(key, ids.filter((id) => id !== productId)))
    },
    [holidays, withErrorHandling],
  )

  return { holidays, error, toggleHoliday, addProductToHoliday, removeProductFromHoliday, HOLIDAY_DEFS }
}
