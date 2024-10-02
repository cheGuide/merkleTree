//SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "../lib/openzeppelin-contracts/ERC20.sol";
import "../lib/openzeppelin-contracts/MerkleProof.sol";

contract AirToken is ERC20{
    constructor(address initialOwner)
        ERC20("AirToken", "ATK")
    {}

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}

contract AirDrop{
    uint constant MAX_USERS = 100;
    uint constant MAX_MINT_AMOUNT = 1000;

    event Minted(address user, uint amount);

    mapping(address => uint) mintsPerUser;

    uint userCount;
    AirToken public airToken;
    bytes32 root;

    constructor(address _airToken, bytes32 _root){
        airToken = AirToken(_airToken);
        root = _root;
    }
    

    function mint(uint _amount, bytes32[] memory _proof, bytes32 _leaf)public {
        require(MerkleProof.verify(_proof, root, _leaf), "not illegible ");
        require(mintsPerUser[msg.sender] == 0, "already minted");
        require(userCount < MAX_USERS, 
        "the number of users exceeds the limit");

        require(_amount <= MAX_MINT_AMOUNT, 
        "the minting limit per person has been exceeded");

        mintsPerUser[msg.sender] += _amount;
        userCount += 1;
        airToken.mint(msg.sender, _amount);

        emit Minted(msg.sender, _amount);
    }
}