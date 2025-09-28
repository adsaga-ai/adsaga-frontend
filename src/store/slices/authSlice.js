import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from '../../services/authService'

// Async thunks for API calls
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authService.login(email, password)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      // If userData already contains the response (from completeRegistration), use it directly
      if (userData.user && userData.message) {
        return userData
      }
      
      // Otherwise, call the API
      const response = await authService.register(userData)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Removed getCurrentUser API call - user data comes from login response only

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout()
      return true
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: false, // Don't auto-authenticate based on token alone
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearAuth: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.loading = false
      state.error = null
      localStorage.removeItem('token')
    },
    setCredentials: (state, action) => {
      const { user, token } = action.payload
      state.user = user
      state.token = token
      state.isAuthenticated = true
      localStorage.setItem('token', token)
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log('Redux loginUser.fulfilled - action.payload:', action.payload)
        console.log('Redux loginUser.fulfilled - action.payload.data:', action.payload.data)
        console.log('Redux loginUser.fulfilled - action.payload.data.user:', action.payload.data.user)
        console.log('Redux loginUser.fulfilled - action.payload.data.token:', action.payload.data.token)
        
        state.loading = false
        state.user = action.payload.data.user
        state.token = action.payload.data.token
        state.isAuthenticated = true
        state.error = null
        localStorage.setItem('token', action.payload.data.token)
        
        console.log('Redux state updated - user:', state.user)
        console.log('Redux state updated - token:', state.token)
        console.log('Redux state updated - isAuthenticated:', state.isAuthenticated)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isAuthenticated = false
      })
      
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.error = null
        localStorage.setItem('token', action.payload.token)
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isAuthenticated = false
      })
      
      // Removed getCurrentUser cases - no API call needed
      
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.loading = false
        state.error = null
        localStorage.removeItem('token')
      })
  },
})

export const { clearError, clearAuth, setCredentials, updateUser } = authSlice.actions
export default authSlice.reducer
