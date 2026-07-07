import { useCallback, useEffect, useState } from 'react'
import { loadHolidays, setHolidayEnabled, setHolidayProductIds, subscribe, HOLIDAY_DEFS } from '../data/holidaysStore'

export function useHolidays() {
  const [holidays, setHolidays] = useState({})

  const refresh = useCallback(() => {
    loadHolidays().then(setHolidays)
  }, [])

  useEffect(() => {
    refresh()
    return subscribe(refresh)
  }, [refresh])

  const toggleHoliday = useCallback(
    (key) => setHolidayEnabled(key, !holidays[key]?.enabled),
    [holidays],
  )

  const addProductToHoliday = useCallback(
    (key, productId) => {
      const ids = holidays[key]?.productIds || []
      if (ids.includes(productId)) return Promise.resolve()
      return setHolidayProductIds(key, [...ids, productId])
    },
    [holidays],
  )

  const removeProductFromHoliday = useCallback(
    (key, productId) => {
      const ids = holidays[key]?.productIds || []
      return setHolidayProductIds(key, ids.filter((id) => id !== productId))
    },
    [holidays],
  )

  return { holidays, toggleHoliday, addProductToHoliday, removeProductFromHoliday, HOLIDAY_DEFS }
}
