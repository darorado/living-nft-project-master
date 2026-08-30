import { ethers } from 'ethers';

const NFT_CONTRACT_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

// ABI for LivingNFT contract - minimal ABI with only the functions we need
const NFT_ABI = [
  "function getNFTStatus(uint256 tokenId) public view returns (uint256 energy, bool isAlive, uint256 genome)",
  "function feed(uint256 tokenId) public",
  "function mutate(uint256 tokenId, uint256 mutationFactor) public",
  "function updateLifecycle(uint256 tokenId) public",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function balanceOf(address owner) public view returns (uint256)"
];

export const nftService = {
  provider: new ethers.JsonRpcProvider(process.env.RPC_URL || 'http://localhost:8545'),
  wallet: new ethers.Wallet(process.env.PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4b23ee36b3644bed1fd16d3f3c48383b6f53c998a', undefined),

  async getNFTData(tokenId: string) {
    try {
      const tokenIdNum = ethers.toBigInt(tokenId);
      const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, this.provider);
      
      const [energy, isAlive, dna] = await contract.getNFTStatus(tokenIdNum);
      const owner = await contract.ownerOf(tokenIdNum);
      
      return {
        tokenId,
        energy: Number(energy),
        isAlive: isAlive === 1,
        dna: dna.toString(),
        owner: owner,
        timestamp: Date.now()
      };
    } catch (error: any) {
      throw error;
    }
  },

  async feedNFT(tokenId: string) {
    try {
      const tokenIdNum = ethers.toBigInt(tokenId);
      const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, this.wallet);
      
      const tx = await contract.feed(tokenIdNum);
      const receipt = await tx.wait();
      
      return { success: true, txHash: receipt.hash };
    } catch (error: any) {
      throw error;
    }
  },

  async mutateNFT(tokenId: string, factor: number) {
    try {
      const tokenIdNum = ethers.toBigInt(tokenId);
      const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, this.wallet);
      
      const tx = await contract.mutate(tokenIdNum, factor);
      const receipt = await tx.wait();
      
      return { success: true, txHash: receipt.hash };
    } catch (error: any) {
      throw error;
    }
  }
};
import { ethers } from 'ethers';

const COIN_CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

// ABI for LivingCoin contract - minimal ABI with only the functions we need
const COIN_ABI = [
  "function balanceOf(address owner) public view returns (uint256)",
  "function getTotalSupply() public view returns (uint256)",
  "function getCirculatingSupply() public view returns (uint256)",
  "function totalMinted() public view returns (uint256)",
  "function burnCount() public view returns (uint256)",
  "function mintReward(address to, uint256 amount, string memory reason) public returns (bool)",
  "function mintFromEnergy(uint256 energyAmount) public returns (uint256)",
  "function burn(uint256 amount) public"
];

export const coinService = {
  provider: new ethers.JsonRpcProvider(process.env.RPC_URL || 'http://localhost:8545'),
  wallet: new ethers.Wallet(process.env.PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4b23ee36b3644bed1fd16d3f3c48383b6f53c998a', undefined),

  async getBalance(address: string) {
    try {
      const contract = new ethers.Contract(COIN_CONTRACT_ADDRESS, COIN_ABI, this.provider);
      const balance = await contract.balanceOf(address);
      return ethers.formatUnits(balance, 18);
    } catch (error: any) {
      throw error;
    }
  },

  async getTotalSupply() {
    try {
      const contract = new ethers.Contract(COIN_CONTRACT_ADDRESS, COIN_ABI, this.provider);
      const total = await contract.getTotalSupply();
      return ethers.formatUnits(total, 18);
    } catch (error: any) {
      throw error;
    }
  },

  async getCirculatingSupply() {
    try {
      const contract = new ethers.Contract(COIN_CONTRACT_ADDRESS, COIN_ABI, this.provider);
      const circulating = await contract.getCirculatingSupply();
      return ethers.formatUnits(circulating, 18);
    } catch (error: any) {
      throw error;
    }
  },

  async mintReward(to: string, amount: string, reason: string = 'Manual mint') {
    try {
      const amountWei = ethers.parseUnits(amount, 18);
      const contract = new ethers.Contract(COIN_CONTRACT_ADDRESS, COIN_ABI, this.wallet);
      const tx = await contract.mintReward(to, amountWei, 'Manual mint');
      const receipt = await tx.wait();
      
      return { success: true, txHash: receipt.hash };
    } catch (error: any) {
      throw error;
    }
  }
};