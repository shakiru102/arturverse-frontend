pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

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
    mapping (address => bool) platformUse;


    function changeOwner (address newOwner) public  isOwner {
        emit OwnerTransfer( owner, newOwner);
        owner = newOwner;
    }

    function getAssets (address user) external view returns (uint256[] memory) {
        require(platformUse[user]);
            return  assets[user];
    }


    function mintCertificate(address user, string memory tokenURI, uint256 itemId)
        public
        isOwner
        returns (uint256)
    {
        _mint(user, itemId);
        _setTokenURI(itemId, tokenURI);
        assets[user].push(itemId);
        platformUse[user] = true;

        return itemId;

    }

    
    function _transferFrom(address from, address to, uint256 tokenId) public {
           transferFrom(from, to, tokenId);
           assets[to].push(tokenId);
           platformUse[to] = true;
         uint256[] storage userAsset = assets[from];
         for (uint i; i <  userAsset.length; i++ ) {
              if(userAsset[i] == tokenId) {
                  userAsset[i] = userAsset[userAsset.length - 1];
                  userAsset.pop();
                  break;
              }
         }
    }

}