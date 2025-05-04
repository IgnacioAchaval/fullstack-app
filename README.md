# Task Manager Application

A full-stack task management application built with React, Node.js, Express, and PostgreSQL.

## Features

- Create, read, update, and delete tasks
- Mark tasks as completed
- Responsive design
- RESTful API
- PostgreSQL database
- Docker containerization
- CI/CD pipeline with GitHub Actions
- Unit, integration, and E2E tests

## Prerequisites

- Node.js 20 or later
- PostgreSQL 16 or later
- Docker and Docker Compose
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/task-manager.git
cd task-manager
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
# Backend (.env)
NODE_ENV=development
PORT=3000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/taskmanager

# Frontend (.env)
VITE_API_URL=http://localhost:3000
```

4. Start the development servers:
```bash
# Start backend
cd backend
npm run dev

# Start frontend
cd frontend
npm run dev
```

## Running with Docker

1. Build and start the containers:
```bash
docker-compose up --build
```

2. Access the application:
- Frontend: http://localhost
- Backend API: http://localhost:3000

## Testing

### Backend Tests
```bash
cd backend
npm test              # Run unit tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run test:integration # Run integration tests
```

### Frontend Tests
```bash
cd frontend
npm test              # Run unit tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run test:e2e      # Run E2E tests
```

## CI/CD Pipeline

The project includes a GitHub Actions workflow that:
1. Runs tests (unit, integration, and E2E)
2. Builds Docker images
3. Pushes images to DockerHub
4. Deploys to EC2

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

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## API Documentation

### Tasks Endpoints

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task



