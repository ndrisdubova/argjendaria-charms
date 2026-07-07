import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { CheckCircle2, Trash2, Pencil, Scale, Coins, Receipt, History } from 'lucide-react'
import { useProducts } from '../../hooks/useProducts'
import { useSales } from '../../hooks/useSales'
import SaleForm from './SaleForm'
import SalesHistoryList from './SalesHistoryList'
import { requirePassword, formatMoney, formatGrams, formatTime } from './salesUtils'
import '../Contact.css'

const EMPTY = { productId: '', grams: '', pricePerGram: '', price: '' }

function AdminSalesManager() {
  const { products } = useProducts()
  const { addSale, updateSale, deleteSale, todaySales, todayTotals, history } = useSales()
  const [form, setForm] = useState(EMPTY)
  const [priceTouched, setPriceTouched] = useState(false)
  const [error, setError] = useState('')
  const [successPhase, setSuccessPhase] = useState('idle')
  const [expandedDay, setExpandedDay] = useState(null)
  const [editingSale, setEditingSale] = useState(null)
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setError('')

    if (name === 'price') {
      setPriceTouched(true)
      setForm((f) => ({ ...f, price: value }))
      return
    }

    setForm((f) => {
      const next = { ...f, [name]: value }
      if (!priceTouched && next.grams && next.pricePerGram) {
        const computed = Number(next.grams) * Number(next.pricePerGram)
        next.price = Number.isFinite(computed) ? computed.toFixed(2) : f.price
      }
      return next
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const product = products.find((p) => p.id === form.productId)
    if (!product) {
      setError('Please select a product.')
      return
    }
    if (!(Number(form.grams) > 0)) {
      setError('Please enter the grams sold.')
      return
    }
    if (!(Number(form.pricePerGram) > 0)) {
      setError('Please enter the price per gram.')
      return
    }
    if (!(Number(form.price) > 0)) {
      setError('Please enter the sale price.')
      return
    }

    addSale({
      productId: product.id,
      productName: product.name,
      grams: Number(form.grams),
      pricePerGram: Number(form.pricePerGram),
      price: Number(form.price),
    })

    setForm(EMPTY)
    setPriceTouched(false)
    setSuccessPhase('in')
    timers.current.forEach(clearTimeout)
    timers.current = [
      setTimeout(() => setSuccessPhase('out'), 3000),
      setTimeout(() => setSuccessPhase('idle'), 3400),
    ]
  }

  const handleDelete = (sale) => {
    if (!requirePassword()) return
    if (window.confirm(`Delete the sale of "${sale.productName}"? This cannot be undone.`)) {
      deleteSale(sale.id)
    }
  }

  const handleEditClick = (sale) => {
    if (!requirePassword()) return
    setEditingSale(sale)
  }

  const handleSaveEdit = (data) => {
    updateSale(editingSale.id, data)
    setEditingSale(null)
  }

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <h1>Sales Manager</h1>
        <p>Record a sale, then track today's totals and past days below.</p>
      </div>

      <div className="admin-panel sales-form-panel">
        <h2><Receipt size={18} strokeWidth={1.75} /> Record a Sale</h2>

        {successPhase !== 'idle' && (
          <div className={`form-success ${successPhase === 'out' ? 'form-success-out' : ''}`} role="status">
            <span className="form-success-icon">
              <CheckCircle2 size={20} strokeWidth={1.75} />
            </span>
            <span>Sale recorded successfully.</span>
          </div>
        )}

        <form className="sales-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="productId">Product</label>
            <select id="productId" name="productId" value={form.productId} onChange={handleChange}>
              <option value="">Select a piece...</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="grams"><Scale size={13} strokeWidth={1.75} /> Grams</label>
            <input id="grams" name="grams" type="number" min="0" step="0.01" value={form.grams} onChange={handleChange} placeholder="e.g. 4.5" />
          </div>

          <div className="form-field">
            <label htmlFor="pricePerGram"><Coins size={13} strokeWidth={1.75} /> Price per Gram</label>
            <div className="currency-input">
              <span className="currency-symbol">$</span>
              <input id="pricePerGram" name="pricePerGram" type="number" min="0" step="0.01" value={form.pricePerGram} onChange={handleChange} placeholder="0.00" />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="price">Sale Price</label>
            <div className="currency-input">
              <span className="currency-symbol">$</span>
              <input id="price" name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} placeholder="0.00" />
            </div>
          </div>

          {error && <span className="form-error">{error}</span>}

          <button type="submit" className="btn btn-solid sales-submit">Record Sale</button>
        </form>
      </div>

      <div className="admin-stats">
        <div className="admin-stat">
          <span className="admin-stat-value">{todayTotals.count}</span>
          <span className="admin-stat-label">Sales Today</span>
        </div>
        <div className="admin-stat">
          <span className="admin-stat-value">{formatGrams(todayTotals.grams)}</span>
          <span className="admin-stat-label">Grams Sold Today</span>
        </div>
        <div className="admin-stat">
          <span className="admin-stat-value">{formatMoney(todayTotals.revenue)}</span>
          <span className="admin-stat-label">Revenue Today</span>
        </div>
      </div>

      <div className="admin-panel">
        <h2>Today's Sales</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Product</th>
                <th>Grams</th>
                <th>Price / Gram</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {todaySales.map((s) => (
                <tr key={s.id}>
                  <td>{formatTime(s.date)}</td>
                  <td>{s.productName}</td>
                  <td>{formatGrams(s.grams)}</td>
                  <td>{formatMoney(s.pricePerGram)}</td>
                  <td>{formatMoney(s.price)}</td>
                  <td className="admin-table-actions">
                    <button type="button" className="admin-link-btn" onClick={() => handleEditClick(s)}>
                      <Pencil size={14} strokeWidth={1.75} />
                      Edit
                    </button>
                    <button type="button" className="admin-link-btn admin-link-danger" onClick={() => handleDelete(s)}>
                      <Trash2 size={14} strokeWidth={1.75} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {todaySales.length === 0 && (
                <tr>
                  <td colSpan={6} className="admin-table-empty">No sales recorded yet today.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-panel">
        <h2><History size={18} strokeWidth={1.75} /> Sales History</h2>
        <SalesHistoryList
          days={history.slice(0, 5)}
          expandedDay={expandedDay}
          onToggle={(day) => setExpandedDay((d) => (d === day ? null : day))}
          onEdit={handleEditClick}
          onDelete={handleDelete}
          emptyMessage="No past sales history yet — it appears here after midnight."
        />
        <Link to="/admin/sales-history" className="btn btn-outline admin-panel-cta">View Full History</Link>
      </div>

      {editingSale && (
        <SaleForm
          initial={editingSale}
          onSave={handleSaveEdit}
          onClose={() => setEditingSale(null)}
        />
      )}
    </div>
  )
}

export default AdminSalesManager
