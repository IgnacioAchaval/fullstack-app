#!/bin/sh

echo "Starting Backend..."
cd /app/backend
npm start &

echo "Starting Frontend Server..."
serve -s /app/frontend/dist -l 3000