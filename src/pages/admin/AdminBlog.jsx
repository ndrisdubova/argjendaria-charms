import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useBlog } from '../../hooks/useBlog'
import BlogPostForm from './BlogPostForm'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { dateStyle: 'medium' })
}

function AdminBlog() {
  const { posts, addPost, updatePost, deletePost } = useBlog()
  const [editing, setEditing] = useState(null)
  const [adding, setAdding] = useState(false)
  const sorted = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date))

  const handleDelete = (post) => {
    if (window.confirm(`Delete "${post.title}"? This cannot be undone.`)) {
      deletePost(post.id)
    }
  }

  const handleSave = (data) => {
    if (editing) {
      updatePost(editing.id, data)
      setEditing(null)
    } else {
      addPost(data)
      setAdding(false)
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-head admin-page-head-row">
        <div>
          <h1>Blog</h1>
          <p>Publish, edit or remove journal posts.</p>
        </div>
        <button type="button" className="btn btn-solid admin-btn-icon" onClick={() => setAdding(true)}>
          <Plus size={16} strokeWidth={2} />
          New Post
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th></th>
              <th>Title</th>
              <th>Author</th>
              <th>Published</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p) => (
              <tr key={p.id}>
                <td>
                  <img className="admin-table-thumb" src={p.image} alt="" loading="lazy" />
                </td>
                <td>{p.title}</td>
                <td>{p.author}</td>
                <td>{formatDate(p.date)}</td>
                <td className="admin-table-actions">
                  <button type="button" className="admin-link-btn" onClick={() => setEditing(p)}>
                    <Pencil size={14} strokeWidth={1.75} />
                    Edit
                  </button>
                  <button type="button" className="admin-link-btn admin-link-danger" onClick={() => handleDelete(p)}>
                    <Trash2 size={14} strokeWidth={1.75} />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={5} className="admin-table-empty">No posts yet. Publish your first one.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {(adding || editing) && (
        <BlogPostForm
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

export default AdminBlog
