import { useCallback, useEffect, useState } from 'react'
import { loadProducts, addProduct, updateProduct, deleteProduct, subscribe } from '../data/productsStore'

export function useProducts() {
  const [products, setProducts] = useState([])

  const refresh = useCallback(() => {
    loadProducts().then(setProducts)
  }, [])

  useEffect(() => {
    refresh()
    return subscribe(refresh)
  }, [refresh])

  return { products, addProduct, updateProduct, deleteProduct }
}
