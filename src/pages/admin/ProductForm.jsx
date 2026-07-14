import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import ImageInput from './ImageInput'
import { resolveProductImage } from '../../data/images'

const CATEGORY_OPTIONS = ['ring', 'necklace', 'earrings', 'bracelet']
const MAX_GALLERY = 5

const EMPTY = {
  name: '',
  category: 'ring',
  price: '',
  offerPrice: '',
  stock: '10',
  material: '',
  description: '',
  featured: false,
  personalizable: false,
  image: '',
  gallery: [],
  sizes: [],
}

function ProductForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(() => {
    if (!initial) return EMPTY
    return {
      ...EMPTY,
      ...initial,
      stock: Number.isFinite(initial.stock) ? String(initial.stock) : EMPTY.stock,
      image: initial.image || resolveProductImage(initial),
      gallery: initial.gallery || [],
    }
  })
  const [error, setError] = useState('')
  const [sizeInput, setSizeInput] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const setImage = (value) => setForm((f) => ({ ...f, image: value }))

  const setGalleryAt = (index, value) => {
    setForm((f) => {
      const gallery = [...f.gallery]
      gallery[index] = value
      return { ...f, gallery }
    })
  }

  const addGallerySlot = () => {
    setForm((f) => (f.gallery.length >= MAX_GALLERY ? f : { ...f, gallery: [...f.gallery, ''] }))
  }

  const removeGallerySlot = (index) => {
    setForm((f) => ({ ...f, gallery: f.gallery.filter((_, i) => i !== index) }))
  }

  const addSize = () => {
    const value = sizeInput.trim()
    if (!value || form.sizes.includes(value)) {
      setSizeInput('')
      return
    }
    setForm((f) => ({ ...f, sizes: [...f.sizes, value] }))
    setSizeInput('')
  }

  const handleSizeKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSize()
    }
  }

  const removeSize = (size) => {
    setForm((f) => ({ ...f, sizes: f.sizes.filter((s) => s !== size) }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.material.trim() || !form.price) {
      setError('Name, material and price are required.')
      return
    }
    if (!form.image) {
      setError('A main image is required.')
      return
    }
    const pendingSize = sizeInput.trim()
    const allSizes = pendingSize && !form.sizes.includes(pendingSize) ? [...form.sizes, pendingSize] : form.sizes

    onSave({
      ...form,
      price: Number(form.price),
      offerPrice: form.offerPrice ? Number(form.offerPrice) : undefined,
      stock: Math.max(0, Number(form.stock) || 0),
      gallery: form.gallery.filter(Boolean).slice(0, MAX_GALLERY),
      sizes: form.category === 'ring' ? allSizes : [],
    })
  }

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <form className="admin-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className="admin-modal-head">
          <h2>{initial ? 'Edit Piece' : 'Add New Piece'}</h2>
          <button type="button" className="admin-modal-close" onClick={onClose} aria-label="Close">
            <X size={20} strokeWidth={1.75} />
          </button>
        </div>

        <div className="form-field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Éclat Solitaire Ring" />
        </div>

        <div className="admin-form-row">
          <div className="form-field">
            <label htmlFor="category">Category</label>
            <select id="category" name="category" value={form.category} onChange={handleChange}>
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="material">Material</label>
            <input id="material" name="material" value={form.material} onChange={handleChange} placeholder="18k Gold · Diamond" />
          </div>
        </div>

        <div className="admin-form-row">
          <div className="form-field">
            <label htmlFor="price">Price (USD)</label>
            <div className="currency-input">
              <span className="currency-symbol">$</span>
              <input id="price" name="price" type="number" min="0" step="1" value={form.price} onChange={handleChange} placeholder="1200" />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="offerPrice">Offer Price (optional)</label>
            <div className="currency-input">
              <span className="currency-symbol">$</span>
              <input id="offerPrice" name="offerPrice" type="number" min="0" step="1" value={form.offerPrice} onChange={handleChange} placeholder="None" />
            </div>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="stock">Stock (units available)</label>
          <input id="stock" name="stock" type="number" min="0" step="1" value={form.stock} onChange={handleChange} placeholder="10" />
        </div>

        {form.category === 'ring' && (
          <div className="form-field">
            <label>Available Sizes</label>

            {form.sizes.length > 0 && (
              <div className="admin-size-picker">
                {form.sizes.map((size) => (
                  <span className="admin-size-chip admin-size-chip-active admin-size-chip-removable" key={size}>
                    {size}
                    <button type="button" onClick={() => removeSize(size)} aria-label={`Remove size ${size}`}>
                      <X size={12} strokeWidth={2} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="admin-size-add-row">
              <input
                type="text"
                value={sizeInput}
                onChange={(e) => setSizeInput(e.target.value)}
                onKeyDown={handleSizeKeyDown}
                placeholder="e.g. 7 or 7.5"
              />
              <button type="button" className="admin-link-btn" onClick={addSize}>
                <Plus size={14} strokeWidth={1.75} />
                Add Size
              </button>
            </div>
          </div>
        )}

        <div className="form-field">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" rows={3} value={form.description} onChange={handleChange} placeholder="Short product description..." />
        </div>

        <ImageInput label="Main Image" required value={form.image} onChange={setImage} />

        <div className="form-field">
          <label>Additional Photos (optional, up to {MAX_GALLERY})</label>
          <div className="gallery-slots">
            {form.gallery.map((img, i) => (
              <ImageInput
                key={i}
                value={img}
                onChange={(v) => setGalleryAt(i, v)}
                onRemove={() => removeGallerySlot(i)}
              />
            ))}
          </div>
          {form.gallery.length < MAX_GALLERY && (
            <button type="button" className="admin-link-btn" onClick={addGallerySlot}>
              <Plus size={14} strokeWidth={1.75} />
              Add Photo
            </button>
          )}
        </div>

        <label className="admin-checkbox">
          <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
          Feature on homepage
        </label>

        <label className="admin-checkbox">
          <input type="checkbox" name="personalizable" checked={form.personalizable} onChange={handleChange} />
          Personalizable — let customers choose engraving text and font
        </label>

        {error && <span className="form-error">{error}</span>}

        <div className="admin-modal-actions">
          <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-solid">{initial ? 'Save Changes' : 'Add Piece'}</button>
        </div>
      </form>
    </div>
  )
}

export default ProductForm
