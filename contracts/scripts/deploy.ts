import { ethers } from "hardhat";

async function main() {
  console.log("🧬 Deploying Living NFT Smart Contract...");
  
  // Get the contract factory
  const LivingNFT = await ethers.getContractFactory("LivingNFT");
  
  // Deploy parameters (these should be configured based on your network)
  const vrfCoordinator = "0x8103B0A8A00b5162618c01B3ACe91636B8788f1D"; // Sepolia VRF Coordinator
  const subscriptionId = 1234; // Your VRF subscription ID
  const gasLimit = "0x47e7c46"; // Gas limit key
  
  console.log("📍 Deploying with parameters:");
  console.log(`   VRF Coordinator: ${vrfCoordinator}`);
  console.log(`   Subscription ID: ${subscriptionId}`);
  console.log(`   Gas Limit: ${gasLimit}`);
  
  // Deploy the contract
  const livingNFT = await LivingNFT.deploy(vrfCoordinator, subscriptionId, gasLimit);
  
  console.log("⏳ Waiting for deployment...");
  await livingNFT.waitForDeployment();
  
  const contractAddress = await livingNFT.getAddress();
  
  console.log("🎉 Living NFT Contract deployed successfully!");
  console.log(`📍 Contract Address: ${contractAddress}`);
  console.log(`🔗 Transaction Hash: ${livingNFT.deploymentTransaction()?.hash}`);
  
  // Verify deployment
  console.log("🔍 Verifying contract...");
  try {
    // Mint a test NFT
    console.log("🪙 Minting test NFT...");
    const mintTx = await livingNFT.mint();
    await mintTx.wait();
    
    console.log("✅ Test NFT minted successfully!");
    
    // Get NFT data
    const nftData = await livingNFT.getNFTData(1);
    console.log("📊 NFT Data:");
    console.log(`   Token ID: ${nftData.tokenId}`);
    console.log(`   Energy: ${nftData.energy}`);
    console.log(`   Age: ${nftData.age}`);
    console.log(`   Mutations: ${nftData.mutations}`);
    console.log(`   Is Alive: ${nftData.isAlive}`);
    console.log(`   Owner: ${nftData.owner}`);
    
  } catch (error) {
    console.error("❌ Error during verification:", error);
  }
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress: contractAddress,
    transactionHash: livingNFT.deploymentTransaction()?.hash,
    network: network.name,
    deployedAt: new Date().toISOString(),
    vrfCoordinator: vrfCoordinator,
    subscriptionId: subscriptionId,
    gasLimit: gasLimit
  };
  
  // Write deployment info to file
  const fs = require("fs");
  fs.writeFileSync(
    "../frontend/.env.local",
    `NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}\nNEXT_PUBLIC_NETWORK_URL=${network.config.url}\n`
  );
  
  fs.writeFileSync(
    "../backend/.env",
    `CONTRACT_ADDRESS=${contractAddress}\nNETWORK_URL=${network.config.url}\n`
  );
  
  fs.writeFileSync(
    "deployment-info.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("📝 Deployment info saved to deployment-info.json");
  console.log("🔗 Environment variables updated for frontend and backend");
  
  console.log("\n🚀 Next Steps:");
  console.log("1. Start the frontend: cd ../frontend && npm run dev");
  console.log("2. Start the backend: cd ../backend && npm run dev");
  console.log("3. Open http://localhost:3000 to see your Living NFT");
  
  console.log("\n🎯 Contract is ready for use!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
