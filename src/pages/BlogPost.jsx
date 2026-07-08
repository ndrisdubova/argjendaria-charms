import { Link, useParams } from 'react-router-dom'
import { useBlog } from '../hooks/useBlog'
import NotFound from './NotFound'
import './Blog.css'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { dateStyle: 'long' })
}

function BlogPost() {
  const { id } = useParams()
  const { posts, loading } = useBlog()
  const post = posts.find((p) => p.id === id)

  if (!post) return loading ? null : <NotFound />

  return (
    <section className="section blog-post">
      <div className="container blog-post-container">
        <Link to="/blog" className="blog-back-link">&larr; Back to Journal</Link>

        <span className="blog-card-meta">{formatDate(post.date)} · {post.author}</span>
        <h1>{post.title}</h1>

        <div className="blog-post-image">
          <img src={post.image} alt={post.title} />
        </div>

        <div className="blog-post-content">
          {post.content.split('\n\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BlogPost
