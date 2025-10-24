// const hre = require("hardhat");

// async function main() {
//   const BaseflowTasks = await hre.ethers.getContractFactory("BaseflowTasks");
//   const baseflowTasks = await BaseflowTasks.deploy();

//   await baseflowTasks.deployed();

//   console.log("BaseflowTasks deployed to:", baseflowTasks.address);
// }

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });


const hre = require("hardhat");

async function main() {
  const BaseflowTasks = await hre.ethers.getContractFactory("BaseflowTasks");
  const baseflowTasks = await BaseflowTasks.deploy();

  // Wait for deployment confirmation
  await baseflowTasks.waitForDeployment();

  console.log("✅ BaseflowTasks deployed to:", await baseflowTasks.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
