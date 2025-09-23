import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { organisationService, subscriptionService } from '../services'

const Organisation = () => {
  const { isAuthenticated } = useAuth()
  const [organisations, setOrganisations] = useState([])
  const [subscriptionTypes, setSubscriptionTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingOrg, setEditingOrg] = useState(null)
  const [formData, setFormData] = useState({
    organisation_name: '',
    website: '',
    subscription_code: ''
  })

  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [orgsData, subsData] = await Promise.all([
        organisationService.getOrganisations(),
        subscriptionService.getSubscriptions()
      ])
      setOrganisations(orgsData)
      setSubscriptionTypes(subsData)
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingOrg) {
        await organisationService.updateOrganisation(editingOrg.organisation_id, formData)
      } else {
        await organisationService.createOrganisation(formData)
      }
      setShowForm(false)
      setEditingOrg(null)
      setFormData({ organisation_name: '', website: '', subscription_code: '' })
      fetchData()
    } catch (error) {
      setError(error.message)
    }
  }

  const handleEdit = (org) => {
    setEditingOrg(org)
    setFormData({
      organisation_name: org.organisation_name,
      website: org.website || '',
      subscription_code: org.subscription_code || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (orgId) => {
    if (window.confirm('Are you sure you want to delete this organisation?')) {
      try {
        await organisationService.deleteOrganisation(orgId)
        fetchData()
      } catch (error) {
        setError(error.message)
      }
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingOrg(null)
    setFormData({ organisation_name: '', website: '', subscription_code: '' })
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-foreground">Please login to manage organisations</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Organisation Management</h1>
        <p className="text-lg text-muted-foreground">Create and manage your organisations</p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="space-y-8">
        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-4 sm:mb-0">Organisations</h2>
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              Add New Organisation
            </button>
          </div>

          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading organisations...</p>
            </div>
          )}

          {!loading && organisations.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏢</span>
              </div>
              <p className="text-muted-foreground text-lg">No organisations found. Create your first organisation to get started.</p>
            </div>
          )}

          {!loading && organisations.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {organisations.map((org) => (
                <div key={org.organisation_id} className="card group">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                      {org.organisation_name}
                    </h3>
                    <div className="flex space-x-2">
                      <button 
                        className="btn btn-secondary text-sm px-3 py-1"
                        onClick={() => handleEdit(org)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-danger text-sm px-3 py-1"
                        onClick={() => handleDelete(org.organisation_id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Website:</span> {org.website || 'Not specified'}</p>
                    <p><span className="font-medium">Subscription:</span> {org.subscription_code || 'Not assigned'}</p>
                    <p><span className="font-medium">Created:</span> {new Date(org.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showForm && (
          <div className="card">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {editingOrg ? 'Edit Organisation' : 'Create New Organisation'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label htmlFor="organisation_name" className="form-label">Organisation Name</label>
                  <input
                    type="text"
                    id="organisation_name"
                    name="organisation_name"
                    value={formData.organisation_name}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter organisation name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="website" className="form-label">Website</label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subscription_code" className="form-label">Subscription Type</label>
                <select
                  id="subscription_code"
                  name="subscription_code"
                  value={formData.subscription_code}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="">Select subscription type</option>
                  {subscriptionTypes.map((sub) => (
                    <option key={sub.subscription_code} value={sub.subscription_code}>
                      {sub.subscription_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button type="submit" className="btn btn-primary">
                  {editingOrg ? 'Update Organisation' : 'Create Organisation'}
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

export default Organisation
