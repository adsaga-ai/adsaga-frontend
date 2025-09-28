import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'

// Import store and contexts
import { store } from './store'
import { ThemeProvider } from './contexts/ThemeContext'

// Import router
import { router } from './routes/routes'

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <RouterProvider router={router} />
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="mobile-toast-container"
          toastClassName="mobile-toast"
          bodyClassName="mobile-toast-body"
          style={{
            fontSize: '14px',
            maxWidth: '90vw',
            margin: '0 auto'
          }}
        />
      </ThemeProvider>
    </Provider>
  )
}

export default App
