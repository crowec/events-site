import React from 'react';
import ReactDOM from 'react-dom/client';
// import App from './App.tsx';
import './index.css';
import EventPage from './components/EventPage.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <EventPage
            event={{
                id: 'connie-30',
                title: 'Welcome to ConnieCon',
                date: '2025-10-04',
                time: '15:30 - 23:00',
                location: 'SOMEWHERE',
                theme: 'birthday',
                description:
                    '#bob\n The pinnacn a space where cutting-edge innovation meets timeless tradition.',
            }}
            onBackToPortal={handleBackToPortal}
        />
    </React.StrictMode>
);
function handleBackToPortal(): void {
    throw new Error('Function not implemented.');
}
