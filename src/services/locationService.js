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

export const locationService = {
  // Get all locations for an organisation
  async getOrganisationLocations(organisationId) {
    try {
      const response = await api.get(`/organisations/${organisationId}/locations`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch locations')
    }
  },

  // Get location by ID
  async getLocationById(locationId) {
    try {
      const response = await api.get(`/locations/${locationId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch location')
    }
  },

  // Create new location for an organisation
  async createLocation(organisationId, locationData) {
    try {
      const response = await api.post(`/organisations/${organisationId}/locations`, {
        address: locationData.address,
        city: locationData.city,
        state: locationData.state,
        country: locationData.country
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create location')
    }
  },

  // Update location
  async updateLocation(locationId, locationData) {
    try {
      const response = await api.put(`/locations/${locationId}`, {
        address: locationData.address,
        city: locationData.city,
        state: locationData.state,
        country: locationData.country
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update location')
    }
  },

  // Delete location
  async deleteLocation(locationId) {
    try {
      const response = await api.delete(`/locations/${locationId}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete location')
    }
  },

  // Get all locations (admin only)
  async getAllLocations() {
    try {
      const response = await api.get('/locations')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch all locations')
    }
  },
}
