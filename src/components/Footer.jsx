import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Send, Check } from 'lucide-react'
import { useNewsletter } from '../hooks/useNewsletter'
import './Footer.css'

function Footer() {
  const { addSubscriber } = useNewsletter()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setStatus('invalid')
      return
    }
    const result = addSubscriber(email)
    setStatus(result)
    if (result === 'ok') {
      setEmail('')
      timers.current.forEach(clearTimeout)
      timers.current = [setTimeout(() => setStatus('idle'), 5000)]
    }
  }

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="brand footer-logo">Charm's</span>
          <p>Fine jewelry, handcrafted for the moments that matter most.</p>

          <h4 className="footer-newsletter-heading">Join Our Newsletter</h4>

          {status === 'ok' ? (
            <div className="newsletter-success" role="status">
              <span className="newsletter-success-icon">
                <Check size={22} strokeWidth={3} />
              </span>
              <div className="newsletter-success-copy">
                <strong>You're subscribed!</strong>
                <span>Thank you for joining Charm's.</span>
              </div>
            </div>
          ) : (
            <>
              <form className="footer-newsletter" onSubmit={handleSubscribe} noValidate>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setStatus('idle')
                  }}
                  placeholder="Your email address"
                  aria-label="Email address"
                />
                <button type="submit" aria-label="Subscribe to newsletter">
                  <Send size={16} strokeWidth={1.75} />
                </button>
              </form>
              {status === 'duplicate' && <p className="footer-newsletter-message">You're already on the list.</p>}
              {status === 'invalid' && <p className="footer-newsletter-message footer-newsletter-error">Please enter a valid email.</p>}
            </>
          )}
        </div>

        <div className="footer-col">
          <h4>Explore</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Collection</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/size-guide">Ring Size Guide</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Visit</h4>
          <ul>
            <li>Rr. Shadervani</li>
            <li>Gjilan, Kosova 6000</li>
            <li>+383 48 77 33 88 </li>
            <li>argjendaria@charms.com </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Follow</h4>
          <ul className="footer-social">
            <li><a href="https://www.instagram.com/" aria-label="Instagram">Instagram</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Charm's Jewelry. All rights reserved. Developed by Ndris Dubova.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer;
