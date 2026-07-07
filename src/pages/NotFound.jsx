import { Link } from 'react-router-dom'
import { hero } from '../data/images'
import './NotFound.css'

function NotFound() {
  return (
    <section className="not-found" style={{ backgroundImage: `url(${hero})` }}>
      <div className="not-found-overlay" aria-hidden="true" />
      <div className="container not-found-inner">
        <span className="eyebrow">Page Not Found</span>
        <h1>404</h1>
        <p>The piece you're looking for isn't in our collection.</p>
        <div className="not-found-actions">
          <Link to="/" className="btn btn-solid">Back to Home</Link>
          <Link to="/products" className="btn btn-outline">Browse Collection</Link>
        </div>
      </div>
    </section>
  )
}

export default NotFound
