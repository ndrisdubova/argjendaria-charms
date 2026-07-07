import { useCallback, useEffect, useMemo, useState } from 'react'
import { loadSales, saveSales, subscribe, makeId, todayKey } from '../data/salesStore'

export function useSales() {
  const [sales, setSales] = useState(() => loadSales())

  useEffect(() => subscribe(() => setSales(loadSales())), [])

  const addSale = useCallback((sale) => {
    const now = new Date()
    const next = [...loadSales(), { ...sale, id: makeId(), date: now.toISOString(), day: todayKey() }]
    saveSales(next)
  }, [])

  const updateSale = useCallback((id, updates) => {
    const next = loadSales().map((s) => (s.id === id ? { ...s, ...updates } : s))
    saveSales(next)
  }, [])

  const deleteSale = useCallback((id) => {
    const next = loadSales().filter((s) => s.id !== id)
    saveSales(next)
  }, [])

  const today = todayKey()

  const todaySales = useMemo(
    () => sales.filter((s) => s.day === today).sort((a, b) => new Date(b.date) - new Date(a.date)),
    [sales, today],
  )

  const todayTotals = useMemo(
    () => ({
      count: todaySales.length,
      grams: todaySales.reduce((sum, s) => sum + Number(s.grams || 0), 0),
      revenue: todaySales.reduce((sum, s) => sum + Number(s.price || 0), 0),
    }),
    [todaySales],
  )

  const allDayGroups = useMemo(() => {
    const byDay = {}
    sales.forEach((s) => {
      if (!byDay[s.day]) byDay[s.day] = []
      byDay[s.day].push(s)
    })
    return Object.entries(byDay)
      .map(([day, entries]) => ({
        day,
        entries: entries.sort((a, b) => new Date(b.date) - new Date(a.date)),
        count: entries.length,
        grams: entries.reduce((sum, s) => sum + Number(s.grams || 0), 0),
        revenue: entries.reduce((sum, s) => sum + Number(s.price || 0), 0),
      }))
      .sort((a, b) => b.day.localeCompare(a.day))
  }, [sales])

  const history = useMemo(() => allDayGroups.filter((g) => g.day !== today), [allDayGroups, today])

  return { sales, addSale, updateSale, deleteSale, today, todaySales, todayTotals, history, allDayGroups }
}
