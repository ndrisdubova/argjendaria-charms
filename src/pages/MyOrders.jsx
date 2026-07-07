import { Link } from 'react-router-dom'
import { Check, MapPin } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useOrders } from '../hooks/useOrders'
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from '../data/ordersStore'
import './Products.css'
import './Cart.css'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
}

function OrderProgress({ status }) {
  const currentIndex = Math.max(0, ORDER_STATUSES.indexOf(status))

  return (
    <div className="order-progress">
      {ORDER_STATUSES.map((step, i) => (
        <div
          key={step}
          className={`order-progress-step ${i <= currentIndex ? 'order-progress-step-done' : ''} ${i === currentIndex ? 'order-progress-step-current' : ''}`}
        >
          <span className="order-progress-dot">{i < currentIndex && <Check size={11} strokeWidth={2.5} />}</span>
          <span className="order-progress-label">{ORDER_STATUS_LABELS[step]}</span>
        </div>
      ))}
    </div>
  )
}

function MyOrders() {
  const { currentUser, isLoggedIn } = useAuth()
  const { orders } = useOrders()

  if (!isLoggedIn) {
    return (
      <section className="section auth-page">
        <div className="auth-card">
          <span className="eyebrow">My Orders</span>
          <h1>Log In Required</h1>
          <p className="auth-card-sub">Log in to track your orders.</p>
          <div className="favorites-auth-actions">
            <Link to="/login?next=/my-orders" className="btn btn-solid">Log In</Link>
            <Link to="/signup?next=/my-orders" className="btn btn-outline">Sign Up</Link>
          </div>
        </div>
      </section>
    )
  }

  const myOrders = orders
    .filter((o) => o.customerId === currentUser.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  return (
    <section className="section products-page">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Order Tracking</span>
          <h2>My Orders</h2>
          <p>Track the status of everything you've ordered from Charm's.</p>
        </div>

        {myOrders.length > 0 ? (
          <div className="orders-list">
            {myOrders.map((order) => (
              <div className="order-card" key={order.id}>
                <div className="order-card-head">
                  <div className="order-card-head-info">
                    <span className="order-card-id">Order #{order.id.slice(-6).toUpperCase()}</span>
                    <span className="order-card-date">{formatDate(order.createdAt)}</span>
                  </div>
                  <span className={`order-status-badge order-status-${order.status}`}>
                    {ORDER_STATUS_LABELS[order.status] || ORDER_STATUS_LABELS.confirmed}
                  </span>
                </div>

                <OrderProgress status={order.status} />

                <ul className="order-card-items">
                  {order.items.map((item) => (
                    <li key={`${item.productId}-${item.size || ''}`}>
                      <span>{item.productName}{item.size ? ` (Size ${item.size})` : ''} × {item.quantity}</span>
                      <span>${(item.price * item.quantity).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>

                <div className="order-card-foot">
                  <span className="order-card-address">
                    <MapPin size={14} strokeWidth={1.75} />
                    {order.address}
                  </span>
                  <span className="order-card-total">Total: ${order.total.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>You haven't placed any orders yet.</p>
            <Link to="/products" className="btn btn-outline empty-state-cta">Browse the Collection</Link>
          </div>
        )}
      </div>
    </section>
  )
}

export default MyOrders
