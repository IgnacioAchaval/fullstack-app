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
npm run build

echo "Starting backend..."
NODE_ENV=development npm run dev > "$LOGS_DIR/backend.log" 2>&1 &
BACKEND_PID=$!

# Start frontend
cd "$ROOT_DIR/frontend"
echo "Starting frontend..."
npm run dev > "$LOGS_DIR/frontend.log" 2>&1 &
FRONTEND_PID=$!

# Function to check if a service is ready
check_service() {
  local url=$1
  local service=$2
  local log_file="$LOGS_DIR/${service}.log"
  
  for i in {1..30}; do
    if curl -s "$url" > /dev/null; then
      echo "$service is ready!"
      return 0
    fi
    if [ $i -eq 30 ]; then
      echo "$service failed to start. Logs:"
      cat "$log_file"
      return 1
    fi
    echo "Waiting for $service... ($i/30)"
    sleep 1
  done
}

# Wait for services to be ready
echo "Waiting for services to be ready..."
check_service "http://localhost:3001/health" "backend" || exit 1
check_service "http://localhost:3000" "frontend" || exit 1

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