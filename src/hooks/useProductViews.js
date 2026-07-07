import { useCallback, useEffect, useState } from 'react'
import { loadViews, recordView as recordViewApi, subscribe } from '../data/productViewsStore'

export function useProductViews() {
  const [views, setViews] = useState({})

  const refresh = useCallback(() => {
    loadViews().then(setViews)
  }, [])

  useEffect(() => {
    refresh()
    return subscribe(refresh)
  }, [refresh])

  const recordView = useCallback((productId) => recordViewApi(productId), [])

  return { views, recordView }
}
