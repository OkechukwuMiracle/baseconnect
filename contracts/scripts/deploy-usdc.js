// const hre = require("hardhat");

// async function main() {
//   const BaseflowTasks = await hre.ethers.getContractFactory("BaseflowTasks");
//   const baseflowTasks = await BaseflowTasks.deploy();

//   // Wait for deployment confirmation
//   await baseflowTasks.waitForDeployment();

//   console.log("✅ BaseflowTasks deployed to:", await baseflowTasks.getAddress());
// }

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error("❌ Deployment failed:", error);
//     process.exit(1);
//   });


// scripts/deploy-usdc.js
const hre = require("hardhat");

async function main() {
  console.log("Deploying BaseflowTasksUSDC...");

  // USDC addresses
  const USDC_ADDRESSES = {
    // Base Mainnet
    base: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    // Base Sepolia Testnet
    baseSepolia: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
  };

  // Detect which network we're on
  const network = hre.network.name;
  let usdcAddress;

  if (network === "sepolia" || network === "baseSepolia") {
    usdcAddress = USDC_ADDRESSES.baseSepolia;
    console.log("Using Base Sepolia USDC:", usdcAddress);
  } else if (network === "base") {
    usdcAddress = USDC_ADDRESSES.base;
    console.log("Using Base Mainnet USDC:", usdcAddress);
  } else {
    throw new Error(`Unsupported network: ${network}`);
  }

  // Deploy contract
  const BaseflowTasksUSDC = await hre.ethers.getContractFactory("BaseflowTasksUSDC");
  const contract = await BaseflowTasksUSDC.deploy(usdcAddress);

  // ✅ FIXED: Use waitForDeployment() instead of deployed()
  await contract.waitForDeployment();

  // ✅ FIXED: Use getAddress() to get the contract address
  const contractAddress = await contract.getAddress();

  console.log("✅ BaseflowTasksUSDC deployed to:", contractAddress);
  console.log("USDC Token:", usdcAddress);
  
  // Save deployment info
  console.log("\n📝 Add this to your .env file:");
  console.log(`VITE_CONTRACT_ADDRESS=${contractAddress}`);
  console.log(`USDC_ADDRESS=${usdcAddress}`);

  // Wait for block confirmations before verifying
  if (network !== "hardhat" && network !== "localhost") {
    console.log("\nWaiting for 5 block confirmations...");
    
    // ✅ FIXED: Get deployment transaction and wait for confirmations
    const deploymentTx = contract.deploymentTransaction();
    await deploymentTx.wait(5);

    console.log("\n🔍 Verifying contract on BaseScan...");
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [usdcAddress],
      });
      console.log("✅ Contract verified!");
    } catch (error) {
      console.log("❌ Verification failed:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });