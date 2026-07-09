import { useEffect } from 'react'

export function useButtonGlow() {
  useEffect(() => {
    const onMove = (e) => {
      const btn = e.target.closest?.('.btn')
      if (!btn) return
      const rect = btn.getBoundingClientRect()
      btn.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`)
      btn.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`)
    }
    document.addEventListener('pointermove', onMove)
    return () => document.removeEventListener('pointermove', onMove)
  }, [])
}
