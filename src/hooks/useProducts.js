import { useCallback, useEffect, useState } from 'react'
import { loadProducts, addProduct, updateProduct, deleteProduct, subscribe } from '../data/productsStore'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(() => {
    loadProducts().then((data) => {
      setProducts(data)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    refresh()
    return subscribe(refresh)
  }, [refresh])

  return { products, loading, addProduct, updateProduct, deleteProduct }
}
