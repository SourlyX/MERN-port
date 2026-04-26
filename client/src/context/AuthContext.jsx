import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem('user')
      const token = localStorage.getItem('accessToken')

      if (storedUser && token) {
        // Tiene todo, sesión válida
        setUser(JSON.parse(storedUser))
        setIsAuthenticated(true)
      } else if (storedUser) {
        // Tiene user pero no token → intentar refresh
        try {
          const res = await fetch('/api/users/refresh', {
            method: 'POST',
            credentials: 'include',
          })
          if (res.ok) {
            const data = await res.json()
            localStorage.setItem('accessToken', data.accessToken)
            setUser(JSON.parse(storedUser))
            setIsAuthenticated(true)
            console.log('✅ Token renovado automáticamente')
          } else {
            // Refresh falló, limpiar todo
            localStorage.removeItem('user')
            localStorage.removeItem('accessToken')
          }
        } catch (err) {
          console.error('Error al renovar token:', err)
          localStorage.removeItem('user')
          localStorage.removeItem('accessToken')
        }
      }
      setLoading(false)
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
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, loading, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}