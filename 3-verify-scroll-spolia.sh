#!/bin/bash

# Prompt user for contract address
read -p "Enter the contract address to verify: " CONTRACT_ADDRESS

# Verify the contract on Scroll Sepolia
pnpm hardhat verify --network scrollSepolia $CONTRACT_ADDRESS