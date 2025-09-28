import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { organisationService } from '../services'

const DashboardNew = () => {
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
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-foreground">Please login to access the dashboard</h2>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user?.fullname}!</h1>
        <p className="text-muted-foreground">Here's what's happening with your organisations today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary mb-2">{organisations.length}</div>
          <p className="text-muted-foreground font-medium">Organisations</p>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary mb-2">0</div>
          <p className="text-muted-foreground font-medium">Users</p>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary mb-2">0</div>
          <p className="text-muted-foreground font-medium">Locations</p>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary mb-2">0</div>
          <p className="text-muted-foreground font-medium">Active Projects</p>
        </div>
      </div>

      {/* Recent Organisations */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Recent Organisations</h2>
          <button className="btn btn-primary">View All</button>
        </div>
        
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading organisations...</p>
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
            <p className="text-muted-foreground text-lg mb-4">No organisations found.</p>
            <button className="btn btn-primary">Create Your First Organisation</button>
          </div>
        )}

        {!loading && !error && organisations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organisations.slice(0, 6).map((org) => (
              <div key={org.organisation_id} className="card group hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🏢</span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="btn btn-secondary text-xs px-2 py-1">Edit</button>
                    <button className="btn btn-danger text-xs px-2 py-1">Delete</button>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
                  {org.organisation_name}
                </h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p><span className="font-medium">Website:</span> {org.website || 'Not specified'}</p>
                  <p><span className="font-medium">Subscription:</span> {org.subscription_code || 'Not assigned'}</p>
                  <p><span className="font-medium">Created:</span> {new Date(org.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-2xl font-bold text-foreground mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 rounded-lg border border-border hover:bg-muted transition-colors duration-200 text-left">
            <div className="text-2xl mb-2">🏢</div>
            <div className="font-medium text-foreground">Create Organisation</div>
            <div className="text-sm text-muted-foreground">Add a new organisation</div>
          </button>
          <button className="p-4 rounded-lg border border-border hover:bg-muted transition-colors duration-200 text-left">
            <div className="text-2xl mb-2">👥</div>
            <div className="font-medium text-foreground">Add User</div>
            <div className="text-sm text-muted-foreground">Invite team members</div>
          </button>
          <button className="p-4 rounded-lg border border-border hover:bg-muted transition-colors duration-200 text-left">
            <div className="text-2xl mb-2">📍</div>
            <div className="font-medium text-foreground">Add Location</div>
            <div className="text-sm text-muted-foreground">Register new location</div>
          </button>
          <button className="p-4 rounded-lg border border-border hover:bg-muted transition-colors duration-200 text-left">
            <div className="text-2xl mb-2">📊</div>
            <div className="font-medium text-foreground">View Reports</div>
            <div className="text-sm text-muted-foreground">Analytics & insights</div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default DashboardNew
