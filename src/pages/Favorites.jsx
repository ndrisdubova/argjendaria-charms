import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../hooks/useProducts'
import { useFavorites } from '../hooks/useFavorites'
import { useAuth } from '../hooks/useAuth'
import './Products.css'

function Favorites() {
  const { isLoggedIn } = useAuth()
  const { products } = useProducts()
  const { favoriteIds } = useFavorites()
  const favorites = products.filter((p) => favoriteIds.includes(p.id))

  return (
    <section className="section products-page">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Saved Pieces</span>
          <h2>Your Favorites</h2>
          <p>The pieces you've saved for later, all in one place.</p>
        </div>

        {!isLoggedIn ? (
          <div className="empty-state">
            <p>Log in to view and save your favorite pieces.</p>
            <div className="favorites-auth-actions">
              <Link to="/login?next=/favorites" className="btn btn-solid">Log In</Link>
              <Link to="/signup?next=/favorites" className="btn btn-outline">Sign Up</Link>
            </div>
          </div>
        ) : favorites.length > 0 ? (
          <div className="product-grid">
            {favorites.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>You haven't saved any pieces yet.</p>
            <Link to="/products" className="btn btn-outline empty-state-cta">
              Browse the Collection
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

export default Favorites
