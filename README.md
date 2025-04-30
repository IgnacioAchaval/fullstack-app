# Task Manager Fullstack Application

A modern task management application built with React, Node.js, and PostgreSQL.

## Features

- Create, read, update, and delete tasks
- Task status management (pending, in progress, completed)
- Modern, responsive UI
- RESTful API
- PostgreSQL database
- Docker containerization
- CI/CD pipeline with GitHub Actions
- Automated testing (unit and E2E)

## Tech Stack

### Frontend
- React with TypeScript
- Material-UI for components
- Vite for build tooling
- React Router for navigation
- Axios for API calls

### Backend
- Node.js with Express
- TypeScript
- PostgreSQL database
- Jest for unit testing
- CodeceptJS for E2E testing

### DevOps
- Docker for containerization
- GitHub Actions for CI/CD
- AWS EC2 for deployment
- DockerHub for image registry

## Prerequisites

- Node.js 20 or later
- Docker and Docker Compose
- PostgreSQL (if running locally)
- Git

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/task-manager.git
   cd task-manager
   ```

2. Set up environment variables:
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   # Frontend
   cp frontend/.env.example frontend/.env
   ```

3. Start the development environment:
   ```bash
   docker-compose up -d
   ```

4. Access the application:
   - Frontend: http://localhost
   - Backend API: http://localhost:3001
   - API Documentation: http://localhost:3001/api-docs

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

## Testing

### Backend Tests

```bash
cd backend
npm run test        # Run unit tests
npm run test:e2e    # Run E2E tests
```

### Frontend Tests

```bash
cd frontend
npm run test
```

## Deployment

The application is automatically deployed to AWS EC2 when changes are pushed to the main branch. The deployment process includes:

1. Running all tests
2. Building Docker images
3. Pushing images to DockerHub
4. Deploying to EC2

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

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

