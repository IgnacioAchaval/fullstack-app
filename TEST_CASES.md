# Test Cases Documentation

## Unit Tests

### Backend Tests
1. **Task Controller Tests**
   - Create task
   - Get all tasks
   - Get task by ID
   - Update task
   - Delete task

2. **Database Connection Tests**
   - Connection successful
   - Connection error handling

### Frontend Tests
1. **App Component Tests**
   - Render task table
   - Display tasks
   - Add new task
   - Delete task
   - Show correct status

2. **Task Component Tests**
   - Render task item
   - Display task details
   - Handle status changes

## E2E Tests (CodeceptJS)

1. **Task Creation**
   - Navigate to home page
   - Fill task form
   - Submit form
   - Verify task appears in list

2. **Task Status Update**
   - Create task
   - Click status button
   - Verify status changes

3. **Task Deletion**
   - Create task
   - Click delete button
   - Verify task removed

## Test Coverage

### Backend Coverage
- Controllers: 95%
- Services: 90%
- Database: 85%

### Frontend Coverage
- Components: 90%
- Utils: 85%

## Running Tests

### Unit Tests
```bash
# Backend
cd backend
npm run test

# Frontend
cd frontend
npm run test
```

### E2E Tests
```bash
cd tests
codeceptjs run --steps
``` 