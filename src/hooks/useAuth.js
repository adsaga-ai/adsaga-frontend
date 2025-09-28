import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  clearError 
} from '../store/slices/authSlice'

export const useAuth = () => {
  const dispatch = useDispatch()
  const { user, token, isAuthenticated, loading, error } = useSelector(state => {
    console.log('useAuth selector - state.auth:', state.auth)
    return state.auth
  })

  const login = useCallback(async (email, password) => {
    return dispatch(loginUser({ email, password }))
  }, [dispatch])

  const register = useCallback(async (userData) => {
    return dispatch(registerUser(userData))
  }, [dispatch])

  // Removed checkAuth - user data comes from login response only

  const logout = useCallback(() => {
    dispatch(logoutUser())
  }, [dispatch])

  const clearAuthError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    clearError: clearAuthError
  }
}
