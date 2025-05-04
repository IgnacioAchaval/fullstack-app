#!/bin/bash
set -e

# Store the root directory
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TESTS_DIR="$ROOT_DIR/tests"

# Function to check if PostgreSQL is running
check_postgres() {
    if command -v psql &> /dev/null; then
        if psql -h localhost -p 5432 -U postgres -d taskmanager_test -c "SELECT 1" &> /dev/null; then
            return 0
        fi
    fi
    return 1
}

# Function to check if Docker is available
check_docker() {
    if command -v docker &> /dev/null; then
        if docker info &> /dev/null; then
            return 0
        fi
    fi
    return 1
}

# Cleanup function
cleanup() {
    echo "Cleaning up..."
    kill $(jobs -p) 2>/dev/null || true
    
    if check_docker; then
        docker stop taskmanager-postgres-test 2>/dev/null || true
        docker rm taskmanager-postgres-test 2>/dev/null || true
    fi
}

# Set up trap for cleanup
trap cleanup EXIT

# Check if PostgreSQL is running or Docker is available
if ! check_postgres; then
    if check_docker; then
        echo "Starting PostgreSQL container..."
        docker run --name taskmanager-postgres-test \
            -e POSTGRES_USER=postgres \
            -e POSTGRES_PASSWORD=postgres \
            -e POSTGRES_DB=taskmanager_test \
            -p 5432:5432 \
            -d postgres:latest
        
        # Wait for PostgreSQL to be ready
        echo "Waiting for PostgreSQL to be ready..."
        for i in {1..30}; do
            if docker exec taskmanager-postgres-test pg_isready -U postgres &> /dev/null; then
                break
            fi
            if [ $i -eq 30 ]; then
                echo "Error: PostgreSQL failed to start"
                exit 1
            fi
            sleep 1
        done
    else
        echo "Error: Neither PostgreSQL is running nor Docker is available"
        echo "Please ensure PostgreSQL is running with the following settings:"
        echo "  Host: localhost"
        echo "  Port: 5432"
        echo "  User: postgres"
        echo "  Password: postgres"
        echo "  Database: taskmanager_test"
        exit 1
    fi
fi

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
PORT=3001 \
DB_USER=postgres \
DB_PASSWORD=postgres \
DB_NAME=taskmanager_test \
DB_HOST=localhost \
DB_PORT=5432 \
NODE_ENV=test \
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

# Run E2E tests
echo "Running E2E tests..."
cd "$TESTS_DIR"
npm install
npm test
TEST_EXIT_CODE=$?

# Cleanup
cleanup

exit $TEST_EXIT_CODE 