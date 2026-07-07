import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MessagesSquare, Eye, Heart, TrendingUp, Coins, Receipt, CalendarRange, Trash2 } from 'lucide-react'
import { useInquiries } from '../../hooks/useInquiries'
import { useProducts } from '../../hooks/useProducts'
import { useProductViews } from '../../hooks/useProductViews'
import { useFavoriteCounts } from '../../hooks/useFavoriteCounts'
import { useSales } from '../../hooks/useSales'
import { formatMoney, requireAnalyticsPassword } from './salesUtils'
import DayDetailModal from './DayDetailModal'

const WEEK_DAYS = 7
const TOP_N = 5

function dayKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function getWeekStart(date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function TrendBarChart({ data, max, onSelectDay, renderTooltip }) {
  return (
    <div className="analytics-trend-chart analytics-bar-chart">
      <div className="analytics-bar-tracks">
        {data.map((d) => (
          <div
            className="analytics-bar-col analytics-trend-col-clickable"
            key={d.key}
            tabIndex={0}
            role="button"
            aria-label={`View details for ${d.fullLabel}`}
            onClick={() => onSelectDay(d.key)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelectDay(d.key)
              }
            }}
          >
            <div className="analytics-trend-tooltip" style={{ bottom: `calc(${(d.count / max) * 100}% + 14px)` }}>
              {renderTooltip(d)}
            </div>
            <div className="analytics-bar-track">
              <div className="analytics-bar-fill" style={{ height: `${(d.count / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="analytics-trend-labels">
        {data.map((d) => (
          <span className="analytics-trend-day-label" key={d.key}>{d.label}</span>
        ))}
      </div>
    </div>
  )
}

function RankedList({ items, emptyMessage, formatValue = (v) => v, onDeleteProduct }) {
  const max = Math.max(1, ...items.map((i) => i.count))
  return items.length > 0 ? (
    <ol className="analytics-rank-list">
      {items.map((item) => (
        <li key={item.id}>
          <span className="analytics-rank-label">{item.name}</span>
          <div className="analytics-rank-track">
            <div className="analytics-rank-fill" style={{ width: `${(item.count / max) * 100}%` }} />
          </div>
          <span className="analytics-rank-value">{formatValue(item.count)}</span>
          {onDeleteProduct && item.productExists && (
            <button
              type="button"
              className="admin-link-btn admin-link-danger analytics-rank-delete"
              aria-label={`Delete "${item.name}"`}
              onClick={() => onDeleteProduct(item)}
            >
              <Trash2 size={14} strokeWidth={1.75} />
            </button>
          )}
        </li>
      ))}
    </ol>
  ) : (
    <p className="holiday-empty">{emptyMessage}</p>
  )
}

function AdminAnalytics() {
  const { inquiries } = useInquiries()
  const { products, deleteProduct } = useProducts()
  const { views } = useProductViews()
  const favoriteCounts = useFavoriteCounts()
  const { sales, allDayGroups, deleteSale } = useSales()
  const [selectedDay, setSelectedDay] = useState(null)

  const trend = useMemo(() => {
    const counts = {}
    inquiries.forEach((inq) => {
      const key = dayKey(new Date(inq.createdAt))
      counts[key] = (counts[key] || 0) + 1
    })
    const monday = getWeekStart(new Date())
    const days = []
    for (let i = 0; i < WEEK_DAYS; i += 1) {
      const d = new Date(monday)
      d.setDate(d.getDate() + i)
      const key = dayKey(d)
      days.push({
        key,
        label: d.toLocaleDateString(undefined, { weekday: 'short' }),
        fullLabel: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        count: counts[key] || 0,
      })
    }
    return days
  }, [inquiries])

  const maxTrend = Math.max(1, ...trend.map((d) => d.count))
  const trendTotal = trend.reduce((sum, d) => sum + d.count, 0)

  const salesTrend = useMemo(() => {
    const revenueByDay = {}
    allDayGroups.forEach((g) => {
      revenueByDay[g.day] = g.revenue
    })
    const monday = getWeekStart(new Date())
    const days = []
    for (let i = 0; i < WEEK_DAYS; i += 1) {
      const d = new Date(monday)
      d.setDate(d.getDate() + i)
      const key = dayKey(d)
      days.push({
        key,
        label: d.toLocaleDateString(undefined, { weekday: 'short' }),
        fullLabel: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        count: revenueByDay[key] || 0,
      })
    }
    return days
  }, [allDayGroups])

  const maxSalesTrend = Math.max(1, ...salesTrend.map((d) => d.count))

  const topInquired = useMemo(() => {
    const counts = {}
    inquiries.forEach((inq) => {
      if (inq.type !== 'piece' || !inq.productId) return
      counts[inq.productId] = (counts[inq.productId] || 0) + 1
    })
    return Object.entries(counts)
      .map(([productId, count]) => ({
        id: productId,
        name: products.find((p) => p.id === productId)?.name || 'Removed piece',
        count,
        productExists: products.some((p) => p.id === productId),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, TOP_N)
  }, [inquiries, products])

  const topViewed = useMemo(() => {
    return Object.entries(views)
      .map(([productId, count]) => ({
        id: productId,
        name: products.find((p) => p.id === productId)?.name || 'Removed piece',
        count,
        productExists: products.some((p) => p.id === productId),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, TOP_N)
  }, [views, products])

  const topFavorited = useMemo(() => {
    return Object.entries(favoriteCounts)
      .map(([productId, count]) => ({
        id: productId,
        name: products.find((p) => p.id === productId)?.name || 'Removed piece',
        count,
        productExists: products.some((p) => p.id === productId),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, TOP_N)
  }, [favoriteCounts, products])

  const topSold = useMemo(() => {
    const revenueByProduct = {}
    sales.forEach((s) => {
      revenueByProduct[s.productId] = (revenueByProduct[s.productId] || 0) + Number(s.price || 0)
    })
    return Object.entries(revenueByProduct)
      .map(([productId, revenue]) => ({
        id: productId,
        name: products.find((p) => p.id === productId)?.name || sales.find((s) => s.productId === productId)?.productName || 'Removed piece',
        count: revenue,
        productExists: products.some((p) => p.id === productId),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, TOP_N)
  }, [sales, products])

  const handleDeleteProduct = (item) => {
    if (!requireAnalyticsPassword()) return
    if (window.confirm(`Delete "${item.name}"? This cannot be undone.`)) {
      deleteProduct(item.id)
    }
  }

  const totalViews = Object.values(views).reduce((sum, n) => sum + n, 0)
  const totalFavorites = Object.values(favoriteCounts).reduce((sum, n) => sum + n, 0)
  const totalRevenue = sales.reduce((sum, s) => sum + Number(s.price || 0), 0)
  const revenueTrendTotal = salesTrend.reduce((sum, d) => sum + d.count, 0)

  return (
    <div className="admin-page">
      <div className="admin-page-head admin-page-head-row">
        <div>
          <h1>Analytics</h1>
          <p>
            A read on how customers engage with the storefront and what they actually buy. Use it to
            spot which pieces are drawing interest before they convert, and which ones are already
            proven sellers worth restocking or featuring.
          </p>
        </div>
        <Link to="/admin/analytics-history" className="btn btn-outline admin-btn-icon">
          <CalendarRange size={16} strokeWidth={1.75} />
          View Full History
        </Link>
      </div>

      <div className="admin-stats">
        <div className="admin-stat">
          <MessagesSquare className="admin-stat-icon" size={22} strokeWidth={1.5} />
          <span className="admin-stat-value">{inquiries.length}</span>
          <span className="admin-stat-label">Total Inquiries</span>
        </div>
        <div className="admin-stat">
          <Eye className="admin-stat-icon" size={22} strokeWidth={1.5} />
          <span className="admin-stat-value">{totalViews}</span>
          <span className="admin-stat-label">Product Views</span>
        </div>
        <div className="admin-stat">
          <Heart className="admin-stat-icon" size={22} strokeWidth={1.5} />
          <span className="admin-stat-value">{totalFavorites}</span>
          <span className="admin-stat-label">Total Favorites</span>
        </div>
        <div className="admin-stat">
          <Receipt className="admin-stat-icon" size={22} strokeWidth={1.5} />
          <span className="admin-stat-value">{sales.length}</span>
          <span className="admin-stat-label">Total Sales</span>
        </div>
        <div className="admin-stat">
          <Coins className="admin-stat-icon" size={22} strokeWidth={1.5} />
          <span className="admin-stat-value">{formatMoney(totalRevenue)}</span>
          <span className="admin-stat-label">Total Revenue</span>
        </div>
      </div>

      <div className="admin-panel">
        <h2><TrendingUp size={18} strokeWidth={1.75} /> Inquiries Over Time</h2>
        <p className="admin-settings-desc">
          This week, Monday through Sunday ({trendTotal} total so far). Resets fresh every Monday —
          past weeks are kept in Analytics History. A rising bar trend means interest is building —
          check Top Inquired below to see which pieces are driving it. Click a point to see that
          day in detail.
        </p>
        <TrendBarChart
          data={trend}
          max={maxTrend}
          onSelectDay={setSelectedDay}
          renderTooltip={(d) => (
            <>
              <strong>{d.count}</strong> {d.count === 1 ? 'inquiry' : 'inquiries'}
              <span>{d.fullLabel}</span>
            </>
          )}
        />
      </div>

      <div className="admin-panel">
        <h2><Coins size={18} strokeWidth={1.75} /> Revenue Over Time</h2>
        <p className="admin-settings-desc">
          This week, Monday through Sunday ({formatMoney(revenueTrendTotal)} total so far). Resets
          fresh every Monday — past weeks are kept in Analytics History. Use this alongside
          Inquiries Over Time to see how interest is turning into actual sales. Click a point to
          see that day in detail.
        </p>
        <TrendBarChart
          data={salesTrend}
          max={maxSalesTrend}
          onSelectDay={setSelectedDay}
          renderTooltip={(d) => (
            <>
              <strong>{formatMoney(d.count)}</strong>
              <span>{d.fullLabel}</span>
            </>
          )}
        />
      </div>

      <div className="admin-dashboard-panels">
        <div className="admin-panel">
          <h2><MessagesSquare size={18} strokeWidth={1.75} /> Top Inquired Pieces</h2>
          <p className="admin-settings-desc">Pieces customers ask about most — good candidates to feature.</p>
          <RankedList items={topInquired} emptyMessage="No piece inquiries yet." onDeleteProduct={handleDeleteProduct} />
        </div>

        <div className="admin-panel">
          <h2><Eye size={18} strokeWidth={1.75} /> Top Viewed Pieces</h2>
          <p className="admin-settings-desc">Pieces getting the most product-page traffic.</p>
          <RankedList items={topViewed} emptyMessage="No product views recorded yet." onDeleteProduct={handleDeleteProduct} />
        </div>

        <div className="admin-panel">
          <h2><Heart size={18} strokeWidth={1.75} /> Top Favorited Pieces</h2>
          <p className="admin-settings-desc">Pieces customers have saved to come back to.</p>
          <RankedList items={topFavorited} emptyMessage="No favorites saved yet." onDeleteProduct={handleDeleteProduct} />
        </div>

        <div className="admin-panel">
          <h2><Receipt size={18} strokeWidth={1.75} /> Top Sold Pieces</h2>
          <p className="admin-settings-desc">Your proven sellers by revenue, from the Sales Manager.</p>
          <RankedList items={topSold} emptyMessage="No sales recorded yet." formatValue={formatMoney} onDeleteProduct={handleDeleteProduct} />
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

export default AdminAnalytics
