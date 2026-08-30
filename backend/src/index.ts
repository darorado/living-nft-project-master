import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import cron from 'node-cron';
import Redis from 'redis';
import { ethers } from 'ethers';

// Load environment variables
dotenv.config();

// Import tRPC router
import { appRouter, createContext } from './router';

// Create Express app
const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Redis client
const redisClient = Redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log('🔴 Redis Connected');
});

// WebSocket server for real-time updates
const server = createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('🔌 WebSocket client connected');
  
  ws.on('message', (message) => {
    console.log('📨 Received message:', message.toString());
  });
  
  ws.on('close', () => {
    console.log('🔌 WebSocket client disconnected');
  });
});

// Broadcast function for real-time updates
function broadcast(data: any) {
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// tRPC server setup
const tRPCMiddleware = createExpressMiddleware({
  router: appRouter,
  createContext,
});
// Health check endpoint

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    redis: redisClient.isOpen ? 'connected' : 'disconnected'
  });
});

app.get('/api/status', (req, res) => {
// API status endpoint
  res.json({
    status: 'running',
    version: '1.0.0',
    endpoints: {
      trpc: '/trpc',
      websocket: 'ws://localhost:3001',
      health: '/health',
      status: '/api/status'
    },
    blockchain: {
      contractAddress: process.env.CONTRACT_ADDRESS,
      networkUrl: process.env.NETWORK_URL,
      networkName: process.env.NETWORK_NAME || 'localhost'
    }
  });
});

// Serve tRPC under /trpc
app.use('/trpc', tRPCMiddleware);

// Background tasks with cron
cron.schedule('*/5 * * * *', async () => {
  console.log('⏰ Running lifecycle updates...');
  
  try {
    // Update all NFT lifecycles
    // This would interact with the smart contract
    console.log('🔄 Updating NFT lifecycles');
    
    // Broadcast updates to connected clients
    broadcast({
      type: 'lifecycle_update',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error in lifecycle update:', error);
  }
});

// Environmental data updates
cron.schedule('0 * * * *', async () => {
  console.log('⏰ Running environmental updates...');
  
  try {
    const weatherData = await fetchWeatherData();
    const marketData = await fetchMarketData();
    
    await redisClient.setEx('weather_data', 3600, JSON.stringify(weatherData));
    // Cache in Redis
    await redisClient.setEx('market_data', 3600, JSON.stringify(marketData));
    
    // Broadcast to clients
    broadcast({
      type: 'environmental_update',
      data: { weather: weatherData, market: marketData },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error in environmental update:', error);
  }

});
// Helper functions
async function fetchWeatherData() {
  // Mock weather data - replace with real API call
  return {
    temperature: 22,
    humidity: 65,
    pressure: 1013,
    windSpeed: 10,
    conditions: 'partly_cloudy',
    timestamp: new Date().toISOString()
  };
}

async function fetchMarketData() {
  // Mock market data - replace with real API call
  return {
    floorPrice: '0.05',
    volume24h: '125.5',
    totalSupply: 1000,
    marketCap: '50000',
    timestamp: new Date().toISOString()
  };
}

// Blockchain provider setup
const provider = new ethers.JsonRpcProvider(
  process.env.NETWORK_URL || 'http://localhost:8545'
);

// Contract ABI (simplified)
const contractABI = [
  "function getNFTData(uint256 tokenId) view returns (tuple(uint256 tokenId, tuple(uint8[12] layers, uint256 generation, uint256 timestamp) dna, uint256 energy, uint256 age, uint256 lastFed, uint256 mutations, bool isAlive, uint256 birthTime, uint256 lastMutation, address owner, uint256 colonySize) nftData)",
  "function feed(uint256 tokenId)",
  "function forceMutation(uint256 tokenId, uint8 layerIndex)",
  "function breed(uint256 tokenId1, uint256 tokenId2) returns (uint256)",
  "function updateLifeCycle(uint256 tokenId)"
];

// Contract instance
const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS || '',
  contractABI,
  provider
);

// Start server
const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    // Connect to Redis
    await redisClient.connect();
    
    // Start tRPC server (which includes HTTP and WebSocket)
    const server = tRPCServer.listen({ port: PORT });
    
    console.log(`🚀 Backend API running on port ${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/health`);
    console.log(`📡 tRPC endpoint: http://localhost:${PORT}/trpc`);
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();
    
