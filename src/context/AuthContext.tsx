import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import axios from 'axios'
import * as authApi from '../api/auth.api'
import { setSessionInvalidationHandler, tokenStorage } from '../api/axiosInstance'
import type { LoginPayload, User } from '../types'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  const invalidateSession = useCallback(() => {
    tokenStorage.clear()
    setUser(null)
  }, [])

  useEffect(() => {
    setSessionInvalidationHandler(invalidateSession)
    return () => setSessionInvalidationHandler(null)
  }, [invalidateSession])

  useEffect(() => {
    let active = true
    async function restoreSession() {
      if (!tokenStorage.get()) {
        setIsInitializing(false)
        return
      }
      try {
        const restoredUser = await authApi.getCurrentUser()
        if (active) setUser(restoredUser)
      } catch (error: unknown) {
        if (active && axios.isAxiosError(error) && error.response?.status === 401) {
          invalidateSession()
        }
      } finally {
        if (active) setIsInitializing(false)
      }
    }
    void restoreSession()
    return () => { active = false }
  }, [invalidateSession])

  const login = useCallback(async (payload: LoginPayload) => {
    const result = await authApi.login(payload)
    tokenStorage.set(result.accessToken)
    setUser(result.user)
    return result.user
  }, [])
  const logout = useCallback(() => invalidateSession(), [invalidateSession])
  const value = useMemo(() => ({
    user, isAuthenticated: user !== null, isInitializing, login, logout, invalidateSession,
  }), [user, isInitializing, login, logout, invalidateSession])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
