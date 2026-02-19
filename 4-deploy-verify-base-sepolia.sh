#!/usr/bin/env bash

set -euo pipefail

BUILD_PROFILE="production"

echo "Cleaning and building artifacts with profile: ${BUILD_PROFILE}"
pnpm hardhat clean
pnpm hardhat build --build-profile "${BUILD_PROFILE}"

echo "Deploying AgreementContract to baseSepolia..."
DEPLOY_OUTPUT="$(pnpm hardhat run --build-profile "${BUILD_PROFILE}" scripts/deploy.ts --network baseSepolia 2>&1)"
echo "$DEPLOY_OUTPUT"

CONTRACT_ADDRESS="$(echo "$DEPLOY_OUTPUT" | sed -n 's/^AgreementContract deployed to: \(0x[a-fA-F0-9]\{40\}\)$/\1/p' | tail -n1)"

if [ -z "$CONTRACT_ADDRESS" ]; then
  echo "Failed to parse deployed contract address from deployment output."
  exit 1
fi

echo "Detected contract address: $CONTRACT_ADDRESS"
echo "Waiting 30 seconds before verification..."
sleep 30

echo "Verifying AgreementContract on baseSepolia..."
pnpm hardhat verify \
  --build-profile "${BUILD_PROFILE}" \
  --network baseSepolia \
  "$CONTRACT_ADDRESS"

echo "Done. AgreementContract deployed and verified at: $CONTRACT_ADDRESS"
