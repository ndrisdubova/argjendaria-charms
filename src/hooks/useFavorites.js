import { useCallback, useEffect, useState } from 'react'
import { loadFavoritesForCustomer, addFavoriteForCustomer, removeFavoriteForCustomer, subscribe } from '../data/favoritesStore'
import { useAuth } from './useAuth'

export function useFavorites() {
  const { currentUser } = useAuth()
  const [favoriteIds, setFavoriteIds] = useState([])

  const refresh = useCallback(() => {
    if (!currentUser) {
      setFavoriteIds([])
      return
    }
    loadFavoritesForCustomer(currentUser.id).then(setFavoriteIds)
  }, [currentUser])

  useEffect(() => {
    refresh()
    return subscribe(refresh)
  }, [refresh])

  const isFavorite = useCallback((id) => favoriteIds.includes(id), [favoriteIds])

  const toggleFavorite = useCallback(
    async (id) => {
      if (!currentUser) return false
      if (favoriteIds.includes(id)) {
        await removeFavoriteForCustomer(currentUser.id, id)
      } else {
        await addFavoriteForCustomer(currentUser.id, id)
      }
      return true
    },
    [currentUser, favoriteIds],
  )

  return { favoriteIds, isFavorite, toggleFavorite, requiresLogin: !currentUser }
}
