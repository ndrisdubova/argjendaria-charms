import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { LayoutDashboard, Gem, Receipt, History, MessagesSquare, PackageOpen, Newspaper, Star, Mail, PartyPopper, BarChart3, CalendarRange, Settings, ArrowLeft, LogOut, Users, Megaphone, ShieldAlert, Percent, Menu } from 'lucide-react'
import { useAdminTheme } from '../../hooks/useAdminTheme'
import { useInquiries } from '../../hooks/useInquiries'

function AdminLayout({ children, onLogout }) {
  const [theme] = useAdminTheme()
  const { unreadCount } = useInquiries()
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)
  const navLinkClass = ({ isActive }) => `admin-nav-link ${isActive ? 'admin-nav-link-active' : ''}`

  return (
    <div className="admin-shell" data-admin-theme={theme}>
      <aside className="admin-aside">
        <div className="admin-aside-top">
          <div className="admin-aside-brand">
            <Gem size={20} strokeWidth={1.5} />
            Charm's
          </div>
          <button
            type="button"
            className="admin-nav-toggle"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <Menu size={22} strokeWidth={1.75} />
          </button>
        </div>

        <div className={`admin-mobile-menu ${menuOpen ? 'admin-mobile-menu-open' : ''}`}>
          <nav className="admin-nav">
            <NavLink to="/admin" end className={navLinkClass} onClick={closeMenu}>
              <LayoutDashboard size={17} strokeWidth={1.75} />
              Dashboard
            </NavLink>
            <NavLink to="/admin/products" className={navLinkClass} onClick={closeMenu}>
              <Gem size={17} strokeWidth={1.75} />
              Products
            </NavLink>
            <NavLink to="/admin/sales" className={navLinkClass} onClick={closeMenu}>
              <Receipt size={17} strokeWidth={1.75} />
              Sales Manager
            </NavLink>
            <NavLink to="/admin/sales-history" className={navLinkClass} onClick={closeMenu}>
              <History size={17} strokeWidth={1.75} />
              Sales History
            </NavLink>
            <NavLink to="/admin/inquiries" className={({ isActive }) => `admin-nav-link admin-nav-link-row ${isActive ? 'admin-nav-link-active' : ''}`} onClick={closeMenu}>
              <span className="admin-nav-link-label">
                <MessagesSquare size={17} strokeWidth={1.75} />
                Inquiries
              </span>
              {unreadCount > 0 && <span className="admin-nav-badge">{unreadCount}</span>}
            </NavLink>
            <NavLink to="/admin/orders" className={navLinkClass} onClick={closeMenu}>
              <PackageOpen size={17} strokeWidth={1.75} />
              Orders
            </NavLink>
            <NavLink to="/admin/users" className={navLinkClass} onClick={closeMenu}>
              <Users size={17} strokeWidth={1.75} />
              Users
            </NavLink>
            <NavLink to="/admin/blog" className={navLinkClass} onClick={closeMenu}>
              <Newspaper size={17} strokeWidth={1.75} />
              Blog
            </NavLink>
            <NavLink to="/admin/reviews" className={navLinkClass} onClick={closeMenu}>
              <Star size={17} strokeWidth={1.75} />
              Reviews
            </NavLink>
            <NavLink to="/admin/newsletter" className={navLinkClass} onClick={closeMenu}>
              <Mail size={17} strokeWidth={1.75} />
              Newsletter
            </NavLink>
            <NavLink to="/admin/holidays" className={navLinkClass} onClick={closeMenu}>
              <PartyPopper size={17} strokeWidth={1.75} />
              Holidays
            </NavLink>
            <NavLink to="/admin/discounts" className={navLinkClass} onClick={closeMenu}>
              <Percent size={17} strokeWidth={1.75} />
              Discounts
            </NavLink>
            <NavLink to="/admin/analytics" className={navLinkClass} onClick={closeMenu}>
              <BarChart3 size={17} strokeWidth={1.75} />
              Analytics
            </NavLink>
            <NavLink to="/admin/analytics-history" className={navLinkClass} onClick={closeMenu}>
              <CalendarRange size={17} strokeWidth={1.75} />
              Analytics History
            </NavLink>
            <NavLink to="/admin/announcement" className={navLinkClass} onClick={closeMenu}>
              <Megaphone size={17} strokeWidth={1.75} />
              Announcement
            </NavLink>
            <NavLink to="/admin/maintenance" className={navLinkClass} onClick={closeMenu}>
              <ShieldAlert size={17} strokeWidth={1.75} />
              Maintenance
            </NavLink>
            <NavLink to="/admin/settings" className={navLinkClass} onClick={closeMenu}>
              <Settings size={17} strokeWidth={1.75} />
              Settings
            </NavLink>
          </nav>

          <div className="admin-aside-footer">
            <Link to="/" className="admin-view-site" onClick={closeMenu}>
              <ArrowLeft size={15} strokeWidth={1.75} />
              View Site
            </Link>
            <button type="button" className="btn btn-outline admin-logout" onClick={onLogout}>
              <LogOut size={15} strokeWidth={1.75} />
              Log Out
            </button>
          </div>
        </div>
      </aside>

      <div className="admin-content">{children}</div>
    </div>
  )
}

export default AdminLayout
