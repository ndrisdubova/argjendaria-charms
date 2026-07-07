import { useCallback, useEffect, useState } from 'react'
import { loadReviews, addReview as addReviewApi, updateReview as updateReviewApi, deleteReview as deleteReviewApi, subscribe } from '../data/reviewsStore'

export function useReviews() {
  const [reviews, setReviews] = useState([])

  const refresh = useCallback(() => {
    loadReviews().then(setReviews)
  }, [])

  useEffect(() => {
    refresh()
    return subscribe(refresh)
  }, [refresh])

  const addReview = useCallback((review) => addReviewApi(review), [])
  const updateReview = useCallback((id, updates) => updateReviewApi(id, updates), [])
  const deleteReview = useCallback((id) => deleteReviewApi(id), [])

  return { reviews, addReview, updateReview, deleteReview }
}
