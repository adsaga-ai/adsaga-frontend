// Route paths constants
export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  
  // Protected routes
  DASHBOARD: '/dashboard',
  ORGANISATION: '/organisation',
  USERS: '/users',
  LOCATIONS: '/locations',
  SETTINGS: '/settings',
  
  // Nested routes
  DASHBOARD_ORGANISATION: '/dashboard/organisation',
  DASHBOARD_USERS: '/dashboard/users',
  DASHBOARD_LOCATIONS: '/dashboard/locations',
  DASHBOARD_SETTINGS: '/dashboard/settings'
}

// Route permissions
export const ROUTE_PERMISSIONS = {
  [ROUTES.HOME]: { requireAuth: false },
  [ROUTES.LOGIN]: { requireAuth: false },
  [ROUTES.REGISTER]: { requireAuth: false },
  [ROUTES.DASHBOARD]: { requireAuth: true },
  [ROUTES.ORGANISATION]: { requireAuth: true },
  [ROUTES.USERS]: { requireAuth: true },
  [ROUTES.LOCATIONS]: { requireAuth: true },
  [ROUTES.SETTINGS]: { requireAuth: true }
}

// Navigation items for sidebar
export const SIDEBAR_NAVIGATION = [
  {
    name: 'Dashboard',
    href: ROUTES.DASHBOARD,
    icon: '📊',
    description: 'Overview and analytics'
  },
  {
    name: 'Organisations',
    href: ROUTES.DASHBOARD_ORGANISATION,
    icon: '🏢',
    description: 'Manage organisations'
  },
  {
    name: 'Users',
    href: ROUTES.DASHBOARD_USERS,
    icon: '👥',
    description: 'User management'
  },
  {
    name: 'Locations',
    href: ROUTES.DASHBOARD_LOCATIONS,
    icon: '📍',
    description: 'Location tracking'
  },
  {
    name: 'Settings',
    href: ROUTES.DASHBOARD_SETTINGS,
    icon: '⚙️',
    description: 'App settings'
  }
]
