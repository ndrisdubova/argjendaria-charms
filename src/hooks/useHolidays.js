import { useCallback, useEffect, useState } from 'react'
import { loadHolidays, saveHolidays, subscribe, HOLIDAY_DEFS } from '../data/holidaysStore'

export function useHolidays() {
  const [holidays, setHolidays] = useState(() => loadHolidays())

  useEffect(() => subscribe(() => setHolidays(loadHolidays())), [])

  const toggleHoliday = useCallback((key) => {
    const current = loadHolidays()
    saveHolidays({ ...current, [key]: { ...current[key], enabled: !current[key].enabled } })
  }, [])

  const addProductToHoliday = useCallback((key, productId) => {
    const current = loadHolidays()
    const ids = current[key].productIds
    if (!ids.includes(productId)) {
      saveHolidays({ ...current, [key]: { ...current[key], productIds: [...ids, productId] } })
    }
  }, [])

  const removeProductFromHoliday = useCallback((key, productId) => {
    const current = loadHolidays()
    saveHolidays({
      ...current,
      [key]: { ...current[key], productIds: current[key].productIds.filter((id) => id !== productId) },
    })
  }, [])

  return { holidays, toggleHoliday, addProductToHoliday, removeProductFromHoliday, HOLIDAY_DEFS }
}
