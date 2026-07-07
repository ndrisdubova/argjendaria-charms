import { useCallback, useEffect, useState } from 'react'
import { loadViews, recordView as recordViewApi, subscribe } from '../data/productViewsStore'

export function useProductViews() {
  const [views, setViews] = useState(() => loadViews())

  useEffect(() => subscribe(() => setViews(loadViews())), [])

  const recordView = useCallback((productId) => recordViewApi(productId), [])

  return { views, recordView }
}
