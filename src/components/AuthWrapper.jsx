import { useEffect } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const AuthWrapper = () => {
  const { isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // No need to check auth - user data comes from login response only

  useEffect(() => {
    // Define public routes that don't require authentication
    const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password']
    
    // If not authenticated and not on public pages, redirect to login
    if (!loading && !isAuthenticated && !publicRoutes.includes(location.pathname)) {
      navigate('/login')
    }
    
    // If authenticated and on public pages, redirect to root (dashboard)
    if (!loading && isAuthenticated && publicRoutes.includes(location.pathname)) {
      navigate('/')
    }
  }, [isAuthenticated, loading, location.pathname, navigate])

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return <Outlet />
}

export default AuthWrapper
