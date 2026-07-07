import { Moon, Sun } from 'lucide-react'
import { useAdminTheme } from '../../hooks/useAdminTheme'

function AdminSettings() {
  const [theme, setTheme] = useAdminTheme()

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <h1>Settings</h1>
        <p>Customize the Admin Panel.</p>
      </div>

      <div className="admin-panel">
        <h2>Appearance</h2>
        <p className="admin-settings-desc">
          Choose a light or dark theme for the admin panel. This only affects your view of the
          dashboard — it doesn't change how the storefront looks to customers.
        </p>

        <div className="theme-toggle">
          <button
            type="button"
            className={`theme-option ${theme === 'dark' ? 'theme-option-active' : ''}`}
            onClick={() => setTheme('dark')}
          >
            <Moon size={17} strokeWidth={1.75} />
            Dark Mode
          </button>
          <button
            type="button"
            className={`theme-option ${theme === 'light' ? 'theme-option-active' : ''}`}
            onClick={() => setTheme('light')}
          >
            <Sun size={17} strokeWidth={1.75} />
            Light Mode
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminSettings
