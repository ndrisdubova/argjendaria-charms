import { useState } from 'react'
import { X } from 'lucide-react'
import { useProducts } from '../../hooks/useProducts'

function SaleForm({ initial, onSave, onClose }) {
  const { products } = useProducts()
  const [form, setForm] = useState({
    productId: initial.productId,
    grams: String(initial.grams),
    pricePerGram: String(initial.pricePerGram),
    price: String(initial.price),
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const product = products.find((p) => p.id === form.productId)
    if (!product) {
      setError('Please select a product.')
      return
    }
    if (!(Number(form.grams) > 0) || !(Number(form.pricePerGram) > 0) || !(Number(form.price) > 0)) {
      setError('Grams, price per gram and sale price must all be greater than zero.')
      return
    }
    onSave({
      productId: product.id,
      productName: product.name,
      grams: Number(form.grams),
      pricePerGram: Number(form.pricePerGram),
      price: Number(form.price),
    })
  }

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <form className="admin-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className="admin-modal-head">
          <h2>Edit Sales</h2>
          <button type="button" className="admin-modal-close" onClick={onClose} aria-label="Close">
            <X size={20} strokeWidth={1.75} />
          </button>
        </div>

        <div className="form-field">
          <label htmlFor="edit-productId">Product</label>
          <select id="edit-productId" name="productId" value={form.productId} onChange={handleChange}>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="admin-form-row">
          <div className="form-field">
            <label htmlFor="edit-grams">Grams</label>
            <input id="edit-grams" name="grams" type="number" min="0" step="0.01" value={form.grams} onChange={handleChange} />
          </div>

          <div className="form-field">
            <label htmlFor="edit-pricePerGram">Price per Gram</label>
            <div className="currency-input">
              <span className="currency-symbol">$</span>
              <input id="edit-pricePerGram" name="pricePerGram" type="number" min="0" step="0.01" value={form.pricePerGram} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="edit-price">Sale Price</label>
          <div className="currency-input">
            <span className="currency-symbol">$</span>
            <input id="edit-price" name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} />
          </div>
        </div>

        {error && <span className="form-error">{error}</span>}

        <div className="admin-modal-actions">
          <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-solid">Save Changes</button>
        </div>
      </form>
    </div>
  )
}

export default SaleForm
