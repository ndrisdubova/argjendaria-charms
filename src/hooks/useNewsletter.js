import { useCallback, useEffect, useState } from 'react'
import { loadSubscribers, saveSubscribers, subscribe, makeId } from '../data/newsletterStore'

export function useNewsletter() {
  const [subscribers, setSubscribers] = useState(() => loadSubscribers())

  useEffect(() => subscribe(() => setSubscribers(loadSubscribers())), [])

  const addSubscriber = useCallback((email) => {
    const current = loadSubscribers()
    if (current.some((s) => s.email.toLowerCase() === email.toLowerCase())) {
      return 'duplicate'
    }
    const next = [...current, { id: makeId(), email, subscribedAt: new Date().toISOString() }]
    saveSubscribers(next)
    return 'ok'
  }, [])

  const deleteSubscriber = useCallback((id) => {
    const next = loadSubscribers().filter((s) => s.id !== id)
    saveSubscribers(next)
  }, [])

  return { subscribers, addSubscriber, deleteSubscriber }
}
