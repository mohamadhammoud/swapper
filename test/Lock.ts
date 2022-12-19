import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Start Point", async function () {
  let tokenA: any;
  let tokenB: any;
  let tokenC: any;

  let swapper: any;

  let owner: any;
  let user1: any;
  let user2: any;

  beforeEach("Deployments", async function () {
    [owner, user1, user2] = await ethers.getSigners();
    const tokenFactory = await ethers.getContractFactory("Token");

    tokenA = await tokenFactory.deploy("USDC", "USDC");

    tokenB = await tokenFactory.deploy("Bitcoin", "BTC");

    tokenC = await tokenFactory.deploy("Polytrade", "PLT");

    const swapperFactory = await ethers.getContractFactory("Swapper");
    swapper = await swapperFactory.deploy(
      tokenA.address,
      tokenB.address,
      tokenC.address
    );
  });

  describe("Grant swapper contract MINTER_ROLE and BURNER_ROLE roles in tokenC", async function () {
    it("Should call the tokenC contract to grant roles and swap 1:1", async function () {
      const MINTER_ROLE = await tokenC.MINTER_ROLE();
      await tokenC.grantRole(MINTER_ROLE, swapper.address);

      const BURNER_ROLE = await tokenC.BURNER_ROLE();
      await tokenC.grantRole(BURNER_ROLE, swapper.address);

      expect(await tokenC.hasRole(MINTER_ROLE, swapper.address)).to.equal(true);
      expect(await tokenC.hasRole(BURNER_ROLE, swapper.address)).to.equal(true);

      const amount = ethers.utils.parseEther("70000");

      await tokenA.mint(owner.address, amount);
      await tokenB.mint(owner.address, amount);

      expect(await tokenA.balanceOf(owner.address)).to.equal(amount);
      expect(await tokenB.balanceOf(owner.address)).to.equal(amount);

      await tokenA.approve(swapper.address, amount);
      await swapper.swap(tokenA.address, amount);

      expect(await tokenA.balanceOf(owner.address)).to.equal(0);
      expect(await tokenC.balanceOf(owner.address)).to.equal(amount);

      await swapper.unswap(tokenA.address, amount);

      expect(await tokenA.balanceOf(owner.address)).to.equal(amount);
      expect(await tokenC.balanceOf(owner.address)).to.equal(0);
    });

    it("Should call the tokenC contract to grant roles and swap 1:2", async function () {
      const MINTER_ROLE = await tokenC.MINTER_ROLE();
      await tokenC.grantRole(MINTER_ROLE, swapper.address);

      const BURNER_ROLE = await tokenC.BURNER_ROLE();
      await tokenC.grantRole(BURNER_ROLE, swapper.address);

      const mintedAmount = ethers.utils.parseEther("70000");
      await tokenA.mint(owner.address, mintedAmount);

      await swapper.setPrice(2);
      await tokenA.approve(swapper.address, mintedAmount);
      await swapper.swap(tokenA.address, mintedAmount);

      expect(await tokenA.balanceOf(owner.address)).to.equal(
        ethers.utils.parseEther("0")
      );
      expect(await tokenC.balanceOf(owner.address)).to.equal(
        ethers.utils.parseEther("35000")
      );

      await swapper.unswap(tokenA.address, ethers.utils.parseEther("35000"));
      expect(await tokenA.balanceOf(owner.address)).to.equal(mintedAmount);
      expect(await tokenC.balanceOf(owner.address)).to.equal(0);
    });
  });
});
