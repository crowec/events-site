import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import styles from './EventDetail.module.css';
import '../styles/themes.css';

interface Event {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    backgroundImage?: string;
    fontFamily?: string;
    backgroundColor?: string;
    containerBackgroundColor?: string;
    dressCode?: string;
    details?: string;
}

interface EventDetailProps {
    event: Event;
    onBackToPortal: () => void;
}


const EventDetail = ({ event, onBackToPortal }: EventDetailProps) => {

    return (
        <div className={`${styles.container} theme-birthday`}>
            <div className={`${styles.background} background`}>
               
                {/* Birthday stars */}
                    <div className="star-field">
                        {Array.from({ length: 150 }).map((_, i) => (
                            <div
                                key={i}
                                className="star"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 3}s`,
                                    animationDuration: `${2 + Math.random() * 2}s`,
                                }}
                            />
                        ))}
                    </div>
                
            </div>

            <div className={styles.content}>
                <header className={styles.header}>
                    <button className="backButton" onClick={onBackToPortal}>
                     ← Back to Portal
                    </button>

                    <h1 className={`${styles.title} title`}>{event.title}</h1>
                </header>

                <div className={`${styles.eventDetails} event-details`}>
                    <div className={styles.infoGrid}>
                        <div className={styles.infoCard}>
                            <h3>📅 Date & Time</h3>
                            <p>
                                {event.date} at {event.time}
                            </p>
                        </div>

                        <div className={styles.infoCard}>
                            <h3>📍 Location</h3>
                            <p>{event.location}</p>
                        </div>

                        {event.dressCode && (
                            <div className={styles.infoCard}>
                                <h3>👔 Dress Code</h3>
                                <p>{event.dressCode}</p>
                            </div>
                        )}
                    </div>

                    <div className={styles.description}>
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeSanitize]}
                            className={styles.markdown}
                        >
                            {event.details}
                        </ReactMarkdown>
                    </div>

            
                
                </div>
            </div>
        </div>
    );
};

export default EventDetail;

// const EventDetail = ({ event, onBackToPortal }: EventDetailProps) => {
//     const formatDate = (dateString: string) => {
//         return new Date(dateString).toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric',
//         });
//     };

//     const formatDateTime = (dateString: string, timeString: string) => {
//         const formattedDate = formatDate(dateString);
//         return `${formattedDate}, ${timeString}`;
//     };

//     const containerStyle = {
//         background: event.backgroundColor || undefined,
//         backgroundImage: event.backgroundImage
//             ? `url(${event.backgroundImage})`
//             : undefined,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         backgroundAttachment: 'fixed',
//         fontFamily: event.fontFamily || undefined,
//     };

//     const infoContainerStyle = {
//         background:
//             event.containerBackgroundColor || 'rgba(255, 255, 255, 0.2)',
//     };

//     const descriptionContainerStyle = {
//         background:
//             event.containerBackgroundColor || 'rgba(255, 255, 255, 0.25)',
//     };

//     return (
//         <div className="event-detail-container" style={containerStyle}>
//             {event.id === 'connie-30' && (
//                     <div className="star-field">
//                         {Array.from({ length: 150 }).map((_, i) => (
//                             <div
//                                 key={i}
//                                 className="star"
//                                 style={{
//                                     left: `${Math.random() * 100}%`,
//                                     top: `${Math.random() * 100}%`,
//                                     animationDelay: `${Math.random() * 3}s`,
//                                     animationDuration: `${2 + Math.random() * 2}s`,
//                                 }}
//                             />
//                         ))}
//                     </div>
//             )}
            
//             <div className="event-overlay">
//                 <button className="back-button" onClick={onBackToPortal}>
//                     ← Back to Portal
//                 </button>

//                 <div className="event-detail">
//                     <div className="event-hero">
//                         <h1>{event.title}</h1>
//                     </div>

//                     {event.details && (
//                         <div
//                             className="event-description"
//                             style={descriptionContainerStyle}
//                         >
//                             <h3>Details</h3>
//                             <p>{event.details}</p>
//                         </div>
//                     )}

//                     <div className="event-info" style={infoContainerStyle}>
//                         <div className="info-section">
//                             <h3>Date & Time</h3>
//                             <p>{formatDateTime(event.date, event.time)}</p>
//                         </div>

//                         <div className="info-section">
//                             <h3>Location</h3>
//                             <p>{event.location}</p>
//                         </div>

//                         {event.dress_code && (
//                             <div className="info-section">
//                                 <h3>Dress Code</h3>
//                                 <p>{event.dress_code}</p>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EventDetail;
