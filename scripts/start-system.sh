#!/bin/bash
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
echo -e "${GREEN}🧬 Initializing Living NFT Ecosystem on Linux...${NC}"
if ! docker info > /dev/null 2>&1; then
  echo -e "${RED}❌ Docker is not running. Run: sudo systemctl start docker${NC}"; exit 1
fi
if ! curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
  echo -e "${YELLOW}⚠️ Ollama not reachable at :11434 — AI features will fallback${NC}"
  echo -e "${YELLOW}   Run: ollama serve & ollama pull llama3.2${NC}"
else
  echo -e "${GREEN}✅ Ollama reachable${NC}"; ollama list 2>/dev/null | head -n 10
fi
echo -e "${YELLOW}🔨 Building images...${NC}"
docker compose build
docker compose down -v 2>/dev/null || true
echo -e "${GREEN}🚀 Starting services...${NC}"
docker compose up -d
echo -e "${YELLOW}⏳ Waiting 12s for blockchain...${NC}"; sleep 12
docker compose ps
echo ""
# deploy contracts inside blockchain container
echo -e "${YELLOW}📜 Deploying contracts...${NC}"
docker exec living-nft-blockchain npx hardhat run scripts/deploy.js --network localhost 2>&1 | tail -n 30 || echo "Deploy via host fallback..."
if ! docker exec living-nft-blockchain npx hardhat run scripts/deploy.js --network localhost > /tmp/deploy.log 2>&1; then
  echo -e "${YELLOW}Trying host deploy...${NC}"
  (cd contracts && npx hardhat run scripts/deploy.js --network localhost 2>&1 | tail -n 30)
fi
cat /tmp/deploy.log 2>/dev/null | tail -n 30
echo -e "${GREEN}==========================================${NC}"
echo -e "🌐 ACCESS POINTS:"
echo -e "   Frontend:     http://localhost:3000"
echo -e "   Technocrat:   http://localhost:3000/technocrat"
echo -e "   Backend API:  http://localhost:3001/health"
echo -e "   Blockchain:   http://localhost:8545"
echo -e "   Redis:        localhost:6379"
echo -e "   Ollama:       http://localhost:11434"
echo -e "==========================================${NC}"
echo -e "${YELLOW}Logs: docker compose logs -f${NC}"
echo -e "${YELLOW}Stop: docker compose down${NC}"
