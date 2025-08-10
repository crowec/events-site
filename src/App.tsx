import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import LoginPage from './components/LoginPage'
import EventDetail from './components/EventDetail'
import AttendeeListPage from './components/AttendeeListPage'
import LoadingSpinner from './components/LoadingSpinner'
import apiService, { Event } from './services/api'

function App() {
  const [authenticatedEvent, setAuthenticatedEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const verifyExistingToken = async () => {
      if (apiService.isAuthenticated()) {
        try {
          const { valid, event } = await apiService.verifyToken()
          if (valid && event) {
            setAuthenticatedEvent(event)
          }
        } catch (err) {
          console.error('Token verification failed:', err)
          setError('Session expired. Please log in again.')
        }
      }
      setIsLoading(false)
    }

    verifyExistingToken()
  }, [])

  const handleLogin = async (password: string): Promise<boolean> => {
    try {
      setError(null)
      const response = await apiService.login(password)
      
      if (response.success && response.event) {
        setAuthenticatedEvent(response.event)
        return true
      }
      return false
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed'
      setError(errorMessage)
      return false
    }
  }

  const handleBackToPortal = () => {
    apiService.logout()
    setAuthenticatedEvent(null)
    setError(null)
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!authenticatedEvent) {
    return <LoginPage onLogin={handleLogin} error={error} />
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<EventDetail event={authenticatedEvent} onBackToPortal={handleBackToPortal} />} />
        <Route path="/attendees" element={<AttendeeListPage event={authenticatedEvent} onBack={() => window.location.href = '/'} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App