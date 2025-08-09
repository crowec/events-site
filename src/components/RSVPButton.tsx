import { useState } from 'react'
import './RSVPButton.css'

interface RSVPButtonProps {
  eventId: string
  onRSVPSubmitted?: () => void
}

type RSVPStatus = 'yes' | 'no' | 'maybe'

const RSVPButton = ({ eventId, onRSVPSubmitted }: RSVPButtonProps) => {
  const [showModal, setShowModal] = useState(false)
  const [guestName, setGuestName] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<RSVPStatus>('yes')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!guestName.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`http://localhost:3001/api/rsvp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId,
          guestName: guestName.trim(),
          status: selectedStatus
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit RSVP')
      }

      const data = await response.json()
      setMessage(`RSVP submitted successfully! Total responses: ${data.counts.total}`)
      setGuestName('')
      setShowModal(false)
      onRSVPSubmitted?.()
      setTimeout(() => setMessage(''), 5000)
    } catch (error) {
      console.error('RSVP error:', error)
      setMessage(error instanceof Error ? error.message : 'Failed to submit RSVP')
      setTimeout(() => setMessage(''), 5000)
    }
    setLoading(false)
  }

  const getStatusLabel = (status: RSVPStatus) => {
    switch (status) {
      case 'yes': return 'Attending'
      case 'no': return 'Not Attending'
      case 'maybe': return 'Maybe'
    }
  }

  return (
    <>
      <button className="rsvp-btn" onClick={() => setShowModal(true)}>
        <svg className="rsvp-icon" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
        RSVP
      </button>

      {showModal && (
        <div className="rsvp-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="rsvp-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            <h3>RSVP to Event</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="guestName">Your Name</label>
                <input
                  id="guestName"
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Your Response</label>
                <div className="status-options">
                  {(['yes', 'no', 'maybe'] as RSVPStatus[]).map((status) => (
                    <button
                      key={status}
                      type="button"
                      className={`status-option ${status} ${selectedStatus === status ? 'selected' : ''}`}
                      onClick={() => setSelectedStatus(status)}
                    >
                      <span className="status-text">{getStatusLabel(status)}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" disabled={loading || !guestName.trim()} className="submit-btn">
                  {loading ? 'Submitting...' : 'Submit RSVP'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {message && (
        <div className={`rsvp-message ${message.includes('successfully') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
    </>
  )
}

export default RSVPButton