import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useProducts } from '../../hooks/useProducts'
import { resolveProductImage } from '../../data/images'
import { getStock } from '../../data/productsStore'
import ProductForm from './ProductForm'

function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts()
  const [editing, setEditing] = useState(null)
  const [adding, setAdding] = useState(false)

  const handleDelete = (product) => {
    if (window.confirm(`Delete "${product.name}"? This cannot be undone.`)) {
      deleteProduct(product.id)
    }
  }

  const handleSave = (data) => {
    if (editing) {
      updateProduct(editing.id, data)
      setEditing(null)
    } else {
      addProduct(data)
      setAdding(false)
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-head admin-page-head-row">
        <div>
          <h1>Products</h1>
          <p>Add, edit or remove pieces from the collection.</p>
        </div>
        <button type="button" className="btn btn-solid admin-btn-icon" onClick={() => setAdding(true)}>
          <Plus size={16} strokeWidth={2} />
          Add Piece
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Category</th>
              <th>Material</th>
              <th>Price</th>
              <th>Offer</th>
              <th>Stock</th>
              <th>Featured</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  <img className="admin-table-thumb" src={resolveProductImage(p)} alt="" />
                </td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{p.material}</td>
                <td>${Number(p.price).toLocaleString()}</td>
                <td>{p.offerPrice ? `$${Number(p.offerPrice).toLocaleString()}` : '—'}</td>
                <td>{getStock(p) === 0 ? <span className="admin-stock-out">Out of stock</span> : getStock(p)}</td>
                <td>{p.featured ? 'Yes' : '—'}</td>
                <td className="admin-table-actions">
                  <button type="button" className="admin-link-btn" onClick={() => setEditing(p)}>
                    <Pencil size={14} strokeWidth={1.75} />
                    Edit
                  </button>
                  <button type="button" className="admin-link-btn admin-link-danger" onClick={() => handleDelete(p)}>
                    <Trash2 size={14} strokeWidth={1.75} />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={9} className="admin-table-empty">No pieces yet. Add your first one.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {(adding || editing) && (
        <ProductForm
          initial={editing}
          onSave={handleSave}
          onClose={() => {
            setAdding(false)
            setEditing(null)
          }}
        />
      )}
    </div>
  )
}

export default AdminProducts
