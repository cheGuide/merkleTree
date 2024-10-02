const { MerkleTree } = require("merkletreejs"); // Используем require для CommonJS
const keccak256 = require("keccak256"); // Используем require для keccak256
const fs = require("fs"); // Используем require для модуля файловой системы
const path = require("path"); // Используем require для модуля пути

// Определяем путь к файлу с whitelist
const whitelistFile = path.join(__dirname, "whitelist.txt"); // или 'whitelist.json'

// Функция для чтения whitelist из файла
function getWhitelist(): string[] {
  let whitelist: string[] = [];
  if (fs.existsSync(whitelistFile)) {
    const fileContent = fs.readFileSync(whitelistFile, "utf-8");
    // Если файл JSON, парсим его как JSON
    if (whitelistFile.endsWith(".json")) {
      whitelist = JSON.parse(fileContent);
    } else {
      // Если файл txt, разбиваем строки
      whitelist = fileContent
        .split("\n")
        .map((addr) => addr.trim())
        .filter(Boolean);
    }
  } else {
    console.error(`Файл ${whitelistFile} не найден.`);
    process.exit(1);
  }
  return whitelist;
}

// Читаем whitelist из файла
const whitelistAddresses = getWhitelist();

// Генерируем хэши для каждого адреса
const leafNodes = whitelistAddresses.map((addr) =>
  keccak256(addr.toLowerCase())
);
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
const root = merkleTree.getRoot().toString("hex");

console.log("Merkle Root:", root);
