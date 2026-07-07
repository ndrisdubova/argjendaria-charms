import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { addFavoriteForCustomer } from '../data/favoritesStore'
import './Contact.css'
import './Auth.css'

function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await login(form.email.trim(), form.password)
    if (!result.ok) {
      setError(result.error)
      return
    }
    const favoriteToApply = searchParams.get('favorite')
    if (favoriteToApply) await addFavoriteForCustomer(result.customer.id, favoriteToApply)
    navigate(searchParams.get('next') || '/')
  }

  return (
    <section className="section auth-page">
      <div className="auth-card">
        <span className="eyebrow">Welcome Back</span>
        <h1>Log In</h1>
        <p className="auth-card-sub">Log in to save your favorite pieces.</p>

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
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>

          {error && <span className="form-error">{error}</span>}

          <button type="submit" className="btn btn-solid auth-submit">
            <LogIn size={16} strokeWidth={1.75} />
            Log In
          </button>
        </form>

        <p className="auth-switch">
          <Link to={`/forgot-password?${searchParams.toString()}`}>Forgot your password?</Link>
        </p>

        <p className="auth-switch">
          Don't have an account? <Link to={`/signup?${searchParams.toString()}`}>Sign Up</Link>
        </p>
      </div>
    </section>
  )
}

export default Login
