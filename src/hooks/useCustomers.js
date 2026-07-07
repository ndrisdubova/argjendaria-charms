import { useEffect, useState } from 'react'
import { loadCustomers, subscribe } from '../data/authStore'

export function useCustomers() {
  const [customers, setCustomers] = useState(() => loadCustomers())

  useEffect(() => subscribe(() => setCustomers(loadCustomers())), [])

  return customers
}
