/**
 * Airtel Stadium360 - Authentication Context & Provider
 * Provides global user state, token persistence, and role-based permissions (RBAC).
 */
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { User, UserRole, LoginCredentials, RegisterData, RolePermissions } from '../types/auth'
import * as authService from '../services/authService'

export const ROLE_MODULE_PERMISSIONS: Record<UserRole, string[]> = {
  NETWORK_ADMIN: [
    'dashboard',
    'digital-twin',
    'demand-capacity',
    'optimizer',
    'simulator',
    'budget',
    'connectivity',
    'critical-services',
    'auth',
    'reports',
    'evaluation',
  ],
  TELECOM_ENGINEER: [
    'dashboard',
    'digital-twin',
    'demand-capacity',
    'optimizer',
    'simulator',
    'budget',
    'connectivity',
    'critical-services',
    'auth',
    'reports',
    'evaluation',
  ],
  EXECUTIVE_VIEWER: [
    'dashboard',
    'digital-twin',
    'demand-capacity',
    'reports',
    'evaluation',
    'auth',
  ],
}

export const computePermissions = (role: UserRole | null, isSuperuser?: boolean): RolePermissions => {
  if (!role) {
    return {
      canManageUsers: false,
      canApproveBudgets: false,
      canModifyNetworkConfig: false,
      canExecuteSimulations: false,
      canRunOptimizer: false,
      canViewDashboards: false,
      canDownloadReports: false,
      isReadOnly: true,
    }
  }

  const isAdmin = role === 'NETWORK_ADMIN' || !!isSuperuser
  const isEngineer = role === 'TELECOM_ENGINEER' || isAdmin

  return {
    canManageUsers: isAdmin,
    canApproveBudgets: isAdmin,
    canModifyNetworkConfig: isEngineer,
    canExecuteSimulations: isEngineer,
    canRunOptimizer: isEngineer,
    canViewDashboards: true,
    canDownloadReports: true,
    isReadOnly: role === 'EXECUTIVE_VIEWER' && !isSuperuser,
  }
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  role: UserRole | null
  permissions: RolePermissions
  canAccessModule: (moduleId: string) => boolean
  hasPermission: (permission: keyof RolePermissions) => boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  quickSwitchDemo: (email: string) => Promise<void>
  updateUserProfile: (data: Partial<Pick<User, 'full_name' | 'department' | 'phone'>>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const DEMO_CREDENTIALS: Record<string, string> = {
  'admin@airtel.com': 'AirtelNoc@2026',
  'engineer@airtel.com': 'AirtelRf@2026',
  'viewer@airtel.com': 'AirtelSync@2026',
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(authService.getToken())
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Verify stored token on initial load
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = authService.getToken()
      if (storedToken) {
        try {
          const profile = await authService.getProfile()
          setUser(profile)
          setToken(storedToken)
        } catch (err) {
          // Token expired or invalid
          authService.removeToken()
          setUser(null)
          setToken(null)
        }
      } else {
        // Fallback: auto-login as Default RF Planning Engineer for immediate competition demonstration
        try {
          const authData = await authService.login({
            email: 'engineer@airtel.com',
            password: 'AirtelRf@2026',
          })
          setUser(authData.user)
          setToken(authData.access_token)
        } catch (e) {
          // backend offline or database seeding
        }
      }
      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  const permissions = useMemo(() => {
    return computePermissions(user?.role || null, user?.is_superuser)
  }, [user?.role, user?.is_superuser])

  const canAccessModule = (moduleId: string): boolean => {
    if (!user || !user.role) return false
    const allowed = ROLE_MODULE_PERMISSIONS[user.role] || []
    return allowed.includes(moduleId)
  }

  const hasPermission = (permission: keyof RolePermissions): boolean => {
    return !!permissions[permission]
  }

  const handleLogin = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    try {
      const authData = await authService.login(credentials)
      setUser(authData.user)
      setToken(authData.access_token)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (data: RegisterData) => {
    setIsLoading(true)
    try {
      const authData = await authService.register(data)
      setUser(authData.user)
      setToken(authData.access_token)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await authService.logout()
      setUser(null)
      setToken(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickSwitchDemo = async (email: string) => {
    const password = DEMO_CREDENTIALS[email]
    if (!password) {
      throw new Error(`No demo password registered for ${email}`)
    }
    await handleLogin({ email, password })
  }

  const handleUpdateProfile = async (
    data: Partial<Pick<User, 'full_name' | 'department' | 'phone'>>
  ) => {
    const updated = await authService.updateProfile(data)
    setUser(updated)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        role: user?.role || null,
        permissions,
        canAccessModule,
        hasPermission,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        quickSwitchDemo: handleQuickSwitchDemo,
        updateUserProfile: handleUpdateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
