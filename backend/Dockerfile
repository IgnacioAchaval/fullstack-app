# Use Node.js LTS version
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm ci

# Copy app source
COPY . .

# Build TypeScript code
RUN npm run build

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm", "start"]