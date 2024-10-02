import { MerkleTree } from "merkletreejs";
const keccak256 = require("keccak256");

// Массив адресов для whitelist
const whitelistAddresses: string[] = [
  "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
  "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
  "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
  "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
  "0x976EA74026E726554dB657fA54763abd0C3a0aa9",
];

// Генерируем хэши для каждого адреса
const leafNodes = whitelistAddresses.map((addr) =>
  keccak256(addr.toLowerCase())
);
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
const root = merkleTree.getRoot().toString("hex");

console.log("Merkle Root:", root); // Для отладки, вывод корня дерева Merkle

// Объявляем глобально функцию для генерации proof
declare global {
  interface Window {
    generateProof: () => void;
  }
}

window.generateProof = function generateProof() {
  const userAddress = (
    document.getElementById("userAddress") as HTMLInputElement
  ).value;
  const resultDiv = document.getElementById("result");

  // Проверяем, введен ли адрес
  if (!userAddress) {
    resultDiv!.innerHTML = "Пожалуйста, введите адрес.";
    return;
  }

  // Преобразуем адрес в хэш
  const leaf = keccak256(userAddress.toLowerCase());

  // Проверяем, находится ли адрес в whitelist
  if (!whitelistAddresses.includes(userAddress.toLowerCase())) {
    resultDiv!.innerHTML = "Адрес не найден в whitelist.";
    return;
  }

  // Генерируем proof для этого адреса
  const proof = merkleTree.getHexProof(leaf);

  // Проверяем, правильный ли proof для данного root
  const isValid = merkleTree.verify(proof, leaf, merkleTree.getRoot());

  if (isValid) {
    resultDiv!.innerHTML = `Proof для ${userAddress}: <br>${proof.join(
      "<br>"
    )}`;
  } else {
    resultDiv!.innerHTML = "Proof не валиден.";
  }
};
