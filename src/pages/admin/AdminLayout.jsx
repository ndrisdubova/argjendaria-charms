import { Link, NavLink } from 'react-router-dom'
import { LayoutDashboard, Gem, Receipt, History, MessagesSquare, PackageOpen, Newspaper, Star, Mail, PartyPopper, BarChart3, CalendarRange, Settings, ArrowLeft, LogOut, Users, Megaphone, ShieldAlert, Percent } from 'lucide-react'
import { useAdminTheme } from '../../hooks/useAdminTheme'
import { useInquiries } from '../../hooks/useInquiries'

function AdminLayout({ children, onLogout }) {
  const [theme] = useAdminTheme()
  const { unreadCount } = useInquiries()

  return (
    <div className="admin-shell" data-admin-theme={theme}>
      <aside className="admin-aside">
        <div className="admin-aside-brand">
          <Gem size={20} strokeWidth={1.5} />
          Charm's
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin" end className={({ isActive }) => `admin-nav-link ${isActive ? 'admin-nav-link-active' : ''}`}>
            <LayoutDashboard size={17} strokeWidth={1.75} />
            Dashboard
          </NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => `admin-nav-link ${isActive ? 'admin-nav-link-active' : ''}`}>
            <Gem size={17} strokeWidth={1.75} />
            Products
          </NavLink>
          <NavLink to="/admin/sales" className={({ isActive }) => `admin-nav-link ${isActive ? 'admin-nav-link-active' : ''}`}>
            <Receipt size={17} strokeWidth={1.75} />
            Sales Manager
          </NavLink>
          <NavLink to="/admin/sales-history" className={({ isActive }) => `admin-nav-link ${isActive ? 'admin-nav-link-active' : ''}`}>
            <History size={17} strokeWidth={1.75} />
            Sales History
          </NavLink>
          <NavLink to="/admin/inquiries" className={({ isActive }) => `admin-nav-link admin-nav-link-row ${isActive ? 'admin-nav-link-active' : ''}`}>
            <span className="admin-nav-link-label">
              <MessagesSquare size={17} strokeWidth={1.75} />
              Inquiries
            </span>
            {unreadCount > 0 && <span className="admin-nav-badge">{unreadCount}</span>}
          </NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => `admin-nav-link ${isActive ? 'admin-nav-link-active' : ''}`}>
            <PackageOpen size={17} strokeWidth={1.75} />
            Orders
          </NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => `admin-nav-link ${isActive ? 'admin-nav-link-active' : ''}`}>
            <Users size={17} strokeWidth={1.75} />
            Users
          </NavLink>
          <NavLink to="/admin/blog" className={({ isActive }) => `admin-nav-link ${isActive ? 'admin-nav-link-active' : ''}`}>
            <Newspaper size={17} strokeWidth={1.75} />
            Blog
          </NavLink>
          <NavLink to="/admin/reviews" className={({ isActive }) => `admin-nav-link ${isActive ? 'admin-nav-link-active' : ''}`}>
            <Star size={17} strokeWidth={1.75} />
            Reviews
          </NavLink>
          <NavLink to="/admin/newsletter" className={({ isActive }) => `admin-nav-link ${isActive ? 'admin-nav-link-active' : ''}`}>
            <Mail size={17} strokeWidth={1.75} />
            Newsletter
          </NavLink>
          <NavLink to="/admin/holidays" className={({ isActive }) => `admin-nav-link ${isActive ? 'admin-nav-link-active' : ''}`}>
            <PartyPopper size={17} strokeWidth={1.75} />
            Holidays
          </NavLink>
          <NavLink to="/admin/discounts" className={({ isActive }) => `admin-nav-link ${isActive ? 'admin-nav-link-active' : ''}`}>
            <Percent size={17} strokeWidth={1.75} />
            Discounts
          </NavLink>
          <NavLink to="/admin/analytics" className={({ isActive }) => `admin-nav-link ${isActive ? 'admin-nav-link-active' : ''}`}>
            <BarChart3 size={17} strokeWidth={1.75} />
            Analytics
          </NavLink>
          <NavLink to="/admin/analytics-history" className={({ isActive }) => `admin-nav-link ${isActive ? 'admin-nav-link-active' : ''}`}>
            <CalendarRange size={17} strokeWidth={1.75} />
            Analytics History
          </NavLink>
          <NavLink to="/admin/announcement" className={({ isActive }) => `admin-nav-link ${isActive ? 'admin-nav-link-active' : ''}`}>
            <Megaphone size={17} strokeWidth={1.75} />
            Announcement
          </NavLink>
          <NavLink to="/admin/maintenance" className={({ isActive }) => `admin-nav-link ${isActive ? 'admin-nav-link-active' : ''}`}>
            <ShieldAlert size={17} strokeWidth={1.75} />
            Maintenance
          </NavLink>
          <NavLink to="/admin/settings" className={({ isActive }) => `admin-nav-link ${isActive ? 'admin-nav-link-active' : ''}`}>
            <Settings size={17} strokeWidth={1.75} />
            Settings
          </NavLink>
        </nav>

        <div className="admin-aside-footer">
          <Link to="/" className="admin-view-site">
            <ArrowLeft size={15} strokeWidth={1.75} />
            View Site
          </Link>
          <button type="button" className="btn btn-outline admin-logout" onClick={onLogout}>
            <LogOut size={15} strokeWidth={1.75} />
            Log Out
          </button>
        </div>
      </aside>

      <div className="admin-content">{children}</div>
    </div>
  )
}

export default AdminLayout
