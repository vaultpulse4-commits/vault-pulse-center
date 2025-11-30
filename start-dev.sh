#!/bin/bash

echo "========================================"
echo "Starting Vault Pulse Center"
echo "========================================"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Stopping servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

trap cleanup INT TERM

# Start Backend
echo "Starting Backend Server..."
cd server
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 3

# Start Frontend
echo ""
echo "Starting Frontend Development Server..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "========================================"
echo "Servers Started!"
echo "========================================"
echo ""
echo "Backend:  http://localhost:3001"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait
