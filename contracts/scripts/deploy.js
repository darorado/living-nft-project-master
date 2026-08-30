const hre = require("hardhat");

async function main() {
  console.log("Deploying LivingCoin...");
  const LivingCoin = await hre.ethers.getContractFactory("LivingCoin");
  const livingCoin = await LivingCoin.deploy();
  await livingCoin.waitForDeployment();
  console.log("LivingCoin deployed to:", await livingCoin.getAddress());

  console.log("\nDeploying LivingNFT...");
  const LivingNFT = await hre.ethers.getContractFactory("LivingNFT");
  const livingNFT = await LivingNFT.deploy();
  await livingNFT.waitForDeployment();
  const nftAddress = await livingNFT.getAddress();
  console.log("LivingNFT deployed to:", nftAddress);

  const [owner] = await hre.ethers.getSigners();
  console.log("\nOwner:", owner.address);

  console.log("\nMinting NFT #1 with genome 12345...");
  const mintTx = await livingNFT.mint(owner, 12345);
  await mintTx.wait();
  console.log("Minted token 1");

  console.log("\nMinting 1000 LCOIN to owner...");
  const coinTx = await livingCoin.mintReward(owner.address, hre.ethers.parseUnits("1000", 18), "Initial distribution");
  await coinTx.wait();
  console.log("Minted 1000 LCOIN");

  console.log("\nChecking NFT status...");
  const status = await livingNFT.getNFTStatus(1);
  console.log("NFT #1 status:", {
    energy: Number(status[0]),
    isAlive: status[1],
    genome: status[2].toString()
  });

  console.log("\nChecking coin balance...");
  const balance = await livingCoin.balanceOf(owner.address);
  console.log("LCOIN balance:", hre.ethers.formatUnits(balance, 18));

  console.log("\nAll contracts deployed and verified!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});