import { useState } from 'react'
import { Plus, Pencil, Trash2, Star } from 'lucide-react'
import { useReviews } from '../../hooks/useReviews'
import ReviewForm from './ReviewForm'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { dateStyle: 'medium' })
}

function AdminReviews() {
  const { reviews, addReview, updateReview, deleteReview } = useReviews()
  const [editing, setEditing] = useState(null)
  const [adding, setAdding] = useState(false)
  const sorted = [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date))

  const handleDelete = (review) => {
    if (window.confirm(`Delete the review from ${review.name}? This cannot be undone.`)) {
      deleteReview(review.id)
    }
  }

  const handleSave = (data) => {
    if (editing) {
      updateReview(editing.id, data)
      setEditing(null)
    } else {
      addReview(data)
      setAdding(false)
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-head admin-page-head-row">
        <div>
          <h1>Reviews</h1>
          <p>Manage the client reviews shown on the homepage.</p>
        </div>
        <button type="button" className="btn btn-solid admin-btn-icon" onClick={() => setAdding(true)}>
          <Plus size={16} strokeWidth={2} />
          Add Review
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Rating</th>
              <th>Review</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>
                  <div className="admin-review-stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} strokeWidth={1.5} fill={i < r.rating ? 'currentColor' : 'none'} />
                    ))}
                  </div>
                </td>
                <td className="admin-review-text-cell">{r.text}</td>
                <td>{formatDate(r.date)}</td>
                <td className="admin-table-actions">
                  <button type="button" className="admin-link-btn" onClick={() => setEditing(r)}>
                    <Pencil size={14} strokeWidth={1.75} />
                    Edit
                  </button>
                  <button type="button" className="admin-link-btn admin-link-danger" onClick={() => handleDelete(r)}>
                    <Trash2 size={14} strokeWidth={1.75} />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={5} className="admin-table-empty">No reviews yet. Add your first one.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {(adding || editing) && (
        <ReviewForm
          initial={editing}
          onSave={handleSave}
          onClose={() => {
            setAdding(false)
            setEditing(null)
          }}
        />
      )}
    </div>
  )
}

export default AdminReviews
