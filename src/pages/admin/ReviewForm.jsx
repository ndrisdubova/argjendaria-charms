import { useState } from 'react'
import { X } from 'lucide-react'

const EMPTY = { name: '', rating: 5, text: '' }

function ReviewForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(() => (initial ? { ...EMPTY, ...initial } : EMPTY))
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: name === 'rating' ? Number(value) : value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.text.trim()) {
      setError('Client name and review text are required.')
      return
    }
    onSave(form)
  }

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <form className="admin-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className="admin-modal-head">
          <h2>{initial ? 'Edit Review' : 'Add Review'}</h2>
          <button type="button" className="admin-modal-close" onClick={onClose} aria-label="Close">
            <X size={20} strokeWidth={1.75} />
          </button>
        </div>

        <div className="form-field">
          <label htmlFor="name">Client Name</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Elira K." />
        </div>

        <div className="form-field">
          <label htmlFor="rating">Rating</label>
          <select id="rating" name="rating" value={form.rating} onChange={handleChange}>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="text">Review</label>
          <textarea id="text" name="text" rows={4} value={form.text} onChange={handleChange} placeholder="What did the client say?" />
        </div>

        {error && <span className="form-error">{error}</span>}

        <div className="admin-modal-actions">
          <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-solid">{initial ? 'Save Changes' : 'Add Review'}</button>
        </div>
      </form>
    </div>
  )
}

export default ReviewForm
