import axios from 'axios'
import { toast } from 'react-toastify'
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
      // Redirect to login on 401 errors
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
      
      console.log('AuthService login response:', response.data)
      
      // Show success toast with API message
      if (response.data.message) {
        toast.success(response.data.message)
      } else {
        toast.success('Login successful!')
      }
      
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed'
      toast.error(errorMessage)
      throw new Error(errorMessage)
    }
  },

  // Register user (legacy - single step)
  async register(userData) {
    try {
      const response = await api.post('/users/register', {
        fullname: userData.fullname,
        email: userData.email,
        password: userData.password,
      })
      
      // Show success toast with API message
      if (response.data.message) {
        toast.success(response.data.message)
      } else {
        toast.success('Registration successful!')
      }
      
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed'
      toast.error(errorMessage)
      throw new Error(errorMessage)
    }
  },

  // Multi-step registration flow
  async initiateRegistration(email) {
    try {
      const response = await api.post('/users/register/initiate', {
        email
      })
      
      // Show success toast with API message
      if (response.data.message) {
        toast.success(response.data.message)
      } else {
        toast.success('Verification code sent to your email')
      }
      
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send verification code'
      toast.error(errorMessage)
      throw new Error(errorMessage)
    }
  },

  async verifyOTP(email, otp_code) {
    try {
      const response = await api.post('/users/register/verify-otp', {
        email,
        otp_code
      })
      
      // Show success toast with API message
      if (response.data.message) {
        toast.success(response.data.message)
      } else {
        toast.success('Email verified successfully')
      }
      
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Invalid OTP code'
      toast.error(errorMessage)
      throw new Error(errorMessage)
    }
  },

  async completeRegistration(email, otp_code, fullname, password) {
    try {
      const response = await api.post('/users/register/complete', {
        email,
        otp_code,
        fullname,
        password
      })
      
      // Show success toast with API message
      if (response.data.message) {
        toast.success(response.data.message)
      } else {
        toast.success('Account created successfully!')
      }
      
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed'
      toast.error(errorMessage)
      throw new Error(errorMessage)
    }
  },

  // Removed getCurrentUser - user data comes from login response only

  // Forgot password
  async forgotPassword(email) {
    try {
      const response = await api.post('/users/forgot-password', {
        email
      })
      
      // Show success toast with API message
      if (response.data.message) {
        toast.success(response.data.message)
      } else {
        toast.success('Password reset link sent to your email')
      }
      
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send reset link'
      toast.error(errorMessage)
      throw new Error(errorMessage)
    }
  },

  // Reset password
  async resetPassword(token, password, confirmPassword) {
    try {
      const response = await api.post('/users/reset-password', {
        token,
        password,
        confirmPassword
      })
      
      // Show success toast with API message
      if (response.data.message) {
        toast.success(response.data.message)
      } else {
        toast.success('Password reset successfully')
      }
      
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to reset password'
      toast.error(errorMessage)
      throw new Error(errorMessage)
    }
  },

  // Logout user
  async logout() {
    try {
      await api.post('/users/logout')
      toast.success('Logged out successfully')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Logout failed')
    } finally {
      localStorage.removeItem('token')
    }
  },
}
