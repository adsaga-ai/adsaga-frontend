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

export const workflowConfigService = {
  // Get all workflow configs
  async getWorkflowConfigs() {
    try {
      const response = await api.get('/workflow-configs')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch workflow configs')
    }
  },

  // Get workflow config by ID
  async getWorkflowConfigById(id) {
    try {
      const response = await api.get(`/workflow-configs/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch workflow config')
    }
  },

  // Get workflow configs by organisation
  async getWorkflowConfigsByOrganisation() {
    try {
      const response = await api.get('/workflow-configs/organisation')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch workflow configs by organisation')
    }
  },

  // Get workflow configs by user
  async getWorkflowConfigsByUser() {
    try {
      const response = await api.get('/workflow-configs/user/me')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch workflow configs by user')
    }
  },

  // Create new workflow config
  async createWorkflowConfig(workflowConfigData) {
    try {
      const response = await api.post('/workflow-configs', {
        domains: workflowConfigData.domains || [],
        locations: workflowConfigData.locations || [],
        designations: workflowConfigData.designations || [],
        runs_at: workflowConfigData.runs_at,
        leads_count: workflowConfigData.leads_count || 0
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create workflow config')
    }
  },

  // Update workflow config
  async updateWorkflowConfig(id, workflowConfigData) {
    try {
      const response = await api.put(`/workflow-configs/${id}`, {
        domains: workflowConfigData.domains || [],
        locations: workflowConfigData.locations || [],
        designations: workflowConfigData.designations || [],
        runs_at: workflowConfigData.runs_at,
        leads_count: workflowConfigData.leads_count || 0
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update workflow config')
    }
  },

  // Delete workflow config
  async deleteWorkflowConfig(id) {
    try {
      const response = await api.delete(`/workflow-configs/${id}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete workflow config')
    }
  },
}
