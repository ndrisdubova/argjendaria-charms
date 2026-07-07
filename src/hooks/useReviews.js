import { useCallback, useEffect, useState } from 'react'
import { loadReviews, saveReviews, subscribe, makeId } from '../data/reviewsStore'

export function useReviews() {
  const [reviews, setReviews] = useState(() => loadReviews())

  useEffect(() => subscribe(() => setReviews(loadReviews())), [])

  const addReview = useCallback((review) => {
    const next = [...loadReviews(), { ...review, id: makeId(), date: new Date().toISOString() }]
    saveReviews(next)
  }, [])

  const updateReview = useCallback((id, updates) => {
    const next = loadReviews().map((r) => (r.id === id ? { ...r, ...updates } : r))
    saveReviews(next)
  }, [])

  const deleteReview = useCallback((id) => {
    const next = loadReviews().filter((r) => r.id !== id)
    saveReviews(next)
  }, [])

  return { reviews, addReview, updateReview, deleteReview }
}
