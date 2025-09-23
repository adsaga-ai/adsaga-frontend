import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { locationService, organisationService } from '../services'

const Locations = () => {
  const { isAuthenticated } = useAuth()
  const [locations, setLocations] = useState([])
  const [organisations, setOrganisations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingLocation, setEditingLocation] = useState(null)
  const [selectedOrganisation, setSelectedOrganisation] = useState('')
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    country: ''
  })

  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [orgsData] = await Promise.all([
        organisationService.getOrganisations()
      ])
      setOrganisations(orgsData.data || orgsData)
      
      // Fetch locations for all organisations
      const allLocations = []
      for (const org of orgsData.data || orgsData) {
        try {
          const locData = await locationService.getOrganisationLocations(org.organisation_id)
          const orgLocations = (locData.data || locData).map(loc => ({
            ...loc,
            organisation_name: org.organisation_name
          }))
          allLocations.push(...orgLocations)
        } catch (err) {
          console.warn(`Failed to fetch locations for organisation ${org.organisation_id}:`, err)
        }
      }
      setLocations(allLocations)
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
    if (!selectedOrganisation) {
      setError('Please select an organisation')
      return
    }

    try {
      if (editingLocation) {
        await locationService.updateLocation(editingLocation.location_id, formData)
      } else {
        await locationService.createLocation(selectedOrganisation, formData)
      }
      setShowForm(false)
      setEditingLocation(null)
      setFormData({ address: '', city: '', state: '', country: '' })
      setSelectedOrganisation('')
      fetchData()
    } catch (error) {
      setError(error.message)
    }
  }

  const handleEdit = (location) => {
    setEditingLocation(location)
    setFormData({
      address: location.address,
      city: location.city,
      state: location.state,
      country: location.country
    })
    setSelectedOrganisation(location.organisation_id)
    setShowForm(true)
  }

  const handleDelete = async (locationId) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      try {
        await locationService.deleteLocation(locationId)
        fetchData()
      } catch (error) {
        setError(error.message)
      }
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingLocation(null)
    setFormData({ address: '', city: '', state: '', country: '' })
    setSelectedOrganisation('')
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-foreground">Please login to manage locations</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Location Management</h1>
        <p className="text-lg text-muted-foreground">Manage locations for your organisations</p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="space-y-8">
        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-4 sm:mb-0">Locations</h2>
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              Add New Location
            </button>
          </div>

          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading locations...</p>
            </div>
          )}

          {!loading && locations.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📍</span>
              </div>
              <p className="text-muted-foreground text-lg">No locations found. Add your first location to get started.</p>
            </div>
          )}

          {!loading && locations.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {locations.map((location) => (
                <div key={location.location_id} className="card group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary text-xl">📍</span>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        className="btn btn-secondary text-sm px-3 py-1"
                        onClick={() => handleEdit(location)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-danger text-sm px-3 py-1"
                        onClick={() => handleDelete(location.location_id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
                    {location.city}, {location.state}
                  </h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p><span className="font-medium">Address:</span> {location.address}</p>
                    <p><span className="font-medium">Country:</span> {location.country}</p>
                    <p><span className="font-medium">Organisation:</span> {location.organisation_name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showForm && (
          <div className="card">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {editingLocation ? 'Edit Location' : 'Add New Location'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-group">
                <label htmlFor="organisation" className="form-label">Organisation</label>
                <select
                  id="organisation"
                  value={selectedOrganisation}
                  onChange={(e) => setSelectedOrganisation(e.target.value)}
                  className="form-input"
                  required
                >
                  <option value="">Select an organisation</option>
                  {organisations.map((org) => (
                    <option key={org.organisation_id} value={org.organisation_id}>
                      {org.organisation_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="address" className="form-label">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter street address"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label htmlFor="city" className="form-label">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter city"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="state" className="form-label">State</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter state"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="country" className="form-label">Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter country"
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button type="submit" className="btn btn-primary">
                  {editingLocation ? 'Update Location' : 'Add Location'}
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

export default Locations
