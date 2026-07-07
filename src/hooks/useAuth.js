import { useCallback, useEffect, useState } from 'react'
import {
  loadCustomers,
  getSession,
  subscribe,
  signup as signupApi,
  login as loginApi,
  logout as logoutApi,
  resetPassword as resetPasswordApi,
  changePassword as changePasswordApi,
} from '../data/authStore'

export function useAuth() {
  const [sessionId, setSessionId] = useState(() => getSession())

  useEffect(() => subscribe(() => setSessionId(getSession())), [])

  const currentUser = sessionId ? loadCustomers().find((c) => c.id === sessionId) || null : null

  const signup = useCallback((data) => signupApi(data), [])
  const login = useCallback((email, password) => loginApi(email, password), [])
  const logout = useCallback(() => logoutApi(), [])
  const resetPassword = useCallback((email, newPassword) => resetPasswordApi(email, newPassword), [])
  const changePassword = useCallback(
    (currentPassword, newPassword) => changePasswordApi(currentUser?.id, currentPassword, newPassword),
    [currentUser],
  )

  return { currentUser, isLoggedIn: !!currentUser, signup, login, logout, resetPassword, changePassword }
}
