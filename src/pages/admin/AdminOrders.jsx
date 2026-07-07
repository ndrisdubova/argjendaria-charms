import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Trash2, PackageCheck, PackageOpen } from 'lucide-react'
import { useOrders } from '../../hooks/useOrders'
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from '../../data/ordersStore'

function formatDate(iso) {
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

function AdminOrders() {
  const { activeOrders, updateOrderStatus, deleteOrder } = useOrders()

  const handleDelete = (order) => {
    if (window.confirm(`Remove order #${order.id.slice(-6).toUpperCase()} from ${order.firstName} ${order.lastName} from this list? The customer will still see it in their order history, and it stays in Sales History and Analytics.`)) {
      deleteOrder(order.id)
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-head admin-page-head-row">
        <div>
          <h1>Orders</h1>
          <p>Orders placed through the storefront cart and checkout.</p>
        </div>
        <Link to="/admin/orders/completed" className="btn btn-outline admin-btn-icon">
          <PackageCheck size={16} strokeWidth={1.75} />
          View Completed Orders
        </Link>
      </div>

      <div className="admin-inquiry-list">
        {activeOrders.map((order) => (
          <div key={order.id} className="admin-inquiry-card admin-order-card">
            <div className="admin-inquiry-card-head">
              <div className="admin-inquiry-card-title">
                <span className="admin-inquiry-name">Order #{order.id.slice(-6).toUpperCase()} — {order.firstName} {order.lastName}</span>
                <span className={`admin-order-status-badge admin-order-status-${order.status}`}>
                  {ORDER_STATUS_LABELS[order.status] || ORDER_STATUS_LABELS.confirmed}
                </span>
              </div>
              <span className="admin-inquiry-date">{formatDate(order.createdAt)}</span>
            </div>

            <div className="admin-order-contact">
              <a className="admin-inquiry-email" href={`mailto:${order.email}`}>
                <Mail size={14} strokeWidth={1.75} />
                {order.email}
              </a>
              <span className="admin-inquiry-email">
                <Phone size={14} strokeWidth={1.75} />
                {order.phone}
              </span>
              <span className="admin-inquiry-email">
                <MapPin size={14} strokeWidth={1.75} />
                {order.address}
              </span>
            </div>

            <ul className="admin-order-items">
              {order.items.map((item) => (
                <li key={`${item.productId}-${item.size || ''}`}>
                  <span>{item.productName}{item.size ? ` (Size ${item.size})` : ''} × {item.quantity}</span>
                  <span>${(item.price * item.quantity).toLocaleString()}</span>
                </li>
              ))}
            </ul>

            <div className="admin-order-foot">
              <span className="admin-order-total">Total: ${order.total.toLocaleString()}</span>
              <div className="admin-table-actions">
                <label className="admin-order-status-field">
                  Status
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                </label>
                <button type="button" className="admin-link-btn admin-link-danger" onClick={() => handleDelete(order)}>
                  <Trash2 size={14} strokeWidth={1.75} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {activeOrders.length === 0 && (
          <div className="admin-table-empty admin-table-empty-icon">
            <PackageOpen size={28} strokeWidth={1.5} />
            No active orders right now.
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminOrders
