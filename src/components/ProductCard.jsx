import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Heart, Minus, Plus, ShoppingBag, Zap } from 'lucide-react'
import GemImage from './GemImage'
import { resolveProductImage } from '../data/images'
import { useFavorites } from '../hooks/useFavorites'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import { useDiscounts } from '../hooks/useDiscounts'
import { getStock } from '../data/productsStore'
import { getDiscountedPrice, formatDiscountedPrice } from '../data/discountsStore'
import './ProductCard.css'


function ProductCard({ product }) {
  const { discounts } = useDiscounts()
  const discountPercent = discounts[product.id] || 0
  const hasDiscount = discountPercent > 0
  const discountedPrice = hasDiscount ? getDiscountedPrice(product.price, discountPercent) : null
  const hasOffer = !hasDiscount && product.offerPrice && product.offerPrice < product.price
  const { isLoggedIn } = useAuth()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { addToCart, quantityInCart } = useCart()
  const favorited = isFavorite(product.id)
  const navigate = useNavigate()
  const location = useLocation()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [selectedSize, setSelectedSize] = useState('')
  const [sizeError, setSizeError] = useState(false)

  const hasSizes = product.category === 'ring' && product.sizes && product.sizes.length > 0
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

  const requireLogin = () => navigate(`/login?next=${encodeURIComponent(location.pathname)}`)

  const dec = () => setQuantity((q) => Math.max(1, q - 1))
  const inc = () => setQuantity((q) => Math.min(available, q + 1))

  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value)
    setSizeError(false)
  }

  const validateSize = () => {
    if (hasSizes && !selectedSize) {
      setSizeError(true)
      return false
    }
    return true
  }

  const handleAddToCart = () => {
    if (!isLoggedIn) return requireLogin()
    if (!validateSize()) return
    addToCart(product.id, quantity, hasSizes ? selectedSize : null)
    setQuantity(1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const handleBuyNow = () => {
    if (!isLoggedIn) return requireLogin()
    if (!validateSize()) return
    navigate('/checkout', { state: { buyNow: { productId: product.id, quantity, size: hasSizes ? selectedSize : null } } })
  }

  return (
    <article className="product-card">
      {hasDiscount && <span className="product-discount-badge">{discountPercent}% Off</span>}
      <Link to={`/products/${product.id}`}>
        <GemImage category={product.category} image={resolveProductImage(product)} alt={product.name} />
      </Link>
      <button
        type="button"
        className={`product-favorite-btn ${favorited ? 'product-favorite-btn-active' : ''}`}
        aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
        aria-pressed={favorited}
        onClick={handleFavoriteClick}
      >
        <Heart size={18} strokeWidth={1.75} fill={favorited ? 'currentColor' : 'none'} />
      </button>
      <div className="product-info">
        <span className="product-material">{product.material}</span>
        <Link to={`/products/${product.id}`} className="product-title-link">
          <h3>{product.name}</h3>
        </Link>
        <p className="product-desc">{product.description}</p>
        <div className="product-footer">
          <div className="product-price-group">
            {hasDiscount ? (
              <>
                <span className="product-price-original">${product.price.toLocaleString()}</span>
                <span className="product-price">${formatDiscountedPrice(discountedPrice)}</span>
              </>
            ) : hasOffer ? (
              <>
                <span className="product-price-original">${product.price.toLocaleString()}</span>
                <span className="product-price">${product.offerPrice.toLocaleString()}</span>
              </>
            ) : (
              <span className="product-price">${product.price.toLocaleString()}</span>
            )}
          </div>
          <Link to={`/products/${product.id}`} className="btn btn-outline product-btn">
            Details
          </Link>
        </div>

        {available > 0 ? (
          <div className="product-cart-block">
            {hasSizes && (
              <div className="product-size-select-row">
                <select
                  className={`product-size-select ${sizeError ? 'product-size-select-error' : ''}`}
                  value={selectedSize}
                  onChange={handleSizeChange}
                  aria-label="Select size"
                >
                  <option value="">Select Size</option>
                  {product.sizes.map((size) => (
                    <option key={size} value={size}>Size {size}</option>
                  ))}
                </select>
                {sizeError && <span className="form-error">Please select a size.</span>}
              </div>
            )}
            <div className="product-cart-row">
              <div className="qty-stepper">
                <button type="button" onClick={dec} disabled={quantity <= 1} aria-label="Decrease quantity">
                  <Minus size={13} strokeWidth={2} />
                </button>
                <span>{quantity}</span>
                <button type="button" onClick={inc} disabled={quantity >= available} aria-label="Increase quantity">
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
      </div>
    </article>
  )
}

export default ProductCard
