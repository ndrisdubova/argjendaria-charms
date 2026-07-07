import { useCallback, useEffect, useState } from 'react'
import { listCustomers, subscribe } from '../data/authStore'

export function useCustomers() {
  const [customers, setCustomers] = useState([])

  const refresh = useCallback(() => {
    listCustomers().then(setCustomers)
  }, [])

  useEffect(() => {
    refresh()
    return subscribe(refresh)
  }, [refresh])

  return customers
}
