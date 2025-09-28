import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'

// Layouts
import MainLayout from '../layouts/MainLayout'
import DashboardLayout from '../layouts/DashboardLayout'

// Pages
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import ForgotPassword from '../pages/ForgotPassword'
import ResetPassword from '../pages/ResetPassword'
import DashboardNew from '../pages/DashboardNew'
import Organisation from '../pages/Organisation'
import Users from '../pages/Users'
import Locations from '../pages/Locations'
import Settings from '../pages/Settings'

// Components
import AuthWrapper from '../components/AuthWrapper'
import OrganisationCheck from '../components/OrganisationCheck'
import ProtectedRoute from './ProtectedRoute'

// Route definitions
export const routes = [
  {
    path: '/',
    element: <AuthWrapper />,
    children: [
      // Dashboard layout with organization check
      {
        path: '',
        element: (
          <ProtectedRoute requireAuth={true}>
            <OrganisationCheck />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <DashboardLayout />
          },
          {
            path: 'organisation',
            element: <DashboardLayout />
          },
          {
            path: 'users',
            element: <DashboardLayout />
          },
          {
            path: 'locations',
            element: <DashboardLayout />
          },
          {
            path: 'workflow-config',
            element: <DashboardLayout />
          },
          {
            path: 'settings',
            element: <DashboardLayout />
          }
        ]
      },
      // Public routes with main layout
      {
        path: 'auth',
        element: <MainLayout />,
        children: [
          {
            path: 'home',
            element: <Home />
          }
        ]
      },
      // Login and Register routes (standalone)
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
      },
      {
        path: 'forgot-password',
        element: (
          <ProtectedRoute requireAuth={false}>
            <ForgotPassword />
          </ProtectedRoute>
        )
      },
      {
        path: 'reset-password',
        element: (
          <ProtectedRoute requireAuth={false}>
            <ResetPassword />
          </ProtectedRoute>
        )
      },
      // Dashboard route redirects to root
      {
        path: 'dashboard',
        element: <Navigate to="/" replace />
      }
    ]
  }
]

// Create router
export const router = createBrowserRouter(routes)

export default routes