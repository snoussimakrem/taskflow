# Use official Node.js 22 Alpine image
FROM node:22-alpine

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first (for better caching)
COPY package*.json ./

# Install production dependencies only
# Using --omit=dev instead of --only=production (newer npm syntax)
RUN npm ci --omit=dev

# Copy the rest of the application code
COPY . .

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs && \
    chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose the port the app runs on
EXPOSE 5011

# Command to run the app
CMD ["node", "server.js"]