import { Mail, Trash2, Gem, MessageCircle, Inbox } from 'lucide-react'
import { useInquiries } from '../../hooks/useInquiries'

function formatDate(iso) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function AdminInquiries() {
  const { inquiries, markRead, deleteInquiry } = useInquiries()
  const sorted = [...inquiries].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const handleDelete = (inquiry) => {
    if (window.confirm(`Delete this inquiry from ${inquiry.name}? This cannot be undone.`)) {
      deleteInquiry(inquiry.id)
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <h1>Inquiries</h1>
        <p>Messages sent from the contact page and product pages.</p>
      </div>

      <div className="admin-inquiry-list">
        {sorted.map((inquiry) => (
          <div
            key={inquiry.id}
            className={`admin-inquiry-card ${inquiry.read ? '' : 'admin-inquiry-card-unread'}`}
            onClick={() => !inquiry.read && markRead(inquiry.id)}
          >
            <div className="admin-inquiry-card-head">
              <div className="admin-inquiry-card-title">
                {!inquiry.read && <span className="admin-inquiry-dot" aria-label="Unread" />}
                <span className="admin-inquiry-name">{inquiry.name}</span>
                <span className={`admin-inquiry-badge ${inquiry.type === 'piece' ? 'admin-inquiry-badge-piece' : ''}`}>
                  {inquiry.type === 'piece' ? <Gem size={12} strokeWidth={1.75} /> : <MessageCircle size={12} strokeWidth={1.75} />}
                  {inquiry.type === 'piece' ? `Piece: ${inquiry.productName}` : 'General'}
                </span>
                {inquiry.size && <span className="admin-inquiry-badge">Size: {inquiry.size}</span>}
              </div>
              <span className="admin-inquiry-date">{formatDate(inquiry.createdAt)}</span>
            </div>

            <a className="admin-inquiry-email" href={`mailto:${inquiry.email}`} onClick={(e) => e.stopPropagation()}>
              <Mail size={14} strokeWidth={1.75} />
              {inquiry.email}
            </a>

            <p className="admin-inquiry-message">{inquiry.message}</p>

            <div className="admin-table-actions">
              <button
                type="button"
                className="admin-link-btn admin-link-danger"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete(inquiry)
                }}
              >
                <Trash2 size={14} strokeWidth={1.75} />
                Delete
              </button>
            </div>
          </div>
        ))}

        {sorted.length === 0 && (
          <div className="admin-table-empty admin-table-empty-icon">
            <Inbox size={28} strokeWidth={1.5} />
            No inquiries yet.
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminInquiries
