// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Company {
    struct Product {
        string hashCodeHash; // Store the hashed hash code instead of the plain hash code
        uint256 timestamp;
    }
    
    address public owner;
    uint private key;

    constructor() {
        owner = msg.sender;
        key = block.timestamp;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }
    
    mapping(bytes32 => bool) private productAvailability;
    Product[] private allProducts;
    
    event ProductAdded(bytes32 hashCodeHash, uint256 timestamp);
    
    function addProduct(string memory _hashCode, uint256 _timestamp) public onlyOwner() {
        require(bytes(_hashCode).length > 0, "Hash code cannot be empty");
        bytes32 hashCodeHash = encodeHash(owner, _hashCode, address(this)); // Hash the hash code using SHA-256
        
        require(!productAvailability[hashCodeHash], "Product with this hash code already exists");
        
        allProducts.push(Product(_hashCode, _timestamp));
        productAvailability[hashCodeHash] = true;
        
        emit ProductAdded(hashCodeHash, _timestamp);
    }
    
    function verifyProduct(string memory _productHashCode) public view returns (bool) {
        bytes32 hashCodeHash = encodeHash(owner, _productHashCode, address(this)); // Hash the input hash code
        return productAvailability[hashCodeHash];
    }

    function getAllProductInformation() public view returns (Product[] memory) {
        return allProducts;
    }
    
    function encodeHash(address _owner, string memory _hashCode, address _contractAddress) internal view returns (bytes32) {
        return keccak256(abi.encodePacked(_owner, _hashCode, _contractAddress, key));
    }
}
