import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
  })

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: {
      background: isDarkMode ? '#0a0a0a' : '#ffffff',
      foreground: isDarkMode ? '#ffffff' : '#000000',
      card: isDarkMode ? '#1a1a1a' : '#ffffff',
      'card-foreground': isDarkMode ? '#ffffff' : '#000000',
      popover: isDarkMode ? '#1a1a1a' : '#ffffff',
      'popover-foreground': isDarkMode ? '#ffffff' : '#000000',
      primary: '#844ee0',
      'primary-foreground': '#ffffff',
      secondary: isDarkMode ? '#2a2a2a' : '#f8f9fa',
      'secondary-foreground': isDarkMode ? '#ffffff' : '#000000',
      muted: isDarkMode ? '#2a2a2a' : '#f8f9fa',
      'muted-foreground': isDarkMode ? '#9ca3af' : '#6b7280',
      accent: '#844ee0',
      'accent-foreground': '#ffffff',
      destructive: '#ef4444',
      'destructive-foreground': '#ffffff',
      border: isDarkMode ? '#374151' : '#e5e7eb',
      input: isDarkMode ? '#1a1a1a' : '#ffffff',
      ring: '#844ee0',
    }
  }

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  )
}
