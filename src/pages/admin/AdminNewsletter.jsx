import { Trash2, Mail } from 'lucide-react'
import { useNewsletter } from '../../hooks/useNewsletter'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { dateStyle: 'medium' })
}

function AdminNewsletter() {
  const { subscribers, deleteSubscriber } = useNewsletter()
  const sorted = [...subscribers].sort((a, b) => new Date(b.subscribedAt) - new Date(a.subscribedAt))

  const handleDelete = (subscriber) => {
    if (window.confirm(`Remove ${subscriber.email} from the newsletter list?`)) {
      deleteSubscriber(subscriber.id)
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <h1>Newsletter</h1>
        <p>Subscribers collected from the site footer.</p>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Subscribed</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((s) => (
              <tr key={s.id}>
                <td>
                  <a className="admin-inquiry-email" href={`mailto:${s.email}`}>
                    <Mail size={14} strokeWidth={1.75} />
                    {s.email}
                  </a>
                </td>
                <td>{formatDate(s.subscribedAt)}</td>
                <td className="admin-table-actions">
                  <button type="button" className="admin-link-btn admin-link-danger" onClick={() => handleDelete(s)}>
                    <Trash2 size={14} strokeWidth={1.75} />
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={3} className="admin-table-empty">No subscribers yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminNewsletter
