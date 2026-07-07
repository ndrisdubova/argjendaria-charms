import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { KeyRound } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { addFavoriteForCustomer } from '../data/favoritesStore'
import './Contact.css'
import './Auth.css'

const INITIAL_FORM = { email: '', password: '', confirmPassword: '' }

function ForgotPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { resetPassword } = useAuth()
  const [form, setForm] = useState(INITIAL_FORM)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError('Please enter a valid email.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    const result = resetPassword(form.email.trim(), form.password)
    if (!result.ok) {
      setError(result.error)
      return
    }
    const favoriteToApply = searchParams.get('favorite')
    if (favoriteToApply) addFavoriteForCustomer(result.customer.id, favoriteToApply)
    navigate(searchParams.get('next') || '/account')
  }

  return (
    <section className="section auth-page">
      <div className="auth-card">
        <span className="eyebrow">Account Recovery</span>
        <h1>Reset Password</h1>
        <p className="auth-card-sub">
          There's no email verification here yet — enter your account email and choose a new password.
        </p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="jane@example.com"
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">New Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
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
            <KeyRound size={16} strokeWidth={1.75} />
            Reset Password
          </button>
        </form>

        <p className="auth-switch">
          Remembered it? <Link to={`/login?${searchParams.toString()}`}>Log In</Link>
        </p>
      </div>
    </section>
  )
}

export default ForgotPassword
