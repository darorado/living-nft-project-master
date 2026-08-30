// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LivingNFT is ERC721URIStorage, Ownable {
    struct NFTData {
        uint256 genome;
        uint256 energy;
        uint256 age;
        uint256 lastUpdate;
        bool isAlive;
        uint256 feedCount;
        uint256 mutationCount;
        uint256 deathTimestamp;
    }

    mapping(uint256 => NFTData) public nfts;
    uint256 private _nextTokenId;

    uint256 public constant MAX_ENERGY = 100;
    uint256 public constant ENERGY_DECAY_PER_HOUR = 1;
    uint256 public constant FEED_AMOUNT = 10;
    uint256 public constant GHOST_PERIOD = 7 days;

    event NFTBorn(uint256 indexed tokenId, uint256 genome);
    event NFTFed(uint256 indexed tokenId, uint256 newEnergy);
    event NFTMutated(uint256 indexed tokenId, uint256 newGenome);
    event NFTDied(uint256 indexed tokenId);
    event NFTReborn(uint256 indexed tokenId, uint256 newGenome);

    constructor() ERC721("Living NFT", "LNFT") Ownable(msg.sender) {}

    function mint(address to, uint256 initialGenome) public onlyOwner returns (uint256) {
        _nextTokenId++;
        uint256 tokenId = _nextTokenId;
        _mint(to, tokenId);
        _setTokenURI(tokenId, string(abi.encodePacked("https://api.livingnft.io/nft/", _uintToString(tokenId))));

        nfts[tokenId] = NFTData({
            genome: initialGenome,
            energy: MAX_ENERGY,
            age: 0,
            lastUpdate: block.timestamp,
            isAlive: true,
            feedCount: 0,
            mutationCount: 0,
            deathTimestamp: 0
        });

        emit NFTBorn(tokenId, initialGenome);
        return tokenId;
    }

    function feed(uint256 tokenId) public {
        require(nfts[tokenId].isAlive, "NFT is dead");
        _updateLifecycle(tokenId);
        nfts[tokenId].energy = nfts[tokenId].energy + FEED_AMOUNT > MAX_ENERGY ? MAX_ENERGY : nfts[tokenId].energy + FEED_AMOUNT;
        nfts[tokenId].lastUpdate = block.timestamp;
        nfts[tokenId].feedCount++;
        emit NFTFed(tokenId, nfts[tokenId].energy);
    }

    function mutate(uint256 tokenId, uint256 mutationFactor) public onlyOwner {
        require(nfts[tokenId].isAlive, "NFT is dead");
        uint256 newGenome = nfts[tokenId].genome ^ mutationFactor;
        nfts[tokenId].genome = newGenome;
        nfts[tokenId].mutationCount++;
        emit NFTMutated(tokenId, newGenome);
    }

    function rebirth(uint256 tokenId, uint256 newGenome) public onlyOwner {
        require(!nfts[tokenId].isAlive, "NFT is already alive");
        require(block.timestamp >= nfts[tokenId].deathTimestamp + GHOST_PERIOD, "Ghost period not over");
        
        nfts[tokenId].genome = newGenome;
        nfts[tokenId].energy = MAX_ENERGY;
        nfts[tokenId].isAlive = true;
        nfts[tokenId].lastUpdate = block.timestamp;
        nfts[tokenId].deathTimestamp = 0;
        nfts[tokenId].mutationCount++;
        
        emit NFTReborn(tokenId, newGenome);
    }

    function _updateLifecycle(uint256 tokenId) internal {
        NFTData storage nft = nfts[tokenId];
        uint256 timePassed = block.timestamp - nft.lastUpdate;
        uint256 energyLoss = (timePassed / 3600) * ENERGY_DECAY_PER_HOUR;
        
        nft.age += timePassed / 86400;
        if (energyLoss >= nft.energy) {
            nft.energy = 0;
            nft.isAlive = false;
            nft.deathTimestamp = block.timestamp;
            emit NFTDied(tokenId);
        } else {
            nft.energy -= energyLoss;
            nft.lastUpdate = block.timestamp;
        }
    }

    function getNFTStatus(uint256 tokenId) public view returns (uint256 energy, bool isAlive, uint256 genome, uint256 feedCount, uint256 mutationCount, uint256 age, uint256 ghostEnd) {
        NFTData storage nft = nfts[tokenId];
        return (nft.energy, nft.isAlive, nft.genome, nft.feedCount, nft.mutationCount, nft.age, nft.deathTimestamp > 0 ? nft.deathTimestamp + GHOST_PERIOD : 0);
    }

    function _uintToString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}