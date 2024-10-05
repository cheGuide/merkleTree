import { MerkleTree } from "merkletreejs";
const keccak256 = require("keccak256");

// Константа для MAX_MINT_AMOUNT (она должна совпадать с контрактом)
const MAX_MINT_AMOUNT = 1000;

// Массив адресов для whitelist
const whitelistAddresses: string[] = [
  "0x1234567890123456789012345678901234567890",
  "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
  "0x7890789078907890789078907890789078907890",
];

// Генерируем двойные хэши для каждого адреса с учётом MAX_MINT_AMOUNT
const leafNodes = whitelistAddresses.map((addr) =>
  keccak256(keccak256(addr.toLowerCase() + MAX_MINT_AMOUNT))
);
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
const root = merkleTree.getRoot().toString("hex"); // Преобразуем в строку в hex формате

// Выводим Merkle Root для отладки
console.log("Merkle Root:", root);

// Получаем адрес из аргументов командной строки
const userAddress = process.argv[2];

if (!userAddress) {
  console.error("Пожалуйста, укажите адрес как аргумент.");
  process.exit(1);
}

// Преобразуем адрес в двойной хэш с учётом MAX_MINT_AMOUNT
const leaf = keccak256(keccak256(userAddress.toLowerCase() + MAX_MINT_AMOUNT));

// Проверяем, находится ли адрес в whitelist
if (!whitelistAddresses.includes(userAddress.toLowerCase())) {
  console.log("Адрес не найден в whitelist.");
  process.exit(1);
}

// Генерируем proof для этого адреса
const proof = merkleTree.getHexProof(leaf);

// Конвертация proof в формат для Solidity
const proofForSolidity = proof.map((p) => `bytes32(${p})`);

// Выводим массив proof в формате bytes32[]
console.log(`Proof для Solidity: [${proofForSolidity.join(", ")}]`);

// Проверяем, правильный ли proof для данного root
const isValid = merkleTree.verify(proof, leaf, merkleTree.getRoot());

if (isValid) {
  console.log(
    `Proof для ${userAddress} (в формате bytes32[]):`,
    proofForSolidity
  );
} else {
  console.log("Proof не валиден.");
}
