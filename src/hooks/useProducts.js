import { useCallback, useEffect, useState } from 'react'
import { loadProducts, addProduct, updateProduct, deleteProduct, subscribe, getCachedProducts } from '../data/productsStore'

export function useProducts() {
  const cached = getCachedProducts()
  const [products, setProducts] = useState(cached || [])
  const [loading, setLoading] = useState(cached === null)
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
