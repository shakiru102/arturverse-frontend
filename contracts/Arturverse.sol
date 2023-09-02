pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "@openzeppelin/contracts/utils/Address.sol";

contract Arturvers is ERC721URIStorage {

     address public owner;    

     event OwnerTransfer (address indexed previousOwner, address indexed  currentOwner);

    constructor() ERC721("Arturverse", "ATV") {
          
          owner = msg.sender;
          emit OwnerTransfer(address(0), owner);
    }

    modifier  isOwner () {
        require(owner == msg.sender, "You do not have access to this contract");
        _;
    }
    

    mapping (address => uint256 []) assets;
    // mapping (address => bool) redeemOnPlatform;
    mapping (string => uint256) redeemToken;


    function changeOwner (address newOwner) public  isOwner {
        emit OwnerTransfer( owner, newOwner);
        owner = newOwner;
    }

    function getAssets (address user) external view returns (uint256[] memory) {
            return  assets[user];
    }
    
    function setRedeemToken(string memory newToken, uint256 value) private {
        redeemToken[newToken] = value;
        
    }

    function mintCertificate(string memory redeemtoken, string memory tokenURI, uint256 itemId)
        public
        isOwner
        returns (uint256)
    {
        _mint(address(this), itemId);
        _setTokenURI(itemId, tokenURI);
        assets[address(this)].push(itemId);
        setRedeemToken(redeemtoken, itemId);
        return itemId;

    }

    function updateAssets (address reciever, address sender, uint256 tokenId) private {
        assets[reciever].push(tokenId);
        uint256[] storage userAsset = assets[sender];
        for (uint i; i <  userAsset.length; i++ ) {
            if(userAsset[i] == tokenId) {
                userAsset[i] = userAsset[userAsset.length - 1];
                userAsset.pop();
                break;
            }
        }
    }

    function redeem(string memory redeemtoken, address user, uint256 tokenId) public {
        require(redeemToken[redeemtoken] == tokenId, "Could not redeem token");
        _transfer(address(this), user, tokenId);
        updateAssets(user, address(this), tokenId);
    }
    

    
    function transferFrom(address from, address to, uint256 tokenId) public virtual override(ERC721, IERC721) {
        require(from != address(this), "certificate must be redeem on platform");
           _transfer(from, to, tokenId);
           updateAssets(to, from, tokenId);
    }

}