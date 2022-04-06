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
