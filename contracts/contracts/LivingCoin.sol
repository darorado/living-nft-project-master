// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LivingCoin is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1000000000 * 10**18;
    uint256 public totalMinted;
    uint256 public burnCount;

    event CoinGenerated(address indexed to, uint256 amount, string reason);
    event CoinsBurned(address indexed from, uint256 amount);

    constructor() ERC20("Living Coin", "LCOIN") Ownable(msg.sender) {}

    function mintReward(address to, uint256 amount, string memory reason) public onlyOwner returns (bool) {
        require(totalMinted + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
        totalMinted += amount;
        emit CoinGenerated(to, amount, reason);
        return true;
    }

    function mintFromEnergy(uint256 energyAmount) public onlyOwner returns (uint256) {
        uint256 coinAmount = (energyAmount * 10**18) / 100;
        require(totalMinted + coinAmount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(msg.sender, coinAmount);
        totalMinted += coinAmount;
        return coinAmount;
    }

    function burn(uint256 amount) public {
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        _burn(msg.sender, amount);
        burnCount += amount;
    }
}