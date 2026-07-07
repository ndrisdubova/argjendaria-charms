import { useEffect, useState } from 'react'
import { Megaphone } from 'lucide-react'
import { useAnnouncement } from '../../hooks/useAnnouncement'

function AdminAnnouncement() {
  const { announcement, updateAnnouncement } = useAnnouncement()
  const [bannerText, setBannerText] = useState(announcement.text)

  useEffect(() => {
    setBannerText(announcement.text)
  }, [announcement.text])

  const handleToggle = () => updateAnnouncement({ enabled: !announcement.enabled })
  const handleSave = () => updateAnnouncement({ text: bannerText })

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <h1>Announcement Banner</h1>
        <p>Show a dismissible strip across the top of the site.</p>
      </div>

      <div className="admin-panel">
        <div className="holiday-card-head">
          <h2><Megaphone size={18} strokeWidth={1.75} /> Banner</h2>
          <button
            type="button"
            className={`holiday-toggle ${announcement.enabled ? 'holiday-toggle-on' : ''}`}
            onClick={handleToggle}
            aria-pressed={announcement.enabled}
            aria-label="Toggle announcement banner"
          >
            <span className="holiday-toggle-knob" />
          </button>
        </div>
        <p className="admin-settings-desc">
          A sale, new hours, or anything customers should see first. Visitors can dismiss it for
          their session.
        </p>

        <div className="form-field">
          <label htmlFor="banner-text">Banner text</label>
          <input
            id="banner-text"
            type="text"
            value={bannerText}
            onChange={(e) => setBannerText(e.target.value)}
            placeholder="Free shipping on all orders through Friday!"
          />
        </div>

        <button type="button" className="btn btn-solid" onClick={handleSave} disabled={bannerText === announcement.text}>
          Save Banner
        </button>
      </div>
    </div>
  )
}

export default AdminAnnouncement
