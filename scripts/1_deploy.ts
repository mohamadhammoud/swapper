import { ethers } from "hardhat";

import dotenv from "dotenv";

dotenv.config();

const { PRIVATE_KEY, PUBLIC_KEY, ALCHEMY_KEY } = process.env;

async function main() {
  const tokenFactory = await ethers.getContractFactory("Token");

  console.log(`Deploying Contracts`);
  console.log(
    `-------------------------------------------------------------------------`
  );

  const deployUSDC = await tokenFactory.deploy("USDC", "USDC");
  const USDC = await deployUSDC.deployed();

  const deployBitcoin = await tokenFactory.deploy("Bitcoin", "BTC");
  const Bitcoin = await deployBitcoin.deployed();

  const deployPolytrade = await tokenFactory.deploy("Polytrade", "PLT");
  const Polytrade = await deployPolytrade.deployed();

  const swapperFactory = await ethers.getContractFactory("Swapper");

  const deploySwapper = await swapperFactory.deploy(
    USDC.address,
    Bitcoin.address,
    Polytrade.address
  );

  const swapper = await deploySwapper.deployed();

  console.log("deployUSDC address USDC", USDC.address);
  console.log("deployBitcoin address USDC", Bitcoin.address);
  console.log("Polytrade address USDC", Polytrade.address);
  console.log("Swagger address", swapper.address);
  console.log();
  console.log(
    `-------------------------------------------------------------------------`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
