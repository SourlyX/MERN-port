import { createContext, useState, useEffect } from 'react'
import { fetchUserData } from '../api/users'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem('user')
      if (!storedUser) return

      try {
        const freshUser = await fetchUserData()
        setUser(freshUser)
        setIsAuthenticated(true)
        localStorage.setItem('user', JSON.stringify(freshUser))
        console.log('✅ Data cargada desde servidor')
      } catch (err) {
        console.error('Error cargando data:', err)
        localStorage.removeItem('user')
        localStorage.removeItem('accessToken')
      }
    }

    initAuth()
  }, [])

  const updateUser = (updatedUser) => {
    setUser(updatedUser)
    setIsAuthenticated(true)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}