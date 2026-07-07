import { ShieldAlert } from 'lucide-react'
import { useMaintenance } from '../../hooks/useMaintenance'
import { requireMaintenanceCode, setMaintenanceEnabled } from '../../data/maintenanceStore'

function AdminMaintenance() {
  const maintenance = useMaintenance()

  const handleToggle = () => {
    const action = maintenance.enabled ? 'disable maintenance mode' : 'enable maintenance mode'
    if (!requireMaintenanceCode(action)) return
    setMaintenanceEnabled(!maintenance.enabled)
  }

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <h1>Maintenance Mode</h1>
        <p>Take the storefront offline temporarily while you keep working.</p>
      </div>

      <div className="admin-panel">
        <div className="holiday-card-head">
          <h2><ShieldAlert size={18} strokeWidth={1.75} /> Maintenance Mode</h2>
          <button
            type="button"
            className={`holiday-toggle ${maintenance.enabled ? 'holiday-toggle-on' : ''}`}
            onClick={handleToggle}
            aria-pressed={maintenance.enabled}
            aria-label="Toggle maintenance mode"
          >
            <span className="holiday-toggle-knob" />
          </button>
        </div>
        <p className="admin-settings-desc">
          When enabled, visitors see a "we'll be right back" page instead of the storefront. The
          admin panel stays reachable so you can turn it back off. Requires the maintenance code
          to toggle either direction.
        </p>
        {maintenance.enabled && (
          <p className="admin-settings-desc admin-maintenance-live">Maintenance mode is currently live on the site.</p>
        )}
      </div>
    </div>
  )
}

export default AdminMaintenance
