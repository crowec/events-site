import React from 'react';
import ReactDOM from 'react-dom/client';
// import App from './App.tsx';
import './index.css';
import EventDetail from './components/EventDetail.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <EventDetail
            event={{
        "id": "connie-30",
        "title": "Connie-con",
        "date": "2025-10-04",
        "time": "15:30 - 23:00",
        "location": "SOMEWHERE",
        "backgroundImage": "",
        "fontFamily": "\"Montserrat\", sans-serif",
        "backgroundColor": "linear-gradient(135deg, #1251d9ff 0%, #991f9dff 50%, #cbd414ff 100%)",
        "containerBackgroundColor": "rgba(255, 255, 255, 1)",
        "dressCode": "Business formal",
        "details": "The pinnacle of exclusive networking. Connect with tomorrow's leaders today in a space where cutting-edge innovation meets timeless tradition."
    }}
            onBackToPortal={handleBackToPortal}
        />
    </React.StrictMode>
);
function handleBackToPortal(): void {
    throw new Error('Function not implemented.');
}

