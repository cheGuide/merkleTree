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
    

    function mint (bytes32[] memory _proof)public {
        bytes32 leaf= keccak256(abi.encodePacked(msg.sender));
        
        require(leaf != 0, "wrong address");
        require(MerkleProof.verify(_proof, root,  leaf), "not illegible ");
        require(mintsPerUser[msg.sender] == 0, "already minted");
        require(userCount < MAX_USERS, 
        "the number of users exceeds the limit");

        mintsPerUser[msg.sender] += MAX_MINT_AMOUNT;
        userCount += 1;
        airToken.mint(msg.sender, MAX_MINT_AMOUNT);

        emit Minted(msg.sender, MAX_MINT_AMOUNT);
    }
}