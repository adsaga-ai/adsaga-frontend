import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import AdSagaLogo from '../assets/final_bomb_resize.jpg'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const { login, loading, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    console.log('Login attempt with:', formData.email)
    const result = await login(formData.email, formData.password)
    console.log('Login result:', result)
    
    if (result.type === 'auth/loginUser/fulfilled') {
      console.log('Login successful, navigating to dashboard')
      navigate('/')
    } else {
      console.log('Login failed:', result)
    }
  }

  return (
    <div className="h-screen flex bg-white overflow-hidden">
      {/* Left side - Brand Showcase */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#844ee0]">
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 text-center">
          <h1 className="text-5xl font-bold mb-6 text-white">
            AdSaga.ai
          </h1>
          <p className="text-2xl mb-6 text-purple-100 font-medium">Modern Digital Growth Partner</p>
          <p className="text-lg text-purple-200 leading-relaxed">
            Helping B2B companies scale with automation, AI, and data-driven marketing
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white overflow-y-auto">
        <div className="max-w-md w-full space-y-4 py-4">
          {/* Welcome content for desktop */}
          <div className="hidden lg:block text-center mb-4">
            <img 
              src={AdSagaLogo} 
              alt="AdSaga Logo" 
              className="w-40 h-32 mx-auto mb-2 object-contain"
            />
          </div>

          {/* Logo for mobile */}
          <div className="lg:hidden text-center mb-4">
            <img 
              src={AdSagaLogo} 
              alt="AdSaga Logo" 
              className="w-40 h-32 mx-auto object-contain"
            />
          </div>

          <div className="bg-white shadow-xl rounded-lg p-8 border border-gray-200">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Login</h2>
              <p className="text-sm text-gray-600">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200"
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button 
                type="submit"
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition duration-200 ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-purple-600 hover:bg-purple-700 transform hover:scale-105'
                }`}
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="text-center mt-6">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200">
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login