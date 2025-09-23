# AdSaga Frontend

A modern React.js frontend application for managing organisations, users, and locations. Built with Vite, React Router, and Axios for API integration.

## Features

- **User Authentication**: Login and registration with JWT token management
- **Organisation Management**: Create, read, update, and delete organisations
- **User Management**: Manage users within organisations
- **Location Tracking**: Track multiple locations for each organisation
- **Responsive Design**: Modern, mobile-friendly UI
- **API Integration**: Ready for backend integration with Postman environment support

## Tech Stack

- **React 18** - Frontend framework
- **Vite** - Build tool and development server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Context API** - State management
- **CSS3** - Styling with modern CSS features

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd adsaga-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
# Create .env file in the root directory
VITE_API_BASE_URL=http://localhost:3001/api
VITE_POSTMAN_ENV_URL=normalUrl
VITE_APP_NAME=AdSaga Frontend
VITE_APP_VERSION=1.0.0
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Navigation component
│   └── Footer.jsx      # Footer component
├── contexts/           # React Context providers
│   └── AuthContext.jsx # Authentication context
├── pages/              # Page components
│   ├── Home.jsx        # Home page
│   ├── Login.jsx       # Login page
│   ├── Register.jsx    # Registration page
│   ├── Dashboard.jsx   # User dashboard
│   └── Organisation.jsx # Organisation management
├── services/           # API service functions
│   ├── authService.js  # Authentication API calls
│   └── organisationService.js # Organisation API calls
├── config/             # Configuration files
│   └── environment.js  # Environment configuration
├── utils/              # Utility functions
├── App.jsx             # Main App component
├── App.css             # App-specific styles
├── index.css           # Global styles
└── main.jsx            # Application entry point
```

## API Integration

The application is configured to work with a backend API. Update the `VITE_API_BASE_URL` in your environment file to point to your backend server.

### Postman Environment

The application supports Postman environment variables. Set up your Postman environment with the `normalUrl` variable pointing to your API base URL.

## Database Schema

The application is designed to work with the following database tables:

- `subscription_type` - Subscription types for organisations
- `organisation` - Organisation details
- `organisation_location` - Organisation locations
- `user` - User accounts

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
