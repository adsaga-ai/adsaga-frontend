import React from 'react'
import { createBrowserRouter } from 'react-router-dom'

// Layouts
import MainLayout from '../layouts/MainLayout'
import DashboardLayout from '../layouts/DashboardLayout'

// Pages
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import DashboardNew from '../pages/DashboardNew'
import Organisation from '../pages/Organisation'
import Users from '../pages/Users'
import Locations from '../pages/Locations'
import Settings from '../pages/Settings'

// Protected Route
import ProtectedRoute from './ProtectedRoute'

// Route definitions
export const routes = [
  // Public routes with main layout
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'login',
        element: (
          <ProtectedRoute requireAuth={false}>
            <Login />
          </ProtectedRoute>
        )
      },
      {
        path: 'register',
        element: (
          <ProtectedRoute requireAuth={false}>
            <Register />
          </ProtectedRoute>
        )
      }
    ]
  },
  // Protected routes with dashboard layout
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute requireAuth={true}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardNew />
      },
      {
        path: 'organisation',
        element: <Organisation />
      },
      {
        path: 'users',
        element: <Users />
      },
      {
        path: 'locations',
        element: <Locations />
      },
      {
        path: 'settings',
        element: <Settings />
      }
    ]
  },
  // Redirect old organisation route to new one
  {
    path: '/organisation',
    element: (
      <ProtectedRoute requireAuth={true}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Organisation />
      }
    ]
  }
]

// Create router
export const router = createBrowserRouter(routes)

export default routes
