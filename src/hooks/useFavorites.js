import { useCallback, useEffect, useState } from 'react'
import { loadAllFavorites, saveAllFavorites, subscribe } from '../data/favoritesStore'
import { useAuth } from './useAuth'

export function useFavorites() {
  const { currentUser } = useAuth()
  const [allFavorites, setAllFavorites] = useState(() => loadAllFavorites())

  useEffect(() => subscribe(() => setAllFavorites(loadAllFavorites())), [])

  const favoriteIds = currentUser ? allFavorites[currentUser.id] || [] : []

  const isFavorite = useCallback((id) => favoriteIds.includes(id), [favoriteIds])

  const toggleFavorite = useCallback(
    (id) => {
      if (!currentUser) return false
      const all = loadAllFavorites()
      const current = all[currentUser.id] || []
      const next = current.includes(id) ? current.filter((f) => f !== id) : [...current, id]
      saveAllFavorites({ ...all, [currentUser.id]: next })
      return true
    },
    [currentUser],
  )

  return { favoriteIds, isFavorite, toggleFavorite, requiresLogin: !currentUser }
}
