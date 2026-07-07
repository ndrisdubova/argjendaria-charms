import { useState } from 'react'
import { X } from 'lucide-react'
import ImageInput from './ImageInput'

const EMPTY = {
  title: '',
  excerpt: '',
  content: '',
  author: "Charm's Atelier",
  image: '',
}

function BlogPostForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(() => (initial ? { ...EMPTY, ...initial } : EMPTY))
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const setImage = (value) => setForm((f) => ({ ...f, image: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.excerpt.trim() || !form.content.trim()) {
      setError('Title, excerpt and content are required.')
      return
    }
    if (!form.image) {
      setError('A cover image is required.')
      return
    }
    onSave(form)
  }

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <form className="admin-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className="admin-modal-head">
          <h2>{initial ? 'Edit Post' : 'New Post'}</h2>
          <button type="button" className="admin-modal-close" onClick={onClose} aria-label="Close">
            <X size={20} strokeWidth={1.75} />
          </button>
        </div>

        <div className="form-field">
          <label htmlFor="title">Title</label>
          <input id="title" name="title" value={form.title} onChange={handleChange} placeholder="How to Choose the Right Diamond Cut" />
        </div>

        <div className="form-field">
          <label htmlFor="author">Author</label>
          <input id="author" name="author" value={form.author} onChange={handleChange} placeholder="Charm's Atelier" />
        </div>

        <div className="form-field">
          <label htmlFor="excerpt">Excerpt</label>
          <textarea id="excerpt" name="excerpt" rows={2} value={form.excerpt} onChange={handleChange} placeholder="A short teaser shown on the journal list..." />
        </div>

        <div className="form-field">
          <label htmlFor="content">Content</label>
          <textarea id="content" name="content" rows={8} value={form.content} onChange={handleChange} placeholder="Full post content. Separate paragraphs with a blank line." />
        </div>

        <ImageInput label="Cover Image" required value={form.image} onChange={setImage} />

        {error && <span className="form-error">{error}</span>}

        <div className="admin-modal-actions">
          <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-solid">{initial ? 'Save Changes' : 'Publish Post'}</button>
        </div>
      </form>
    </div>
  )
}

export default BlogPostForm
