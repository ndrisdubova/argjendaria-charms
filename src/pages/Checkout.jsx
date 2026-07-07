import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useProducts } from '../hooks/useProducts'
import { useCart } from '../hooks/useCart'
import { useOrders } from '../hooks/useOrders'
import { getStock } from '../data/productsStore'
import './Contact.css'
import './Auth.css'
import './Products.css'
import './Cart.css'

function splitName(fullName) {
  const parts = (fullName || '').trim().split(/\s+/).filter(Boolean)
  return { firstName: parts[0] || '', lastName: parts.slice(1).join(' ') }
}

function Checkout() {
  const { currentUser, isLoggedIn } = useAuth()
  const { products } = useProducts()
  const { items, clearCart } = useCart()
  const { placeOrder } = useOrders()
  const location = useLocation()
  const [form, setForm] = useState(() => {
    const { firstName, lastName } = splitName(currentUser?.name)
    return { firstName, lastName, email: currentUser?.email || '', phone: '', address: '' }
  })
  const [errors, setErrors] = useState({})
  const [placedOrder, setPlacedOrder] = useState(null)
  const timers = useRef([])

  const buyNow = location.state?.buyNow

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  if (!isLoggedIn) {
    return (
      <section className="section auth-page">
        <div className="auth-card">
          <span className="eyebrow">Checkout</span>
          <h1>Log In Required</h1>
          <p className="auth-card-sub">Log in to complete your order.</p>
          <div className="favorites-auth-actions">
            <Link to="/login?next=/checkout" className="btn btn-solid">Log In</Link>
            <Link to="/signup?next=/checkout" className="btn btn-outline">Sign Up</Link>
          </div>
        </div>
      </section>
    )
  }

  const rawLines = buyNow ? [{ productId: buyNow.productId, quantity: buyNow.quantity, size: buyNow.size }] : items

  const lines = rawLines
    .map((item) => {
      const product = products.find((p) => p.id === item.productId)
      if (!product) return null
      const unitPrice = product.offerPrice && product.offerPrice < product.price ? product.offerPrice : product.price
      const stock = getStock(product)
      const quantity = Math.min(item.quantity, Math.max(stock, 0))
      return { productId: product.id, productName: product.name, size: item.size || null, quantity, unitPrice, lineTotal: unitPrice * quantity }
    })
    .filter((l) => l && l.quantity > 0)

  const total = lines.reduce((sum, l) => sum + l.lineTotal, 0)

  if (placedOrder) {
    return (
      <section className="section auth-page">
        <div className="auth-card checkout-success-card">
          <span className="form-success-icon checkout-success-icon">
            <CheckCircle2 size={28} strokeWidth={1.75} />
          </span>
          <h1>Order Placed!</h1>
          <p className="auth-card-sub">
            Thank you, {placedOrder.firstName}. Your order total was ${placedOrder.total.toLocaleString()}.
          </p>
          <div className="favorites-auth-actions">
            <Link to="/my-orders" className="btn btn-solid">Track My Order</Link>
            <Link to="/products" className="btn btn-outline">Continue Shopping</Link>
          </div>
        </div>
      </section>
    )
  }

  if (lines.length === 0) {
    return (
      <section className="section products-page">
        <div className="container">
          <div className="empty-state">
            <p>There's nothing to check out yet.</p>
            <Link to="/products" className="btn btn-outline empty-state-cta">Browse the Collection</Link>
          </div>
        </div>
      </section>
    )
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const validate = () => {
    const next = {}
    if (!form.firstName.trim()) next.firstName = 'Please enter your first name.'
    if (!form.lastName.trim()) next.lastName = 'Please enter your last name.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Please enter a valid email.'
    if (!form.phone.trim()) next.phone = 'Please enter a phone number.'
    if (!form.address.trim()) next.address = 'Please enter a delivery address.'
    return next
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const order = placeOrder({
      customerId: currentUser.id,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      items: lines.map((l) => ({ productId: l.productId, productName: l.productName, size: l.size, quantity: l.quantity, price: l.unitPrice })),
    })

    if (!buyNow) clearCart()
    setPlacedOrder(order)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section className="section products-page">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Checkout</span>
          <h2>Complete Your Order</h2>
          <p>Enter your details and we'll prepare your pieces for delivery.</p>
        </div>

        <div className="cart-layout">
          <form className="contact-form checkout-form" onSubmit={handleSubmit} noValidate>
            <div className="checkout-form-row">
              <div className="form-field">
                <label htmlFor="firstName">First Name</label>
                <input id="firstName" name="firstName" value={form.firstName} onChange={handleChange} />
                {errors.firstName && <span className="form-error">{errors.firstName}</span>}
              </div>
              <div className="form-field">
                <label htmlFor="lastName">Last Name</label>
                <input id="lastName" name="lastName" value={form.lastName} onChange={handleChange} />
                {errors.lastName && <span className="form-error">{errors.lastName}</span>}
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange} />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="phone">Phone Number</label>
              <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+383 04X XXX XXX" />
              {errors.phone && <span className="form-error">{errors.phone}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="address">Delivery Address</label>
              <textarea id="address" name="address" rows={3} value={form.address} onChange={handleChange} />
              {errors.address && <span className="form-error">{errors.address}</span>}
            </div>

            <button type="submit" className="btn btn-solid contact-submit">Place Order</button>
          </form>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            {lines.map((l) => (
              <div className="cart-summary-row" key={`${l.productId}-${l.size || ''}`}>
                <span>{l.productName}{l.size ? ` (Size ${l.size})` : ''} × {l.quantity}</span>
                <span>${l.lineTotal.toLocaleString()}</span>
              </div>
            ))}
            <div className="cart-summary-row cart-summary-total">
              <span>Total</span>
              <span>${total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Checkout
