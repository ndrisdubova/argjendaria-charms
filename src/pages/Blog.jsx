import { Link } from 'react-router-dom'
import { useBlog } from '../hooks/useBlog'
import './Blog.css'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { dateStyle: 'long' })
}

function Blog() {
  const { posts } = useBlog()
  const sorted = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <section className="section blog-page">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Journal</span>
          <h2>From the Atelier</h2>
          <p>Notes on craftsmanship, care, and the stories behind our pieces.</p>
        </div>

        {sorted.length > 0 ? (
          <div className="blog-grid">
            {sorted.map((post) => (
              <Link to={`/blog/${post.id}`} className="blog-card" key={post.id}>
                <div className="blog-card-image">
                  <img src={post.image} alt={post.title} loading="lazy" />
                </div>
                <div className="blog-card-body">
                  <span className="blog-card-meta">{formatDate(post.date)} · {post.author}</span>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <span className="blog-card-link">Read More &rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="empty-state">No posts published yet. Check back soon.</p>
        )}
      </div>
    </section>
  )
}

export default Blog
