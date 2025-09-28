import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { authService } from '../services/authService'
import AdSagaLogo from '../assets/final_bomb_resize.jpg'

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1) // 1: Email, 2: OTP, 3: Complete
  const [formData, setFormData] = useState({
    email: '',
    otp_code: '',
    fullname: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const { isAuthenticated, register } = useAuth()
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

  // Step 1: Initiate Registration (Send OTP)
  const handleInitiateRegistration = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = await authService.initiateRegistration(formData.email)
      
      if (data.success) {
        setCurrentStep(2)
      }
    } catch (error) {
      // Error toast is handled in authService
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = await authService.verifyOTP(formData.email, formData.otp_code)
      
      if (data.success) {
        setCurrentStep(3)
      }
    } catch (error) {
      // Error toast is handled in authService
    } finally {
      setLoading(false)
    }
  }

  // Step 3: Complete Registration
  const handleCompleteRegistration = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      // Show error toast for validation
      const { toast } = await import('react-toastify')
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      // Show error toast for validation
      const { toast } = await import('react-toastify')
      toast.error('Password must be at least 6 characters long')
      return
    }

    setLoading(true)

    try {
      const data = await authService.completeRegistration(
        formData.email,
        formData.otp_code,
        formData.fullname,
        formData.password
      )

      if (data.success) {
        // Store user data in Redux and redirect to dashboard
        const userData = {
          user: data.data, // User data from response
          token: data.token || 'temp-token', // Use token if provided, otherwise temp
          message: data.message
        }
        
        // Use Redux register action to store user data
        const result = await register(userData)
        
        if (result.type === 'auth/registerUser/fulfilled') {
          navigate('/')
        }
      }
    } catch (error) {
      // Error toast is handled in authService
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    if (currentStep === 1) {
      handleInitiateRegistration(e)
    } else if (currentStep === 2) {
      handleVerifyOTP(e)
    } else if (currentStep === 3) {
      handleCompleteRegistration(e)
    }
  }

  return (
    <div className="h-screen flex bg-white overflow-hidden">
      {/* Left side - Brand Showcase */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 to-purple-700">
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

      {/* Right side - Register Form */}
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
            {/* Progress Steps */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-2">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      currentStep >= step 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step}
                    </div>
                    {step < 3 && (
                      <div className={`w-8 h-0.5 ${
                        currentStep > step ? 'bg-purple-600' : 'bg-gray-200'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {currentStep === 1 && 'Enter Email'}
                {currentStep === 2 && 'Verify Email'}
                {currentStep === 3 && 'Complete Registration'}
              </h2>
              <p className="text-sm text-gray-600">
                {currentStep === 1 && 'We\'ll send you a verification code'}
                {currentStep === 2 && 'Enter the code sent to your email'}
                {currentStep === 3 && 'Set your password and complete registration'}
              </p>
            </div>
            

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Step 1: Email */}
              {currentStep === 1 && (
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
              )}

              {/* Step 2: OTP Verification */}
              {currentStep === 2 && (
                <div>
                  <label htmlFor="otp_code" className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    id="otp_code"
                    name="otp_code"
                    value={formData.otp_code}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 text-center text-lg tracking-widest"
                    placeholder="Enter 6-digit code"
                    maxLength="6"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Code sent to: {formData.email}
                  </p>
                </div>
              )}

              {/* Step 3: Complete Registration */}
              {currentStep === 3 && (
                <>
                  <div>
                    <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullname"
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                      placeholder="Enter your password"
                      required
                      minLength="6"
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </>
              )}

              <button 
                type="submit"
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition duration-200 ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-purple-600 hover:bg-purple-700 transform hover:scale-105'
                }`}
                disabled={loading}
              >
                {loading ? (
                  currentStep === 1 ? 'Sending Code...' :
                  currentStep === 2 ? 'Verifying...' :
                  'Creating Account...'
                ) : (
                  currentStep === 1 ? 'Send Verification Code' :
                  currentStep === 2 ? 'Verify Code' :
                  'Create Account'
                )}
              </button>

              {/* Back button for steps 2 and 3 */}
              {(currentStep === 2 || currentStep === 3) && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="w-full py-3 px-4 rounded-lg font-semibold text-gray-600 border border-gray-300 hover:bg-gray-50 transition duration-200"
                >
                  Back
                </button>
              )}
            </form>

            <div className="text-center mt-6">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
