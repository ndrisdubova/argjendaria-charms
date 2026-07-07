import { X, MessagesSquare, Receipt, Trash2 } from 'lucide-react'
import { formatDayLabel, formatMoney, formatGrams, formatTime, requirePassword } from './salesUtils'

function dayKeyOf(iso) {
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function DayDetailModal({ day, inquiries, allDayGroups, onClose, onDeleteSale }) {
  const dayInquiries = inquiries
    .filter((inq) => dayKeyOf(inq.createdAt) === day)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  const salesGroup = allDayGroups.find((g) => g.day === day)
  const daySales = salesGroup ? salesGroup.entries : []

  const handleDelete = (sale) => {
    if (!requirePassword()) return
    if (window.confirm(`Delete the sale of "${sale.productName}"? This cannot be undone.`)) {
      onDeleteSale(sale.id)
    }
  }

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal admin-modal-wide" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-head">
          <h2>{formatDayLabel(day)}</h2>
          <button type="button" className="admin-modal-close" onClick={onClose} aria-label="Close">
            <X size={20} strokeWidth={1.75} />
          </button>
        </div>

        <div className="admin-stats admin-stats-compact">
          <div className="admin-stat">
            <span className="admin-stat-value">{dayInquiries.length}</span>
            <span className="admin-stat-label">Inquiries</span>
          </div>
          <div className="admin-stat">
            <span className="admin-stat-value">{daySales.length}</span>
            <span className="admin-stat-label">Sales</span>
          </div>
          <div className="admin-stat">
            <span className="admin-stat-value">{formatMoney(salesGroup?.revenue || 0)}</span>
            <span className="admin-stat-label">Revenue</span>
          </div>
        </div>

        <div className="day-detail-section">
          <h3><MessagesSquare size={15} strokeWidth={1.75} /> Inquiries</h3>
          {dayInquiries.length > 0 ? (
            <ul className="day-detail-list">
              {dayInquiries.map((inq) => (
                <li key={inq.id}>
                  <div className="day-detail-list-head">
                    <span>{inq.name}</span>
                    <span className="day-detail-time">{formatTime(inq.createdAt)}</span>
                  </div>
                  <p className="day-detail-meta">
                    {inq.email}
                    {inq.type === 'piece' && inq.productName && ` · ${inq.productName}${inq.size ? ` (Size ${inq.size})` : ''}`}
                  </p>
                  <p className="day-detail-message">{inq.message}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="holiday-empty">No inquiries on this day.</p>
          )}
        </div>

        <div className="day-detail-section">
          <h3><Receipt size={15} strokeWidth={1.75} /> Sales</h3>
          {daySales.length > 0 ? (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Product</th>
                    <th>Grams</th>
                    <th>Price / Gram</th>
                    <th>Total</th>
                    {onDeleteSale && <th></th>}
                  </tr>
                </thead>
                <tbody>
                  {daySales.map((s) => (
                    <tr key={s.id}>
                      <td>{formatTime(s.date)}</td>
                      <td>{s.productName}</td>
                      <td>{formatGrams(s.grams)}</td>
                      <td>{formatMoney(s.pricePerGram)}</td>
                      <td>{formatMoney(s.price)}</td>
                      {onDeleteSale && (
                        <td className="admin-table-actions">
                          <button type="button" className="admin-link-btn admin-link-danger" onClick={() => handleDelete(s)}>
                            <Trash2 size={14} strokeWidth={1.75} />
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="holiday-empty">No sales on this day.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default DayDetailModal
