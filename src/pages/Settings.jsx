import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../contexts/ThemeContext'
import { userService, subscriptionService, organisationService } from '../services'
import EditUserProfileModal from '../components/EditUserProfileModal'
import EditOrganisationModal from '../components/EditOrganisationModal'

const Settings = () => {
  const { user, isAuthenticated } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [subscriptions, setSubscriptions] = useState([])
  const [organisation, setOrganisation] = useState(null)
  const [showEditProfileModal, setShowEditProfileModal] = useState(false)
  const [showEditOrganisationModal, setShowEditOrganisationModal] = useState(false)
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData({
        fullname: user.fullname || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      fetchSubscriptions()
      if (user.organisation_id) {
        fetchOrganisation()
      }
    }
  }, [isAuthenticated, user])

  const fetchSubscriptions = async () => {
    try {
      const data = await subscriptionService.getSubscriptions()
      setSubscriptions(data.data || data)
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error)
    }
  }

  const fetchOrganisation = async () => {
    try {
      const data = await organisationService.getOrganisationById(user.organisation_id)
      setOrganisation(data.data || data)
    } catch (error) {
      console.error('Failed to fetch organisation:', error)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }


  const handlePasswordChange = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      setSuccess('')

      if (formData.newPassword !== formData.confirmPassword) {
        setError('New passwords do not match')
        return
      }

      if (formData.newPassword.length < 6) {
        setError('New password must be at least 6 characters long')
        return
      }

      // Note: This would need a specific password change endpoint
      // For now, we'll just show a success message
      setSuccess('Password change functionality will be implemented with backend support')
      
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
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
          <h2 className="text-2xl font-bold text-foreground">Please login to access settings</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center py-4 sm:py-8">
        <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-2 sm:mb-4">Settings</h1>
        <p className="text-sm sm:text-lg text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="space-y-4 sm:space-y-8">
        {/* Profile Settings */}
        <div className="card">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 space-y-3 sm:space-y-0">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">Profile Settings</h2>
            <button
              onClick={() => setShowEditProfileModal(true)}
              className="btn btn-secondary w-full sm:w-auto"
            >
              Edit Profile
            </button>
          </div>
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="form-label text-sm sm:text-base">Full Name</label>
                <div className="form-input bg-gray-50 dark:bg-gray-700 cursor-not-allowed text-sm sm:text-base">
                  {user?.fullname || 'Not set'}
                </div>
              </div>

              <div>
                <label className="form-label text-sm sm:text-base">Email</label>
                <div className="form-input bg-gray-50 dark:bg-gray-700 cursor-not-allowed text-sm sm:text-base">
                  {user?.email || 'Not set'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Organization Settings */}
        {user?.organisation_id && (
          <div className="card">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 space-y-3 sm:space-y-0">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">Organization Settings</h2>
              <button
                onClick={() => setShowEditOrganisationModal(true)}
                className="btn btn-secondary w-full sm:w-auto"
              >
                Edit Organization
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="form-label text-sm sm:text-base">Organization Name</label>
                  <div className="form-input bg-gray-50 dark:bg-gray-700 cursor-not-allowed text-sm sm:text-base">
                    {organisation?.organisation_name || 'Loading...'}
                  </div>
                </div>

                <div>
                  <label className="form-label text-sm sm:text-base">Website</label>
                  <div className="form-input bg-gray-50 dark:bg-gray-700 cursor-not-allowed text-sm sm:text-base">
                    {organisation?.website || 'Not set'}
                  </div>
                </div>
              </div>

              <div>
                <label className="form-label text-sm sm:text-base">Organization ID</label>
                <div className="form-input bg-gray-50 dark:bg-gray-700 cursor-not-allowed font-mono text-xs sm:text-sm">
                  {user.organisation_id}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Password Settings */}
        <div className="card">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">Change Password</h2>
          
          <form onSubmit={handlePasswordChange} className="space-y-6">
            <div className="form-group">
              <label htmlFor="currentPassword" className="form-label">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter current password"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="form-group">
                <label htmlFor="newPassword" className="form-label">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter new password"
                  minLength="6"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Confirm new password"
                  minLength="6"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>

        {/* Theme Settings */}
        <div className="card">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">Appearance</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-foreground">Theme</h3>
                <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
              </div>
              <button
                onClick={toggleTheme}
                className="btn btn-secondary"
              >
                {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              </button>
            </div>
          </div>
        </div>

        {/* Subscription Info */}
        {user?.organisation_id && (
          <div className="card">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">Subscription Information</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-foreground">Current Plan</h3>
                  <p className="text-sm text-muted-foreground">Your current subscription plan</p>
                </div>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {user.subscription_code || 'PROT'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Account Actions */}
        <div className="card">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">Account Actions</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-foreground">Export Data</h3>
                <p className="text-sm text-muted-foreground">Download your account data</p>
              </div>
              <button className="btn btn-secondary">
                Export Data
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-foreground text-red-600">Delete Account</h3>
                <p className="text-sm text-muted-foreground">Permanently delete your account</p>
              </div>
              <button className="btn btn-danger">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditUserProfileModal
        isOpen={showEditProfileModal}
        onClose={() => setShowEditProfileModal(false)}
        user={user}
        onSuccess={() => {
          // Profile data is automatically updated in Redux store
          // No need for additional success message handling
        }}
      />

      <EditOrganisationModal
        isOpen={showEditOrganisationModal}
        onClose={() => setShowEditOrganisationModal(false)}
        organisation={organisation}
        onSuccess={() => {
          // Refresh organization data
          if (user?.organisation_id) {
            fetchOrganisation()
          }
          // Success message is handled by the modal's toast notification
        }}
      />
    </div>
  )
}

export default Settings
