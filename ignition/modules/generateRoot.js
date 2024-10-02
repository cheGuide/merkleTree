var MerkleTree = require("merkletreejs").MerkleTree; // Используем require для CommonJS
var keccak256 = require("keccak256"); // Используем require для keccak256
var fs = require("fs"); // Используем require для модуля файловой системы
var path = require("path"); // Используем require для модуля пути
// Определяем путь к файлу с whitelist
var whitelistFile = path.join(__dirname, "whitelist.txt"); // или 'whitelist.json'
// Функция для чтения whitelist из файла
function getWhitelist() {
    var whitelist = [];
    if (fs.existsSync(whitelistFile)) {
        var fileContent = fs.readFileSync(whitelistFile, "utf-8");
        // Если файл JSON, парсим его как JSON
        if (whitelistFile.endsWith(".json")) {
            whitelist = JSON.parse(fileContent);
        }
        else {
            // Если файл txt, разбиваем строки
            whitelist = fileContent
                .split("\n")
                .map(function (addr) { return addr.trim(); })
                .filter(Boolean);
        }
    }
    else {
        console.error("\u0424\u0430\u0439\u043B ".concat(whitelistFile, " \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D."));
        process.exit(1);
    }
    return whitelist;
}
// Читаем whitelist из файла
var whitelistAddresses = getWhitelist();
// Генерируем хэши для каждого адреса
var leafNodes = whitelistAddresses.map(function (addr) {
    return keccak256(addr.toLowerCase());
});
var merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
var root = merkleTree.getRoot().toString("hex");
console.log("Merkle Root:", root);
