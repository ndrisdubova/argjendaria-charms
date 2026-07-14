import { useState } from 'react'
import { Heart, TreePine, PartyPopper, Flower2, Plus, X } from 'lucide-react'
import { useHolidays } from '../../hooks/useHolidays'
import { useProducts } from '../../hooks/useProducts'
import { resolveProductImage } from '../../data/images'

const ICONS = {
  valentines: Heart,
  christmas: TreePine,
  newyears: PartyPopper,
  mothersday: Flower2,
}

function HolidayCard({ holidayKey, label, holiday, products, onToggle, onAdd, onRemove }) {
  const Icon = ICONS[holidayKey]
  const [selected, setSelected] = useState('')
  const assignedProducts = holiday.productIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean)
  const availableProducts = products.filter((p) => !holiday.productIds.includes(p.id))

  const handleAdd = () => {
    if (!selected) return
    onAdd(holidayKey, selected)
    setSelected('')
  }

  return (
    <div className="admin-panel holiday-card">
      <div className="holiday-card-head">
        <h2><Icon size={18} strokeWidth={1.75} /> {label}</h2>
        <button
          type="button"
          className={`holiday-toggle ${holiday.enabled ? 'holiday-toggle-on' : ''}`}
          role="switch"
          aria-checked={holiday.enabled}
          aria-label={`${holiday.enabled ? 'Disable' : 'Enable'} ${label}`}
          onClick={() => onToggle(holidayKey)}
        >
          <span className="holiday-toggle-knob" />
        </button>
      </div>

      <p className="admin-settings-desc">
        {holiday.enabled
          ? `${label} is live — its collection shows on the homepage.`
          : `${label} is hidden from the site right now.`}
      </p>

      <div className="holiday-add-row">
        <select value={selected} onChange={(e) => setSelected(e.target.value)}>
          <option value="">Select a piece to add...</option>
          {availableProducts.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <button type="button" className="admin-link-btn" onClick={handleAdd} disabled={!selected}>
          <Plus size={14} strokeWidth={1.75} />
          Add
        </button>
      </div>

      {assignedProducts.length > 0 ? (
        <ul className="holiday-product-list">
          {assignedProducts.map((p) => (
            <li key={p.id}>
              <img src={resolveProductImage(p)} alt="" className="admin-table-thumb" loading="lazy" />
              <span className="holiday-product-name">{p.name}</span>
              <button type="button" className="admin-link-btn admin-link-danger" onClick={() => onRemove(holidayKey, p.id)}>
                <X size={13} strokeWidth={1.75} />
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="holiday-empty">No pieces added yet.</p>
      )}
    </div>
  )
}

function AdminHolidays() {
  const { holidays, error, toggleHoliday, addProductToHoliday, removeProductFromHoliday, HOLIDAY_DEFS } = useHolidays()
  const { products } = useProducts()

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <h1>Holiday Collections</h1>
        <p>Toggle a holiday on to feature it on the homepage, and choose which pieces belong to it.</p>
      </div>

      {error && (
        <div className="admin-panel admin-error-banner" role="alert">
          Couldn’t reach the holidays database. Your changes may not have saved — please try again.
        </div>
      )}

      <div className="holiday-cards">
        {HOLIDAY_DEFS.map(({ key, label }) => (
          <HolidayCard
            key={key}
            holidayKey={key}
            label={label}
            holiday={holidays[key]}
            products={products}
            onToggle={toggleHoliday}
            onAdd={addProductToHoliday}
            onRemove={removeProductFromHoliday}
          />
        ))}
      </div>
    </div>
  )
}

export default AdminHolidays
