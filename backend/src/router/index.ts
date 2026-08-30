import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { ethers } from 'ethers';
import Redis from 'redis';
import type { WebSocket } from 'ws';
import { characterGenerator } from '../services/characterGenerator';
import { assistant } from '../services/assistant';

// Contract ABI (simplified)
const contractABI = [
  "function getNFTData(uint256 tokenId) view returns (tuple(uint256 tokenId, tuple(uint8[12] layers, uint256 generation, uint256 timestamp) dna, uint256 energy, uint256 age, uint256 lastFed, uint256 mutations, bool isAlive, uint256 birthTime, uint256 lastMutation, address owner, uint256 colonySize) nftData)",
  "function feed(uint256 tokenId)",
  "function forceMutation(uint256 tokenId, uint8 layerIndex)",
  "function breed(uint256 tokenId1, uint256 tokenId2) returns (uint256)",
  "function updateLifeCycle(uint256 tokenId)",
  "function getOwnedNFTs(address owner) view returns (uint256[])",
  "function getMutationHistory(uint256 tokenId) view returns (tuple(uint256 timestamp, uint8 layerIndex, uint8 oldValue, uint8 newValue, string description)[])"
];


// Create tRPC instance
const t = initTRPC.create({
  isServer: true,
  allowOutsideOfServer: true,
});

// Context creation
export const createContext = async () => {
  const redisClient = Redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  });

  await redisClient.connect();

  return {
    redis: redisClient,
    provider: new ethers.JsonRpcProvider(
      process.env.NETWORK_URL || 'http://localhost:8545'
    ),
    contractAddress: process.env.CONTRACT_ADDRESS || '',
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

// Create router
export const appRouter = t.router({
  // Get NFT data
  getNFTData: t.procedure
    .input(z.object({ tokenId: z.number() }))
    .query(async ({ input, ctx }) => {
      const { tokenId } = input;
      const { provider, contractAddress } = ctx;

      try {
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        const nftData = await contract.getNFTData(tokenId);
        
        return {
          success: true,
          data: {
            tokenId: nftData.tokenId.toString(),
            dna: {
              layers: nftData.dna.layers.map((layer: number) => layer.toString()),
              generation: nftData.dna.generation.toString(),
              timestamp: nftData.dna.timestamp.toString()
            },
            energy: nftData.energy.toString(),
            age: nftData.age.toString(),
            lastFed: nftData.lastFed.toString(),
            mutations: nftData.mutations.toString(),
            isAlive: nftData.isAlive,
            birthTime: nftData.birthTime.toString(),
            lastMutation: nftData.lastMutation.toString(),
            owner: nftData.owner,
            colonySize: nftData.colonySize.toString()
          }
        };
      } catch (error) {
        console.error('Error getting NFT data:', error);
        return {
          success: false,
          error: 'Failed to get NFT data'
        };
      }
    }),

  // Feed NFT
  feedNFT: t.procedure
    .input(z.object({ 
      tokenId: z.number(),
      privateKey: z.string()
    }))
    .mutation(async ({ input, ctx }) => {
      const { tokenId, privateKey } = input;
      const { provider, contractAddress } = ctx;

      try {
        const wallet = new ethers.Wallet(privateKey, provider);
        const contract = new ethers.Contract(contractAddress, contractABI, wallet);
        
        const tx = await contract.feed(tokenId);
        const receipt = await tx.wait();
        
        return {
          success: true,
          transactionHash: receipt?.hash,
          blockNumber: receipt?.blockNumber
        };
      } catch (error) {
        console.error('Error feeding NFT:', error);
        return {
          success: false,
          error: 'Failed to feed NFT'
        };
      }
    }),

  // Force mutation
  forceMutation: t.procedure
    .input(z.object({ 
      tokenId: z.number(),
      layerIndex: z.number(),
      privateKey: z.string()
    }))
    .mutation(async ({ input, ctx }) => {
      const { tokenId, layerIndex, privateKey } = input;
      const { provider, contractAddress } = ctx;

      try {
        const wallet = new ethers.Wallet(privateKey, provider);
        const contract = new ethers.Contract(contractAddress, contractABI, wallet);
        
        const tx = await contract.forceMutation(tokenId, layerIndex);
        const receipt = await tx.wait();
        
        return {
          success: true,
          transactionHash: receipt?.hash,
          blockNumber: receipt?.blockNumber
        };
      } catch (error) {
        console.error('Error forcing mutation:', error);
        return {
          success: false,
          error: 'Failed to force mutation'
        };
      }
    }),

  // Breed NFTs
  breedNFTs: t.procedure
    .input(z.object({ 
      tokenId1: z.number(),
      tokenId2: z.number(),
      privateKey: z.string()
    }))
    .mutation(async ({ input, ctx }) => {
      const { tokenId1, tokenId2, privateKey } = input;
      const { provider, contractAddress } = ctx;

      try {
        const wallet = new ethers.Wallet(privateKey, provider);
        const contract = new ethers.Contract(contractAddress, contractABI, wallet);
        
        const tx = await contract.breed(tokenId1, tokenId2);
        const receipt = await tx.wait();
        
        return {
          success: true,
          transactionHash: receipt?.hash,
          blockNumber: receipt?.blockNumber
        };
      } catch (error) {
        console.error('Error breeding NFTs:', error);
        return {
          success: false,
          error: 'Failed to breed NFTs'
        };
      }
    }),

  // Get owned NFTs
  getOwnedNFTs: t.procedure
    .input(z.object({ owner: z.string() }))
    .query(async ({ input, ctx }) => {
      const { owner } = input;
      const { provider, contractAddress } = ctx;

      try {
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        const ownedNFTs = await contract.getOwnedNFTs(owner);
        
        return {
          success: true,
          data: ownedNFTs.map((tokenId: number) => tokenId.toString())
        };
      } catch (error) {
        console.error('Error getting owned NFTs:', error);
        return {
          success: false,
          error: 'Failed to get owned NFTs'
        };
      }
    }),

  // Get mutation history
  getMutationHistory: t.procedure
    .input(z.object({ tokenId: z.number() }))
    .query(async ({ input, ctx }) => {
      const { tokenId } = input;
      const { provider, contractAddress } = ctx;

      try {
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        const mutationHistory = await contract.getMutationHistory(tokenId);
        
        return {
          success: true,
          data: mutationHistory.map((mutation: any) => ({
            timestamp: mutation.timestamp.toString(),
            layerIndex: mutation.layerIndex.toString(),
            oldValue: mutation.oldValue.toString(),
            newValue: mutation.newValue.toString(),
            description: mutation.description
          }))
        };
      } catch (error) {
        console.error('Error getting mutation history:', error);
        return {
          success: false,
          error: 'Failed to get mutation history'
        };
      }
    }),

  // Update lifecycle
  updateLifecycle: t.procedure
    .input(z.object({ 
      tokenId: z.number(),
      privateKey: z.string()
    }))
    .mutation(async ({ input, ctx }) => {
      const { tokenId, privateKey } = input;
      const { provider, contractAddress } = ctx;

      try {
        const wallet = new ethers.Wallet(privateKey, provider);
        const contract = new ethers.Contract(contractAddress, contractABI, wallet);
        
        const tx = await contract.updateLifeCycle(tokenId);
        const receipt = await tx.wait();
        
        return {
          success: true,
          transactionHash: receipt?.hash,
          blockNumber: receipt?.blockNumber
        };
      } catch (error) {
        console.error('Error updating lifecycle:', error);
        return {
          success: false,
          error: 'Failed to update lifecycle'
        };
      }
    }),

  // Get environmental data
  getEnvironmentalData: t.procedure
    .query(async ({ ctx }) => {
      const { redis } = ctx;

      try {
        const weatherData = await redis.get('weather_data');
        const marketData = await redis.get('market_data');
        
        return {
          success: true,
          data: {
            weather: weatherData ? JSON.parse(weatherData) : null,
            market: marketData ? JSON.parse(marketData) : null
          }
        };
      } catch (error) {
        console.error('Error getting environmental data:', error);
        return {
          success: false,
          error: 'Failed to get environmental data'
        };
      }
    }),

  // Get blockchain status
  getBlockchainStatus: t.procedure
    .query(async ({ ctx }) => {
      const { provider } = ctx;

      try {
        const blockNumber = await provider.getBlockNumber();
        const gasPrice = await provider.getFeeData();
        
        return {
          success: true,
          data: {
            blockNumber: blockNumber.toString(),
            gasPrice: gasPrice.gasPrice?.toString(),
            network: await provider.getNetwork()
          }
        };
      } catch (error) {
        console.error('Error getting blockchain status:', error);
        return {
          success: false,
          error: 'Failed to get blockchain status'
        };
      }
    }),

  // Get user statistics
  getUserStats: t.procedure
    .input(z.object({ address: z.string() }))
    .query(async ({ input, ctx }) => {
      const { address } = input;
      const { redis, provider, contractAddress } = ctx;

      try {
        // Get owned NFTs
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        const ownedNFTs = await contract.getOwnedNFTs(address);
        
        // Get cached stats or calculate
        const cacheKey = `user_stats_${address}`;
        const cachedStats = await redis.get(cacheKey);
        
        if (cachedStats) {
          return {
            success: true,
            data: JSON.parse(cachedStats)
          };
        }
        
        // Calculate stats
        let totalEnergy = 0;
        let totalMutations = 0;
        let aliveCount = 0;
        let totalAge = 0;
        
        for (const tokenId of ownedNFTs) {
          try {
            const nftData = await contract.getNFTData(tokenId);
            totalEnergy += Number(nftData.energy);
            totalMutations += Number(nftData.mutations);
            if (nftData.isAlive) aliveCount++;
            totalAge += Number(nftData.age);
          } catch (error) {
            console.error(`Error getting data for token ${tokenId}:`, error);
          }
        }
        
        const stats = {
          totalNFTs: ownedNFTs.length,
          totalEnergy: totalEnergy.toString(),
          totalMutations: totalMutations.toString(),
          aliveCount,
          averageAge: ownedNFTs.length > 0 ? (totalAge / ownedNFTs.length).toFixed(2) : '0',
          lastUpdated: new Date().toISOString()
        };
        
        // Cache for 5 minutes
        await redis.setEx(cacheKey, 300, JSON.stringify(stats));
        
        return {
          success: true,
          data: stats
        };
      } catch (error) {
        console.error('Error getting user stats:', error);
        return {
          success: false,
          error: 'Failed to get user stats'
        };
      }
    }),

  // Get market data
  getMarketData: t.procedure
    .query(async ({ ctx }) => {
      const { redis } = ctx;

      try {
        const marketData = await redis.get('market_data');
        
        if (marketData) {
          return {
            success: true,
            data: JSON.parse(marketData)
          };
        }
        
        // Return default data if no cached data
        return {
          success: true,
          data: {
            floorPrice: '0.05',
            volume24h: '125.5',
            totalSupply: 1000,
            marketCap: '50000',
            timestamp: new Date().toISOString()
          }
        };
      } catch (error) {
        console.error('Error getting market data:', error);
        return {
          success: false,
          error: 'Failed to get market data'
        };
      }
    }),

  // Generate NFT character
  generateCharacter: t.procedure
    .input(z.object({
      prompt: z.string().min(1, "Prompt is required")
    }))
    .mutation(async ({ input, ctx }) => {
      const { prompt } = input;
      const character = await characterGenerator.generateCharacter(prompt);
      return {
        success: true,
        data: character
      };
    }),

  // Chat with NFT assistant
  chatWithAssistant: t.procedure
    .input(z.object({
      message: z.string().min(1, "Message is required"),
      characterId: z.string().optional()
    }))
    .mutation(async ({ input, ctx }) => {
      const { message, characterId } = input;
      let character = null;
      
      // If characterId is provided, try to fetch it from blockchain
      if (characterId) {
        try {
          const contract = new ethers.Contract(
            ctx.contractAddress,
            contractABI,
            ctx.provider
          );
          const tokenId = parseInt(characterId);
          const nftData = await contract.getNFTData(tokenId);
          
          character = {
            name: `NFT #${tokenId}`,
            description: "Living NFT character",
            traits: ["alive", "unique"],
            appearance: "Generated from blockchain",
            backstory: "Born from smart contract",
            powers: ["self-evolution", "digital immortality"]
          };
        } catch (error) {
          console.error('Failed to fetch character from blockchain:', error);
        }
      }
      
      const response = await assistant.chat(message, character);
      return {
        success: true,
        data: response
      };
    })
});

export type AppRouter = typeof appRouter;
