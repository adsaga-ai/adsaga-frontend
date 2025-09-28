import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import DashboardNew from '../pages/DashboardNew'
import Organisation from '../pages/Organisation'
import Users from '../pages/Users'
import Locations from '../pages/Locations'
import WorkflowConfig from '../pages/WorkflowConfig'
import Settings from '../pages/Settings'

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const location = useLocation()

  // Determine which component to render based on the current path
  const renderPage = () => {
    switch (location.pathname) {
      case '/':
        return <DashboardNew />
      case '/organisation':
        return <Organisation />
      case '/users':
        return <Users />
      case '/locations':
        return <Locations />
      case '/workflow-config':
        return <WorkflowConfig />
      case '/settings':
        return <Settings />
      default:
        return <DashboardNew />
    }
  }

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans transition-all duration-300">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        collapsed={sidebarCollapsed}
      />

      {/* Main content */}
      <div className={`transition-all duration-300 ${
        sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'
      }`}>
        <Header 
          onMenuClick={() => setSidebarOpen(true)} 
          onSidebarToggle={handleSidebarToggle}
          sidebarCollapsed={sidebarCollapsed}
        />
        <main className="p-4 md:p-6 lg:p-8">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
