import { useState } from 'react'
import './LoginPage.css'

interface LoginPageProps {
  onLogin: (password: string) => Promise<boolean>
  error?: string | null
}

const LoginPage = ({ onLogin, error: globalError }: LoginPageProps) => {
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const displayError = globalError || localError

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!password.trim()) {
      setLocalError('Password is required')
      return
    }

    setIsLoading(true)
    setLocalError('')
    
    try {
      const success = await onLogin(password)
      if (!success) {
        setLocalError('Invalid password')
        setPassword('')
      }
    } catch (err) {
      setLocalError('Connection error. Please try again.')
      setPassword('')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Welcome</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            disabled={isLoading}
            className={displayError ? 'error' : ''}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Access'}
          </button>
        </form>
        {displayError && <div className="error-message">{displayError}</div>}
      </div>
    </div>
  )
}

export default LoginPage