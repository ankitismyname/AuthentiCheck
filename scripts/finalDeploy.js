const { ethers } = require("hardhat");

async function main() {
  //   const [deployer] = await ethers.getSigners();
  //   console.log("Deploying contracts with the account:", deployer.address);

  // Deploy Company contract
  const ownerAddress = "0x49FC9C47B6BdAA2932f3Fcd4f638f69496Ee4b47";
  const Company = await ethers.getContractFactory("Company");
  const company = await Company.deploy(ownerAddress);
  await company.deployed();
  console.log("Company contract deployed to:", company.address);

  // Deploy Central contract
  const Central = await ethers.getContractFactory("Central");
  const central = await Central.deploy();
  await central.deployed();
  console.log("Central contract deployed to:", central.address);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
