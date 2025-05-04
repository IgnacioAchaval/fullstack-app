#!/bin/bash
set -e

# Store the root directory
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TESTS_DIR="$ROOT_DIR/tests"

# Function to cleanup processes
cleanup() {
  echo "Cleaning up..."
  kill $BACKEND_PID 2>/dev/null || true
  kill $FRONTEND_PID 2>/dev/null || true
  exit 1
}

# Set up cleanup on script exit
trap cleanup EXIT

# Start backend
cd "$ROOT_DIR/backend"
echo "Building backend..."
npm install
npm run build
echo "Starting backend..."
npm start &
BACKEND_PID=$!

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 5

# Start frontend
cd "$ROOT_DIR/frontend"
echo "Building frontend..."
npm install
npm run build
echo "Starting frontend..."
npm run preview &
FRONTEND_PID=$!

# Wait for services to be ready
echo "Waiting for services to start..."
sleep 10

# Run tests
cd "$TESTS_DIR"
echo "Running E2E tests..."
npm install --legacy-peer-deps
npx codeceptjs run --steps

# If we get here, tests passed
trap - EXIT
cleanup 