// Environment configuration
const config = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  POSTMAN_ENV_URL: import.meta.env.VITE_POSTMAN_ENV_URL || 'normalUrl',
  
  // App Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || 'AdSaga Frontend',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // Development settings
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD
}

export default config
