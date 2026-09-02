import { createContext } from 'react'
import type { LoginPayload, User } from '../types'

export interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isInitializing: boolean
  sessionRestoreError: boolean
  login: (payload: LoginPayload) => Promise<User>
  logout: () => void
  invalidateSession: () => void
  retrySession: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
