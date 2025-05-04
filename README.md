# Task Management Application

A simple task management application built with Node.js, React, and PostgreSQL.

## Project Structure

- `backend/` - Node.js Express API
- `frontend/` - React frontend application
- `tests/` - Integration tests using CodeceptJS
- `.github/workflows/` - GitHub Actions CI/CD configuration

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- PostgreSQL (if running locally)

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd fullstack-app
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:
```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

4. Start the development environment:
```bash
docker-compose up
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## Testing

### Unit Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Integration Tests
```bash
npm run test:e2e
```

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment:
- Builds the application on every push to main
- Runs unit tests
- Creates and pushes Docker images
- Deploys to production environment
- Runs integration tests against the deployed application

## Docker

Build and run the application using Docker:
```bash
docker-compose up --build
```

## License

MIT

## Features

- Create, read, update, and delete tasks
- Mark tasks as complete/incomplete
- Filter and sort tasks
- Responsive design
- Real-time updates

## Tech Stack

### Backend
- Node.js
- Express
- PostgreSQL
- TypeScript
- Jest for testing

### Frontend
- React
- TypeScript
- Vite
- Jest for testing

## Development

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## API Documentation

### Tasks Endpoints

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── tests/
│   │   └── types/
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── tests/
│   │   └── types/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```



