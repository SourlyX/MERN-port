import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

const RedirectIfAuth = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext)

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}

export default RedirectIfAuth