import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { CheckCircle2, Heart, Minus, Plus, ShoppingBag, Zap } from 'lucide-react'
import { useProducts } from '../hooks/useProducts'
import { useInquiries } from '../hooks/useInquiries'
import { useFavorites } from '../hooks/useFavorites'
import { useAuth } from '../hooks/useAuth'
import { useProductViews } from '../hooks/useProductViews'
import { useCart } from '../hooks/useCart'
import { useDiscounts } from '../hooks/useDiscounts'
import { resolveProductImage } from '../data/images'
import { getStock } from '../data/productsStore'
import { getDiscountedPrice, formatDiscountedPrice } from '../data/discountsStore'
import {
  FONT_OPTIONS,
  DEFAULT_FONT,
  MAX_PERSONALIZATION_LENGTH,
  fontStack,
  cleanPersonalization,
} from '../data/personalization'
import NotFound from './NotFound'
import '../components/ProductCard.css'
import '../pages/Contact.css'
import './ProductDetail.css'

const INITIAL_FORM = { name: '', email: '', message: '' }

function ProductDetail() {
  const { id } = useParams()
  const { products, loading: productsLoading } = useProducts()
  const { addInquiry } = useInquiries()
  const { isLoggedIn } = useAuth()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { recordView } = useProductViews()
  const { addToCart, quantityInCart } = useCart()
  const { discounts } = useDiscounts()
  const navigate = useNavigate()
  const location = useLocation()
  const product = products.find((p) => p.id === id)
  const [activeImage, setActiveImage] = useState(null)
  const [form, setForm] = useState(INITIAL_FORM)
  const [selectedSize, setSelectedSize] = useState(null)
  const [errors, setErrors] = useState({})
  const [successPhase, setSuccessPhase] = useState('idle')
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [engravingText, setEngravingText] = useState('')
  const [engravingFont, setEngravingFont] = useState(DEFAULT_FONT)
  const timers = useRef([])

  useEffect(() => {
    setActiveImage(null)
    setSuccessPhase('idle')
    setErrors({})
    setSelectedSize(null)
    setQuantity(1)
    setAdded(false)
    setEngravingText('')
    setEngravingFont(DEFAULT_FONT)
    setForm(product ? { ...INITIAL_FORM, message: `I'm interested in the "${product.name}". Could you tell me more about it?` } : INITIAL_FORM)
    timers.current.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    if (product) recordView(product.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  if (!product) return productsLoading ? null : <NotFound />

  const hasSizes = product.category === 'ring' && product.sizes && product.sizes.length > 0
  const isPersonalizable = Boolean(product.personalizable)
  const stock = getStock(product)
  const inCartQty = quantityInCart(product.id)
  const available = Math.max(0, stock - inCartQty)

  const handleFavoriteClick = () => {
    if (!isLoggedIn) {
      navigate(`/login?next=${encodeURIComponent(location.pathname)}&favorite=${product.id}`)
      return
    }
    toggleFavorite(product.id)
  }

  const requireLoginForPurchase = () => navigate(`/login?next=${encodeURIComponent(location.pathname)}`)

  const decQuantity = () => setQuantity((q) => Math.max(1, q - 1))
  const incQuantity = () => setQuantity((q) => Math.min(available, q + 1))

  const validatePurchase = () => {
    let ok = true
    if (hasSizes && !selectedSize) {
      setErrors((e) => ({ ...e, size: 'Please select a size.' }))
      ok = false
    }
    if (isPersonalizable && !engravingText.trim()) {
      setErrors((e) => ({ ...e, engraving: 'Please enter the text you would like engraved.' }))
      ok = false
    }
    return ok
  }

  const buildPersonalization = () =>
    isPersonalizable ? cleanPersonalization(engravingText, engravingFont) : null

  const handleAddToCart = () => {
    if (!isLoggedIn) return requireLoginForPurchase()
    if (!validatePurchase()) return
    addToCart(product.id, quantity, hasSizes ? selectedSize : null, buildPersonalization())
    setQuantity(1)
    setEngravingText('')
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const handleBuyNow = () => {
    if (!isLoggedIn) return requireLoginForPurchase()
    if (!validatePurchase()) return
    navigate('/checkout', {
      state: {
        buyNow: {
          productId: product.id,
          quantity,
          size: hasSizes ? selectedSize : null,
          personalization: buildPersonalization(),
        },
      },
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Please enter your name.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Please enter a valid email.'
    if (!form.message.trim()) next.message = 'Please add a message.'
    if (hasSizes && !selectedSize) next.size = 'Please select a size.'
    return next
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length === 0) {
      addInquiry({
        type: 'piece',
        name: form.name,
        email: form.email,
        message: form.message,
        productId: product.id,
        productName: product.name,
        size: hasSizes ? selectedSize : undefined,
      })
      setForm({ ...INITIAL_FORM, message: `I'm interested in the "${product.name}". Could you tell me more about it?` })
      setSuccessPhase('in')
      timers.current.forEach(clearTimeout)
      timers.current = [
        setTimeout(() => setSuccessPhase('out'), 4000),
        setTimeout(() => setSuccessPhase('idle'), 4400),
      ]
    }
  }

  const mainImage = resolveProductImage(product)
  const gallery = product.gallery || []
  const discountPercent = discounts[product.id] || 0
  const hasDiscount = discountPercent > 0
  const discountedPrice = hasDiscount ? getDiscountedPrice(product.price, discountPercent) : null
  const hasOffer = !hasDiscount && product.offerPrice && product.offerPrice < product.price
  const shown = activeImage || mainImage

  return (
    <section className="section product-detail">
      <div className="container">
        <Link to="/products" className="product-detail-back">&larr; Back to Collection</Link>

        <div className="product-detail-grid">
          <div className="product-detail-media">
            <div className="product-detail-main-image">
              {hasDiscount && <span className="product-discount-badge">{discountPercent}% Off</span>}
              <img key={shown} src={shown} alt={product.name} />
            </div>

            {gallery.length > 0 && (
              <div className="product-detail-thumbs">
                <button
                  type="button"
                  className={`product-detail-thumb ${shown === mainImage ? 'product-detail-thumb-active' : ''}`}
                  onClick={() => setActiveImage(mainImage)}
                >
                  <img src={mainImage} alt="" />
                </button>
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`product-detail-thumb ${shown === img ? 'product-detail-thumb-active' : ''}`}
                    onClick={() => setActiveImage(img)}
                  >
                    <img src={img} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="product-detail-info">
            <div className="product-detail-heading-row">
              <span className="eyebrow">{product.category}</span>
              <button
                type="button"
                className={`product-detail-favorite ${isFavorite(product.id) ? 'product-detail-favorite-active' : ''}`}
                aria-label={isFavorite(product.id) ? 'Remove from favorites' : 'Add to favorites'}
                aria-pressed={isFavorite(product.id)}
                onClick={handleFavoriteClick}
              >
                <Heart size={17} strokeWidth={1.75} fill={isFavorite(product.id) ? 'currentColor' : 'none'} />
                {isFavorite(product.id) ? 'Saved' : 'Save'}
              </button>
            </div>
            <h1>{product.name}</h1>
            <p className="product-detail-material">{product.material}</p>

            <div className="product-detail-price">
              {hasDiscount ? (
                <>
                  <span className="product-detail-price-original">${product.price.toLocaleString()}</span>
                  <span className="product-detail-price-offer">${formatDiscountedPrice(discountedPrice)}</span>
                </>
              ) : hasOffer ? (
                <>
                  <span className="product-detail-price-original">${product.price.toLocaleString()}</span>
                  <span className="product-detail-price-offer">${product.offerPrice.toLocaleString()}</span>
                </>
              ) : (
                <span className="product-detail-price-offer">${product.price.toLocaleString()}</span>
              )}
            </div>

            <p className="product-detail-desc">{product.description}</p>

            {hasSizes && (
              <div className="product-detail-sizes">
                <span className="product-detail-sizes-label">Select Size</span>
                <div className="product-detail-size-picker">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={`product-detail-size-chip ${selectedSize === size ? 'product-detail-size-chip-active' : ''}`}
                      onClick={() => {
                        setSelectedSize(size)
                        setErrors((e) => ({ ...e, size: undefined }))
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {errors.size && <span className="form-error">{errors.size}</span>}
              </div>
            )}

            {product.category === 'ring' && (
              <Link to="/size-guide" className="product-detail-size-link">
                Not sure of your size? View our ring size guide &rarr;
              </Link>
            )}

            {isPersonalizable && (
              <div className="product-personalize">
                <span className="product-personalize-label">Make It Yours</span>
                <p className="product-personalize-hint">
                  Add a name, date or short message — we&apos;ll engrave it by hand.
                </p>

                <div className="form-field">
                  <label htmlFor="engraving-text">Engraving Text</label>
                  <input
                    id="engraving-text"
                    type="text"
                    maxLength={MAX_PERSONALIZATION_LENGTH}
                    value={engravingText}
                    placeholder="e.g. Elira"
                    onChange={(e) => {
                      setEngravingText(e.target.value)
                      setErrors((err) => ({ ...err, engraving: undefined }))
                    }}
                  />
                  <span className="product-personalize-count">
                    {engravingText.length}/{MAX_PERSONALIZATION_LENGTH}
                  </span>
                </div>

                <div className="form-field">
                  <label>Font</label>
                  <div className="product-personalize-fonts">
                    {FONT_OPTIONS.map((font) => (
                      <button
                        key={font.id}
                        type="button"
                        className={`product-personalize-font ${engravingFont === font.id ? 'product-personalize-font-active' : ''}`}
                        style={{ fontFamily: font.stack }}
                        onClick={() => setEngravingFont(font.id)}
                        aria-pressed={engravingFont === font.id}
                      >
                        {font.label}
                      </button>
                    ))}
                  </div>
                </div>

                {engravingText.trim() && (
                  <div className="product-personalize-preview">
                    <span className="product-personalize-preview-label">Preview</span>
                    <span
                      className="product-personalize-preview-text"
                      style={{ fontFamily: fontStack(engravingFont) }}
                    >
                      {engravingText.trim()}
                    </span>
                  </div>
                )}

                {errors.engraving && <span className="form-error">{errors.engraving}</span>}
              </div>
            )}

            {available > 0 ? (
              <div className="product-cart-block product-detail-cart-block">
                <div className="product-cart-row">
                  <div className="qty-stepper">
                    <button type="button" onClick={decQuantity} disabled={quantity <= 1} aria-label="Decrease quantity">
                      <Minus size={13} strokeWidth={2} />
                    </button>
                    <span>{quantity}</span>
                    <button type="button" onClick={incQuantity} disabled={quantity >= available} aria-label="Increase quantity">
                      <Plus size={13} strokeWidth={2} />
                    </button>
                  </div>
                  <button type="button" className="btn btn-outline product-cart-btn" onClick={handleAddToCart}>
                    <ShoppingBag size={14} strokeWidth={1.75} />
                    {added ? 'Added' : 'Add to Cart'}
                  </button>
                </div>
                <button type="button" className="btn btn-solid product-buynow-btn" onClick={handleBuyNow}>
                  <Zap size={14} strokeWidth={1.75} />
                  Buy Now
                </button>
                {available <= 4 && <span className="product-stock-note">Only {available} left</span>}
              </div>
            ) : (
              <span className="product-out-of-stock">{inCartQty > 0 ? 'Max quantity in cart' : 'Out of Stock'}</span>
            )}

            <div className="product-detail-actions">
              <Link to="/products" className="btn btn-outline">Back to Collection</Link>
            </div>
          </div>
        </div>

        <div className="product-detail-inquiry">
          <div className="section-head product-detail-inquiry-head">
            <span className="eyebrow">Interested in This Piece?</span>
            <h2>Send Us an Inquiry</h2>
            <p>Reach out about the {product.name}, and our atelier will get back to you shortly.</p>
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

            <form className="contact-form product-detail-inquiry-form" onSubmit={handleSubmit} noValidate>
              {successPhase !== 'idle' && (
                <div className={`form-success ${successPhase === 'out' ? 'form-success-out' : ''}`} role="status">
                  <span className="form-success-icon">
                    <CheckCircle2 size={22} strokeWidth={1.75} />
                  </span>
                  <span>Thank you — your inquiry has been sent. We'll be in touch shortly.</span>
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
                />
                {errors.message && <span className="form-error">{errors.message}</span>}
              </div>

              <button type="submit" className="btn btn-solid contact-submit">
                Send Inquiry
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductDetail
