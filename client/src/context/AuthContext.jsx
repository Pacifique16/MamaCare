import { createContext, useContext, useState } from 'react'
import { authApi } from '../api/services'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('mamacare_user')
    return saved ? JSON.parse(saved) : null
  })

  const login = async (email, password) => {
    try {
      const res = await authApi.login({ email, password })
      const loggedIn = res.data
      setUser(loggedIn)
      localStorage.setItem('mamacare_user', JSON.stringify(loggedIn))
      return { success: true, user: loggedIn }
    } catch (err) {
      const msg = err.response?.data?.error || 'Invalid email or password'
      return { success: false, error: msg }
    }
  }

  const register = (newUser) => {
    setUser(newUser)
    localStorage.setItem('mamacare_user', JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('mamacare_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
