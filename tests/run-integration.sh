#!/bin/bash
set -e

# Store the root directory
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TESTS_DIR="$ROOT_DIR/tests"

# Cleanup function
cleanup() {
    echo "Cleaning up..."
    kill $(jobs -p) 2>/dev/null || true
}

# Set up trap for cleanup
trap cleanup EXIT

# Set environment variables for test environment
export NODE_ENV=test
export PORT=3001
export DB_USER=postgres
export DB_PASSWORD=postgres
export DB_NAME=taskmanager_test
export DB_HOST=localhost
export DB_PORT=5432

# Build and start backend
echo "Building backend..."
cd "$ROOT_DIR/backend"
npm install
npm run build

echo "Starting backend..."
npm start &
BACKEND_PID=$!

# Wait for backend to start
echo "Waiting for backend to start..."
for i in {1..30}; do
    if curl -s http://localhost:3001/api/tasks/health > /dev/null; then
        break
    fi
    if [ $i -eq 30 ]; then
        echo "Error: Backend failed to start"
        exit 1
    fi
    sleep 1
done

# Build and start frontend
echo "Building frontend..."
cd "$ROOT_DIR/frontend"
npm install
npm run build

echo "Starting frontend..."
npm run preview &
FRONTEND_PID=$!

# Wait for frontend to start
echo "Waiting for frontend to start..."
for i in {1..30}; do
    if curl -s http://localhost:4173 > /dev/null; then
        break
    fi
    if [ $i -eq 30 ]; then
        echo "Error: Frontend failed to start"
        exit 1
    fi
    sleep 1
done

# Run integration tests
echo "Running integration tests..."
cd "$TESTS_DIR"
npm install
npm test
TEST_EXIT_CODE=$?

# Cleanup
cleanup

exit $TEST_EXIT_CODE 