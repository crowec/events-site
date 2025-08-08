import './EventDetail.css'

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  theme: 'dark' | 'gold' | 'red' | 'blue'
  capacity?: number
  dress_code?: string
  details?: string
}

interface EventDetailProps {
  event: Event
  onBackToPortal: () => void
}

const EventDetail = ({ event, onBackToPortal }: EventDetailProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className={`event-detail-container theme-${event.theme}`}>
      <button className="back-button" onClick={onBackToPortal}>
        ← Back to Portal
      </button>
      
      <div className="event-detail">
        <div className="event-hero">
          <h1>{event.title}</h1>
          <p className="event-tagline">{event.description}</p>
        </div>

        <div className="event-info">
          <div className="info-section">
            <h3>Date & Time</h3>
            <p>{formatDate(event.date)}</p>
            <p>{event.time}</p>
          </div>

          <div className="info-section">
            <h3>Location</h3>
            <p>{event.location}</p>
          </div>

          {event.capacity && (
            <div className="info-section">
              <h3>Capacity</h3>
              <p>Limited to {event.capacity} guests</p>
            </div>
          )}

          {event.dress_code && (
            <div className="info-section">
              <h3>Dress Code</h3>
              <p>{event.dress_code}</p>
            </div>
          )}
        </div>

        {event.details && (
          <div className="event-description">
            <h3>Details</h3>
            <p>{event.details}</p>
          </div>
        )}

      </div>
    </div>
  )
}

export default EventDetail