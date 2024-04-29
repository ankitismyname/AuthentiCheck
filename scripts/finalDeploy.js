
const hre = require("hardhat");

async function main() {
  const Chai = await hre.ethers.getContractFactory("Central"); //fetching bytecode and ABI
  const chai = await Chai.deploy(); //creating an instance of our smart contract

  await chai.waitForDeployment();//deploying your smart contract

  console.log("Deployed contract address:",`${chai.target}`);
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
