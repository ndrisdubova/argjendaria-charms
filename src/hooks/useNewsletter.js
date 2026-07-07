import { useCallback, useEffect, useState } from 'react'
import { loadSubscribers, addSubscriber as addSubscriberApi, deleteSubscriber as deleteSubscriberApi, subscribe } from '../data/newsletterStore'

export function useNewsletter() {
  const [subscribers, setSubscribers] = useState([])

  const refresh = useCallback(() => {
    loadSubscribers().then(setSubscribers)
  }, [])

  useEffect(() => {
    refresh()
    return subscribe(refresh)
  }, [refresh])

  const addSubscriber = useCallback((email) => addSubscriberApi(email), [])
  const deleteSubscriber = useCallback((id) => deleteSubscriberApi(id), [])

  return { subscribers, addSubscriber, deleteSubscriber }
}
