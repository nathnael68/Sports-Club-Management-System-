import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import api from './client'

interface User {
  id: number
  email: string
  full_name: string
  role: string
  is_active: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: (idToken: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try { return JSON.parse(storedUser) } catch (e) {}
    }
    return null
  })

  useEffect(() => {
    // Optionally keep this to sync changes across tabs, though not strictly required
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)) } catch (e) {}
    } else {
      setUser(null)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const form = new FormData()
    form.append('username', email)
    form.append('password', password)
    const response = await api.post('/auth/login', form)
    const { access_token } = response.data
    localStorage.setItem('token', access_token)
    
    const me = await api.get('/auth/me')
    localStorage.setItem('user', JSON.stringify(me.data))
    setUser(me.data)
  }

  const loginWithGoogle = async (idToken: string) => {
    const response = await api.post('/auth/google', { id_token: idToken })
    const { access_token } = response.data
    localStorage.setItem('token', access_token)

    const me = await api.get('/auth/me')
    localStorage.setItem('user', JSON.stringify(me.data))
    setUser(me.data)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
