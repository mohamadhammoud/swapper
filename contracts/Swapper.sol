// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./interfaces/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Swapper is Ownable {
    IERC20 public immutable tokenA;
    IERC20 public immutable tokenB;

    IERC20 public immutable tokenC;

    uint256 public tokenCPrice;

    /// @notice We should only be able to use the A,B token contracts
    /// @param token_ The token contract address
    modifier isValidToken(address token_) {
        require(
            token_ == address(tokenA) || token_ == address(tokenB),
            "Swapper: Invalid token"
        );
        _;
    }

    /// @notice Deploying contract with the 3 tokens and default price for tokenC
    /// @param tokenA_ The token contract address
    /// @param tokenB_ TokenC amount to be exchanged
    /// @param tokenC_ TokenC amount to be exchanged
    constructor(
        address tokenA_,
        address tokenB_,
        address tokenC_
    ) {
        tokenA = IERC20(tokenA_);
        tokenB = IERC20(tokenB_);
        tokenC = IERC20(tokenC_);

        tokenCPrice = 1;
    }

    /// @notice Swap either tokenA or tokenB to tokenC according to its price
    /// @dev The we should be able to implement code for decimal by ethers.js
    /// @param token_ The token contract address
    /// @param amount_ TokenA or TokenB amount to be exchanged
    function swap(address token_, uint amount_) external isValidToken(token_) {
        IERC20 tokenIn = IERC20(token_);
        tokenIn.transferFrom(msg.sender, address(this), amount_);

        tokenC.mint(msg.sender, amount_ / tokenCPrice);
    }

    /// @notice unSwap either tokenC to either tokenA or tokenB according to tokenC's price
    /// @dev The we should be able to implement code for decimal by ethers.js
    /// @param token_ The token contract address
    /// @param amount_ TokenC amount to be exchanged
    function unswap(address token_, uint amount_)
        external
        isValidToken(token_)
    {
        IERC20 tokenOut = IERC20(token_);
        tokenOut.transfer(msg.sender, amount_ * tokenCPrice);

        tokenC.burn(msg.sender, amount_);
    }

    function setPrice(uint price_) external onlyOwner {
        tokenCPrice = price_;
    }
}
