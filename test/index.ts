import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import assert from "assert";
import { expect } from "chai";
import { ethers } from "hardhat";
import { MyNFT } from "../typechain";

describe("MyNFT", function () {
  const minimumAmount = "0.01"; // eth
  let myNFT: MyNFT;
  let owner: SignerWithAddress;
  let accounts: SignerWithAddress[];
  beforeEach(async () => {
    myNFT = await ethers
      .getContractFactory("MyNFT")
      .then((factory) => factory.deploy());
    accounts = await ethers.getSigners();
    [owner] = accounts;
  });

  describe("constructor", () => {
    it("should be initialized", async () => {
      expect(myNFT);
    });

    it("owner() should be owner.address", async () => {
      expect(await myNFT.owner()).equal(owner.address);
    });

    it("isMintActive should be false", async () => {
      expect(await myNFT.isMintActive()).to.be.false;
    });
  });

  describe("setBaseUri", () => {
    it("should set the base URI", async () => {
      const baseUri = "abcde";
      assert(await myNFT.setBaseURI(baseUri));
    });
  });

  it("should flip isMintActive", async () => {
    const isMintActive = await myNFT.isMintActive();
    await myNFT.flipIsMintActive();
    expect(await myNFT.isMintActive()).to.equal(!isMintActive);
  });

  describe("payToMint", () => {
    const metaDataUri = "uri";
    describe("when isMintActive is false", async () => {
      it("should throw error", async () => {
        await assert.rejects(myNFT.payToMint(metaDataUri));
      });
    });

    describe("given isRevealed is false", () => {
      beforeEach(async () => {
        await Promise.all([
          myNFT.flipIsMintActive().then((tx) => tx.wait()),
          myNFT.setUnpackedURI("123"),
        ]);
      });

      it("when user mints, should return unpackedURI", async () => {
        await myNFT.connect(accounts[0]).payToMint(metaDataUri, {
          value: ethers.utils.parseEther(minimumAmount),
        });
        expect(await myNFT.tokenURI(0)).to.be.equal("123");
      });
    });

    describe("given isRevealed is true", () => {
      const baseUri = "ipfs://baseUri/";
      beforeEach(async () => {
        await Promise.all([
          myNFT.flipIsMintActive().then((tx) => tx.wait()),
          myNFT.flipIsRevealed(),
          myNFT.setUnpackedURI("123"),
          myNFT.setBaseURI(baseUri),
        ]);
      });

      it("when user mints, should return unpackedURI", async () => {
        await myNFT.connect(accounts[0]).payToMint(metaDataUri, {
          value: ethers.utils.parseEther(minimumAmount),
        });
        expect(await myNFT.tokenURI(0)).to.be.equal(`${baseUri}${metaDataUri}`);
      });
    });
    describe("given isMintActive is true", async () => {
      beforeEach(async () => {
        await Promise.all([
          myNFT.flipIsMintActive().then((tx) => tx.wait()),
          myNFT.flipIsRevealed(),
        ]);
      });

      it("should allow users to mint when value >= minimumAmount", async () => {
        assert(
          await myNFT
            .connect(accounts[0])
            .payToMint(metaDataUri, {
              value: ethers.utils.parseEther(minimumAmount),
            })
            .then((tx) => tx.wait())
        );
        expect(await myNFT.getCount()).to.equal(1);
      });
      it("should reject users to mint when value < minimumAmount", async () => {
        await assert.rejects(
          myNFT
            .connect(accounts[0])
            .payToMint(metaDataUri, { value: ethers.utils.parseEther("0.009") })
        );
      });

      it("should reject users to mint the same uri twice", async () => {
        await myNFT
          .connect(accounts[0])
          .payToMint(metaDataUri, {
            value: ethers.utils.parseEther(minimumAmount),
          })
          .then((tx) => tx.wait());

        expect(await myNFT.mintedNFT(metaDataUri)).to.be.true;

        await assert.rejects(
          myNFT.connect(accounts[0]).payToMint(metaDataUri, {
            value: ethers.utils.parseEther(minimumAmount),
          })
        );
      });
      describe("given hasNFTAvailable is false", () => {
        beforeEach(async () => {
          return myNFT.setTotalNFTAvailable(0).then((tx) => tx.wait());
        });
        it("should throw error", async () => {
          await assert.rejects(
            myNFT.payToMint(metaDataUri, {
              value: ethers.utils.parseEther(minimumAmount),
            })
          );
        });
      });
    });
  });
});
