import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Heart, LogIn, LogOut, ShoppingBag, User } from 'lucide-react'
import { useFavorites } from '../hooks/useFavorites'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import './Navbar.css'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Collection' },
  { to: '/about', label: 'About Us' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
]

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { favoriteIds } = useFavorites()
  const { itemCount } = useCart()
  const { isLoggedIn, currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    setOpen(false)
    navigate('/')
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`navbar ${scrolled ? 'navbar-solid' : ''}`}>
      <div className="container navbar-inner">
        <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
          Charm's
        </NavLink>

        <nav className={`nav-links ${open ? 'nav-links-open' : ''}`}>
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink
            to="/favorites"
            className={({ isActive }) => `nav-link nav-favorite-link ${isActive ? 'nav-link-active' : ''}`}
            onClick={() => setOpen(false)}
          >
            <Heart size={17} strokeWidth={1.75} fill={favoriteIds.length > 0 ? 'currentColor' : 'none'} />
            Favorites
            {favoriteIds.length > 0 && <span className="nav-favorite-badge">{favoriteIds.length}</span>}
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) => `nav-link nav-favorite-link ${isActive ? 'nav-link-active' : ''}`}
            onClick={() => setOpen(false)}
          >
            <ShoppingBag size={17} strokeWidth={1.75} />
            Cart
            {itemCount > 0 && <span className="nav-favorite-badge">{itemCount}</span>}
          </NavLink>

          {isLoggedIn ? (
            <span className="nav-account">
              <Link to="/account" className="nav-account-link" onClick={() => setOpen(false)}>
                <User size={16} strokeWidth={1.75} />
                {currentUser.name.split(' ')[0]}
              </Link>
              <button type="button" className="nav-logout-btn" onClick={handleLogout}>
                <LogOut size={14} strokeWidth={1.75} />
                Log Out
              </button>
            </span>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) => `nav-link nav-favorite-link ${isActive ? 'nav-link-active' : ''}`}
              onClick={() => setOpen(false)}
            >
              <LogIn size={17} strokeWidth={1.75} />
              Log In
            </NavLink>
          )}
        </nav>

        <button
          type="button"
          className="nav-toggle"
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}

export default Navbar
