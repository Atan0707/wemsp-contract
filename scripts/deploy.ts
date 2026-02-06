import hre from "hardhat";

async function main() {
  // Connect to the network and get ethers
  const network = await hre.network.connect();
  const ethers = network.ethers;
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with the account:", deployer.address);
  
  // Get account balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  // Deploy the AgreementContract
  console.log("\nDeploying AgreementContract...");
  const AgreementContract = await ethers.getContractFactory("AgreementContract");
  const agreementContract = await AgreementContract.deploy();
  
  // Wait for deployment to complete
  await agreementContract.waitForDeployment();
  
  const contractAddress = await agreementContract.getAddress();
  console.log("AgreementContract deployed to:", contractAddress);
  
  // Get deployment transaction details
  const deploymentTx = agreementContract.deploymentTransaction();
  if (deploymentTx) {
    console.log("Deployment transaction hash:", deploymentTx.hash);
    console.log("Waiting for confirmations...");
    await deploymentTx.wait(1);
    console.log("Deployment confirmed!");
  }
  
  // Verify contract owner
  const owner = await agreementContract.owner();
  console.log("\nContract owner:", owner);
  console.log("Deployer address:", deployer.address);
  console.log("Owner matches deployer:", owner === deployer.address);
  
  return contractAddress;
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });