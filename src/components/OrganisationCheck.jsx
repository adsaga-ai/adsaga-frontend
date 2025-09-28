import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import CreateOrganisationModal from './CreateOrganisationModal'
import { Outlet } from 'react-router-dom'

const OrganisationCheck = () => {
  const { user, isAuthenticated } = useAuth()
  const [showModal, setShowModal] = useState(false)

  // If user is not authenticated, show nothing (will be handled by AuthWrapper)
  if (!isAuthenticated) {
    return null
  }

  // Check if user has organisation_id when component mounts or user changes
  useEffect(() => {
    console.log('OrganisationCheck useEffect - user:', user)
    console.log('OrganisationCheck useEffect - user type:', typeof user)
    console.log('OrganisationCheck useEffect - user keys:', user ? Object.keys(user) : 'user is null')
    console.log('OrganisationCheck useEffect - organisation_id:', user?.organisation_id)
    console.log('OrganisationCheck useEffect - organisation_id type:', typeof user?.organisation_id)
    
    if (user && (user.organisation_id === null || user.organisation_id === undefined)) {
      console.log('Opening modal - no organisation_id')
      setShowModal(true)
    } else {
      console.log('Closing modal - organisation_id exists:', user?.organisation_id)
      setShowModal(false)
    }
  }, [user])

  // Check if we need to show the modal
  const shouldShowModal = user && (user.organisation_id === null || user.organisation_id === undefined)

  console.log('OrganisationCheck render - shouldShowModal:' , user , " : pe", shouldShowModal, 'showModal:', showModal)

  // Always show the dashboard content
  return (
    <>
      <Outlet />
      {/* Show modal if user has no organisation_id */}
      {shouldShowModal && (
        <CreateOrganisationModal 
          isOpen={true} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </>
  )
}

export default OrganisationCheck
