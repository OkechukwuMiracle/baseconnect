const hre = require("hardhat");

async function main() {
  const BaseflowTasks = await hre.ethers.getContractFactory("BaseflowTasks");
  const baseflowTasks = await BaseflowTasks.deploy();

  await baseflowTasks.deployed();

  console.log("BaseflowTasks deployed to:", baseflowTasks.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });