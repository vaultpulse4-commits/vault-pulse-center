# Build stage
FROM node:22-alpine AS builder

WORKDIR /app/server

# Copy package files
COPY server/package*.json ./
COPY server/prisma ./prisma/

# Install dependencies (including dev)
RUN npm ci

# Copy source code
COPY server/ ./

# Generate Prisma Client
RUN npm run prisma:generate

# Build TypeScript
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY server/package*.json ./
COPY server/prisma ./prisma/

# Install only production dependencies
RUN npm ci --only=production

# Copy built files from builder
COPY --from=builder /app/server/dist ./dist
COPY --from=builder /app/server/node_modules/.prisma ./node_modules/.prisma

# Expose port (Railway will use this)
EXPOSE 3001

# Start the app
CMD ["npm", "start"]
