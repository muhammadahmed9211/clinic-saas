## Stage 1: Build the application
# Use a specific version of the node image for consistency
FROM node:21-alpine as builder
# Create and set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies (only production dependencies)
RUN npm install 

# Copy .env files before copying code (needed for build)
COPY .env* ./

# Copy the rest of the application code
COPY . .
# Build the application #
RUN npm run build

# Stage 2: Run the application
FROM node:21-alpine

# Create and set the working directory
WORKDIR /app
RUN apk add --no-cache curl

# Copy the built application from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/mail-templates ./mail-templates
# Copy node modules from builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env ./.env

# Install PM2
RUN npm install -g pm2

EXPOSE 3000

# Create ecosystem.config.js (ensure no Slack references)
# Remove any existing ecosystem.config.js first to avoid conflicts
RUN rm -f ecosystem.config.js && \
    echo "module.exports = { apps: [" > ecosystem.config.js && \
    echo "  { name: 'restapi', script: 'dist/src/main.js', instances: 1, exec_mode: 'fork' }" >> ecosystem.config.js && \
    echo "] }" >> ecosystem.config.js

# Command to start PM2 with the ecosystem file
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
