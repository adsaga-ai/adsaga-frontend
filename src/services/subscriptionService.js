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

export const subscriptionService = {
  // Get all subscription types
  async getSubscriptions() {
    try {
      const response = await api.get('/subscriptions')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch subscriptions')
    }
  },

  // Get subscription by code
  async getSubscriptionByCode(code) {
    try {
      const response = await api.get(`/subscriptions/${code}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch subscription')
    }
  },

  // Create new subscription
  async createSubscription(subscriptionData) {
    try {
      const response = await api.post('/subscriptions', {
        subscription_code: subscriptionData.subscription_code,
        subscription_name: subscriptionData.subscription_name
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create subscription')
    }
  },

  // Update subscription
  async updateSubscription(code, subscriptionData) {
    try {
      const response = await api.put(`/subscriptions/${code}`, {
        subscription_name: subscriptionData.subscription_name
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update subscription')
    }
  },

  // Delete subscription
  async deleteSubscription(code) {
    try {
      const response = await api.delete(`/subscriptions/${code}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete subscription')
    }
  },
}
