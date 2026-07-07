import { useMemo, useState } from 'react'
import { X, CalendarRange } from 'lucide-react'
import { useSales } from '../../hooks/useSales'
import SaleForm from './SaleForm'
import SalesHistoryList from './SalesHistoryList'
import { requirePassword, formatMoney, formatGrams } from './salesUtils'
import '../Contact.css'

function AdminSalesHistory() {
  const { allDayGroups, updateSale, deleteSale } = useSales()
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [expandedDay, setExpandedDay] = useState(null)
  const [editingSale, setEditingSale] = useState(null)

  const filteredDays = useMemo(
    () => allDayGroups.filter((g) => (!fromDate || g.day >= fromDate) && (!toDate || g.day <= toDate)),
    [allDayGroups, fromDate, toDate],
  )

  const totals = useMemo(
    () => ({
      days: filteredDays.length,
      sales: filteredDays.reduce((sum, g) => sum + g.count, 0),
      grams: filteredDays.reduce((sum, g) => sum + g.grams, 0),
      revenue: filteredDays.reduce((sum, g) => sum + g.revenue, 0),
    }),
    [filteredDays],
  )

  const hasFilters = fromDate !== '' || toDate !== ''

  const clearFilters = () => {
    setFromDate('')
    setToDate('')
  }

  const handleDelete = (sale) => {
    if (!requirePassword()) return
    if (window.confirm(`Delete the sale of "${sale.productName}"? This cannot be undone.`)) {
      deleteSale(sale.id)
    }
  }

  const handleEditClick = (sale) => {
    if (!requirePassword()) return
    setEditingSale(sale)
  }

  const handleSaveEdit = (data) => {
    updateSale(editingSale.id, data)
    setEditingSale(null)
  }

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <h1>Sales History</h1>
        <p>Filter by date, or scroll down to browse every past day.</p>
      </div>

      <div className="admin-panel sales-form-panel">
        <h2><CalendarRange size={18} strokeWidth={1.75} /> Filter by Date</h2>
        <div className="sales-form">
          <div className="form-field">
            <label htmlFor="fromDate">From</label>
            <input id="fromDate" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>
          <div className="form-field">
            <label htmlFor="toDate">To</label>
            <input id="toDate" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>
          {hasFilters && (
            <button type="button" className="admin-link-btn sales-clear-btn" onClick={clearFilters}>
              <X size={14} strokeWidth={1.75} />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      <div className="admin-stats">
        <div className="admin-stat">
          <span className="admin-stat-value">{totals.days}</span>
          <span className="admin-stat-label">Days</span>
        </div>
        <div className="admin-stat">
          <span className="admin-stat-value">{totals.sales}</span>
          <span className="admin-stat-label">Sales</span>
        </div>
        <div className="admin-stat">
          <span className="admin-stat-value">{formatGrams(totals.grams)}</span>
          <span className="admin-stat-label">Grams Sold</span>
        </div>
        <div className="admin-stat">
          <span className="admin-stat-value">{formatMoney(totals.revenue)}</span>
          <span className="admin-stat-label">Revenue</span>
        </div>
      </div>

      <div className="admin-panel">
        <h2>Sales by Day</h2>
        <SalesHistoryList
          days={filteredDays}
          expandedDay={expandedDay}
          onToggle={(day) => setExpandedDay((d) => (d === day ? null : day))}
          onEdit={handleEditClick}
          onDelete={handleDelete}
          emptyMessage={hasFilters ? 'No sales found in this date range.' : 'No sales recorded yet.'}
        />
      </div>

      {editingSale && (
        <SaleForm
          initial={editingSale}
          onSave={handleSaveEdit}
          onClose={() => setEditingSale(null)}
        />
      )}
    </div>
  )
}

export default AdminSalesHistory
