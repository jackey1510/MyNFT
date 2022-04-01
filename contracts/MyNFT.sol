// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    uint32 public totalNFTAvailable = 10;

    bool public isMintActive = false;

    bool public isRevealed = false;

    string private baseURI = "ipfs://";

    string public unpackedURI;

    uint256 public mininumAmount = 0.01 ether;

    mapping(string => bool) public mintedNFT;

    constructor() ERC721("MyNFT", "MNFT") {}

    function setMinimumEther(uint256 mininum) public onlyOwner {
        mininumAmount = mininum;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string memory uri) public onlyOwner {
        baseURI = uri;
    }

    function setUnpackedURI(string memory uri) public onlyOwner {
        unpackedURI = uri;
    }

    function safeMint(address to, string memory uri)
        public
        onlyOwner
        returns (uint256)
    {
        return mint(to, uri);
    }

    function mint(address to, string memory uri)
        private
        hasMinimumEther
        mintIsActive
        hasNFTAvailable
        returns (uint256)
    {
        require(!mintedNFT[uri], "This uri has already been minted");
        mintedNFT[uri] = true;
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        return tokenId;
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        if (!isRevealed) {
            return unpackedURI;
        }
        return super.tokenURI(tokenId);
    }

    modifier hasMinimumEther() {
        require(msg.value >= mininumAmount, "Value less than minimum amout");
        _;
    }

    modifier mintIsActive() {
        require(isMintActive, "Minting is not active yet");
        _;
    }

    function flipIsMintActive() public onlyOwner {
        isMintActive = !isMintActive;
    }

    function flipIsRevealed() public onlyOwner {
        isRevealed = !isRevealed;
    }

    function getCount() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    function payToMint(string calldata metadataUri)
        public
        payable
        returns (uint256)
    {
        return mint(msg.sender, metadataUri);
    }

    modifier hasNFTAvailable() {
        require(
            totalNFTAvailable > _tokenIdCounter.current(),
            "All NFT has been minted"
        );
        _;
    }

    function setTotalNFTAvailable(uint32 total) public onlyOwner {
        totalNFTAvailable = total;
    }
}
