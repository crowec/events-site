import { useState } from 'react'
import './EventDetail.css'
import MarkdownContent from './MarkdownContent'

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
  const [showSuccessFeedback, setShowSuccessFeedback] = useState(false)
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

  const handleAddToCalendar = () => {
    const startDate = new Date(`${event.date}T${event.time}`)
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000) // 2 hours later
    
    const formatICSDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    }
    
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//EventHub//Event Calendar//EN',
      'BEGIN:VEVENT',
      `UID:${event.id}@eventhub.com`,
      `DTSTART:${formatICSDate(startDate)}`,
      `DTEND:${formatICSDate(endDate)}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description}`,
      `LOCATION:${event.location}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n')
    
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.setAttribute('download', `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    setShowSuccessFeedback(true)
    setTimeout(() => setShowSuccessFeedback(false), 2000)
  }

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
            <MarkdownContent content={event.details} />
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
      
      <div className="floating-actions" style={{position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999, padding: '20px', color: 'white'}}>
        <button className="add-to-calendar-btn" onClick={handleAddToCalendar} style={{color: 'white', padding: '15px', border: 'none'}}>
          <svg className="calendar-icon" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          Add to Calendar
        </button>
      </div>
      
      {showSuccessFeedback && (
        <div className="success-feedback">
          ✓ Calendar file downloaded!
        </div>
      )}
    </div>
  )
}

export default EventDetail