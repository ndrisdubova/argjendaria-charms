import { useCallback, useEffect, useState } from 'react'
import { loadProducts, saveProducts, subscribe, makeId } from '../data/productsStore'

export function useProducts() {
  const [products, setProducts] = useState(() => loadProducts())

  useEffect(() => subscribe(() => setProducts(loadProducts())), [])

  const addProduct = useCallback((product) => {
    const next = [...loadProducts(), { ...product, id: makeId() }]
    saveProducts(next)
  }, [])

  const updateProduct = useCallback((id, updates) => {
    const next = loadProducts().map((p) => (p.id === id ? { ...p, ...updates } : p))
    saveProducts(next)
  }, [])

  const deleteProduct = useCallback((id) => {
    const next = loadProducts().filter((p) => p.id !== id)
    saveProducts(next)
  }, [])

  return { products, addProduct, updateProduct, deleteProduct }
}
