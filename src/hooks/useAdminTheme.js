import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'charms_admin_theme'
const EVENT_NAME = 'charms-admin-theme-changed'

function readTheme() {
  return localStorage.getItem(STORAGE_KEY) || 'dark'
}

function writeTheme(theme) {
  localStorage.setItem(STORAGE_KEY, theme)
  window.dispatchEvent(new CustomEvent(EVENT_NAME))
}

export function useAdminTheme() {
  const [theme, setThemeState] = useState(() => readTheme())

  useEffect(() => {
    const handler = () => setThemeState(readTheme())
    window.addEventListener(EVENT_NAME, handler)
    window.addEventListener('storage', handler)
    return () => {
      window.removeEventListener(EVENT_NAME, handler)
      window.removeEventListener('storage', handler)
    }
  }, [])

  const setTheme = useCallback((next) => writeTheme(next), [])

  return [theme, setTheme]
}
