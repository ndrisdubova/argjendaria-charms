import { useEffect, useRef } from 'react'

export function useButtonGlow() {
  const pending = useRef(null)
  const activeBtn = useRef(null)

  useEffect(() => {
    const onMove = (e) => {
      const btn = e.target.closest?.('.btn')
      activeBtn.current = btn || null
      if (!btn) return
      pending.current = { x: e.clientX, y: e.clientY }
      if (pending.current.scheduled) return
      pending.current.scheduled = true
      requestAnimationFrame(() => {
        const b = activeBtn.current
        const p = pending.current
        if (!b || !p) return
        p.scheduled = false
        const rect = b.getBoundingClientRect()
        b.style.setProperty('--mx', `${((p.x - rect.left) / rect.width) * 100}%`)
        b.style.setProperty('--my', `${((p.y - rect.top) / rect.height) * 100}%`)
      })
    }
    document.addEventListener('pointermove', onMove, { passive: true })
    return () => document.removeEventListener('pointermove', onMove)
  }, [])
}
