# 🎭 Exclusive Events Site

A secure, production-ready event management platform with password-protected access to exclusive events. Built with React, Node.js, Express, and Docker.

## ✨ Features

### 🔐 Security First
- **Server-side authentication** with bcrypt password hashing (12 salt rounds)
- **JWT tokens** with configurable expiration (default 1 hour)
- **Rate limiting** for authentication endpoints
- **Helmet.js security headers** (XSS, CSRF, Content Security Policy)
- **Input validation and sanitization** with express-validator
- **CORS configuration** with whitelisted origins
- **Docker security hardening** (non-root users, read-only filesystems)

### 🎨 Beautiful UI/UX
- **Minimalist homepage** with animated starfield background
- **Custom event styling** - each event has unique fonts, backgrounds, and images
- **Glassmorphism design** with backdrop filters and subtle animations
- **Responsive design** that works on all devices
- **Smooth animations** and micro-interactions

### 🏗️ Production Architecture
- **Multi-service Docker setup** with separate frontend/backend containers
- **Health checks** and container monitoring
- **Environment variable configuration**
- **Comprehensive error handling and logging**
- **TypeScript** for type safety
- **Security-hardened nginx** with optimized configuration

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for development)

### 1. Clone and Start
```bash
git clone <repository-url>
cd events-site
docker compose up --build
```

### 2. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

### 3. Test with Event Passwords
- `shadows` → Midnight Gala (Dark theme)
- `midas` → The Golden Circle (Gold theme)
- `phoenix` → Crimson Society (Red theme)
- `azure` → Sapphire Summit (Blue theme)

## 📁 Project Structure

```
events-site/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── config/         # Event configurations
│   │   ├── middleware/     # Security & auth middleware
│   │   ├── routes/         # API endpoints
│   │   └── server.ts       # Main server file
│   ├── Dockerfile          # Backend container config
│   └── package.json
├── src/                    # React frontend
│   ├── components/         # UI components
│   ├── services/          # API service layer
│   └── styles/            # CSS styling
├── docker-compose.yml      # Multi-service orchestration
├── nginx.conf             # Production nginx config
└── README.md
```

## 🛠️ Development

### Environment Variables
Create a `.env` file with:
```env
# Backend
JWT_SECRET=your-super-secure-jwt-secret-key
JWT_EXPIRES_IN=1h
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# Frontend
REACT_APP_API_URL=http://localhost:3001/api
```

### Adding New Events
Edit `/backend/src/config/events.ts`:
```typescript
await createEventConfig(
  'event-id',
  'Event Title',
  'Event description',
  '2024-12-01',        // Date
  '20:00',             // Time
  'Event Location',
  'dark',              // Theme (dark|gold|red|blue)
  'secret-password',   // Access password
  'https://image-url', // Background image (optional)
  '"Custom Font"',     // Font family (optional)
  'linear-gradient(...)', // Background gradient (optional)
  'Dress code',        // Dress code (optional)
  'Detailed description' // Event details (optional)
)
```

### Development Commands
```bash
# Start in development mode
npm run dev              # Frontend
cd backend && npm run dev # Backend

# Build for production
npm run build
cd backend && npm run build

# Run tests
npm test
cd backend && npm test

# Lint code
npm run lint
cd backend && npm run lint
```

## 🐳 Docker Deployment

### Production Deployment
```bash
# Build and start
docker compose up --build -d

# View logs
docker compose logs -f

# Stop services
docker compose down

# Update and restart
docker compose pull
docker compose up --build -d
```

### Environment Configuration
For production, ensure you:
1. Set a strong `JWT_SECRET` (min 32 characters)
2. Configure proper `FRONTEND_URL` for CORS
3. Set `NODE_ENV=production`
4. Review security settings in `nginx.conf`

## 🔒 Security Features

### Authentication Flow
1. User enters password on homepage
2. Frontend sends password to `/api/auth/login`
3. Backend validates with bcrypt
4. JWT token returned on success
5. Token used for subsequent API calls
6. Token expires after configured time

### Security Headers
- Content Security Policy
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: enabled
- Strict-Transport-Security (HSTS)
- Referrer-Policy: strict-origin-when-cross-origin

### Rate Limiting
- **Auth endpoints**: 5 attempts per 15 minutes
- **General endpoints**: 30 requests per minute
- **IP-based** with Redis-like behavior

## 🎨 Customization

### Event Themes
Each event supports custom styling:
- **Background Images**: High-resolution imagery from Unsplash
- **Custom Fonts**: Google Fonts integration
- **Color Schemes**: CSS gradients and color palettes
- **Visual Effects**: Animations, glassmorphism, shadows

### Frontend Styling
- CSS custom properties for theming
- Responsive design with mobile-first approach
- Smooth transitions and animations
- Accessibility-compliant contrast ratios

## 📊 Monitoring & Logging

### Health Checks
- **Frontend**: `/health` endpoint
- **Backend**: `/health` with system info
- **Docker**: Built-in health check commands

### Logging
- **Morgan** HTTP request logging
- **Structured error logging** with context
- **Security event logging** for audit trails

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and questions:
1. Check the GitHub Issues
2. Review the troubleshooting section
3. Contact the maintainers

---

**Built with ❤️ for exclusive events and secure experiences.**