import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import AdSagaLogo from '../assets/final_bomb_resize.jpg'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await authService.forgotPassword(email)
      setIsSubmitted(true)
    } catch (error) {
      console.error('Forgot password error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="h-screen flex bg-white overflow-hidden">
        {/* Left side - Brand Showcase */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#844ee0]">
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

        {/* Right side - Success Message */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white overflow-y-auto">
          <div className="max-w-md w-full space-y-4 py-4">
            {/* Logo */}
            <div className="text-center mb-4">
              <img 
                src={AdSagaLogo} 
                alt="AdSaga Logo" 
                className="w-40 h-32 mx-auto object-contain"
              />
            </div>

            <div className="bg-white shadow-xl rounded-lg p-8 border border-gray-200">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
                <p className="text-sm text-gray-600 mb-6">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Please check your email and click the link to reset your password. The link will expire in 1 hour.
                </p>
                
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-purple-600 hover:bg-purple-700 transform hover:scale-105 transition duration-200"
                  >
                    Back to Login
                  </button>
                  
                  <p className="text-sm text-gray-600">
                    Didn't receive the email?{' '}
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200"
                    >
                      Try again
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex bg-white overflow-hidden">
      {/* Left side - Brand Showcase */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#844ee0]">
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

      {/* Right side - Forgot Password Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white overflow-y-auto">
        <div className="max-w-md w-full space-y-4 py-4">
          {/* Logo */}
          <div className="text-center mb-4">
            <img 
              src={AdSagaLogo} 
              alt="AdSaga Logo" 
              className="w-40 h-32 mx-auto object-contain"
            />
          </div>

          <div className="bg-white shadow-xl rounded-lg p-8 border border-gray-200">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
              <p className="text-sm text-gray-600 mb-6">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                  placeholder="Enter your email address"
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
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <div className="text-center mt-6">
              <p className="text-gray-600">
                Remember your password?{' '}
                <Link to="/login" className="text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200">
                  Back to Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
