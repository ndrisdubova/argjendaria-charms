import { useEffect, useState } from 'react'
import { getFavoriteCounts, subscribe } from '../data/favoritesStore'

export function useFavoriteCounts() {
  const [counts, setCounts] = useState(() => getFavoriteCounts())

  useEffect(() => subscribe(() => setCounts(getFavoriteCounts())), [])

  return counts
}
