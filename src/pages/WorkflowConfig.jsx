import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { workflowConfigService } from '../services'

const WorkflowConfig = () => {
  const { isAuthenticated } = useAuth()
  const [workflowConfigs, setWorkflowConfigs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingConfig, setEditingConfig] = useState(null)
  const [formData, setFormData] = useState({
    domains: [],
    locations: [],
    designations: [],
    runs_at: '',
    leads_count: 0
  })
  const [newItem, setNewItem] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated])

  const fetchData = async () => {
    try {
      setLoading(true)
      const data = await workflowConfigService.getWorkflowConfigsByUser()
      setWorkflowConfigs(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleArrayChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    })
  }

  const addToArray = (field) => {
    if (newItem.trim()) {
      const currentArray = formData[field] || []
      handleArrayChange(field, [...currentArray, newItem.trim()])
      setNewItem('')
    }
  }

  const removeFromArray = (field, index) => {
    const currentArray = formData[field] || []
    handleArrayChange(field, currentArray.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingConfig) {
        await workflowConfigService.updateWorkflowConfig(editingConfig.workflow_config_id, formData)
      } else {
        await workflowConfigService.createWorkflowConfig(formData)
      }
      setShowForm(false)
      setEditingConfig(null)
      setFormData({
        domains: [],
        locations: [],
        designations: [],
        runs_at: '',
        leads_count: 0
      })
      fetchData()
    } catch (error) {
      setError(error.message)
    }
  }

  const handleEdit = (config) => {
    setEditingConfig(config)
    setFormData({
      domains: config.domains || [],
      locations: config.locations || [],
      designations: config.designations || [],
      runs_at: config.runs_at ? new Date(config.runs_at).toISOString().slice(0, 16) : '',
      leads_count: config.leads_count || 0
    })
    setShowForm(true)
  }

  const handleDelete = async (configId) => {
    if (window.confirm('Are you sure you want to delete this workflow configuration?')) {
      try {
        await workflowConfigService.deleteWorkflowConfig(configId)
        fetchData()
      } catch (error) {
        setError(error.message)
      }
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingConfig(null)
    setFormData({
      domains: [],
      locations: [],
      designations: [],
      runs_at: '',
      leads_count: 0
    })
    setNewItem('')
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-foreground">Please login to manage workflow configurations</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Workflow Configuration</h1>
        <p className="text-lg text-muted-foreground">Create and manage your workflow configurations</p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="space-y-8">
        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-4 sm:mb-0">Workflow Configurations</h2>
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              Add New Configuration
            </button>
          </div>

          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading configurations...</p>
            </div>
          )}

          {!loading && workflowConfigs.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚙️</span>
              </div>
              <p className="text-muted-foreground text-lg">No workflow configurations found. Create your first configuration to get started.</p>
            </div>
          )}

          {!loading && workflowConfigs.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {workflowConfigs.map((config) => (
                <div key={config.workflow_config_id} className="card group">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                      Configuration #{config.workflow_config_id.slice(0, 8)}
                    </h3>
                    <div className="flex space-x-2">
                      <button 
                        className="btn btn-secondary text-sm px-3 py-1"
                        onClick={() => handleEdit(config)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-danger text-sm px-3 py-1"
                        onClick={() => handleDelete(config.workflow_config_id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-4 text-sm">
                    <div>
                      <span className="font-medium">Domains:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {config.domains?.length > 0 ? (
                          config.domains.map((domain, index) => (
                            <span key={index} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">
                              {domain}
                            </span>
                          ))
                        ) : (
                          <span className="text-muted-foreground">None</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="font-medium">Locations:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {config.locations?.length > 0 ? (
                          config.locations.map((location, index) => (
                            <span key={index} className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs">
                              {location}
                            </span>
                          ))
                        ) : (
                          <span className="text-muted-foreground">None</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="font-medium">Designations:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {config.designations?.length > 0 ? (
                          config.designations.map((designation, index) => (
                            <span key={index} className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded text-xs">
                              {designation}
                            </span>
                          ))
                        ) : (
                          <span className="text-muted-foreground">None</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="font-medium">Runs At:</span>
                        <p className="text-muted-foreground">
                          {config.runs_at ? new Date(config.runs_at).toLocaleString() : 'Not scheduled'}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Leads Count:</span>
                        <p className="text-muted-foreground">{config.leads_count || 0}</p>
                      </div>
                    </div>

                    <div>
                      <span className="font-medium">Created:</span>
                      <p className="text-muted-foreground">{new Date(config.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showForm && (
          <div className="card">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {editingConfig ? 'Edit Workflow Configuration' : 'Create New Workflow Configuration'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Domains */}
              <div className="form-group">
                <label className="form-label">Domains</label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newItem}
                      onChange={(e) => setNewItem(e.target.value)}
                      className="form-input flex-1"
                      placeholder="Enter domain (e.g., example.com)"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('domains'))}
                    />
                    <button
                      type="button"
                      onClick={() => addToArray('domains')}
                      className="btn btn-secondary"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {formData.domains.map((domain, index) => (
                      <span key={index} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm flex items-center gap-1">
                        {domain}
                        <button
                          type="button"
                          onClick={() => removeFromArray('domains', index)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Locations */}
              <div className="form-group">
                <label className="form-label">Locations</label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newItem}
                      onChange={(e) => setNewItem(e.target.value)}
                      className="form-input flex-1"
                      placeholder="Enter location (e.g., New York)"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('locations'))}
                    />
                    <button
                      type="button"
                      onClick={() => addToArray('locations')}
                      className="btn btn-secondary"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {formData.locations.map((location, index) => (
                      <span key={index} className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-sm flex items-center gap-1">
                        {location}
                        <button
                          type="button"
                          onClick={() => removeFromArray('locations', index)}
                          className="text-green-600 hover:text-green-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Designations */}
              <div className="form-group">
                <label className="form-label">Designations</label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newItem}
                      onChange={(e) => setNewItem(e.target.value)}
                      className="form-input flex-1"
                      placeholder="Enter designation (e.g., CEO)"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('designations'))}
                    />
                    <button
                      type="button"
                      onClick={() => addToArray('designations')}
                      className="btn btn-secondary"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {formData.designations.map((designation, index) => (
                      <span key={index} className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded text-sm flex items-center gap-1">
                        {designation}
                        <button
                          type="button"
                          onClick={() => removeFromArray('designations', index)}
                          className="text-purple-600 hover:text-purple-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label htmlFor="runs_at" className="form-label">Runs At</label>
                  <input
                    type="datetime-local"
                    id="runs_at"
                    name="runs_at"
                    value={formData.runs_at}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="leads_count" className="form-label">Leads Count</label>
                  <input
                    type="number"
                    id="leads_count"
                    name="leads_count"
                    value={formData.leads_count}
                    onChange={handleChange}
                    className="form-input"
                    min="0"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button type="submit" className="btn btn-primary">
                  {editingConfig ? 'Update Configuration' : 'Create Configuration'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default WorkflowConfig
