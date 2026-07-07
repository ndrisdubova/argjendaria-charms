import { useEffect, useState } from 'react'
import { Megaphone, X } from 'lucide-react'
import { useAnnouncement } from '../hooks/useAnnouncement'
import './AnnouncementBar.css'

const DISMISS_KEY = 'charms_announcement_dismissed'

function AnnouncementBar() {
  const { announcement } = useAnnouncement()
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem(DISMISS_KEY))

  useEffect(() => {
    setDismissed(sessionStorage.getItem(DISMISS_KEY))
  }, [announcement.text])

  if (!announcement.enabled || !announcement.text.trim() || dismissed === announcement.text) {
    return null
  }

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, announcement.text)
    setDismissed(announcement.text)
  }

  return (
    <div className="announcement-bar" role="status">
      <div className="container announcement-bar-inner">
        <span className="announcement-bar-text">
          <Megaphone size={15} strokeWidth={1.75} />
          {announcement.text}
        </span>
        <button type="button" className="announcement-bar-close" aria-label="Dismiss announcement" onClick={handleDismiss}>
          <X size={15} strokeWidth={1.75} />
        </button>
      </div>
    </div>
  )
}

export default AnnouncementBar
