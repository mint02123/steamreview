import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import { API_BASE_URL } from '../config'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('patch_lens_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMe = async () => {
      if (!token) {
        setUser(null)
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to load user')
        }

        const data = await response.json()
        setUser(data)
      } catch (error) {
        console.warn('Auth restore failed:', error)
        localStorage.removeItem('patch_lens_token')
        setToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    loadMe()
  }, [token])

  const login = async ({ email, password }) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || '로그인에 실패했습니다.')
    }

    const data = await response.json()

    localStorage.setItem('patch_lens_token', data.access_token)
    setToken(data.access_token)
    setUser(data.user)

    return data
  }

  const signup = async ({ email, password, nickname }) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, nickname }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || '회원가입에 실패했습니다.')
    }

    const data = await response.json()

    localStorage.setItem('patch_lens_token', data.access_token)
    setToken(data.access_token)
    setUser(data.user)

    return data
  }

  const logout = () => {
    localStorage.removeItem('patch_lens_token')
    setToken(null)
    setUser(null)
  }

  const value = useMemo(() => ({
    user,
    token,
    loading,
    isAuthenticated: Boolean(user && token),
    login,
    signup,
    logout,
  }), [user, token, loading])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}