import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import axios from 'axios'
import * as authApi from '../api/auth.api'
import { setSessionInvalidationHandler, tokenStorage } from '../api/axiosInstance'
import type { LoginPayload, User } from '../types'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const [sessionRestoreError, setSessionRestoreError] = useState(false)
  const restorePromiseRef = useRef<Promise<void> | null>(null)

  const invalidateSession = useCallback(() => {
    tokenStorage.clear()
    setUser(null)
    setSessionRestoreError(false)
  }, [])

  useEffect(() => {
    setSessionInvalidationHandler(invalidateSession)
    return () => setSessionInvalidationHandler(null)
  }, [invalidateSession])

  const restoreSession = useCallback(() => {
    if (restorePromiseRef.current) return restorePromiseRef.current

    const restorePromise = (async () => {
      setIsInitializing(true)
      try {
        if (!tokenStorage.get()) {
          setUser(null)
          setSessionRestoreError(false)
          return
        }
        const restoredUser = await authApi.getCurrentUser()
        setUser(restoredUser)
        setSessionRestoreError(false)
      } catch (error: unknown) {
        setUser(null)
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          invalidateSession()
        } else {
          setSessionRestoreError(true)
        }
      } finally {
        setIsInitializing(false)
      }
    })()

    restorePromiseRef.current = restorePromise
    void restorePromise.finally(() => {
      if (restorePromiseRef.current === restorePromise) restorePromiseRef.current = null
    })
    return restorePromise
  }, [invalidateSession])

  useEffect(() => { void restoreSession() }, [restoreSession])

  const login = useCallback(async (payload: LoginPayload) => {
    const result = await authApi.login(payload)
    tokenStorage.set(result.accessToken)
    setUser(result.user)
    setSessionRestoreError(false)
    return result.user
  }, [])
  const logout = useCallback(() => invalidateSession(), [invalidateSession])
  const value = useMemo(() => ({
    user, isAuthenticated: user !== null, isInitializing, sessionRestoreError,
    login, logout, invalidateSession, retrySession: restoreSession,
  }), [user, isInitializing, sessionRestoreError, login, logout, invalidateSession, restoreSession])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
