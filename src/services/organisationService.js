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

export const organisationService = {
  // Get all organisations
  async getOrganisations() {
    try {
      const response = await api.get('/organisations')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch organisations')
    }
  },

  // Get organisation by ID
  async getOrganisationById(id) {
    try {
      const response = await api.get(`/organisations/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch organisation')
    }
  },

  // Create new organisation
  async createOrganisation(organisationData) {
    try {
      const response = await api.post('/organisations', {
        organisation_name: organisationData.organisation_name,
        website: organisationData.website,
        subscription_code: organisationData.subscription_code || 'PROT',
        locations: organisationData.locations || []
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create organisation')
    }
  },

  // Update organisation
  async updateOrganisation(id, organisationData) {
    try {
      const response = await api.put(`/organisations/${id}`, {
        organisation_name: organisationData.organisation_name,
        website: organisationData.website,
        subscription_code: organisationData.subscription_code
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update organisation')
    }
  },

  // Delete organisation
  async deleteOrganisation(id) {
    try {
      const response = await api.delete(`/organisations/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete organisation')
    }
  },

  // Get organisations by subscription code
  async getOrganisationsBySubscription(subscriptionCode) {
    try {
      const response = await api.get(`/organisations/subscription/${subscriptionCode}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch organisations by subscription')
    }
  },

  // Get organisation locations
  async getOrganisationLocations(organisationId) {
    try {
      const response = await api.get(`/organisations/${organisationId}/locations`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch organisation locations')
    }
  },

  // Add location to organisation
  async addLocation(organisationId, locationData) {
    try {
      const response = await api.post(`/organisations/${organisationId}/locations`, locationData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add location')
    }
  },
}
