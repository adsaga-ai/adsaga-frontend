import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const Home = () => {
  const { isAuthenticated, user } = useAuth()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center py-12">
        <h1 className="text-4xl md:text-6xl font-bold text-black dark:text-white mb-6 animate-fade-in">
          Welcome to AdSaga
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Manage your organisations, users, and locations with ease
        </p>
        
        {isAuthenticated ? (
          <div className="space-y-4">
            <p className="text-lg text-foreground">Welcome back, {user?.fullname}!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
                Go to Dashboard
              </Link>
              <Link to="/organisation" className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-lg font-medium transition-colors duration-200">
                Manage Organisations
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
              Login
            </Link>
            <Link to="/register" className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-lg font-medium transition-colors duration-200">
              Register
            </Link>
          </div>
        )}
      </div>

      <div className="py-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <h2 className="text-3xl font-bold text-center mb-8 text-black dark:text-white">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-center group">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/40 transition-colors duration-300">
                <span className="text-2xl">🏢</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">Organisation Management</h3>
              <p className="text-gray-600 dark:text-gray-300">Create and manage multiple organisations with their details and subscription types.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-center group">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/40 transition-colors duration-300">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">User Management</h3>
              <p className="text-gray-600 dark:text-gray-300">Add and manage users within your organisations with proper access controls.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-center group">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/40 transition-colors duration-300">
                <span className="text-2xl">📍</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">Location Tracking</h3>
              <p className="text-gray-600 dark:text-gray-300">Track multiple locations for each organisation with detailed address information.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
