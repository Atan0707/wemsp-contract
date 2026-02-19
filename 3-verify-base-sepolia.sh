#!/usr/bin/env bash

set -euo pipefail

BUILD_PROFILE="production"

# Prompt user for contract address
read -rp "Enter the contract address to verify: " CONTRACT_ADDRESS

echo "Cleaning and rebuilding artifacts with build profile: ${BUILD_PROFILE}"
pnpm hardhat clean
pnpm hardhat build --build-profile "${BUILD_PROFILE}"

echo "Verifying AgreementContract on baseSepolia at ${CONTRACT_ADDRESS}"
pnpm hardhat verify \
  --build-profile "${BUILD_PROFILE}" \
  --network baseSepolia \
  "${CONTRACT_ADDRESS}"
