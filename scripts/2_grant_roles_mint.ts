import { ethers } from "hardhat";

import dotenv from "dotenv";

dotenv.config();

const {
  PRIVATE_KEY,
  PUBLIC_KEY,
  ALCHEMY_KEY,
  USDC_ADDRESS,
  Bitcoin_ADDRESS,
  Polytrade_ADDRESS,
  SWAPPER_ADDRESS,
} = process.env;

async function main() {
  const swapperFactory = await ethers.getContractFactory("Swapper");
  const swapper = await swapperFactory.attach(
    SWAPPER_ADDRESS // The Swapper deployed contract address
  );

  const erc20 = await ethers.getContractFactory("Token");
  const polytradeToken = await erc20.attach(
    Polytrade_ADDRESS // The Polytrade deployed contract address
  );

  console.log();
  console.log("Grant MINTER_ROLE for swapper");
  console.log();

  const MINTER_ROLE = await polytradeToken.MINTER_ROLE();
  await polytradeToken.grantRole(MINTER_ROLE, swapper.address);

  console.log();
  console.log("Grant BURNER_ROLE for swapper");
  console.log();

  const BURNER_ROLE = await polytradeToken.BURNER_ROLE();
  await polytradeToken.grantRole(BURNER_ROLE, swapper.address);

  console.log();
  console.log("Granted ");
  console.log();

  const amount = ethers.utils.parseEther("70000");
  const usdcToken = await erc20.attach(
    USDC_ADDRESS // The deployed contract address
  );

  await usdcToken.mint("0x17b7c1765611E0ce15b20aF68ECFdF86Eac636B3", amount);
  console.log();
  console.log("Minting for owner 70000 USDC and we will swap through them");
  console.log();

  const bitcoinToken = await erc20.attach(
    Bitcoin_ADDRESS // The bitcoinToken deployed contract address
  );

  await bitcoinToken.mint("0x17b7c1765611E0ce15b20aF68ECFdF86Eac636B3", amount);

  console.log();
  console.log(
    "----------------------------------------------------------------------------"
  );
  console.log();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
