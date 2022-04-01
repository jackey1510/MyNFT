# MyNFT

Simple ERC721 NFT Smart Contract built with Hardhat and openzeppelin

## Lifecycle

1. Deploy to blockchain
2. Set baseURI for your NFT collection metadata URI (.json files)
3. Set unpackedURI for unrevealed image (.json file)
4. flipIsMintActive to enable minting
5. After minting, user should be able to see the cover (unpacked image)
6. flipIsRevealed to unpack users' NFT, users then will see the actual NFT minted

## Commands

Install dependencies

```bash
yarn
```

Compile Solidity and TypeChain

```bash
yarn compile
```

Run Test

```
yarn test
```

Linting

```bash
yarn lint
```

Deploy Contract

You will need to create a .env file to save your credentials. (see .env.example)

```bash
yarn deploy
```

## Etherscan verification

To try out Etherscan verification, you first need to deploy a contract to an Ethereum network that's supported by Etherscan, such as Ropsten.

In this project, copy the .env.example file to a file named .env, and then edit it to fill in the details. Enter your Etherscan API key, your Ropsten node URL (eg from Alchemy), and the private key of the account which will send the deployment transaction. With a valid .env file in place, first deploy your contract:

```shell
hardhat run --network ropsten scripts/deploy.ts
```

Then, copy the deployment address and paste it in to replace `DEPLOYED_CONTRACT_ADDRESS` in this command:

```shell
npx hardhat verify --network ropsten DEPLOYED_CONTRACT_ADDRESS "Hello, Hardhat!"
```
