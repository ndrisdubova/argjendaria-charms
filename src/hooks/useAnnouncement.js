import { useCallback, useEffect, useState } from 'react'
import { loadAnnouncement, saveAnnouncement, subscribe } from '../data/announcementStore'

export function useAnnouncement() {
  const [announcement, setAnnouncementState] = useState(() => loadAnnouncement())

  useEffect(() => subscribe(() => setAnnouncementState(loadAnnouncement())), [])

  const updateAnnouncement = useCallback((updates) => {
    const next = { ...loadAnnouncement(), ...updates }
    saveAnnouncement(next)
  }, [])

  return { announcement, updateAnnouncement }
}
