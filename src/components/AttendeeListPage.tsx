import React, { useState, useEffect } from 'react';
import { Event } from '../services/api';

interface RSVP {
  id: number;
  eventId: string;
  guestName: string;
  status: 'yes' | 'no' | 'maybe';
  createdAt: string;
}

interface RSVPCounts {
  yes: number;
  no: number;
  maybe: number;
  total: number;
}

interface AttendeeListPageProps {
  event: Event;
  onBack: () => void;
}

const AttendeeListPage: React.FC<AttendeeListPageProps> = ({ event, onBack }) => {
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [counts, setCounts] = useState<RSVPCounts>({ yes: 0, no: 0, maybe: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRSVPs();
  }, [event.id]);

  const fetchRSVPs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/rsvp/${event.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch RSVPs');
      }
      
      const data = await response.json();
      setRsvps(data.rsvps || []);
      setCounts(data.counts || { yes: 0, no: 0, maybe: 0, total: 0 });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load RSVPs');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'yes': return '✅';
      case 'no': return '❌';
      case 'maybe': return '❓';
      default: return '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'yes': return '#4CAF50';
      case 'no': return '#f44336';
      case 'maybe': return '#FF9800';
      default: return '#666';
    }
  };

  if (loading) {
    return (
      <div className="attendee-list-page" style={{ 
        minHeight: '100vh', 
        background: event.backgroundColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        fontFamily: event.fontFamily || 'Arial, sans-serif'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '40px',
          maxWidth: '800px',
          margin: '0 auto',
          color: 'white',
          textAlign: 'center'
        }}>
          <div>Loading attendee list...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="attendee-list-page" style={{ 
      minHeight: '100vh', 
      background: event.backgroundColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: event.fontFamily || 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '800px',
        margin: '0 auto',
        color: 'white'
      }}>
        <div style={{ marginBottom: '30px' }}>
          <button
            onClick={onBack}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '10px',
              cursor: 'pointer',
              marginBottom: '20px'
            }}
          >
            ← Back to Event
          </button>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '2.5rem' }}>
            {event.title} - Attendees
          </h1>
          <p style={{ margin: '0', opacity: 0.9 }}>
            Manage and view all RSVPs for this event
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(244, 67, 54, 0.2)',
            border: '1px solid rgba(244, 67, 54, 0.5)',
            borderRadius: '10px',
            padding: '15px',
            marginBottom: '20px',
            color: '#ff9999'
          }}>
            {error}
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '15px',
          marginBottom: '30px'
        }}>
          <div style={{
            background: 'rgba(76, 175, 80, 0.2)',
            padding: '20px',
            borderRadius: '15px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '5px' }}>✅</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{counts.yes}</div>
            <div>Yes</div>
          </div>
          <div style={{
            background: 'rgba(244, 67, 54, 0.2)',
            padding: '20px',
            borderRadius: '15px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '5px' }}>❌</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{counts.no}</div>
            <div>No</div>
          </div>
          <div style={{
            background: 'rgba(255, 152, 0, 0.2)',
            padding: '20px',
            borderRadius: '15px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '5px' }}>❓</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{counts.maybe}</div>
            <div>Maybe</div>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '20px',
            borderRadius: '15px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '5px' }}>📊</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{counts.total}</div>
            <div>Total</div>
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '15px',
          padding: '20px'
        }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '1.5rem' }}>
            All RSVPs ({counts.total})
          </h2>
          
          {rsvps.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              opacity: 0.7 
            }}>
              No RSVPs yet. Share the event to get responses!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {rsvps.map((rsvp) => (
                <div
                  key={rsvp.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '15px 20px',
                    borderRadius: '10px',
                    borderLeft: `4px solid ${getStatusColor(rsvp.status)}`
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                      {rsvp.guestName}
                    </div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                      {new Date(rsvp.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '1.1rem'
                  }}>
                    <span>{getStatusIcon(rsvp.status)}</span>
                    <span style={{ 
                      textTransform: 'capitalize',
                      color: getStatusColor(rsvp.status),
                      fontWeight: 'bold'
                    }}>
                      {rsvp.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '30px',
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '15px'
        }}>
          <button
            onClick={fetchRSVPs}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            🔄 Refresh List
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendeeListPage;