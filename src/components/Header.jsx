import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="bg-card border-b border-border px-4 py-4 lg:px-6">
      <div className="flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-muted transition-colors duration-200 lg:hidden"
        >
          <span className="text-xl">☰</span>
        </button>

        {/* Page title - you can make this dynamic based on current route */}
        <div className="flex-1 lg:flex-none">
          <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
        </div>

        {/* User menu */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 rounded-lg hover:bg-muted transition-colors duration-200 relative">
            <span className="text-xl">🔔</span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full"></span>
          </button>

          {/* User dropdown */}
          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">{user?.fullname || 'User'}</p>
              <p className="text-xs text-muted-foreground">{user?.email || 'user@example.com'}</p>
            </div>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-semibold">
                {user?.fullname?.charAt(0) || 'U'}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-muted transition-colors duration-200"
              title="Logout"
            >
              <span className="text-xl">🚪</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
