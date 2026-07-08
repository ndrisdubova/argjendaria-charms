import { useMemo, useState } from 'react'
import { Search, Tag, X } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { categories } from '../data/products'
import { useProducts } from '../hooks/useProducts'
import './Products.css'

const LABELS = {
  all: 'All Pieces',
  ring: 'Rings',
  necklace: 'Necklaces',
  earrings: 'Earrings',
  bracelet: 'Bracelets',
}

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
]

function Products() {
  const { products, loading, error } = useProducts()
  const [active, setActive] = useState('all')
  const [query, setQuery] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [onSaleOnly, setOnSaleOnly] = useState(false)
  const [sort, setSort] = useState('featured')

  const priceBounds = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 0 }
    const prices = products.map((p) => p.price)
    return { min: Math.min(...prices), max: Math.max(...prices) }
  }, [products])

  const hasActiveFilters =
    active !== 'all' || query.trim() !== '' || minPrice !== '' || maxPrice !== '' || onSaleOnly || sort !== 'featured'

  const clearFilters = () => {
    setActive('all')
    setQuery('')
    setMinPrice('')
    setMaxPrice('')
    setOnSaleOnly(false)
    setSort('featured')
  }

  const filtered = useMemo(() => {
    let result = active === 'all' ? products : products.filter((p) => p.category === active)

    const q = query.trim().toLowerCase()
    if (q) {
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.material.toLowerCase().includes(q),
      )
    }

    if (minPrice !== '') {
      result = result.filter((p) => p.price >= Number(minPrice))
    }
    if (maxPrice !== '') {
      result = result.filter((p) => p.price <= Number(maxPrice))
    }

    if (onSaleOnly) {
      result = result.filter((p) => p.offerPrice && p.offerPrice < p.price)
    }

    result = [...result]
    if (sort === 'price-asc') {
      result.sort((a, b) => (a.offerPrice || a.price) - (b.offerPrice || b.price))
    } else if (sort === 'price-desc') {
      result.sort((a, b) => (b.offerPrice || b.price) - (a.offerPrice || a.price))
    } else if (sort === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name))
    } else {
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }

    return result
  }, [products, active, query, minPrice, maxPrice, onSaleOnly, sort])

  return (
    <section className="section products-page">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">The Collection</span>
          <h2>Our Jewelry</h2>
          <p>Each piece is hand-finished in our atelier using ethically sourced materials.</p>
        </div>

        <div className="products-toolbar">
          <div className="products-toolbar-row">
            <div className="products-search">
              <Search size={17} strokeWidth={1.75} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or material..."
                aria-label="Search pieces"
              />
            </div>

            <div className="products-sort">
              <label htmlFor="sort">Sort By</label>
              <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)}>
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="products-toolbar-row products-toolbar-row-wrap">
            <div className="filter-bar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`filter-btn ${active === cat ? 'filter-btn-active' : ''}`}
                  onClick={() => setActive(cat)}
                >
                  {LABELS[cat]}
                </button>
              ))}
            </div>

            <div className="products-price-filter">
              <label>Price</label>
              <input
                type="number"
                min="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder={`${priceBounds.min}`}
                aria-label="Minimum price"
              />
              <span className="products-price-sep">–</span>
              <input
                type="number"
                min="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder={`${priceBounds.max}`}
                aria-label="Maximum price"
              />
            </div>

            <button
              type="button"
              className={`products-chip ${onSaleOnly ? 'products-chip-active' : ''}`}
              onClick={() => setOnSaleOnly((v) => !v)}
            >
              <Tag size={14} strokeWidth={1.75} />
              On Sale
            </button>

            {hasActiveFilters && (
              <button type="button" className="products-clear-btn" onClick={clearFilters}>
                <X size={14} strokeWidth={1.75} />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        <p className="products-results-count">
          {filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'} found
        </p>

        {error ? (
          <p className="empty-state">Couldn't load the collection right now. Please refresh the page.</p>
        ) : filtered.length > 0 ? (
          <div className="product-grid">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : !loading ? (
          <p className="empty-state">No pieces match your filters. Try adjusting your search.</p>
        ) : null}
      </div>
    </section>
  )
}

export default Products
