import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { addFavoriteForCustomer } from '../data/favoritesStore'
import './Contact.css'
import './Auth.css'

const INITIAL_FORM = { name: '', email: '', password: '', confirmPassword: '' }

function Signup() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { signup } = useAuth()
  const [form, setForm] = useState(INITIAL_FORM)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Please enter your name.')
      return
    }
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

    const result = signup({ name: form.name.trim(), email: form.email.trim(), password: form.password })
    if (!result.ok) {
      setError(result.error)
      return
    }
    const favoriteToApply = searchParams.get('favorite')
    if (favoriteToApply) addFavoriteForCustomer(result.customer.id, favoriteToApply)
    navigate(searchParams.get('next') || '/')
  }

  return (
    <section className="section auth-page">
      <div className="auth-card">
        <span className="eyebrow">Join Charm's</span>
        <h1>Create an Account</h1>
        <p className="auth-card-sub">Sign up to save your favorite pieces for later.</p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="name">Full Name</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Jane Doe" />
          </div>

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
            <label htmlFor="password">Password</label>
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
            <label htmlFor="confirmPassword">Confirm Password</label>
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
            <UserPlus size={16} strokeWidth={1.75} />
            Create Account
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to={`/login?${searchParams.toString()}`}>Log In</Link>
        </p>
      </div>
    </section>
  )
}

export default Signup
