"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var merkletreejs_1 = require("merkletreejs");
var keccak256 = require("keccak256");
// Массив адресов для whitelist
var whitelistAddresses = [
    "0x1234567890123456789012345678901234567890",
    "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    "0x7890789078907890789078907890789078907890",
];
// Генерируем хэши для каждого адреса
var leafNodes = whitelistAddresses.map(function (addr) {
    return keccak256(addr.toLowerCase());
});
var merkleTree = new merkletreejs_1.MerkleTree(leafNodes, keccak256, { sortPairs: true });
var root = merkleTree.getRoot().toString("hex"); // Преобразуем в строку в hex формате
// Выводим Merkle Root для отладки
console.log("Merkle Root:", root);
// Получаем адрес из аргументов командной строки
var userAddress = process.argv[2];
if (!userAddress) {
    console.error("Пожалуйста, укажите адрес как аргумент.");
    process.exit(1);
}
// Преобразуем адрес в хэш
var leaf = keccak256(userAddress.toLowerCase());
// Проверяем, находится ли адрес в whitelist
if (!whitelistAddresses.includes(userAddress.toLowerCase())) {
    console.log("Адрес не найден в whitelist.");
    process.exit(1);
}
// Генерируем proof для этого адреса
var proof = merkleTree.getHexProof(leaf);
// Конвертация proof в формат для Solidity
var proofForSolidity = proof.map(function (p) { return "bytes32(".concat(p, ")"); });
// Выводим массив proof в формате bytes32[]
console.log("Proof \u0434\u043B\u044F Solidity: [".concat(proofForSolidity.join(", "), "]"));
// Проверяем, правильный ли proof для данного root
var isValid = merkleTree.verify(proof, leaf, merkleTree.getRoot());
if (isValid) {
    console.log("Proof \u0434\u043B\u044F ".concat(userAddress, " (\u0432 \u0444\u043E\u0440\u043C\u0430\u0442\u0435 bytes32[]):"), proofForSolidity);
}
else {
    console.log("Proof не валиден.");
}
