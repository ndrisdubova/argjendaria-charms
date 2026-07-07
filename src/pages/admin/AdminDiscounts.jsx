import { useState } from 'react'
import { Save, X } from 'lucide-react'
import { useProducts } from '../../hooks/useProducts'
import { useDiscounts } from '../../hooks/useDiscounts'
import { resolveProductImage } from '../../data/images'
import { getDiscountedPrice, formatDiscountedPrice } from '../../data/discountsStore'

function AdminDiscounts() {
  const { products } = useProducts()
  const { discounts, setDiscount, removeDiscount } = useDiscounts()
  const [drafts, setDrafts] = useState({})

  const draftFor = (id) => (drafts[id] !== undefined ? drafts[id] : String(discounts[id] || ''))

  const handleChange = (id, value) => {
    setDrafts((d) => ({ ...d, [id]: value }))
  }

  const clearDraft = (id) => {
    setDrafts((d) => {
      const next = { ...d }
      delete next[id]
      return next
    })
  }

  const handleSave = (id) => {
    const percent = Math.min(90, Math.max(0, Number(draftFor(id)) || 0))
    setDiscount(id, percent)
    clearDraft(id)
  }

  const handleRemove = (id) => {
    removeDiscount(id)
    clearDraft(id)
  }

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <h1>Discounts</h1>
        <p>
          Set a percent-off discount per piece. Pieces with an active discount show a banner (e.g.
          "20% Off") on the Products page and their product detail page, alongside the reduced price.
        </p>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Discounted Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const active = discounts[p.id] || 0
              const draft = draftFor(p.id)
              const previewPercent = Math.min(90, Math.max(0, Number(draft) || 0))
              return (
                <tr key={p.id}>
                  <td>
                    <img className="admin-table-thumb" src={resolveProductImage(p)} alt="" />
                  </td>
                  <td>{p.name}</td>
                  <td>${Number(p.price).toLocaleString()}</td>
                  <td>
                    <div className="discount-input-wrap">
                      <input
                        className="discount-input"
                        type="number"
                        min="0"
                        max="90"
                        step="1"
                        value={draft}
                        onChange={(e) => handleChange(p.id, e.target.value)}
                        placeholder="0"
                      />
                      <span className="discount-input-suffix">%</span>
                    </div>
                  </td>
                  <td>{previewPercent > 0 ? `$${formatDiscountedPrice(getDiscountedPrice(p.price, previewPercent))}` : '—'}</td>
                  <td className="admin-table-actions">
                    <button type="button" className="admin-link-btn" onClick={() => handleSave(p.id)}>
                      <Save size={14} strokeWidth={1.75} />
                      Save
                    </button>
                    {active > 0 && (
                      <button type="button" className="admin-link-btn admin-link-danger" onClick={() => handleRemove(p.id)}>
                        <X size={14} strokeWidth={1.75} />
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="admin-table-empty">No pieces yet. Add one from Products first.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminDiscounts
