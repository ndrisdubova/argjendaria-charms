import { useEffect, useRef, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { useInquiries } from '../hooks/useInquiries'
import './Contact.css'

const INITIAL_FORM = { name: '', email: '', message: '' }

function Contact() {
  const { addInquiry } = useInquiries()
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [successPhase, setSuccessPhase] = useState('idle')
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Please enter your name.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Please enter a valid email.'
    if (!form.message.trim()) next.message = 'Please add a message.'
    return next
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length === 0) {
      addInquiry({ type: 'general', name: form.name, email: form.email, message: form.message })
      setForm(INITIAL_FORM)
      setSuccessPhase('in')
      timers.current.forEach(clearTimeout)
      timers.current = [
        setTimeout(() => setSuccessPhase('out'), 4000),
        setTimeout(() => setSuccessPhase('idle'), 4400),
      ]
    }
  }

  return (
    <section className="section contact-page">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Get in Touch</span>
          <h2>We'd Love to Hear From You</h2>
        </div>

        <div className="contact-grid">
          <div className="contact-info">
            <div className="info-item">
              <h4>Atelier</h4>
              <p>Rr. Shadervani<br />Gjilan, Kosova 60000</p>
            </div>
            <div className="info-item">
              <h4>Hours</h4>
              <p>Mon – Sat: 09:00 – 19:00<br />Sunday:Closed</p>
            </div>
            <div className="info-item">
              <h4>Contact</h4>
              <p>+383 048 77 33 88<br /> argjendaria@charms.com </p>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            {successPhase !== 'idle' && (
              <div className={`form-success ${successPhase === 'out' ? 'form-success-out' : ''}`} role="status">
                <span className="form-success-icon">
                  <CheckCircle2 size={22} strokeWidth={1.75} />
                </span>
                <span>Thank you — your message has been sent. We'll be in touch shortly.</span>
              </div>
            )}

            <div className="form-field">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Jane Doe"
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
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
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={form.message}
                onChange={handleChange}
                placeholder="Tell us what you're looking for..."
              />
              {errors.message && <span className="form-error">{errors.message}</span>}
            </div>

            <button type="submit" className="btn btn-solid contact-submit">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Contact
