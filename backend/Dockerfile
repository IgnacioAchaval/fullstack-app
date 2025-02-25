# Use Node.js as base image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package files for both frontend and backend
COPY backend/package.json backend/package-lock.json backend/
COPY frontend/package.json frontend/package-lock.json frontend/

# Install backend dependencies
RUN cd backend && npm install

# Install frontend dependencies and build the frontend
RUN cd frontend && npm install && npm run build

# Copy full backend and frontend directories
COPY backend backend/
COPY frontend frontend/

# Install a lightweight HTTP server to serve the frontend
RUN npm install -g serve

# Expose ports for backend and frontend
EXPOSE 5000 3000

# Start both backend and frontend
CMD cd backend && npm start & serve -s frontend/dist -l 3000