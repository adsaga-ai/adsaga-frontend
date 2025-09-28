import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { organisationService } from '../services/organisationService'

const CreateOrganisationModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    organisation_name: '',
    website: ''
  })
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  // Debug logging
  console.log('CreateOrganisationModal - isOpen:', isOpen)
  console.log('CreateOrganisationModal - user:', user)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = await organisationService.createOrganisation(formData)
      
      if (data.success) {
        // Refresh the page to update user data with new organisation_id
        window.location.reload()
      }
    } catch (error) {
      // Error toast is handled in organisationService
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all w-full max-w-md">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white bg-opacity-20 mb-4">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Create Organization</h3>
            <p className="text-purple-100">
              Welcome {user?.fullname}! Let's set up your organization to get started.
            </p>
          </div>

          {/* Body */}
          <div className="px-6 py-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="organisation_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Name *
                </label>
                <input
                  type="text"
                  id="organisation_name"
                  name="organisation_name"
                  value={formData.organisation_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 text-lg"
                  placeholder="Enter your organization name"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 text-lg"
                  placeholder="https://yourcompany.com"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium text-white transition duration-200 ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 transform hover:scale-105'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creating...
                    </div>
                  ) : (
                    'Create Organization'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
        </div>
      </div>
    </div>
  )
}

export default CreateOrganisationModal
