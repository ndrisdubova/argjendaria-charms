import { useCallback, useEffect, useState } from 'react'
import { loadAnnouncement, saveAnnouncement, subscribe } from '../data/announcementStore'

export function useAnnouncement() {
  const [announcement, setAnnouncementState] = useState({ enabled: false, text: '' })

  const refresh = useCallback(() => {
    loadAnnouncement().then(setAnnouncementState)
  }, [])

  useEffect(() => {
    refresh()
    return subscribe(refresh)
  }, [refresh])

  const updateAnnouncement = useCallback((updates) => saveAnnouncement(updates), [])

  return { announcement, updateAnnouncement }
}
