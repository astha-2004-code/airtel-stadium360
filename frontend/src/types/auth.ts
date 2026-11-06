/**
 * Airtel Stadium360 - Authentication & User Types
 */

export type UserRole = 'NETWORK_ADMIN' | 'TELECOM_ENGINEER' | 'EXECUTIVE_VIEWER'

export interface User {
  id: number
  email: string
  full_name: string
  role: UserRole
  department: string
  phone?: string
  is_active: boolean
  is_superuser: boolean
  created_at: string
  last_login?: string
}

export interface RolePermissions {
  canManageUsers: boolean
  canApproveBudgets: boolean
  canModifyNetworkConfig: boolean
  canExecuteSimulations: boolean
  canRunOptimizer: boolean
  canViewDashboards: boolean
  canDownloadReports: boolean
  isReadOnly: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  full_name: string
  role?: UserRole
  department?: string
  phone?: string
  institution?: string
  designation?: string
}

export interface UserStatusUpdate {
  is_active: boolean
}

export interface AuthToken {
  access_token: string
  token_type: string
  user: User
}

export interface DemoAccount {
  email: string
  full_name: string
  role: UserRole
  department: string
  description: string
}
