import { ChevronDown, Pencil, Trash2 } from 'lucide-react'
import { formatDayLabel, formatMoney, formatGrams, formatTime } from './salesUtils'

function SalesHistoryList({ days, expandedDay, onToggle, onEdit, onDelete, emptyMessage }) {
  return (
    <div className="sales-history-list">
      {days.map((entry) => (
        <div className="sales-history-day" key={entry.day}>
          <button
            type="button"
            className="sales-history-day-head"
            onClick={() => onToggle(entry.day)}
          >
            <ChevronDown
              size={16}
              strokeWidth={1.75}
              className={`sales-history-chevron ${expandedDay === entry.day ? 'sales-history-chevron-open' : ''}`}
            />
            <span className="sales-history-date">{formatDayLabel(entry.day)}</span>
            <span className="sales-history-summary">
              {entry.count} {entry.count === 1 ? 'sale' : 'sales'} · {formatGrams(entry.grams)} · {formatMoney(entry.revenue)}
            </span>
          </button>

          {expandedDay === entry.day && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Product</th>
                    <th>Grams</th>
                    <th>Price / Gram</th>
                    <th>Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {entry.entries.map((s) => (
                    <tr key={s.id}>
                      <td>{formatTime(s.date)}</td>
                      <td>{s.productName}</td>
                      <td>{formatGrams(s.grams)}</td>
                      <td>{formatMoney(s.pricePerGram)}</td>
                      <td>{formatMoney(s.price)}</td>
                      <td className="admin-table-actions">
                        <button type="button" className="admin-link-btn" onClick={() => onEdit(s)}>
                          <Pencil size={14} strokeWidth={1.75} />
                          Edit
                        </button>
                        <button type="button" className="admin-link-btn admin-link-danger" onClick={() => onDelete(s)}>
                          <Trash2 size={14} strokeWidth={1.75} />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}

      {days.length === 0 && <div className="admin-table-empty">{emptyMessage}</div>}
    </div>
  )
}

export default SalesHistoryList
