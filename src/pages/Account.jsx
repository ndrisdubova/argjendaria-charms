import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle2, Heart, KeyRound, LogOut, Package, UserRound } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useFavorites } from '../hooks/useFavorites'
import './Contact.css'
import './Auth.css'
import './Products.css'

const INITIAL_FORM = { currentPassword: '', newPassword: '', confirmPassword: '' }

function Account() {
  const navigate = useNavigate()
  const { currentUser, isLoggedIn, logout, changePassword } = useAuth()
  const { favoriteIds } = useFavorites()
  const [form, setForm] = useState(INITIAL_FORM)
  const [error, setError] = useState('')
  const [successPhase, setSuccessPhase] = useState('idle')
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  if (!isLoggedIn) {
    return (
      <section className="section auth-page">
        <div className="auth-card">
          <span className="eyebrow">My Account</span>
          <h1>Log In Required</h1>
          <p className="auth-card-sub">Log in to view your account details.</p>
          <div className="favorites-auth-actions">
            <Link to="/login?next=/account" className="btn btn-solid">Log In</Link>
            <Link to="/signup?next=/account" className="btn btn-outline">Sign Up</Link>
          </div>
        </div>
      </section>
    )
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    setError('')
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.newPassword.length < 6) {
      setError('New password must be at least 6 characters.')
      return
    }
    if (form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match.')
      return
    }

    const result = await changePassword(form.currentPassword, form.newPassword)
    if (!result.ok) {
      setError(result.error)
      return
    }

    setForm(INITIAL_FORM)
    setSuccessPhase('in')
    timers.current.forEach(clearTimeout)
    timers.current = [
      setTimeout(() => setSuccessPhase('out'), 3000),
      setTimeout(() => setSuccessPhase('idle'), 3400),
    ]
  }

  return (
    <section className="section auth-page account-page">
      <div className="auth-card account-card">
        <span className="eyebrow">My Account</span>
        <h1>{currentUser.name}</h1>
        <p className="auth-card-sub">{currentUser.email}</p>

        <div className="account-summary">
          <Link to="/favorites" className="account-summary-item">
            <Heart size={18} strokeWidth={1.75} />
            <span>{favoriteIds.length} Saved {favoriteIds.length === 1 ? 'Piece' : 'Pieces'}</span>
          </Link>
          <Link to="/my-orders" className="account-summary-item">
            <Package size={18} strokeWidth={1.75} />
            <span>My Orders</span>
          </Link>
          <button type="button" className="account-summary-item account-logout" onClick={handleLogout}>
            <LogOut size={18} strokeWidth={1.75} />
            <span>Log Out</span>
          </button>
        </div>

        <div className="account-divider" />

        <h2 className="account-section-title"><KeyRound size={16} strokeWidth={1.75} /> Change Password</h2>

        {successPhase !== 'idle' && (
          <div className={`form-success ${successPhase === 'out' ? 'form-success-out' : ''}`} role="status">
            <span className="form-success-icon">
              <CheckCircle2 size={20} strokeWidth={1.75} />
            </span>
            <span>Password updated successfully.</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={form.currentPassword}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="At least 6 characters"
            />
          </div>

          <div className="form-field">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </div>

          {error && <span className="form-error">{error}</span>}

          <button type="submit" className="btn btn-solid auth-submit">
            <UserRound size={16} strokeWidth={1.75} />
            Update Password
          </button>
        </form>
      </div>
    </section>
  )
}

export default Account
