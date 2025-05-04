#!/bin/bash
set -e

# Store the root directory
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOGS_DIR="$ROOT_DIR/logs"
TESTS_DIR="$ROOT_DIR/tests"

# Create logs directory in the root
mkdir -p "$LOGS_DIR"

# Start backend
cd "$ROOT_DIR/backend"
echo "Building backend..."
npm install
npm run build
npm start &
BACKEND_PID=$!

# Start frontend
cd "$ROOT_DIR/frontend"
echo "Starting frontend..."
npm install
npm run build
npm run preview &
FRONTEND_PID=$!

# Wait for services to be ready
echo "Waiting for services to start..."
sleep 10

# Run tests
cd "$TESTS_DIR"
echo "Running E2E tests..."
# Install codeceptjs if not already installed
if ! command -v npx &> /dev/null; then
  npm install -g codeceptjs
fi

# Run the tests with explicit config path
npx codeceptjs run --config "$TESTS_DIR/codecept.conf.js" --steps

# Cleanup
echo "Cleaning up..."
kill $BACKEND_PID 2>/dev/null || true
kill $FRONTEND_PID 2>/dev/null || true 