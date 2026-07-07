import { useMemo, useState } from 'react'
import { CalendarRange, MessagesSquare, Coins, X } from 'lucide-react'
import { useInquiries } from '../../hooks/useInquiries'
import { useSales } from '../../hooks/useSales'
import { formatMoney, formatGrams, formatDayLabel } from './salesUtils'
import DayDetailModal from './DayDetailModal'

function dayKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function AdminAnalyticsHistory() {
  const { inquiries } = useInquiries()
  const { allDayGroups, deleteSale } = useSales()
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [selectedDay, setSelectedDay] = useState(null)

  const days = useMemo(() => {
    const byDay = {}
    inquiries.forEach((inq) => {
      const key = dayKey(new Date(inq.createdAt))
      if (!byDay[key]) byDay[key] = { day: key, inquiries: 0, sales: 0, revenue: 0, grams: 0 }
      byDay[key].inquiries += 1
    })
    allDayGroups.forEach((g) => {
      if (!byDay[g.day]) byDay[g.day] = { day: g.day, inquiries: 0, sales: 0, revenue: 0, grams: 0 }
      byDay[g.day].sales = g.count
      byDay[g.day].revenue = g.revenue
      byDay[g.day].grams = g.grams
    })
    return Object.values(byDay).sort((a, b) => b.day.localeCompare(a.day))
  }, [inquiries, allDayGroups])

  const filteredDays = useMemo(
    () => days.filter((d) => (!fromDate || d.day >= fromDate) && (!toDate || d.day <= toDate)),
    [days, fromDate, toDate],
  )

  const totals = useMemo(
    () => ({
      inquiries: filteredDays.reduce((sum, d) => sum + d.inquiries, 0),
      sales: filteredDays.reduce((sum, d) => sum + d.sales, 0),
      revenue: filteredDays.reduce((sum, d) => sum + d.revenue, 0),
    }),
    [filteredDays],
  )

  const hasFilters = fromDate !== '' || toDate !== ''

  const clearFilters = () => {
    setFromDate('')
    setToDate('')
  }

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <h1>Analytics History</h1>
        <p>
          Inquiries and sales broken down by day. Filter a date range, or scroll down to browse
          every past day — nothing is ever removed. Product views and favorites are only kept as
          running totals, so they don't have a daily breakdown.
        </p>
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
          <MessagesSquare className="admin-stat-icon" size={22} strokeWidth={1.5} />
          <span className="admin-stat-value">{totals.inquiries}</span>
          <span className="admin-stat-label">Inquiries</span>
        </div>
        <div className="admin-stat">
          <span className="admin-stat-value">{totals.sales}</span>
          <span className="admin-stat-label">Sales</span>
        </div>
        <div className="admin-stat">
          <Coins className="admin-stat-icon" size={22} strokeWidth={1.5} />
          <span className="admin-stat-value">{formatMoney(totals.revenue)}</span>
          <span className="admin-stat-label">Revenue</span>
        </div>
      </div>

      <div className="admin-panel">
        <h2>Day by Day</h2>
        <p className="admin-settings-desc">Click a day to see its inquiries and sales in detail.</p>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Inquiries</th>
                <th>Sales</th>
                <th>Grams Sold</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {filteredDays.map((d) => (
                <tr
                  key={d.day}
                  className="admin-table-row-clickable"
                  tabIndex={0}
                  role="button"
                  aria-label={`View details for ${formatDayLabel(d.day)}`}
                  onClick={() => setSelectedDay(d.day)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setSelectedDay(d.day)
                    }
                  }}
                >
                  <td>{formatDayLabel(d.day)}</td>
                  <td>{d.inquiries}</td>
                  <td>{d.sales}</td>
                  <td>{formatGrams(d.grams)}</td>
                  <td>{formatMoney(d.revenue)}</td>
                </tr>
              ))}
              {filteredDays.length === 0 && (
                <tr>
                  <td colSpan={5} className="admin-table-empty">
                    {hasFilters ? 'No activity found in this date range.' : 'No activity recorded yet.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedDay && (
        <DayDetailModal
          day={selectedDay}
          inquiries={inquiries}
          allDayGroups={allDayGroups}
          onClose={() => setSelectedDay(null)}
          onDeleteSale={deleteSale}
        />
      )}
    </div>
  )
}

export default AdminAnalyticsHistory
