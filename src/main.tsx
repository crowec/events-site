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
                description: `# Welcome to Connie-con 2025! 🎉

## What to Expect

**An unforgettable celebration** featuring:

- **Live Entertainment** and music
- **Gourmet Food & Drinks** 
- **Interactive Games** and activities
- **Special Surprises** throughout the night

### Schedule
- **3:30 PM** - Doors open
- **4:00 PM** - Welcome drinks
- **6:00 PM** - Dinner service
- **8:00 PM** - Entertainment begins
- **11:00 PM** - Late night festivities

> *"A night where cutting-edge innovation meets timeless tradition."*

**Dress Code**: Smart casual to fabulous ✨`,
            }}
            onBackToPortal={handleBackToPortal}
        />
    </React.StrictMode>
);
function handleBackToPortal(): void {
    throw new Error('Function not implemented.');
}
