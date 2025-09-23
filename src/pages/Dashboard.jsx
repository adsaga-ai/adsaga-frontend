import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { organisationService } from '../services/organisationService'

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth()
  const [organisations, setOrganisations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrganisations()
    }
  }, [isAuthenticated])

  const fetchOrganisations = async () => {
    try {
      setLoading(true)
      const data = await organisationService.getOrganisations()
      setOrganisations(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-foreground">Please login to access the dashboard</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Dashboard</h1>
        <p className="text-lg text-muted-foreground">Welcome back, {user?.fullname}!</p>
      </div>

      <div className="space-y-8">
        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-4 sm:mb-0">Your Organisations</h2>
            <button className="btn btn-primary">
              Create New Organisation
            </button>
          </div>
          
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading organisations...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {!loading && !error && organisations.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏢</span>
              </div>
              <p className="text-muted-foreground text-lg">No organisations found. Create your first organisation to get started.</p>
            </div>
          )}

          {!loading && !error && organisations.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {organisations.map((org) => (
                <div key={org.organisation_id} className="card group">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                      {org.organisation_name}
                    </h3>
                    <div className="flex space-x-2">
                      <button className="btn btn-secondary text-sm px-3 py-1">
                        Edit
                      </button>
                      <button className="btn btn-danger text-sm px-3 py-1">
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

        <div className="card">
          <h2 className="text-2xl font-bold text-foreground mb-6">Quick Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-primary/5 rounded-xl">
              <div className="text-4xl font-bold text-primary mb-2">
                {organisations.length}
              </div>
              <p className="text-muted-foreground font-medium">Organisations</p>
            </div>
            <div className="text-center p-6 bg-primary/5 rounded-xl">
              <div className="text-4xl font-bold text-primary mb-2">0</div>
              <p className="text-muted-foreground font-medium">Users</p>
            </div>
            <div className="text-center p-6 bg-primary/5 rounded-xl">
              <div className="text-4xl font-bold text-primary mb-2">0</div>
              <p className="text-muted-foreground font-medium">Locations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
