import { Link } from 'react-router-dom'
import { Gem, Star, Tags, Wallet, MessagesSquare, Receipt } from 'lucide-react'
import { useProducts } from '../../hooks/useProducts'
import { useInquiries } from '../../hooks/useInquiries'
import { useSales } from '../../hooks/useSales'

function AdminDashboard() {
  const { products } = useProducts()
  const { inquiries, unreadCount } = useInquiries()
  const { todaySales, todayTotals } = useSales()

  const totalValue = products.reduce((sum, p) => sum + Number(p.price || 0), 0)
  const categoryCount = new Set(products.map((p) => p.category)).size
  const featuredCount = products.filter((p) => p.featured).length
  const recentInquiries = [...inquiries]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <h1>Dashboard</h1>
        <p>Overview of your current catalog.</p>
      </div>

      <div className="admin-stats">
        <div className="admin-stat">
          <Gem className="admin-stat-icon" size={22} strokeWidth={1.5} />
          <span className="admin-stat-value">{products.length}</span>
          <span className="admin-stat-label">Total Pieces</span>
        </div>
        <div className="admin-stat">
          <Star className="admin-stat-icon" size={22} strokeWidth={1.5} />
          <span className="admin-stat-value">{featuredCount}</span>
          <span className="admin-stat-label">Featured</span>
        </div>
        <div className="admin-stat">
          <Tags className="admin-stat-icon" size={22} strokeWidth={1.5} />
          <span className="admin-stat-value">{categoryCount}</span>
          <span className="admin-stat-label">Categories</span>
        </div>
        <div className="admin-stat">
          <Wallet className="admin-stat-icon" size={22} strokeWidth={1.5} />
          <span className="admin-stat-value">${totalValue.toLocaleString()}</span>
          <span className="admin-stat-label">Catalog Value</span>
        </div>
        <div className="admin-stat">
          <MessagesSquare className="admin-stat-icon" size={22} strokeWidth={1.5} />
          <span className="admin-stat-value">{unreadCount}</span>
          <span className="admin-stat-label">New Inquiries</span>
        </div>
        <div className="admin-stat">
          <Receipt className="admin-stat-icon" size={22} strokeWidth={1.5} />
          <span className="admin-stat-value">${todayTotals.revenue.toLocaleString()}</span>
          <span className="admin-stat-label">Sales Today</span>
        </div>
      </div>

      <div className="admin-dashboard-panels">
        <div className="admin-panel">
          <h2><Gem size={18} strokeWidth={1.75} /> Recent Pieces</h2>
          <ul className="admin-recent-list">
            {products.slice(-5).reverse().map((p) => (
              <li key={p.id}>
                <span>{p.name}</span>
                <span className="admin-recent-price">${Number(p.price).toLocaleString()}</span>
              </li>
            ))}
            {products.length === 0 && <li>No pieces yet.</li>}
          </ul>
          <Link to="/admin/products" className="btn btn-outline admin-panel-cta">Manage Products</Link>
        </div>

        <div className="admin-panel">
          <h2><MessagesSquare size={18} strokeWidth={1.75} /> Recent Inquiries</h2>
          <ul className="admin-recent-list">
            {recentInquiries.map((i) => (
              <li key={i.id}>
                <span>{i.name} {!i.read && <span className="admin-nav-badge admin-recent-badge">new</span>}</span>
                <span className="admin-recent-price">{i.type === 'piece' ? i.productName : 'General'}</span>
              </li>
            ))}
            {recentInquiries.length === 0 && <li>No inquiries yet.</li>}
          </ul>
          <Link to="/admin/inquiries" className="btn btn-outline admin-panel-cta">View Inquiries</Link>
        </div>

        <div className="admin-panel">
          <h2><Receipt size={18} strokeWidth={1.75} /> Today's Sales</h2>
          <ul className="admin-recent-list">
            {todaySales.slice(0, 5).map((s) => (
              <li key={s.id}>
                <span>{s.productName}</span>
                <span className="admin-recent-price">${Number(s.price).toLocaleString()}</span>
              </li>
            ))}
            {todaySales.length === 0 && <li>No sales recorded yet today.</li>}
          </ul>
          <Link to="/admin/sales" className="btn btn-outline admin-panel-cta">Open Sales Manager</Link>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
