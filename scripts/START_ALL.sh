#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Starting Living NFT Ecosystem...${NC}"

# 1. Start Hardhat Node (Blockchain)
echo -e "${GREEN}Starting Blockchain Node...${NC}"
cd contracts && npx hardhat node & 
NODE_PID=$!

# 2. Start Backend API
echo -e "${GREEN}Starting Backend API...${NC}"
cd ../backend && npx ts-node src/index.ts & 
BACKEND_PID=$!

# 3. Start Frontend Dashboard
echo -e "${GREEN}Starting Frontend Dashboard...${NC}"
cd ../frontend && npm run dev & 
FRONTEND_PID=$!

echo -e "${BLUE}All systems are launching!${NC}"
echo -e "Blockchain: http://localhost:8545"
echo -e "Backend API: http://localhost:3001"
echo -e "Frontend: http://localhost:3000"

# Keep script running and handle shutdown
trap "kill $NODE_PID $BACKEND_PID $FRONTEND_PID; exit" SIGINT SIGTERM

wait
