import { useCallback, useEffect, useState } from 'react'
import { loadMaintenance, subscribe } from '../data/maintenanceStore'

export function useMaintenance() {
  const [maintenance, setMaintenance] = useState({ enabled: false })

  const refresh = useCallback(() => {
    loadMaintenance().then(setMaintenance)
  }, [])

  useEffect(() => {
    refresh()
    return subscribe(refresh)
  }, [refresh])

  return maintenance
}
