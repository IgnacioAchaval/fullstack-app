# Test Cases

## Backend Tests

### Unit Tests

#### Task Service
1. **Create Task**
   - Should create a new task with valid data
   - Should handle missing optional fields
   - Should throw error with invalid data

2. **Get Tasks**
   - Should return all tasks
   - Should return tasks in correct order
   - Should handle empty task list

3. **Get Task by ID**
   - Should return task with valid ID
   - Should throw error with invalid ID
   - Should throw error with non-existent ID

4. **Update Task**
   - Should update task with valid data
   - Should handle partial updates
   - Should throw error with invalid ID
   - Should throw error with invalid data

5. **Delete Task**
   - Should delete task with valid ID
   - Should throw error with invalid ID
   - Should throw error with non-existent ID

### Integration Tests

#### API Endpoints
1. **Health Check**
   - Should return 200 OK
   - Should return correct status message

2. **Create Task**
   - Should create task with valid data
   - Should return 201 Created
   - Should return created task data
   - Should handle invalid data

3. **Get Tasks**
   - Should return all tasks
   - Should return 200 OK
   - Should return correct task data

4. **Get Task by ID**
   - Should return task with valid ID
   - Should return 200 OK
   - Should return 404 for non-existent ID

5. **Update Task**
   - Should update task with valid data
   - Should return 200 OK
   - Should return updated task data
   - Should handle invalid data

6. **Delete Task**
   - Should delete task with valid ID
   - Should return 204 No Content
   - Should return 404 for non-existent ID

## Frontend Tests

### Unit Tests

#### Components
1. **TaskList**
   - Should render empty state
   - Should render list of tasks
   - Should handle task completion
   - Should handle task deletion

2. **TaskForm**
   - Should render form fields
   - Should handle form submission
   - Should validate required fields
   - Should handle form reset

3. **TaskItem**
   - Should render task data
   - Should handle completion toggle
   - Should handle deletion
   - Should handle editing

### E2E Tests

1. **Task Management Flow**
   - Should create new task
   - Should view task list
   - Should mark task as completed
   - Should delete task
   - Should handle invalid inputs

2. **Error Handling**
   - Should handle API errors
   - Should handle network errors
   - Should show error messages
   - Should recover from errors

3. **User Interface**
   - Should be responsive
   - Should have working navigation
   - Should show loading states
   - Should handle form validation

## Test Coverage Requirements

### Backend
- Unit Tests: > 80% coverage
- Integration Tests: > 70% coverage
- All critical paths tested
- Error cases covered

### Frontend
- Unit Tests: > 80% coverage
- E2E Tests: All user flows
- Component Tests: All components
- Error cases covered

## Test Environment

### Backend
- Node.js 20
- PostgreSQL 16
- Jest for unit tests
- Supertest for integration tests

### Frontend
- Node.js 20
- React 18
- Jest for unit tests
- Playwright for E2E tests

## Running Tests

### Backend
```bash
# Unit Tests
npm test

# Integration Tests
npm run test:integration

# Coverage Report
npm run test:coverage
```

### Frontend
```bash
# Unit Tests
npm test

# E2E Tests
npm run test:e2e

# Coverage Report
npm run test:coverage
``` 