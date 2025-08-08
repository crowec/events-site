# Build stage
FROM node:18-alpine AS build

# Create app directory with non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S backend -u 1001 -G nodejs

WORKDIR /app

# Copy package files
COPY --chown=backend:nodejs package*.json ./

# Install all dependencies (including dev for build)
RUN npm ci --ignore-scripts

# Copy source code
COPY --chown=backend:nodejs . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Install security updates
RUN apk --no-cache add ca-certificates && \
    apk --no-cache upgrade

# Create app directory with non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S backend -u 1001 -G nodejs

WORKDIR /app

# Install build dependencies
RUN apk --no-cache add python3 make g++

# Copy package files and install production dependencies
COPY --chown=backend:nodejs package*.json ./
RUN npm ci --omit=dev && \
    npm cache clean --force

# Copy built application
COPY --from=build --chown=backend:nodejs /app/dist ./dist

# Switch to non-root user
USER backend

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

CMD ["node", "dist/server.js"]