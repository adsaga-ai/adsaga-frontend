import axios from 'axios'
import config from '../config/environment'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authService = {
  // Login user
  async login(email, password) {
    try {
      const response = await api.post('/users/login', {
        email,
        password,
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  },

  // Register user
  async register(userData) {
    try {
      const response = await api.post('/users/register', {
        fullname: userData.fullname,
        email: userData.email,
        password: userData.password,
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed')
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const response = await api.get('/users/me')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get user data')
    }
  },

  // Logout user
  async logout() {
    try {
      await api.post('/users/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('token')
    }
  },
}
