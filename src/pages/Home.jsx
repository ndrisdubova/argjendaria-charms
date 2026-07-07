import React from 'react'
import { Link } from 'react-router-dom'
import { Star, Heart, TreePine, PartyPopper, Flower2 } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../hooks/useProducts'
import { useReviews } from '../hooks/useReviews'
import { useHolidays } from '../hooks/useHolidays'
import { hero, story } from '../data/images'
import './Home.css'

const HOLIDAY_META = {
  valentines: { heading: "Valentine's Day Collection", blurb: 'Romantic pieces to celebrate the ones you love.' },
  christmas: { heading: 'Christmas Collection', blurb: 'Gifts worth finding under the tree.' },
  newyears: { heading: "New Year's Collection", blurb: 'Start the year with something timeless.' },
  mothersday: { heading: "Mother's Day Collection", blurb: 'Thoughtful pieces to honor her.' },
}

const HOLIDAY_ICONS = {
  valentines: Heart,
  christmas: TreePine,
  newyears: PartyPopper,
  mothersday: Flower2,
}

const VALUES = [
  {
    title: 'Handcrafted Artistry',
    text: 'Every piece is shaped and set by master artisans, never mass produced.',
  },
  {
    title: 'Certified Gemstones',
    text: 'Each stone is ethically sourced and independently certified for quality.',
  },
  {
    title: 'Lifetime Warranty',
    text: 'We stand behind our craftsmanship with complimentary lifetime care.',
  },
  {
    title: 'Complimentary Shipping',
    text: 'Insured, discreet delivery on every order, anywhere in the world.',
  },
]

function Home() {
  const { products } = useProducts()
  const { reviews } = useReviews()
  const { holidays, HOLIDAY_DEFS } = useHolidays()
  const featured = products.filter((p) => p.featured)
  const recentReviews = [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date))
  const activeHolidays = HOLIDAY_DEFS.filter(
    ({ key }) => holidays[key]?.enabled && holidays[key].productIds.length > 0,
  )

  return (
    <>
      <section className="hero" style={{ backgroundImage: `url(${hero})` }}>
        <div className="hero-overlay" aria-hidden="true" />
        <div className="container hero-inner">
          <span className="eyebrow">Est. Fine Jewelry House</span>
          <h1>Timeless Elegance, Crafted for You</h1>
          <p className="hero-text">
            Charm's creates heirloom-quality rings, necklaces, earrings and bracelets —
            designed to be worn today and treasured for generations.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="btn btn-solid">Explore the Collection</Link>
            <Link to="/contact" className="btn btn-outline">Talk with us</Link>
          </div>
        </div>
      </section>

      {activeHolidays.map(({ key, label }) => {
        const holidayProducts = products.filter((p) => holidays[key].productIds.includes(p.id))
        const meta = HOLIDAY_META[key]
        const Icon = HOLIDAY_ICONS[key]
        return (
          <section className={`section-tight holiday-section holiday-section-${key}`} key={key}>
            <div className="holiday-deco" aria-hidden="true">
              <div className="holiday-deco-glow" />
              <Icon className="holiday-deco-icon holiday-deco-1" fill="currentColor" strokeWidth={1} />
              <Icon className="holiday-deco-icon holiday-deco-2" fill="currentColor" strokeWidth={1} />
              <Icon className="holiday-deco-icon holiday-deco-3" fill="currentColor" strokeWidth={1} />
              <Icon className="holiday-deco-icon holiday-deco-4" fill="currentColor" strokeWidth={1} />
              <Icon className="holiday-deco-icon holiday-deco-5" fill="currentColor" strokeWidth={1} />
              <Icon className="holiday-deco-icon holiday-deco-6" fill="currentColor" strokeWidth={1} />
              <Icon className="holiday-deco-icon holiday-deco-watermark" fill="currentColor" strokeWidth={1} />
              <Icon className="holiday-deco-icon holiday-deco-watermark-2" fill="currentColor" strokeWidth={1} />
            </div>
            <div className="container">
              <div className="section-head">
                <span className="holiday-badge"><Icon size={14} strokeWidth={1.75} fill="currentColor" /> {label}</span>
                <h2>{meta.heading}</h2>
                <p>{meta.blurb}</p>
                <div className="holiday-divider"><Icon size={16} strokeWidth={1.5} fill="currentColor" /></div>
              </div>
              <div className="product-grid">
                {holidayProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )
      })}

      <section className="section story">
        <div className="container story-grid">
          <div className="story-visual">
            <img src={story} alt="Charm's atelier display" className="story-img" loading="lazy" />
          </div>
          <div className="story-copy">
            <span className="eyebrow">Our Story</span>
            <h2>A Legacy Set in Silver</h2>
            <p>
              Founded on the belief that fine jewelry should feel personal, Charm's brings
              together traditional goldsmithing and modern design. Each collection is
              conceived in our atelier and finished entirely by hand, from wax to polish.
            </p>
            <p>
              We work exclusively with conflict-free diamonds and recycled precious metals —
              because beauty should never come at a cost to the world it's worn in.
            </p>
            <Link to="/products" className="story-link">View our collection &rarr;</Link>
          </div>
        </div>
      </section>

      <section className="section featured">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Signature Pieces</span>
            <h2>Featured Collection</h2>
            <p>A curated edit of our most coveted designs, in gold, diamond and gemstone.</p>
          </div>
          <div className="product-grid">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="featured-cta">
            <Link to="/products" className="btn btn-outline">View Full Collection</Link>
          </div>
        </div>
      </section>

      <section className="section-tight values">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Why Charm's</span>
            <h2>Crafted With Care</h2>
          </div>
          <div className="values-grid">
            {VALUES.map((v) => (
              <div className="value-card" key={v.title}>
                <span className="value-mark" />
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {reviews.length > 0 && (
        <section className="section-tight testimonials">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Client Stories</span>
              <h2>What Our Clients Say</h2>
            </div>
            <div className="testimonials-grid">
              {recentReviews.map((review) => (
                <div className="testimonial-card" key={review.id}>
                  <div className="testimonial-stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        strokeWidth={1.5}
                        fill={i < review.rating ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>
                  <p className="testimonial-text">"{review.text}"</p>
                  <span className="testimonial-name">{review.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="cta-banner">
        <div className="container cta-banner-inner">
          <h2>Find the Piece That Tells Your Story.</h2>
          <p>Visit our atelier or reach out for a private, one-on-one styling session.</p>
          <Link to="/contact" className="btn btn-solid">Get in Touch</Link>
        </div>
      </section>
    </>
  )
}

export default Home