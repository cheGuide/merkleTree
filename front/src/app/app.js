"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var merkletreejs_1 = require("merkletreejs");
var keccak256 = require("keccak256");
// Массив адресов для whitelist
var whitelistAddresses = [
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
    "0x976EA74026E726554dB657fA54763abd0C3a0aa9",
];
// Генерируем хэши для каждого адреса
var leafNodes = whitelistAddresses.map(function (addr) {
    return keccak256(addr.toLowerCase());
});
var merkleTree = new merkletreejs_1.MerkleTree(leafNodes, keccak256, { sortPairs: true });
var root = merkleTree.getRoot().toString("hex");
console.log("Merkle Root:", root); // Для отладки
// Функция для генерации proof для введенного адреса
window.generateProof = function generateProof() {
    var userAddress = document.getElementById("userAddress").value;
    var resultDiv = document.getElementById("result");
    console.log("Введенный адрес:", userAddress); // Для отладки
    // Проверяем, введен ли адрес
    if (!userAddress) {
        resultDiv.innerHTML = "Пожалуйста, введите адрес.";
        return;
    }
    // Преобразуем адрес в хэш
    var leaf = keccak256(userAddress.toLowerCase());
    console.log("Хэш адреса (leaf):", leaf.toString("hex")); // Для отладки
    // Проверяем, находится ли адрес в whitelist
    if (!whitelistAddresses.includes(userAddress.toLowerCase())) {
        resultDiv.innerHTML = "Адрес не найден в whitelist.";
        return;
    }
    // Генерируем proof для этого адреса
    var proof = merkleTree.getHexProof(leaf);
    console.log("Proof для адреса:", proof); // Для отладки
    // Проверяем, правильный ли proof для данного root
    var isValid = merkleTree.verify(proof, leaf, merkleTree.getRoot());
    console.log("Proof валиден:", isValid); // Для отладки
    if (isValid) {
        resultDiv.innerHTML = "Proof \u0434\u043B\u044F ".concat(userAddress, ": <br>").concat(proof.join("<br>"));
    }
    else {
        resultDiv.innerHTML = "Proof не валиден.";
    }
};
