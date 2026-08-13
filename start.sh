#!/usr/bin/env bash

# ==============================================================================
# Netflix Clone - Unified Startup Script
# Starts both Backend (Express/MongoDB) and Frontend (React/Vite) concurrently
# ==============================================================================

# Colorful output helpers
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${BOLD}${CYAN}====================================================${NC}"
echo -e "${BOLD}${CYAN} 🎬 Starting Netflix Clone Project...               ${NC}"
echo -e "${BOLD}${CYAN}====================================================${NC}"

# Check if node_modules exist, install if missing
if [ ! -d "$SCRIPT_DIR/netflix-backend/node_modules" ]; then
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    (cd "$SCRIPT_DIR/netflix-backend" && npm install)
fi

if [ ! -d "$SCRIPT_DIR/netflix-frontend/node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    (cd "$SCRIPT_DIR/netflix-frontend" && npm install)
fi

# Function to stop background processes when Ctrl+C is pressed
cleanup() {
    echo -e "\n${RED}Stopping backend and frontend servers...${NC}"
    kill 0
    exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# Start Backend Server
echo -e "${GREEN}Starting Backend Server on http://localhost:5050...${NC}"
(cd "$SCRIPT_DIR/netflix-backend" && npm run dev) &
BACKEND_PID=$!

# Wait briefly for backend startup
sleep 2

# Start Frontend Server
echo -e "${GREEN}Starting Frontend Server on http://localhost:5173...${NC}"
(cd "$SCRIPT_DIR/netflix-frontend" && npm run dev) &
FRONTEND_PID=$!

# Wait for frontend to get ready, then open browser
sleep 3
echo -e "${BOLD}${GREEN}✅ Both servers are running!${NC}"
echo -e "👉 ${BOLD}Frontend:${NC} http://localhost:5173"
echo -e "👉 ${BOLD}Backend:${NC}  http://localhost:5050"
echo -e "${YELLOW}Press Ctrl+C to stop both servers.${NC}\n"

# Open browser (macOS)
if command -v open > /dev/null; then
    open "http://localhost:5173"
elif command -v xdg-open > /dev/null; then
    xdg-open "http://localhost:5173"
fi

# Keep script running to listen for Ctrl+C
wait
