import { useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import { LockKeyhole, UserRound, KeyRound, ArrowLeft } from 'lucide-react'
import AdminLayout from './admin/AdminLayout'
import AdminDashboard from './admin/AdminDashboard'
import AdminProducts from './admin/AdminProducts'
import AdminSalesManager from './admin/AdminSalesManager'
import AdminSalesHistory from './admin/AdminSalesHistory'
import AdminInquiries from './admin/AdminInquiries'
import AdminOrders from './admin/AdminOrders'
import AdminOrdersCompleted from './admin/AdminOrdersCompleted'
import AdminUsers from './admin/AdminUsers'
import AdminBlog from './admin/AdminBlog'
import AdminReviews from './admin/AdminReviews'
import AdminNewsletter from './admin/AdminNewsletter'
import AdminHolidays from './admin/AdminHolidays'
import AdminDiscounts from './admin/AdminDiscounts'
import AdminAnalytics from './admin/AdminAnalytics'
import AdminAnalyticsHistory from './admin/AdminAnalyticsHistory'
import AdminAnnouncement from './admin/AdminAnnouncement'
import AdminMaintenance from './admin/AdminMaintenance'
import AdminSettings from './admin/AdminSettings'
import AdminNotFound from './admin/AdminNotFound'
import './Admin.css'

const CREDENTIALS = { username: 'charms', password: '123123' }
const SESSION_KEY = 'charms_admin_auth'

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
      sessionStorage.setItem(SESSION_KEY, 'true')
      setError('')
      onLogin()
    } else {
      setError('Incorrect username or password.')
    }
  }

  return (
    <div className="admin-login">
      <form className="admin-login-form" onSubmit={handleSubmit}>
        <LockKeyhole className="admin-login-icon" size={30} strokeWidth={1.5} />
        <span className="eyebrow">Charm's</span>
        <h1>Admin Access</h1>
        <p className="admin-login-sub">Sign in to manage the store.</p>

        <div className="form-field">
          <label htmlFor="username">Username</label>
          <div className="admin-login-input">
            <UserRound size={16} strokeWidth={1.75} />
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="password">Password</label>
          <div className="admin-login-input">
            <KeyRound size={16} strokeWidth={1.75} />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
        </div>

        {error && <span className="form-error">{error}</span>}

        <button type="submit" className="btn btn-solid admin-login-btn">Sign In</button>

        <Link to="/" className="admin-back-link">
          <ArrowLeft size={14} strokeWidth={1.75} />
          Back to site
        </Link>
      </form>
    </div>
  )
}

function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === 'true')

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY)
    setAuthed(false)
  }

  if (!authed) {
    return <AdminLogin onLogin={() => setAuthed(true)} />
  }

  return (
    <AdminLayout onLogout={handleLogout}>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="sales" element={<AdminSalesManager />} />
        <Route path="sales-history" element={<AdminSalesHistory />} />
        <Route path="inquiries" element={<AdminInquiries />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="orders/completed" element={<AdminOrdersCompleted />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="blog" element={<AdminBlog />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="newsletter" element={<AdminNewsletter />} />
        <Route path="holidays" element={<AdminHolidays />} />
        <Route path="discounts" element={<AdminDiscounts />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="analytics-history" element={<AdminAnalyticsHistory />} />
        <Route path="announcement" element={<AdminAnnouncement />} />
        <Route path="maintenance" element={<AdminMaintenance />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="*" element={<AdminNotFound />} />
      </Routes>
    </AdminLayout>
  )
}

export default Admin
