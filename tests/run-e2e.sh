#!/bin/bash
set -e

# Store the root directory
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TESTS_DIR="$ROOT_DIR/tests"

# Start backend
cd "$ROOT_DIR/backend"
echo "Building backend..."
npm install
npm run build
echo "Starting backend..."
npm start &
BACKEND_PID=$!

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
sleep 15

# Run tests
cd "$TESTS_DIR"
echo "Running E2E tests..."
npm install
npx codeceptjs run --steps

# Cleanup
echo "Cleaning up..."
kill $BACKEND_PID 2>/dev/null || true
kill $FRONTEND_PID 2>/dev/null || true 