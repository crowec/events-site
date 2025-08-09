import { useState, useEffect } from 'react'
import './AttendeeList.css'

interface AttendeeListProps {
  eventId: string
  eventTitle: string
  onBack: () => void
}

interface RSVP {
  id: number
  eventId: string
  guestName: string
  status: 'yes' | 'no' | 'maybe'
  createdAt: string
}

interface RSVPCounts {
  yes: number
  no: number
  maybe: number
  total: number
}

const AttendeeList = ({ eventId, eventTitle, onBack }: AttendeeListProps) => {
  const [rsvps, setRSVPs] = useState<RSVP[]>([])
  const [counts, setCounts] = useState<RSVPCounts>({ yes: 0, no: 0, maybe: 0, total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadRSVPs()
  }, [eventId])

  const loadRSVPs = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`http://localhost:3001/api/rsvp/${eventId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch RSVPs')
      }

      const data = await response.json()
      setRSVPs(data.rsvps || [])
      setCounts(data.counts || { yes: 0, no: 0, maybe: 0, total: 0 })
    } catch (err) {
      console.error('Error loading RSVPs:', err)
      setError('Failed to load attendee list. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'yes': return '✓'
      case 'no': return '✗'
      case 'maybe': return '?'
      default: return ''
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'yes': return 'Attending'
      case 'no': return 'Not Attending'  
      case 'maybe': return 'Maybe'
      default: return status
    }
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="attendee-list-container">
        <div className="attendee-list-overlay">
          <button className="back-button" onClick={onBack}>
            ← Back to Event
          </button>
          <div className="loading">Loading attendee list...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="attendee-list-container">
      <div className="attendee-list-overlay">
        <button className="back-button" onClick={onBack}>
          ← Back to Event
        </button>

        <div className="attendee-list">
          <div className="attendee-header">
            <h1>Attendee List</h1>
            <h2>{eventTitle}</h2>
            <button className="refresh-btn" onClick={loadRSVPs} disabled={loading}>
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Refresh
            </button>
          </div>

          <div className="rsvp-summary">
            <div className="summary-item attending">
              <span className="count">{counts.yes}</span>
              <span className="label">Attending</span>
            </div>
            <div className="summary-item maybe">
              <span className="count">{counts.maybe}</span>
              <span className="label">Maybe</span>
            </div>
            <div className="summary-item not-attending">
              <span className="count">{counts.no}</span>
              <span className="label">Not Attending</span>
            </div>
            <div className="summary-item total">
              <span className="count">{counts.total}</span>
              <span className="label">Total Responses</span>
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
              <button onClick={loadRSVPs} className="retry-btn">
                Try Again
              </button>
            </div>
          )}

          {rsvps.length === 0 && !error ? (
            <div className="no-rsvps">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p>No RSVPs yet.</p>
              <p>Be the first to respond to this event!</p>
            </div>
          ) : (
            <div className="rsvp-list">
              <h3>Guest Responses ({counts.total})</h3>
              <div className="rsvp-items">
                {rsvps.map((rsvp) => (
                  <div key={rsvp.id} className={`rsvp-item ${rsvp.status}`}>
                    <div className="guest-info">
                      <span className="guest-name">{rsvp.guestName}</span>
                      <span className="response-time">{formatDate(rsvp.createdAt)}</span>
                    </div>
                    <div className="guest-status">
                      <span className="status-icon">{getStatusIcon(rsvp.status)}</span>
                      <span className="status-text">{getStatusLabel(rsvp.status)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AttendeeList