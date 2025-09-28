import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../contexts/ThemeContext'

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-purple-600 text-white py-4 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link 
            to="/" 
            className="text-2xl font-bold text-white hover:text-purple-200 transition-colors duration-200"
          >
            AdSaga
          </Link>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-105 transition-all duration-200 flex items-center justify-center"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>

            {isAuthenticated ? (
              <>
                <span className="text-white font-medium hidden sm:block">
                  Welcome, {user?.fullname}
                </span>
                <Link 
                  to="/dashboard" 
                  className="text-white hover:bg-white/10 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="border border-white text-white hover:bg-white hover:text-purple-600 px-4 py-2 rounded-lg font-medium transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-white hover:bg-white/10 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-white/20 text-white hover:bg-white/30 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
