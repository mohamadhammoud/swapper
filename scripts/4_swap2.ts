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
  const amount = ethers.utils.parseEther("70000");

  const swapperFactory = await ethers.getContractFactory("Swapper");
  const swapper = await swapperFactory.attach(
    SWAPPER_ADDRESS // The Swapper deployed contract address
  );

  const erc20 = await ethers.getContractFactory("Token");
  const usdcToken = await erc20.attach(
    USDC_ADDRESS // The Polytrade deployed contract address
  );

  const polytradeToken = await erc20.attach(
    Polytrade_ADDRESS // The Polytrade deployed contract address
  );

  console.log();
  console.log(
    "----------------------------------------------------------------------"
  );
  console.log("Owner will set swap price = 2");

  await swapper.setPrice(2);

  await sleep(40000);

  await usdcToken.approve(swapper.address, amount);

  await sleep(40000);

  await swapper.swap(usdcToken.address, amount);

  await sleep(40000);

  console.log();
  console.log("owner will swap all his balance at swap price = 2");
  console.log();

  console.log(
    `Balance of ${PUBLIC_KEY} after swap`,
    await (
      await usdcToken.balanceOf("0x17b7c1765611E0ce15b20aF68ECFdF86Eac636B3")
    ).toString()
  );

  console.log(
    `Balance of ${PUBLIC_KEY} in Polytrade after Swap`,
    await (
      await polytradeToken.balanceOf(
        "0x17b7c1765611E0ce15b20aF68ECFdF86Eac636B3"
      )
    ).toString()
  );

  console.log();
  console.log(
    "----------------------------------------------------------------------"
  );

  console.log(
    "Owner will unswap all his balance at swap price = 2 but we should only swap 35000 ether"
  );

  await sleep(40000);

  await swapper.unswap(usdcToken.address, ethers.utils.parseEther("35000"));

  await sleep(40000);

  console.log(
    `Balance of ${PUBLIC_KEY} after unswap`,
    await (
      await usdcToken.balanceOf("0x17b7c1765611E0ce15b20aF68ECFdF86Eac636B3")
    ).toString()
  );

  console.log(
    `Balance of ${PUBLIC_KEY} in Polytrade after unswap`,
    await (
      await polytradeToken.balanceOf(
        "0x17b7c1765611E0ce15b20aF68ECFdF86Eac636B3"
      )
    ).toString()
  );

  console.log();
  console.log(
    "----------------------------------------------------------------------"
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

const sleep = (delay: number) =>
  new Promise((resolve) => {
    setTimeout(() => resolve({}), delay);
  });
