import { useEffect, useState } from 'react'
import { loadMaintenance, subscribe } from '../data/maintenanceStore'

export function useMaintenance() {
  const [maintenance, setMaintenance] = useState(() => loadMaintenance())

  useEffect(() => subscribe(() => setMaintenance(loadMaintenance())), [])

  return maintenance
}
