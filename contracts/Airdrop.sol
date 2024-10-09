// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../lib/openzeppelin-contracts/ERC20.sol";
import "../lib/openzeppelin-contracts/MerkleProof.sol";

contract AirToken is ERC20 {
    address public distributor;
    address public owner;

    constructor() ERC20("AirToken", "ATK") {
        owner = msg.sender;
    }

    modifier onlyOwner{
        require(msg.sender == owner, "not an owner");
        _;
    }

    function setDistributor(address _distributor) public onlyOwner{
        distributor = _distributor;
    }

    // Функция mint доступна только для контракта AirDrop
    function mint(address to, uint256 amount) public {
        require(msg.sender == distributor, "Minting allowed only by Airdrop contract");
        _mint(to, amount);
    }
}

contract AirDrop {
    uint256 constant MAX_USERS = 100;
    uint256 constant MAX_MINT_AMOUNT = 1000;

    event Minted(address user, uint amount);

    mapping(address => uint) mintsPerUser;
    uint256 public userCount;
    AirToken public airToken;
    bytes32 public root;

    constructor(address _airToken, bytes32 _root) {
        airToken = AirToken(_airToken);
        root = _root;
    }

    function mint(bytes32[] memory _proof) public {
        
        // Меркл проверка
        bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encodePacked(msg.sender, MAX_MINT_AMOUNT))));
        require(MerkleProof.verify(_proof, root, leaf), "not eligible");
        require(mintsPerUser[msg.sender] == 0, "already minted");
        require(userCount < MAX_USERS, "the number of users exceeds the limit");

        // Выполняем mint токенов
        mintsPerUser[msg.sender] += MAX_MINT_AMOUNT;
        userCount += 1;
        airToken.mint(msg.sender, MAX_MINT_AMOUNT);

        emit Minted(msg.sender, MAX_MINT_AMOUNT);
    }
}
