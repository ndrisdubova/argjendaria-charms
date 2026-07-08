import { useCallback, useEffect, useState } from 'react'
import { loadProducts, addProduct, updateProduct, deleteProduct, subscribe } from '../data/productsStore'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(() => {
    loadProducts()
      .then((data) => {
        setProducts(data)
        setError(null)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load products:', err)
        setError(err)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    refresh()
    return subscribe(refresh)
  }, [refresh])

  return { products, loading, error, addProduct, updateProduct, deleteProduct }
}
