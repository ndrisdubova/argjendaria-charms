import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'

function AdminNotFound() {
  return (
    <div className="admin-page">
      <div className="admin-not-found">
        <Compass size={32} strokeWidth={1.5} />
        <h1>404</h1>
        <p className="admin-settings-desc">This admin page doesn't exist.</p>
        <Link to="/admin" className="btn btn-outline">Back to Dashboard</Link>
      </div>
    </div>
  )
}

export default AdminNotFound
