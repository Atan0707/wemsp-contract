import { ethers, network } from "hardhat";

async function main () {
    const { ethers } = await network.connect();
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    console.log("Account balance:", (await deployer.getBalance()).toString());

    const AgreementContract = await ethers.getContractFactory("AgreementContract");
    const agreementContract = await AgreementContract.deploy();
    await agreementContract.deployed();

    console.log("AgreementContract deployed to:", agreementContract.address);
}