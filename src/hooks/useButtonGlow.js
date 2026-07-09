import { useEffect, useRef } from 'react'

export function useButtonGlow() {
  const pending = useRef({ x: 0, y: 0 })
  const activeBtn = useRef(null)
  const scheduled = useRef(false)

  useEffect(() => {
    const onMove = (e) => {
      const btn = e.target.closest?.('.btn')
      activeBtn.current = btn || null
      if (!btn) return
      pending.current.x = e.clientX
      pending.current.y = e.clientY
      if (scheduled.current) return
      scheduled.current = true
      requestAnimationFrame(() => {
        scheduled.current = false
        const b = activeBtn.current
        if (!b) return
        const rect = b.getBoundingClientRect()
        b.style.setProperty('--mx', `${((pending.current.x - rect.left) / rect.width) * 100}%`)
        b.style.setProperty('--my', `${((pending.current.y - rect.top) / rect.height) * 100}%`)
      })
    }
    document.addEventListener('pointermove', onMove, { passive: true })
    return () => document.removeEventListener('pointermove', onMove)
  }, [])
}
