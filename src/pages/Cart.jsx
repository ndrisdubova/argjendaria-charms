import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import { useProducts } from '../hooks/useProducts'
import { resolveProductImage } from '../data/images'
import { getStock } from '../data/productsStore'
import '../components/ProductCard.css'
import './Products.css'
import './Cart.css'

function Cart() {
  const { isLoggedIn } = useAuth()
  const { products } = useProducts()
  const { items, updateQuantity, removeFromCart, quantityInCart } = useCart()
  const navigate = useNavigate()

  if (!isLoggedIn) {
    return (
      <section className="section products-page">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Your Cart</span>
            <h2>Shopping Cart</h2>
          </div>
          <div className="empty-state">
            <p>Log in to view your cart.</p>
            <div className="favorites-auth-actions">
              <Link to="/login?next=/cart" className="btn btn-solid">Log In</Link>
              <Link to="/signup?next=/cart" className="btn btn-outline">Sign Up</Link>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const lines = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId)
      if (!product) return null
      const unitPrice = product.offerPrice && product.offerPrice < product.price ? product.offerPrice : product.price
      const stock = getStock(product)
      const maxForLine = stock - (quantityInCart(item.productId) - item.quantity)
      return { ...item, product, unitPrice, maxForLine, lineTotal: unitPrice * item.quantity }
    })
    .filter(Boolean)

  const grandTotal = lines.reduce((sum, l) => sum + l.lineTotal, 0)

  return (
    <section className="section products-page">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Your Cart</span>
          <h2>Shopping Cart</h2>
          <p>Review your pieces before checking out.</p>
        </div>

        {lines.length > 0 ? (
          <div className="cart-layout">
            <div className="cart-lines">
              {lines.map((line) => (
                <div className="cart-line" key={`${line.productId}-${line.size || ''}`}>
                  <img src={resolveProductImage(line.product)} alt={line.product.name} className="cart-line-image" />
                  <div className="cart-line-info">
                    <Link to={`/products/${line.product.id}`} className="cart-line-name">{line.product.name}</Link>
                    <span className="cart-line-material">{line.product.material}</span>
                    {line.size && <span className="cart-line-size">Size {line.size}</span>}
                    <span className="cart-line-price">${line.unitPrice.toLocaleString()} each</span>
                  </div>
                  <div className="qty-stepper">
                    <button
                      type="button"
                      onClick={() => updateQuantity(line.productId, line.size, line.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={13} strokeWidth={2} />
                    </button>
                    <span>{line.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(line.productId, line.size, Math.min(line.maxForLine, line.quantity + 1))}
                      disabled={line.quantity >= line.maxForLine}
                      aria-label="Increase quantity"
                    >
                      <Plus size={13} strokeWidth={2} />
                    </button>
                  </div>
                  <span className="cart-line-total">${line.lineTotal.toLocaleString()}</span>
                  <button
                    type="button"
                    className="cart-line-remove"
                    onClick={() => removeFromCart(line.productId, line.size)}
                    aria-label={`Remove ${line.product.name}`}
                  >
                    <Trash2 size={16} strokeWidth={1.75} />
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="cart-summary-row cart-summary-total">
                <span>Total</span>
                <span>${grandTotal.toLocaleString()}</span>
              </div>
              <button type="button" className="btn btn-solid cart-checkout-btn" onClick={() => navigate('/checkout')}>
                <ShoppingBag size={16} strokeWidth={1.75} />
                Proceed to Checkout
              </button>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <p>Your cart is empty.</p>
            <Link to="/products" className="btn btn-outline empty-state-cta">Browse the Collection</Link>
          </div>
        )}
      </div>
    </section>
  )
}

export default Cart
