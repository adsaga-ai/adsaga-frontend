import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 py-8 mt-auto border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="mb-2 font-medium">
            &copy; 2024 AdSaga Frontend. All rights reserved.
          </p>
          <p className="text-sm">
            Manage your organisations, users, and locations with ease.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
