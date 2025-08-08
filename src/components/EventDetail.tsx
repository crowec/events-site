import './EventDetail.css'

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  backgroundImage?: string
  fontFamily?: string
  backgroundColor?: string
  containerBackgroundColor?: string
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

  const formatDateTime = (dateString: string, timeString: string) => {
    const formattedDate = formatDate(dateString)
    return `${formattedDate} at ${timeString}`
  }

  const containerStyle = {
    background: event.backgroundColor || undefined,
    backgroundImage: event.backgroundImage ? `url(${event.backgroundImage})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    fontFamily: event.fontFamily || undefined
  };

  const infoContainerStyle = {
    background: event.containerBackgroundColor || 'rgba(255, 255, 255, 0.2)'
  };

  const descriptionContainerStyle = {
    background: event.containerBackgroundColor || 'rgba(255, 255, 255, 0.25)'
  };

  return (
    <div 
      className="event-detail-container"
      style={containerStyle}
    >
      <div className="event-overlay">
        <button className="back-button" onClick={onBackToPortal}>
          ← Back to Portal
        </button>
        
        <div className="event-detail">
        <div className="event-hero">
          <h1>{event.title}</h1>
        </div>

        {event.details && (
          <div className="event-description" style={descriptionContainerStyle}>
            <h3>Details</h3>
            <p>{event.details}</p>
          </div>
        )}

        <div className="event-info" style={infoContainerStyle}>
          <div className="info-section">
            <h3>Date & Time</h3>
            <p>{formatDateTime(event.date, event.time)}</p>
          </div>

          <div className="info-section">
            <h3>Location</h3>
            <p>{event.location}</p>
          </div>

          {event.dress_code && (
            <div className="info-section">
              <h3>Dress Code</h3>
              <p>{event.dress_code}</p>
            </div>
          )}
        </div>

        </div>
      </div>
    </div>
  )
}

export default EventDetail