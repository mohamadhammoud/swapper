# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

The main functionality is to deploy some ERC20 tokens that can be swapped, unswapped through a Swapper contract.

Swapper contract is able to swap tokens with each others according to a specific price set by Swapper's owner.

Swapper contract can swap by granting MINT_ROLE and BURN_ROLE in the deployed tokens.

Having 3 tokens: token A, token B, and token C.
We can swap, unswap A to C. Swap, unswap B to C also ( can't swap A to B).

Try running some of the following tasks:

npm i

npx hardhat compile

npx hardhat test

Here are some CMDS to play with my project:

optional CMD since all contracts are deployed:
npx hardhat run --network mumbai scripts/1_deploy.ts

required CMDS:
npm ci
npx hardhat run --network mumbai scripts/2_grant_roles_mint.ts
npx hardhat run --network mumbai scripts/3_swap1.ts
npx hardhat run --network mumbai scripts/4_swap2.ts
