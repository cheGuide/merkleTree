# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```

Смартконтракт минтит токены для тех людей которые находятся в whitelist.
Находится в скрипте ./ignition/modules/generateRoot.ts, так же этот скрипт выводит root и proof, которые необходимы при деплое и дальнейшем минте токенов.
Для запуска скприта неоходимо ввести команду

```
node ./ignition/modules/generateRoot.ts <address>
```

где <address>-ваш адресс
