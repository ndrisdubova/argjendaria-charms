import { useCallback, useEffect, useState } from 'react'
import { getFavoriteCounts, subscribe } from '../data/favoritesStore'

export function useFavoriteCounts() {
  const [counts, setCounts] = useState({})

  const refresh = useCallback(() => {
    getFavoriteCounts().then(setCounts)
  }, [])

  useEffect(() => {
    refresh()
    return subscribe(refresh)
  }, [refresh])

  return counts
}
