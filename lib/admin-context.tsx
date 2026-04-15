'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// 관리자 코드 - 실제 환경에서는 환경 변수나 서버에서 관리해야 합니다
const ADMIN_CODE = 'ADMIN2024'

interface AdminContextType {
  isAdmin: boolean
  login: (code: string) => boolean
  logout: () => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

const ADMIN_SESSION_KEY = 'valorant_admin_session'

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // 세션 복원
    const session = localStorage.getItem(ADMIN_SESSION_KEY)
    if (session === 'authenticated') {
      setIsAdmin(true)
    }
  }, [])

  const login = (code: string): boolean => {
    if (code === ADMIN_CODE) {
      setIsAdmin(true)
      localStorage.setItem(ADMIN_SESSION_KEY, 'authenticated')
      return true
    }
    return false
  }

  const logout = () => {
    setIsAdmin(false)
    localStorage.removeItem(ADMIN_SESSION_KEY)
  }

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider')
  }
  return context
}
